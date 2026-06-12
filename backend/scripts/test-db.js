const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Robust manual loader for .env to ensure environment variables are populated when run via standard Node CLI
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
          // Strip enclosing quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value;
        }
      });
      console.log('Loaded environment variables from .env file.');
    }
  } catch (err) {
    console.warn('Could not manually load .env file:', err.message);
  }
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting DB connection check...');
  console.log(`Database Endpoint: ${process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : 'DATABASE_URL is not set'}`);
  
  try {
    // Attempt a basic query to verify connection
    console.log('Sending query: SELECT 1...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection successful!');
    
    // Check tables
    console.log('Querying Faculty table...');
    const facultyCount = await prisma.faculty.count();
    console.log(`✓ Faculty Table connection successful! Faculty count: ${facultyCount}`);
  } catch (error) {
    console.error('✗ Database connection failed!');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
