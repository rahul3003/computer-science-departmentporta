const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prisma) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  const adapter = new PrismaPg(pool);
  global.prisma = new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn']
  });
}

prisma = global.prisma;

module.exports = { prisma };
