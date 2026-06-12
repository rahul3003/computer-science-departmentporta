const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
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
      console.log('Loaded environment variables.');
    }
  } catch (err) {
    console.error('Error loading .env file:', err);
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('Seeding faculty user into database...');
  try {
    const email = 'rekha.patil@sandur.edu';
    const password = 'faculty123password';
    const name = 'Mrs. Rekha Patil';

    // 1. Create or verify User login credentials
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'FACULTY',
          gender: 'FEMALE'
        }
      });
      console.log(`✓ User account created for Faculty: ${user.email}`);
    } else {
      console.log(`User login account for ${email} already exists.`);
    }

    // 2. Create or verify Faculty profile record
    const existingFaculty = await prisma.faculty.findUnique({
      where: { email }
    });

    if (!existingFaculty) {
      const faculty = await prisma.faculty.create({
        data: {
          name,
          email,
          department: 'CSE',
          designation: 'Assistant Professor',
          qualification: 'M.Tech in Computer Science',
          experience: '12 Years of Experience',
          officeHours: 'Mon, Wed, Fri: 11:00 AM - 01:00 PM',
          researchPublications: JSON.stringify(['A Study on Cloud Security models', 'Machine learning in education systems'])
        }
      });
      console.log(`✓ Faculty profile record created: ${faculty.id}`);
    } else {
      console.log(`Faculty profile for ${email} already exists.`);
    }

    console.log(`-----------------------------------`);
    console.log(`FACULTY LOGIN CREDENTIALS:`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     FACULTY`);
    console.log(`-----------------------------------`);

  } catch (error) {
    console.error('✗ Failed to seed faculty user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
