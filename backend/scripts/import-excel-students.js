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
  const excelPath = 'c:\\PVL\\-Computer-Science-Department-Portal\\CS First year Student list 26-27.xlsx';
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

    if (data.length <= 3) {
      throw new Error('Excel sheet does not contain enough rows.');
    }

    console.log(`Excel sheet loaded. Total rows found: ${data.length}`);

    // 2. Clear Existing Semester 1 Students
    console.log('Clearing existing students in Semester 1...');
    // Delete attendance records for Semester 1 students first to avoid foreign key violations
    const s1Students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        semester: 'Semester 1'
      },
      select: { id: true }
    });
    
    const s1StudentIds = s1Students.map(s => s.id);
    if (s1StudentIds.length > 0) {
      const deletedAttendance = await prisma.attendance.deleteMany({
        where: {
          studentId: { in: s1StudentIds }
        }
      });
      console.log(`✓ Deleted ${deletedAttendance.count} attendance records for Semester 1 students.`);
    }

    const deleteResult = await prisma.user.deleteMany({
      where: {
        role: 'STUDENT',
        semester: 'Semester 1'
      }
    });
    console.log(`✓ Cleared ${deleteResult.count} existing Semester 1 student users.`);

    // 3. Process and Insert New Students from Excel
    console.log('Processing Excel rows...');
    
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    // Start iteration from Row 3 (index 3) since:
    // Row 0: Title
    // Row 1: Branch
    // Row 2: Headers (Sl.No., Student Name, Father Name, Gender, Student Mobile No., Parent Mobile No., email)
    for (let i = 3; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) {
        continue;
      }

      const name = row[1] ? String(row[1]).trim() : '';
      const genderRaw = row[3] ? String(row[3]).trim().toUpperCase() : '';
      const phoneRaw = row[4] ? String(row[4]).trim() : '';
      const email = row[6] ? String(row[6]).trim().toLowerCase() : '';

      // Skip rows that don't have a valid email
      if (!email || !email.includes('@')) {
        console.log(`[Row ${i}] Skipping: Name='${name}' - No valid email: '${email}'`);
        skipCount++;
        continue;
      }

      // Format gender
      let gender = 'OTHER';
      if (genderRaw === 'M') {
        gender = 'MALE';
      } else if (genderRaw === 'F') {
        gender = 'FEMALE';
      }

      // Format student phone (ignore parent phone at index 5)
      const phone = phoneRaw ? phoneRaw : null;

      // Extract Registration Number (Enrollment ID) from email prefix
      const enrollmentId = email.split('@')[0];

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
            enrollmentId: enrollmentId,
            semester: 'Semester 1',
            group: 'Group A',
            phone: phone
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
