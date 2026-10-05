const csv = require('csv-parser');
const fs = require('fs');
const ExcelJS = require('exceljs');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

const parseExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const results = [];
  
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      const header = worksheet.getRow(1).getCell(colNumber).value;
      rowData[header] = cell.value;
    });
    results.push(rowData);
  });
  
  return results;
};

const generateExcel = async (data, headers, sheetName = 'Sheet1') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  worksheet.addRow(headers);
  
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4A90E2' }
  };
  
  data.forEach(row => {
    worksheet.addRow(headers.map(h => row[h]));
  });
  
  worksheet.columns.forEach(column => {
    column.width = 15;
  });
  
  return await workbook.xlsx.writeBuffer();
};

const generateCSV = (data, headers) => {
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

const { getSchoolProfile } = require('../utils/schoolProfileHelper');

const generateExcelWithSchoolHeader = async (data, headers, reportTitle = 'Report', sheetName = 'Sheet1') => {
  const school = await getSchoolProfile();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  const endColIndex = Math.max(headers.length, 1);
  const endColLetter = String.fromCharCode(64 + (endColIndex > 26 ? 26 : endColIndex));

  // Row 1: School Name Header Banner
  worksheet.mergeCells(`A1:${endColLetter}1`);
  const schoolCell = worksheet.getCell('A1');
  schoolCell.value = (school.name || 'SCHOOL MANAGEMENT SYSTEM').toUpperCase();
  schoolCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  schoolCell.alignment = { horizontal: 'center', vertical: 'middle' };
  schoolCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF059669' } // Primary Theme
  };
  worksheet.getRow(1).height = 30;

  // Row 2: Subtitle (Address & Report Name)
  worksheet.mergeCells(`A2:${endColLetter}2`);
  const subCell = worksheet.getCell('A2');
  const locationText = [school.address?.city, school.address?.district, school.address?.state].filter(Boolean).join(', ');
  subCell.value = `${reportTitle} ${locationText ? `| ${locationText}` : ''}`;
  subCell.font = { bold: true, size: 11, italic: true };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  subCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0FDF4' }
  };
  worksheet.getRow(2).height = 22;

  // Row 3: Blank spacing row
  worksheet.addRow([]);

  // Row 4: Column Headers
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(4);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' }
  };
  headerRow.height = 24;

  // Data rows
  data.forEach(row => {
    worksheet.addRow(headers.map(h => row[h]));
  });

  worksheet.columns.forEach(column => {
    column.width = 18;
    column.alignment = { vertical: 'middle' };
  });

  return await workbook.xlsx.writeBuffer();
};

module.exports = { parseCSV, parseExcel, generateExcel, generateExcelWithSchoolHeader, generateCSV };