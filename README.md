# Complaint Management System — Backend

Node + Express + Prisma + SQLite + JWT.

## Requirements
- Node.js 18+
- npm

## Setup

```bash
npm install
cp .env.example .env        # edit secrets if you like
npx prisma migrate dev --name init
npm run seed
npm run dev