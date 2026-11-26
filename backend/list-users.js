import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true, role: true, createdAt: true },
  orderBy: { id: 'asc' },
});

if (users.length === 0) {
  console.log('❌ No users in the database at all.');
} else {
  console.log(`Found ${users.length} user(s):\n`);
  console.table(users);
}

await prisma.$disconnect();