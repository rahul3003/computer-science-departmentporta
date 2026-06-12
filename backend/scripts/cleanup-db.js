const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Load env variables
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
  console.log('Cleaning up database to leave only 3 credentials...');
  try {
    // 1. Delete all FeedComments and FeedPosts first to avoid foreign key issues
    await prisma.feedComment.deleteMany({});
    await prisma.feedPost.deleteMany({});

    // 2. Delete all other users except admin@sandur.edu, rekha.patil@sandur.edu, and student@sandur.edu
    const allowedEmails = ['admin@sandur.edu', 'rekha.patil@sandur.edu', 'student@sandur.edu'];
    
    const deleteUsersResult = await prisma.user.deleteMany({
      where: {
        email: {
          notIn: allowedEmails
        }
      }
    });
    console.log(`✓ Deleted ${deleteUsersResult.count} other student/faculty user accounts.`);

    // 3. Delete all Faculty records except rekha.patil@sandur.edu
    const deleteFacultyResult = await prisma.faculty.deleteMany({
      where: {
        email: {
          not: 'rekha.patil@sandur.edu'
        }
      }
    });
    console.log(`✓ Deleted ${deleteFacultyResult.count} other faculty profile records.`);

    // 4. Ensure Rekha Patil exists in User and Faculty
    const hashedFacultyPassword = await bcrypt.hash('faculty123password', 10);
    await prisma.user.upsert({
      where: { email: 'rekha.patil@sandur.edu' },
      update: {},
      create: {
        name: 'Mrs. Rekha Patil',
        email: 'rekha.patil@sandur.edu',
        password: hashedFacultyPassword,
        role: 'FACULTY',
        gender: 'FEMALE'
      }
    });

    await prisma.faculty.upsert({
      where: { email: 'rekha.patil@sandur.edu' },
      update: {},
      create: {
        name: 'Mrs. Rekha Patil',
        email: 'rekha.patil@sandur.edu',
        department: 'CSE',
        designation: 'Assistant Professor',
        qualification: 'M.Tech in Software Engineering',
        experience: '12 Years of Teaching Experience',
        officeHours: 'Mon, Wed, Fri: 11:00 AM - 01:00 PM',
        researchPublications: JSON.stringify(['Comparative Study of NoSQL Databases for Large Scale Web Apps'])
      }
    });
    console.log('✓ Verified Rekha Patil (Faculty) user and profile exist.');

    // 5. Ensure Aarav Patel exists in User
    const hashedStudentPassword = await bcrypt.hash('password123', 10);
    await prisma.user.upsert({
      where: { email: 'student@sandur.edu' },
      update: {},
      create: {
        name: 'Aarav Patel',
        email: 'student@sandur.edu',
        password: hashedStudentPassword,
        role: 'STUDENT',
        gender: 'MALE',
        enrollmentId: 'SP-2024-CSE-048',
        semester: 'Semester 5',
        group: 'Group B'
      }
    });
    console.log('✓ Verified Aarav Patel (Student) user exists.');

    // 6. Ensure Admin HOD exists in User
    const hashedAdminPassword = await bcrypt.hash('adminpassword123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@sandur.edu' },
      update: {},
      create: {
        name: 'Admin HOD',
        email: 'admin@sandur.edu',
        password: hashedAdminPassword,
        role: 'ADMIN'
      }
    });
    console.log('✓ Verified Admin HOD user exists.');

    // Print final list of users
    const users = await prisma.user.findMany();
    console.log('\n--- CURRENT USERS IN DB ---');
    users.forEach(u => {
      console.log(`- Role: ${u.role} | Email: ${u.email} | Name: ${u.name}`);
    });

  } catch (error) {
    console.error('✗ Cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
