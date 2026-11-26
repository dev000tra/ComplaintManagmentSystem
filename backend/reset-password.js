import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

const EMAIL = 'user@test.com';       // ← change to the user you want to reset
const NEW_PASSWORD = 'test123';      // ← new password

async function main() {
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);
  const user = await prisma.user.update({
    where: { email: EMAIL },
    data: { passwordHash: hash },
  });
  console.log(`✅ Password for ${user.email} (${user.role}) reset to "${NEW_PASSWORD}"`);
}

main()
  .catch((e) => { console.error('❌', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());