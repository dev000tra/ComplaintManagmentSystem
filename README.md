# Complaint Management System

A full-stack Complaint Management System where users can register, log in, and submit complaints, and admins can view all complaints and update their statuses.

Built as a basic but complete implementation of the acceptance criteria in the project specification.

---

## Features

### User
- Register with name, email, and password
- Log in securely (JWT-based auth)
- Submit complaints (subject + description)
- View **only their own** complaints
- Track status of each complaint (`Pending` → `In Progress` → `Resolved`)

### Admin
- Log in with the seeded admin account
- View **all** complaints from every user
- See full complaint details (subject, description, submitter, date, status)
- Update complaint status via inline dropdown
- Status changes reflect immediately in the UI

### System
- JWT authentication with bcrypt password hashing
- Role-based route protection (`USER` vs `ADMIN`)
- Automatic unique complaint numbers (`CMP-YYYYMMDD-XXXXXX`)
- Auto-recorded submitter and submission date
- Server-side + client-side validation
- Default status `Pending` for every new complaint
- Protected API endpoints (401 for unauthenticated, 403 for non-admin)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 6, React Router 6, Axios, Tailwind CSS 4 |
| **Backend** | Node.js, Express 4, Prisma 5, JWT, bcryptjs, express-validator |
| **Database** | SQLite (via Prisma) — easy to swap to Postgres/MySQL |

---

## Project Structure

```
Complaint Management System/
├── backend/                          # Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma             # DB schema
│   │   ├── seed.js                   # Seeds admin account
│   │   ├── migrations/               # Auto-generated migrations
│   │   └── dev.db                    # SQLite database (gitignored)
│   ├── src/
│   │   ├── server.js                 # Express app entry
│   │   ├── db.js                     # Prisma client
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authenticate + requireAdmin
│   │   │   └── validate.js           # express-validator error handler
│   │   └── routes/
│   │       ├── auth.js               # /api/auth/register, /api/auth/login
│   │       └── complaints.js         # /api/complaints CRUD
│   ├── .env                          # Backend env vars (gitignored)
│   ├── .env.example                  # Template for .env
│   ├── .gitignore
│   └── package.json
│
├── src/                              # React frontend source
│   ├── auth/
│   │   └── AuthContext.jsx           # Global auth state
│   ├── components/
│   │   ├── ProtectedRoute.jsx        # Route guard (login + admin)
│   │   └── StatusBadge.jsx           # Colored status pill
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── MyComplaints.jsx
│   │   ├── SubmitComplaint.jsx
│   │   └── AdminComplaints.jsx
│   ├── api.js                        # Axios instance + interceptors
│   ├── App.jsx                       # Routes + navbar
│   ├── main.jsx                      # React entry
│   └── index.css                     # Tailwind + component classes
│
├── .env                              # Frontend env vars (VITE_API_URL)
├── .env.example
├── .gitignore
├── index.html
├── package.json                      # Frontend package
├── vite.config.js
└── README.md                         # ← this file
```

---

## Prerequisites

- **Node.js** 18 or newer
- **npm** 9 or newer
- A modern browser (Chrome, Edge, Firefox)
- PowerShell (Windows) / Terminal (macOS/Linux)

---

## Setup

### 1. Clone or open the project

```bash
cd "Complaint Management System"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` (copy from `.env.example`):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-to-a-long-random-string"
PORT=5000
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@123"
```

Run migrations, seed the admin, and start:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

You should see:

```
✅ Admin created: admin@example.com
API → http://localhost:5000
```

### 3. Frontend setup (in a new terminal)

```bash
cd "Complaint Management System"       # project root, NOT backend/
npm install
npm run dev
```

You should see:

```
VITE v6.x  ready in ~1s
➜  Local:   http://localhost:5173/
```

### 4. Open the app

**http://localhost:5173**

- Register a new user → submit a complaint → verify it appears on `/complaints`
- Log out → log in as admin → open `/admin/complaints` → change status
- Log out → log back in as the user → confirm the new status is visible

---

## Demo Admin Account

Seeded automatically by `npm run seed`:

| Field | Value |
|-------|-------|
| **Email** | `admin@example.com` |
| **Password** | `Admin@123` |
| **Role** | `ADMIN` |

Credentials are configurable via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`.

---

## Available Scripts

### Frontend (project root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with auto-restart on file change |
| `npm start` | Start API without file watching |
| `npm run migrate` | Run Prisma migrations |
| `npm run seed` | Create the admin account |
| `npm run studio` | Open Prisma Studio (visual DB browser) at :5555 |

---

## Environment Variables

### Frontend (`.env` at project root)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-to-a-long-random-string"
PORT=5000
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@123"
```

> ⚠️ **Restart Vite** after changing `VITE_*` variables — Vite only reads env at startup.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | public | Health check → `{"ok":true}` |
| `POST` | `/auth/register` | public | Create user → `{ token, user }` |
| `POST` | `/auth/login` | public | Login → `{ token, user }` |
| `GET` | `/complaints` | user/admin | User: own complaints. Admin: all complaints. |
| `POST` | `/complaints` | user/admin | Create complaint `{ subject, description }` |
| `PATCH` | `/complaints/:id/status` | **admin only** | Update status `{ status }` |

### Example — register user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

### Example — list complaints (as admin)

```bash
curl http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

### Example — update complaint status

```bash
curl -X PATCH http://localhost:5000/api/complaints/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"status":"In Progress"}'
```

---

