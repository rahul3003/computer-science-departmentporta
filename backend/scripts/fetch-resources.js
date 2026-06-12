const path = require('path');
const fs = require('fs');

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
  } catch (err) {}
}

const { prisma } = require('../src/lib/prisma');

async function main() {
  const resources = await prisma.resource.findMany();
  console.log('--- ALL RESOURCES IN DATABASE ---');
  resources.forEach(res => {
    console.log(`ID: ${res.id} | Title: ${res.title} | Category: ${res.category} | Semester: ${res.semester} | URL: ${res.fileUrl}`);
  });
  await prisma.$disconnect();
}

main().catch(console.error);
