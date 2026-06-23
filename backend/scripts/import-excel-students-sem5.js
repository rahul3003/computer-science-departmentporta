const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');
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
  const excelPath = 'c:\\PVL\\-Computer-Science-Department-Portal\\III Year.xlsx';
  console.log('Reading Excel sheet from:', excelPath);

  try {
    // 1. Read the Excel File
    if (!fs.existsSync(excelPath)) {
      throw new Error(`File not found: ${excelPath}`);
    }
    const workbook = XLSX.readFile(excelPath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length <= 1) {
      throw new Error('Excel sheet does not contain enough rows.');
    }

    console.log(`Excel sheet loaded. Total rows found: ${data.length}`);

    // 2. Clear Existing Semester 5 Students
    console.log('Clearing existing students in Semester 5...');
    // Delete attendance records for Semester 5 students first to avoid foreign key violations
    const s5Students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        semester: 'Semester 5'
      },
      select: { id: true }
    });
    
    const s5StudentIds = s5Students.map(s => s.id);
    if (s5StudentIds.length > 0) {
      const deletedAttendance = await prisma.attendance.deleteMany({
        where: {
          studentId: { in: s5StudentIds }
        }
      });
      console.log(`✓ Deleted ${deletedAttendance.count} attendance records for Semester 5 students.`);
    }

    const deleteResult = await prisma.user.deleteMany({
      where: {
        role: 'STUDENT',
        semester: 'Semester 5'
      }
    });
    console.log(`✓ Cleared ${deleteResult.count} existing Semester 5 student users.`);

    // 3. Process and Insert New Students from Excel
    console.log('Processing Excel rows...');
    
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    // Start iteration from Row 1 (index 1) since Row 0 is headers
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) {
        continue;
      }

      const enrollmentId = row[1] ? String(row[1]).trim() : '';
      const name = row[2] ? String(row[2]).trim() : '';
      const email = row[3] ? String(row[3]).trim().toLowerCase() : '';

      // Skip rows that don't have a valid email
      if (!email || !email.includes('@')) {
        console.log(`[Row ${i}] Skipping: Name='${name}' - No valid email: '${email}'`);
        skipCount++;
        continue;
      }

      // Gender is not in this spreadsheet, default to null
      const gender = null;

      // Password is the email address itself (hashed)
      const hashedPassword = bcrypt.hashSync(email, 10);

      try {
        // Create user in the database
        await prisma.user.create({
          data: {
            name: name || 'Unknown Student',
            email: email,
            password: hashedPassword,
            role: 'STUDENT',
            gender: gender,
            enrollmentId: enrollmentId || null,
            semester: 'Semester 5',
            group: 'Group A',
            phone: null
          }
        });
        successCount++;
      } catch (err) {
        console.error(`[Row ${i}] Failed to insert student '${name}' (Email: ${email}):`, err.message);
        failCount++;
      }
    }

    console.log('\n--- IMPORT SUMMARY ---');
    console.log(`✓ Successfully imported: ${successCount}`);
    console.log(`⚠ Skipped rows: ${skipCount}`);
    console.log(`✗ Failed rows: ${failCount}`);

  } catch (error) {
    console.error('✗ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
