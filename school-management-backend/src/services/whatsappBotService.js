// src/services/whatsappBotService.js
const Student = require('../models/Student');
const { FeeInvoice, FeePayment } = require('../models/Fee');
const Mark = require('../models/Mark');

/**
 * Handles incoming WhatsApp webhook messages from Parents.
 */
exports.processParentWhatsAppMessage = async (fromNumber, messageText) => {
  const cleanText = (messageText || '').trim().toLowerCase();
  
  // Format standard response
  let replyText = '';
  let documentUrl = null;

  if (cleanText.includes('hi') || cleanText.includes('hello') || cleanText.includes('menu')) {
    replyText = `🏫 *Welcome to P.P.M. Higher Secondary School Official Portal Bot*\n\nPlease reply with a command:\n1️⃣ *FEE <AdmNo>* - Check pending fee balance & receipts\n2️⃣ *RESULT <AdmNo>* - View latest exam marks\n3️⃣ *ATTENDANCE <AdmNo>* - View monthly attendance\n4️⃣ *TIMETABLE* - Today's class timetable schedule`;
  } else if (cleanText.startsWith('fee')) {
    const parts = cleanText.split(' ');
    const adm = parts[1] || '';
    
    if (!adm) {
      replyText = `⚠️ Please provide student admission number. Example: *FEE 8821*`;
    } else {
      const student = await Student.findOne({ admissionNo: new RegExp(adm, 'i') });
      if (student) {
        const invoices = await FeeInvoice.find({ studentId: student._id });
        const totalDue = invoices.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0);
        
        replyText = `💰 *Fee Summary for ${student.fullName} (Adm: ${student.admissionNo})*\n\n` +
          `• Total Outstanding: ₹${totalDue.toLocaleString('en-IN')}\n` +
          `• Invoices: ${invoices.length} Bills\n` +
          (totalDue > 0 ? `\n💳 Pay online or at the school fee counter to avoid late fines.` : `\n✅ All fees cleared! No pending dues.`);
      } else {
        replyText = `❌ No student record found for Admission No: ${adm}`;
      }
    }
  } else if (cleanText.startsWith('result')) {
    const parts = cleanText.split(' ');
    const adm = parts[1] || '';
    
    if (!adm) {
      replyText = `⚠️ Please provide student admission number. Example: *RESULT 8821*`;
    } else {
      const student = await Student.findOne({ admissionNo: new RegExp(adm, 'i') });
      if (student) {
        const marks = await Mark.find({ studentId: student._id }).limit(5);
        replyText = `📊 *Latest Academic Results: ${student.fullName}*\n\n` +
          (marks.length > 0 
            ? marks.map(m => `• ${m.subject || 'Subject'}: ${m.score}/${m.maxMarks || 100} (${m.grade || 'A'})`).join('\n')
            : `• No published exam results available for this term.`);
      } else {
        replyText = `❌ No student record found for Admission No: ${adm}`;
      }
    }
  } else {
    replyText = `🤖 Command not recognized. Type *MENU* to see available self-service options.`;
  }

  return {
    to: fromNumber,
    replyText,
    documentUrl,
    timestamp: new Date()
  };
};
