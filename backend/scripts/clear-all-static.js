const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
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
  console.log('Starting full database static data purge...');
  try {
    // 1. Clear resources table
    const clearResources = await prisma.resource.deleteMany({});
    console.log(`✓ Deleted ${clearResources.count} static resources (notes, manuals, syllabus files, question papers).`);

    // 2. Clear announcements table
    const clearAnnouncements = await prisma.announcement.deleteMany({});
    console.log(`✓ Deleted ${clearAnnouncements.count} static announcements.`);

    // 3. Clear subjects table
    const clearSubjects = await prisma.subject.deleteMany({});
    console.log(`✓ Deleted ${clearSubjects.count} static subjects.`);

    // 4. Clear timetable slots table
    const clearTimetable = await prisma.timetableSlot.deleteMany({});
    console.log(`✓ Deleted ${clearTimetable.count} static timetable slots.`);

    // 5. Clear feed posts and comments (extra check)
    const clearComments = await prisma.feedComment.deleteMany({});
    const clearPosts = await prisma.feedPost.deleteMany({});
    console.log(`✓ Deleted ${clearComments.count} feed comments and ${clearPosts.count} feed posts.`);

    console.log('\n✓ Purge complete! Database is now a clean slate.');
  } catch (error) {
    console.error('✗ Purge failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
