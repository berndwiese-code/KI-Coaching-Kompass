const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const file = path.join(__dirname, 'Ki Coaching Kompass eigene Dateien', 'website Struktur.xlsx');
const workbook = xlsx.readFile(file);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const csvData = xlsx.utils.sheet_to_csv(worksheet);

fs.writeFileSync('website_struktur.csv', csvData);
console.log('Successfully written to website_struktur.csv');
