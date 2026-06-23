const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'c:\\PVL\\-Computer-Science-Department-Portal\\III Year.xlsx';
if (!fs.existsSync(excelPath)) {
  console.error(`File not found: ${excelPath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
console.log('Sheet Names:', workbook.SheetNames);
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Total rows:', data.length);
console.log('First 10 rows:');
for (let i = 0; i < Math.min(data.length, 15); i++) {
  console.log(`Row ${i}:`, data[i]);
}
