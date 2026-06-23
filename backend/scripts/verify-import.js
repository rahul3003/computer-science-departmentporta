const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Load environment variables from backend/.env
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      envConfig.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value;
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    // 1. Verify Semester 3 Students
    const sem3Count = await prisma.user.count({
      where: {
        role: 'STUDENT',
        semester: 'Semester 3'
      }
    });
    const sem3NullGenderCount = await prisma.user.count({
      where: {
        role: 'STUDENT',
        semester: 'Semester 3',
        gender: null
      }
    });
    console.log(`Semester 3 students: Total = ${sem3Count}, Null Gender = ${sem3NullGenderCount}`);

    const sampleSem3 = await prisma.user.findFirst({
      where: {
        role: 'STUDENT',
        semester: 'Semester 3'
      }
    });
    console.log('Sample Semester 3 student:', sampleSem3);

    // 2. Verify Semester 5 Students
    const sem5Count = await prisma.user.count({
      where: {
        role: 'STUDENT',
        semester: 'Semester 5'
      }
    });
    const sem5NullGenderCount = await prisma.user.count({
      where: {
        role: 'STUDENT',
        semester: 'Semester 5',
        gender: null
      }
    });
    console.log(`Semester 5 students: Total = ${sem5Count}, Null Gender = ${sem5NullGenderCount}`);

    const sampleSem5 = await prisma.user.findFirst({
      where: {
        role: 'STUDENT',
        semester: 'Semester 5'
      }
    });
    console.log('Sample Semester 5 student:', sampleSem5);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
