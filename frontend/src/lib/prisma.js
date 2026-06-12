import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  const adapter = new PrismaPg(pool);
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });
}

export const prisma = globalForPrisma.prisma;
