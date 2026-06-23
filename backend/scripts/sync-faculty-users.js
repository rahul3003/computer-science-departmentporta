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
  console.log('Starting synchronization of Faculty table with User table...');
  try {
    // 1. Get all faculty members
    const faculties = await prisma.faculty.findMany();
    console.log(`Found ${faculties.length} faculty member(s) in Faculty table.`);

    const defaultPassword = 'faculty123password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    let createdCount = 0;

    for (const faculty of faculties) {
      // 2. Check if a User with the same email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: faculty.email }
      });

      if (!existingUser) {
        console.log(`No user record found for faculty: ${faculty.name} (${faculty.email}). Creating...`);
        
        await prisma.user.create({
          data: {
            name: faculty.name,
            email: faculty.email,
            password: hashedPassword,
            role: 'FACULTY'
          }
        });
        console.log(`✓ User record created for ${faculty.email}.`);
        createdCount++;
      } else {
        console.log(`User record already exists for faculty: ${faculty.name} (${faculty.email}). Role is: ${existingUser.role}`);
        // If the role is not FACULTY, we should log a warning but not overwrite it.
        if (existingUser.role !== 'FACULTY') {
          console.warn(`WARNING: User exists but has a different role: ${existingUser.role}. Updating role to FACULTY...`);
          await prisma.user.update({
            where: { email: faculty.email },
            data: { role: 'FACULTY' }
          });
          console.log(`✓ Updated role to FACULTY for user ${faculty.email}.`);
        }
      }
    }

    console.log(`Synchronization complete! Created ${createdCount} user account(s).`);
  } catch (error) {
    console.error('✗ Failed to synchronize faculty users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
