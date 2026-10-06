// src/controllers/feeController.js
const { FeeCategory, FeeStructure, FeeInvoice, FeePayment } = require('../models/Fee');
const Student = require('../models/Student');
const Class = require('../models/Class');
const AcademicYear = require('../models/AcademicYear');
const Notification = require('../models/Notification');
const { broadcastToUser, broadcastToClass } = require('../config/socket');

// Helper to generate formatted serial numbers
function generateInvoiceNumber(seq) {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${String(seq).padStart(4, '0')}-${randomSuffix}`;
}

function generateReceiptNumber(seq) {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `REC-${year}-${String(seq).padStart(4, '0')}-${randomSuffix}`;
}

// ==================== 1. DASHBOARD & ANALYTICS ====================

exports.getFeeDashboardStats = async (req, res) => {
  try {
    const { academicYearId } = req.query;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Parallel aggregations for speed
    const [
      todayPayments,
      monthPayments,
      allPayments,
      invoiceSummary,
      methodBreakdown,
      recentPayments,
      totalStudents
    ] = await Promise.all([
      // Today total collection
      FeePayment.aggregate([
        { $match: { isVoid: false, paymentDate: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' }, count: { $sum: 1 } } }
      ]),

      // Month-to-date collection
      FeePayment.aggregate([
        { $match: { isVoid: false, paymentDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' }, count: { $sum: 1 } } }
      ]),

      // All-time / Year collection
      FeePayment.aggregate([
        { $match: { isVoid: false } },
        { $group: { _id: null, total: { $sum: '$amountPaid' }, count: { $sum: 1 } } }
      ]),

      // Invoice status breakdown
      FeeInvoice.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalBilled: { $sum: '$totalAmount' },
            totalPaid: { $sum: '$paidAmount' },
            totalBalance: { $sum: '$balanceAmount' }
          }
        }
      ]),

      // Payment Method Breakdown
      FeePayment.aggregate([
        { $match: { isVoid: false } },
        {
          $group: {
            _id: '$paymentMethod',
            total: { $sum: '$amountPaid' },
            count: { $sum: 1 }
          }
        }
      ]),

      // Recent 10 payments
      FeePayment.find({ isVoid: false })
        .sort({ paymentDate: -1 })
        .limit(10)
        .populate('receivedBy', 'name shortName'),

      // Total students
      Student.countDocuments({ status: 'active' })
    ]);

    let totalBilled = 0;
    let totalCollected = allPayments[0]?.total || 0;
    let totalOutstanding = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    let partialCount = 0;
    let overdueCount = 0;

    invoiceSummary.forEach(item => {
      totalBilled += item.totalBilled || 0;
      totalOutstanding += item.totalBalance || 0;

      if (item._id === 'paid') paidCount += item.count;
      else if (item._id === 'unpaid') unpaidCount += item.count;
      else if (item._id === 'partially_paid') partialCount += item.count;
      else if (item._id === 'overdue') overdueCount += item.count;
    });

    const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

    return res.json({
      success: true,
      stats: {
        todayCollected: todayPayments[0]?.total || 0,
        todayTransactionsCount: todayPayments[0]?.count || 0,
        monthCollected: monthPayments[0]?.total || 0,
        totalCollected,
        totalBilled,
        totalOutstanding,
        collectionRate: Math.round(collectionRate * 10) / 10,
        totalStudents,
        invoiceCounts: {
          paid: paidCount,
          unpaid: unpaidCount,
          partiallyPaid: partialCount,
          overdue: overdueCount,
          total: paidCount + unpaidCount + partialCount + overdueCount
        },
        methodBreakdown: methodBreakdown.map(m => ({
          method: m._id,
          amount: m.total,
          count: m.count
        })),
        recentTransactions: recentPayments
      }
    });
  } catch (error) {
    console.error('Error in getFeeDashboardStats:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 2. FEE CATEGORIES (HEADS) ====================

exports.getFeeCategories = async (req, res) => {
  try {
    let categories = await FeeCategory.find().sort({ name: 1 });

    // Pre-seed default heads if empty
    if (categories.length === 0) {
      const defaultHeads = [
        { name: 'Tuition Fee', code: 'TUI', type: 'tuition', description: 'Regular academic tuition fees' },
        { name: 'Computer & Lab Fee', code: 'LAB', type: 'facility', description: 'Science and computer lab maintenance' },
        { name: 'Annual Sports & Cultural', code: 'SPO', type: 'co_curricular', description: 'Sports day, arts fest, and club activities' },
        { name: 'Library & Journal Fund', code: 'LIB', type: 'facility', description: 'Library card and book reading fund' },
        { name: 'School Bus Transport', code: 'BUS', type: 'transport', description: 'Monthly or term bus commute charges' },
        { name: 'Term Examination Fee', code: 'EXAM', type: 'examination', description: 'Printing, hall tickets, and exam assessment' },
        { name: 'Admission & Registration', code: 'ADM', type: 'one_time', description: 'One-time admission and registration fee' },
        { name: 'PTA & Development Fund', code: 'PTA', type: 'miscellaneous', description: 'Parent Teacher Association institutional fund' }
      ];

      categories = await FeeCategory.insertMany(defaultHeads);
    }

    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('Error in getFeeCategories:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFeeCategory = async (req, res) => {
  try {
    const { name, code, type, description } = req.body;

    const existing = await FeeCategory.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Fee head with code ${code} already exists` });
    }

    const category = await FeeCategory.create({
      name,
      code: code.toUpperCase(),
      type: type || 'tuition',
      description: description || ''
    });

    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error in createFeeCategory:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeeCategory = async (req, res) => {
  try {
    const category = await FeeCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Fee category not found' });
    }
    return res.json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFeeCategory = async (req, res) => {
  try {
    const category = await FeeCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Fee category not found' });
    }
    return res.json({ success: true, message: 'Fee category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 3. FEE STRUCTURES (TEMPLATES) ====================

exports.getFeeStructures = async (req, res) => {
  try {
    const { academicYearId } = req.query;
    const query = {};
    if (academicYearId) query.academicYearId = academicYearId;

    const structures = await FeeStructure.find(query)
      .populate('academicYearId', 'name year')
      .populate('classIds', 'name section displayName')
      .populate('heads.categoryId', 'name code type')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: structures.length, data: structures });
  } catch (error) {
    console.error('Error in getFeeStructures:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeeStructureById = async (req, res) => {
  try {
    const structure = await FeeStructure.findById(req.params.id)
      .populate('academicYearId', 'name year')
      .populate('classIds', 'name section displayName')
      .populate('heads.categoryId', 'name code type');

    if (!structure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    return res.json({ success: true, data: structure });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFeeStructure = async (req, res) => {
  try {
    const { name, academicYearId, classIds, heads, installments, description } = req.body;

    let totalAmount = 0;
    (heads || []).forEach(h => {
      totalAmount += Number(h.amount) || 0;
    });

    const structure = await FeeStructure.create({
      name,
      academicYearId,
      classIds: classIds || [],
      heads: heads || [],
      totalAmount,
      installments: installments || [],
      description: description || '',
      createdBy: req.user._id
    });

    return res.status(201).json({ success: true, data: structure });
  } catch (error) {
    console.error('Error in createFeeStructure:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const { heads } = req.body;
    if (heads) {
      let totalAmount = 0;
      heads.forEach(h => {
        totalAmount += Number(h.amount) || 0;
      });
      req.body.totalAmount = totalAmount;
    }

    const structure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!structure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    return res.json({ success: true, data: structure });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }
    return res.json({ success: true, message: 'Fee structure deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 4. STUDENT FEE INVOICES ====================

exports.getFeeInvoices = async (req, res) => {
  try {
    const { classId, studentId, status, academicYearId, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (classId) query.classId = classId;
    if (studentId) query.studentId = studentId;
    if (academicYearId) query.academicYearId = academicYearId;
    if (status && status !== 'all') query.status = status;

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [invoices, total] = await Promise.all([
      FeeInvoice.find(query)
        .populate('classId', 'name section displayName')
        .populate('studentId', 'fullName admissionNo rollNumber parentIds')
        .sort({ dueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      FeeInvoice.countDocuments(query)
    ]);

    // Check overdue status on the fly
    const now = new Date();
    const updatedInvoices = invoices.map(inv => {
      const invObj = inv.toObject();
      if ((invObj.status === 'unpaid' || invObj.status === 'partially_paid') && new Date(invObj.dueDate) < now) {
        invObj.isOverdue = true;
      }
      return invObj;
    });

    return res.json({
      success: true,
      data: updatedInvoices,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getFeeInvoices:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeeInvoiceById = async (req, res) => {
  try {
    const invoice = await FeeInvoice.findById(req.params.id)
      .populate('classId', 'name section displayName')
      .populate('studentId', 'fullName admissionNo rollNumber parentIds email')
      .populate('feeStructureId');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const payments = await FeePayment.find({ invoiceId: invoice._id, isVoid: false })
      .sort({ paymentDate: -1 })
      .populate('receivedBy', 'name shortName');

    return res.json({
      success: true,
      data: {
        ...invoice.toObject(),
        payments
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mass-generate invoices for students
exports.generateBulkInvoices = async (req, res) => {
  try {
    const { classIds, feeStructureId, title, dueDate, academicYearId } = req.body;

    if (!classIds || classIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one class is required' });
    }
    if (!feeStructureId) {
      return res.status(400).json({ success: false, message: 'Fee structure template is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ success: false, message: 'Due date is required' });
    }

    const structure = await FeeStructure.findById(feeStructureId).populate('heads.categoryId');
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    const students = await Student.find({
      classId: { $in: classIds },
      status: 'active'
    }).populate('classId');

    if (students.length === 0) {
      return res.status(400).json({ success: false, message: 'No active students found in selected classes' });
    }

    const invoiceTitle = title || `${structure.name} - ${new Date(dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

    let generatedCount = 0;
    const bulkInvoices = [];

    const totalInvoiceCount = await FeeInvoice.countDocuments();

    for (let i = 0; i < students.length; i++) {
      const st = students[i];
      const items = (structure.heads || []).map(h => ({
        categoryId: h.categoryId?._id || h.categoryId,
        name: h.categoryName || h.categoryId?.name || 'Fee Head',
        amount: h.amount,
        paidAmount: 0
      }));

      const subtotal = structure.totalAmount;
      const discountAmount = 0;
      const totalAmount = subtotal;
      const invoiceNumber = generateInvoiceNumber(totalInvoiceCount + i + 1);

      bulkInvoices.push({
        invoiceNumber,
        studentId: st._id,
        studentName: st.fullName,
        admissionNo: st.admissionNo || '',
        rollNumber: st.rollNumber || '',
        classId: st.classId?._id || st.classId,
        className: st.classId?.displayName || st.classId?.name || '',
        academicYearId: academicYearId || structure.academicYearId,
        feeStructureId: structure._id,
        title: invoiceTitle,
        items,
        subtotal,
        discountAmount,
        fineAmount: 0,
        totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        dueDate: new Date(dueDate),
        status: 'unpaid'
      });
    }

    await FeeInvoice.insertMany(bulkInvoices);

    return res.status(201).json({
      success: true,
      message: `Successfully generated ${bulkInvoices.length} invoices across ${classIds.length} classes`,
      count: bulkInvoices.length
    });
  } catch (error) {
    console.error('Error in generateBulkInvoices:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create a single customized invoice
exports.createCustomInvoice = async (req, res) => {
  try {
    const { studentId, title, items, discountAmount = 0, discountReason, dueDate, notes, academicYearId } = req.body;

    const student = await Student.findById(studentId).populate('classId');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    let subtotal = 0;
    (items || []).forEach(it => {
      subtotal += Number(it.amount) || 0;
    });

    const totalAmount = Math.max(0, subtotal - Number(discountAmount));
    const totalCount = await FeeInvoice.countDocuments();
    const invoiceNumber = generateInvoiceNumber(totalCount + 1);

    const invoice = await FeeInvoice.create({
      invoiceNumber,
      studentId: student._id,
      studentName: student.fullName,
      admissionNo: student.admissionNo || '',
      rollNumber: student.rollNumber || '',
      classId: student.classId?._id,
      className: student.classId?.displayName || student.classId?.name || '',
      academicYearId: academicYearId || student.academicYearId,
      title,
      items: items || [],
      subtotal,
      discountAmount: Number(discountAmount),
      discountReason: discountReason || '',
      fineAmount: 0,
      totalAmount,
      paidAmount: 0,
      balanceAmount: totalAmount,
      dueDate: new Date(dueDate),
      status: 'unpaid',
      notes: notes || ''
    });

    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error in createCustomInvoice:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 5. FEE COLLECTION & PAYMENTS ====================

exports.collectFeePayment = async (req, res) => {
  try {
    const {
      invoiceId,
      amountPaid,
      paymentMethod = 'cash',
      transactionReference,
      bankName,
      remarks,
      paymentDate
    } = req.body;

    const payAmount = Number(amountPaid);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    const invoice = await FeeInvoice.findById(invoiceId).populate('studentId');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.balanceAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invoice is already fully paid' });
    }

    const totalPaymentsCount = await FeePayment.countDocuments();
    const receiptNumber = generateReceiptNumber(totalPaymentsCount + 1);

    // Create payment transaction
    const payment = await FeePayment.create({
      receiptNumber,
      invoiceId: invoice._id,
      studentId: invoice.studentId?._id || invoice.studentId,
      studentName: invoice.studentName,
      admissionNo: invoice.admissionNo,
      rollNumber: invoice.rollNumber,
      classId: invoice.classId,
      className: invoice.className,
      academicYearId: invoice.academicYearId,
      amountPaid: payAmount,
      paymentMethod,
      transactionReference: transactionReference || '',
      bankName: bankName || '',
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      receivedBy: req.user._id,
      receiverName: req.user.name || 'Accountant',
      remarks: remarks || ''
    });

    // Update invoice paid and balance amounts
    const newPaidAmount = (invoice.paidAmount || 0) + payAmount;
    const newBalanceAmount = Math.max(0, invoice.totalAmount - newPaidAmount);
    const newStatus = newBalanceAmount <= 0 ? 'paid' : 'partially_paid';

    // Distribute paid amount across items proportionally
    let remainingPay = payAmount;
    invoice.items.forEach(item => {
      const itemUnpaid = item.amount - (item.paidAmount || 0);
      if (itemUnpaid > 0 && remainingPay > 0) {
        const allocate = Math.min(itemUnpaid, remainingPay);
        item.paidAmount = (item.paidAmount || 0) + allocate;
        remainingPay -= allocate;
      }
    });

    invoice.paidAmount = newPaidAmount;
    invoice.balanceAmount = newBalanceAmount;
    invoice.status = newStatus;
    await invoice.save();

    // Side-effects: trigger parent notification
    setImmediate(async () => {
      try {
        const student = await Student.findById(invoice.studentId);
        if (student && student.parentIds && student.parentIds.length > 0) {
          const title = `💰 Fee Receipt: ₹${payAmount.toLocaleString('en-IN')}`;
          const message = `Payment of ₹${payAmount} received for ${student.fullName} (${invoice.title}). Receipt: ${receiptNumber}. Outstanding balance: ₹${newBalanceAmount}.`;

          for (const pId of student.parentIds) {
            const notif = await Notification.create({
              userId: pId,
              title,
              message,
              type: 'success',
              data: {
                type: 'fee_payment',
                receiptNumber,
                invoiceNumber: invoice.invoiceNumber,
                amountPaid: payAmount,
                balanceAmount: newBalanceAmount,
                studentId: student._id
              }
            });

            broadcastToUser(pId, 'notification', {
              id: notif._id,
              _id: notif._id,
              title,
              message,
              type: 'success',
              data: notif.data,
              timestamp: notif.createdAt,
              read: false
            });
          }
        }
      } catch (err) {
        console.error('Error sending fee notification:', err);
      }
    });

    return res.status(201).json({
      success: true,
      message: `Payment of ₹${payAmount} recorded successfully. Receipt #${receiptNumber}`,
      payment,
      invoice
    });
  } catch (error) {
    console.error('Error in collectFeePayment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeePayments = async (req, res) => {
  try {
    const { classId, studentId, paymentMethod, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = { isVoid: false };
    if (classId) query.classId = classId;
    if (studentId) query.studentId = studentId;
    if (paymentMethod && paymentMethod !== 'all') query.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [payments, total] = await Promise.all([
      FeePayment.find(query)
        .populate('receivedBy', 'name shortName email')
        .populate('classId', 'name section displayName')
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      FeePayment.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getFeePayments:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeeReceiptById = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id)
      .populate('invoiceId')
      .populate('studentId', 'fullName admissionNo rollNumber parentName fatherFullName phone')
      .populate('classId', 'name section displayName')
      .populate('receivedBy', 'name shortName');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.voidFeePayment = async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await FeePayment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    if (payment.isVoid) {
      return res.status(400).json({ success: false, message: 'Receipt is already voided' });
    }

    // Revert invoice amounts
    const invoice = await FeeInvoice.findById(payment.invoiceId);
    if (invoice) {
      invoice.paidAmount = Math.max(0, (invoice.paidAmount || 0) - payment.amountPaid);
      invoice.balanceAmount = Math.min(invoice.totalAmount, invoice.totalAmount - invoice.paidAmount);
      invoice.status = invoice.paidAmount <= 0 ? 'unpaid' : 'partially_paid';
      await invoice.save();
    }

    payment.isVoid = true;
    payment.voidReason = reason || 'Cancelled by Admin';
    payment.voidedAt = new Date();
    payment.voidedBy = req.user._id;
    await payment.save();

    return res.json({
      success: true,
      message: `Receipt #${payment.receiptNumber} voided and invoice balance adjusted`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 6. DEFAULTERS & DUE REMINDERS ====================

exports.getFeeDefaulters = async (req, res) => {
  try {
    const { classId, minAmount = 0 } = req.query;

    const query = {
      status: { $in: ['unpaid', 'partially_paid', 'overdue'] },
      balanceAmount: { $gt: Number(minAmount) }
    };
    if (classId) query.classId = classId;

    const invoices = await FeeInvoice.find(query)
      .populate('classId', 'name section displayName')
      .populate('studentId', 'fullName admissionNo rollNumber parentIds phone fatherPhone motherPhone')
      .sort({ dueDate: 1, balanceAmount: -1 });

    const totalOverdueAmount = invoices.reduce((sum, i) => sum + (i.balanceAmount || 0), 0);

    return res.json({
      success: true,
      count: invoices.length,
      totalOverdueAmount,
      data: invoices
    });
  } catch (error) {
    console.error('Error in getFeeDefaulters:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendFeeReminders = async (req, res) => {
  try {
    const { invoiceIds, classId } = req.body;

    let query = {
      status: { $in: ['unpaid', 'partially_paid', 'overdue'] },
      balanceAmount: { $gt: 0 }
    };

    if (invoiceIds && Array.isArray(invoiceIds) && invoiceIds.length > 0) {
      query._id = { $in: invoiceIds };
    } else if (classId) {
      query.classId = classId;
    }

    const invoices = await FeeInvoice.find(query).populate('studentId');
    if (invoices.length === 0) {
      return res.json({ success: true, message: 'No pending invoices found for reminder', count: 0 });
    }

    let remindedCount = 0;
    for (const inv of invoices) {
      const student = inv.studentId;
      if (!student || !student.parentIds || student.parentIds.length === 0) continue;

      const title = `⚠️ Fee Payment Reminder: ${inv.title}`;
      const message = `Dear Parent, a fee balance of ₹${inv.balanceAmount.toLocaleString('en-IN')} for ${inv.studentName} is due by ${new Date(inv.dueDate).toLocaleDateString('en-US')}. Please pay online or at the school fee counter.`;

      for (const pId of student.parentIds) {
        const notif = await Notification.create({
          userId: pId,
          title,
          message,
          type: 'warning',
          data: {
            type: 'fee_reminder',
            invoiceId: inv._id,
            invoiceNumber: inv.invoiceNumber,
            balanceAmount: inv.balanceAmount,
            dueDate: inv.dueDate
          }
        });

        broadcastToUser(pId, 'notification', {
          id: notif._id,
          _id: notif._id,
          title,
          message,
          type: 'warning',
          data: notif.data,
          timestamp: notif.createdAt,
          read: false
        });
        remindedCount++;
      }

      inv.remindedAt = new Date();
      inv.reminderCount = (inv.reminderCount || 0) + 1;
      await inv.save();
    }

    return res.json({
      success: true,
      message: `Sent fee reminders to ${remindedCount} parent(s) across ${invoices.length} invoices`,
      count: remindedCount
    });
  } catch (error) {
    console.error('Error in sendFeeReminders:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 7. PARENT & STUDENT FEE VIEW ====================

exports.getChildFeeDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate('classId');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [invoices, payments] = await Promise.all([
      FeeInvoice.find({ studentId: student._id }).sort({ dueDate: 1, createdAt: -1 }),
      FeePayment.find({ studentId: student._id, isVoid: false }).sort({ paymentDate: -1 })
    ]);

    let totalBilled = 0;
    let totalPaid = 0;
    let totalDue = 0;

    invoices.forEach(inv => {
      totalBilled += inv.totalAmount || 0;
      totalPaid += inv.paidAmount || 0;
      totalDue += inv.balanceAmount || 0;
    });

    return res.json({
      success: true,
      student: {
        _id: student._id,
        fullName: student.fullName,
        admissionNo: student.admissionNo,
        rollNumber: student.rollNumber,
        className: student.classId?.displayName || student.classId?.name
      },
      summary: {
        totalBilled,
        totalPaid,
        totalDue
      },
      invoices,
      payments
    });
  } catch (error) {
    console.error('Error in getChildFeeDetails:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