## Database Schema

```prisma
model User {
  id           Int         @id @default(autoincrement())
  name         String
  email        String      @unique
  passwordHash String
  role         String      @default("USER")   // "USER" | "ADMIN"
  createdAt    DateTime    @default(now())
  complaints   Complaint[]
}

model Complaint {
  id              Int      @id @default(autoincrement())
  complaintNumber String   @unique
  subject         String
  description     String
  status          String   @default("Pending") // "Pending" | "In Progress" | "Resolved"
  userId          Int
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([status])
}
```

---

## Acceptance Criteria — Where Each Is Enforced

| Criterion | Frontend | Backend |
|-----------|----------|---------|
| User sees only own complaints | `MyComplaints.jsx` filters via API | `GET /complaints` — `where: { userId: req.user.id }` unless admin |
| Admin sees all complaints | `AdminComplaints.jsx` | `GET /complaints` — no filter for admins |
| Admin can update status | Dropdown in `AdminComplaints.jsx` | `PATCH /complaints/:id/status` with `requireAdmin` |
| Required-field validation | `SubmitComplaint.jsx` (maxLength + trim check) | `express-validator` chains in `routes/complaints.js` |
| Login required for complaint pages | `ProtectedRoute` wrapper | `authenticate` middleware on every `/complaints` route |
| Only admin can update status | Hidden for users, `adminOnly` route guard | `requireAdmin` middleware → 403 for non-admins |
| Unique complaint number | — | `@unique` in schema + retry loop in route handler |
| Default status `Pending` | — | `@default("Pending")` in schema |
| Auto submitted-by + date | — | `userId` from JWT, `createdAt @default(now())` |
| Workflow Pending → In Progress → Resolved | Dropdown options | `isIn(['Pending','In Progress','Resolved'])` validator |

---

## Troubleshooting

### Blank page on `http://localhost:5173`

1. Open DevTools (**F12**) → **Console** tab → look for red errors.
2. Verify `src/main.jsx` has `import './index.css';` and `vite.config.js` imports `defineConfig` from `'vite'`.
3. Verify `index.html` starts with `<!DOCTYPE html>` (no Quirks Mode).

### `curl http://localhost:5000/api/health` fails to connect

- Backend terminal must show `API → http://localhost:5000`.
- If it crashed on startup, check the terminal for the error (usually a missing `.env` or migration not run).

### Login fails with "Invalid credentials"

- Confirm the user exists: `cd backend && node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.user.findMany().then(u=>{console.table(u.map(x=>({email:x.email,role:x.role})));p.$disconnect();})"`
- If not, register fresh via `/register`.

### Admin logs in but lands on `/complaints` (not `/admin/complaints`)

Role case mismatch. Every role check in the frontend must use **`'ADMIN'`** (all caps), matching what the backend returns:

```bash
cd "Complaint Management System"
Get-ChildItem src -Recurse -Include *.jsx,*.js | Select-String "role.*admin"
```

All matches must be `role === 'ADMIN'` or `role !== 'ADMIN'`.

### Wrong password causes page blink / reload

The axios interceptor is redirecting on `401` from login itself. Fix in `src/api.js`:

```js
if (error.response?.status === 401 && !url.includes('/auth/')) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### CORS error in browser console

- Backend must be running on port 5000.
- Frontend `.env` must be `VITE_API_URL=http://localhost:5000/api` (restart Vite after editing).

### `EADDRINUSE: port 5000 already in use`

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### `Table 'User' does not exist` from Prisma

Migrations haven't been applied:

```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

### Reset the entire database (fresh start)

```bash
cd backend
npx prisma migrate reset --force
npm run seed
```

---

## Switching to PostgreSQL / MySQL

1. Change `provider` in `backend/prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"      // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `backend/.env`:

   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/complaints"
   ```

3. Delete the old SQLite migration and regenerate:

   ```bash
   rm -rf backend/prisma/migrations backend/prisma/dev.db
   cd backend
   npx prisma migrate dev --name init
   npm run seed
   ```

No application code changes needed.

---

## Deployment Notes

### Backend (Render / Railway / Fly.io)

- Set env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start command: `npm start`

### Frontend (Vercel / Netlify)

- Set env var `VITE_API_URL=https://your-backend-url.com/api`
- Build command: `npm run build`
- Output directory: `dist`

---
## Security

### Implemented
- **JWT stored in `HttpOnly` cookies** — not accessible to JavaScript, preventing XSS token theft
- **`SameSite=Lax`** cookie attribute — blocks cross-site request forgery
- **`Secure` flag in production** — cookie only sent over HTTPS
- **15-minute access token lifetime** — minimizes exposure window
- **bcrypt password hashing** (10 rounds, auto-salted)
- **JWT signature verification** on every protected request
- **Role-based access control** — `USER` vs `ADMIN` enforced server-side
- **Server-side validation** — subject ≤ 150, description ≤ 2,000
- **CORS locked** to the frontend origin with `credentials: true`
- **Session invalidation** via `POST /auth/logout` (clears cookie server-side)

### Planned hardening (future)
- Refresh token rotation with SHA-256 hashed storage
- Rate limiting on `/auth/login` and `/auth/register` (5 attempts / 15 min)
- CSRF double-submit tokens (defense-in-depth over `SameSite`)
- PostgreSQL migration for concurrent-write safety

## License

MIT — free to use, modify, and distribute.

---

## Author

Built as a full-stack implementation of the Complaint Management System specification.
```