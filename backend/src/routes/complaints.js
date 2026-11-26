import { Router } from 'express';
import { body, param } from 'express-validator';
import { prisma } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

const STATUSES = ['Pending', 'In Progress', 'Resolved'];

/** Generates a unique-ish complaint number: CMP-YYYYMMDD-XXXXXX */
function generateComplaintNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CMP-${date}-${rand}`;
}

/** Shape returned to the React app */
function toApi(c) {
  return {
    id: c.id,
    complaint_number: c.complaintNumber,
    subject: c.subject,
    description: c.description,
    status: c.status,
    submitted_by_name: c.user?.name ?? null,
    user_id: c.userId,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

// GET /api/complaints  — user: own only; admin: all
router.get('/', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    const complaints = await prisma.complaint.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(complaints.map(toApi));
  } catch (err) {
    next(err);
  }
});

// POST /api/complaints  — create (any authenticated user)
router.post(
  '/',
  authenticate,
  [
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required')
      .isLength({ max: 150 }).withMessage('Subject max 150 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 2000 }).withMessage('Description max 2,000 characters'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { subject, description } = req.body;

      // Retry on the (extremely unlikely) complaint-number collision
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const complaint = await prisma.complaint.create({
            data: {
              complaintNumber: generateComplaintNumber(),
              subject,
              description,
              userId: req.user.id,
            },
            include: { user: { select: { name: true } } },
          });
          return res.status(201).json(toApi(complaint));
        } catch (err) {
          if (err.code !== 'P2002') throw err; // P2002 = unique constraint
        }
      }
      res.status(500).json({ message: 'Could not generate a unique complaint number' });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/complaints/:id/status  — admin only
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  [
    param('id').isInt().withMessage('Invalid complaint id'),
    body('status').isIn(STATUSES).withMessage('Invalid status value'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const existing = await prisma.complaint.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: 'Complaint not found' });

      const updated = await prisma.complaint.update({
        where: { id },
        data: { status },
        include: { user: { select: { name: true } } },
      });
      res.json(toApi(updated));
    } catch (err) {
      next(err);
    }
  }
);

export default router;