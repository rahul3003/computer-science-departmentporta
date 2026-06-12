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
  console.log('Seeding default users into database...');
  try {
    // 1. Seed Admin
    const adminEmail = 'admin@sandur.edu';
    const adminPassword = 'adminpassword123';
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      const admin = await prisma.user.create({
        data: {
          name: 'Admin HOD',
          email: adminEmail,
          password: hashedAdminPassword,
          role: 'ADMIN'
        }
      });
      console.log(`✓ Admin user successfully seeded! ID: ${admin.id}`);
    } else {
      console.log(`Admin user with email ${adminEmail} already exists.`);
    }

    // 2. Seed default Student
    const studentEmail = 'student@sandur.edu';
    const studentPassword = 'password123';

    const existingStudent = await prisma.user.findUnique({
      where: { email: studentEmail }
    });

    if (!existingStudent) {
      const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
      const student = await prisma.user.create({
        data: {
          name: 'Aarav Patel',
          email: studentEmail,
          password: hashedStudentPassword,
          role: 'STUDENT',
          gender: 'MALE',
          enrollmentId: 'SP-2024-CSE-048',
          semester: 'Semester 5',
          group: 'Group B'
        }
      });
      console.log(`✓ Default student successfully seeded! ID: ${student.id}`);
    } else {
      console.log(`Student user with email ${studentEmail} already exists.`);
    }

    console.log(`-----------------------------------`);
    console.log(`DEFAULT LOGIN CREDENTIALS AVAILABLE:`);
    console.log(`1. Admin`);
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`2. Student`);
    console.log(`   Email:    ${studentEmail}`);
    console.log(`   Password: ${studentPassword}`);
    console.log(`-----------------------------------`);
  } catch (error) {
    console.error('✗ Failed to seed default users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
