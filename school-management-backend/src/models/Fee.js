// src/models/Fee.js
const mongoose = require('mongoose');

// ── 1. Fee Category (Fee Head) Schema ────────────────────────────────────
const FeeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['tuition', 'transport', 'examination', 'facility', 'co_curricular', 'miscellaneous', 'one_time'],
    default: 'tuition'
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

FeeCategorySchema.index({ code: 1 }, { unique: true });

// ── 2. Fee Structure Schema (Class Template) ─────────────────────────────
const FeeStructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  classIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  heads: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeCategory',
      required: true
    },
    categoryName: String,
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    isOptional: {
      type: Boolean,
      default: false
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  installments: [{
    name: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      required: true
    },
    lateFinePerDay: {
      type: Number,
      default: 0
    },
    lateFineGraceDays: {
      type: Number,
      default: 0
    }
  }],
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

FeeStructureSchema.index({ academicYearId: 1, isActive: 1 });

// ── 3. Student Fee Invoice Schema (Student Bill) ─────────────────────────
const FeeInvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  admissionNo: {
    type: String,
    default: ''
  },
  rollNumber: {
    type: String,
    default: ''
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  feeStructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure'
  },
  title: {
    type: String,
    required: true
  },
  items: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeCategory'
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  discountReason: {
    type: String,
    default: ''
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    required: true,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid', 'overdue', 'waived'],
    default: 'unpaid'
  },
  notes: String,
  remindedAt: Date,
  reminderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

FeeInvoiceSchema.index({ studentId: 1, academicYearId: 1 });
FeeInvoiceSchema.index({ classId: 1, status: 1 });
FeeInvoiceSchema.index({ dueDate: 1, status: 1 });

// ── 4. Fee Payment Schema (Transaction Receipt) ──────────────────────────
const FeePaymentSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeInvoice',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  admissionNo: String,
  rollNumber: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  className: String,
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear'
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer', 'cheque', 'dd', 'online'],
    default: 'cash'
  },
  transactionReference: {
    type: String,
    default: ''
  },
  bankName: {
    type: String,
    default: ''
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverName: String,
  remarks: {
    type: String,
    default: ''
  },
  isVoid: {
    type: Boolean,
    default: false
  },
  voidReason: String,
  voidedAt: Date,
  voidedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

FeePaymentSchema.index({ studentId: 1, paymentDate: -1 });
FeePaymentSchema.index({ invoiceId: 1 });
FeePaymentSchema.index({ paymentDate: -1 });
FeePaymentSchema.index({ paymentMethod: 1 });

// Create models
const FeeCategory = mongoose.models.FeeCategory || mongoose.model('FeeCategory', FeeCategorySchema);
const FeeStructure = mongoose.models.FeeStructure || mongoose.model('FeeStructure', FeeStructureSchema);
const FeeInvoice = mongoose.models.FeeInvoice || mongoose.model('FeeInvoice', FeeInvoiceSchema);
const FeePayment = mongoose.models.FeePayment || mongoose.model('FeePayment', FeePaymentSchema);

module.exports = {
  FeeCategory,
  FeeStructure,
  FeeInvoice,
  FeePayment
};
