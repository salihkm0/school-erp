// src/routes/feeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getFeeDashboardStats,
  getFeeCategories,
  createFeeCategory,
  updateFeeCategory,
  deleteFeeCategory,
  getFeeStructures,
  getFeeStructureById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeInvoices,
  getFeeInvoiceById,
  generateBulkInvoices,
  createCustomInvoice,
  collectFeePayment,
  getFeePayments,
  getFeeReceiptById,
  voidFeePayment,
  getFeeDefaulters,
  sendFeeReminders,
  getChildFeeDetails
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');

// All fee routes require authentication
router.use(protect);

// 1. Dashboard & Analytics
router.get('/dashboard', authorize('admin', 'super_admin', 'staff'), getFeeDashboardStats);

// 2. Fee Categories / Heads
router.get('/categories', getFeeCategories);
router.post('/categories', authorize('admin', 'super_admin', 'staff'), createFeeCategory);
router.put('/categories/:id', authorize('admin', 'super_admin'), updateFeeCategory);
router.delete('/categories/:id', authorize('admin', 'super_admin'), deleteFeeCategory);

// 3. Fee Structures / Templates
router.get('/structures', getFeeStructures);
router.get('/structures/:id', getFeeStructureById);
router.post('/structures', authorize('admin', 'super_admin', 'staff'), createFeeStructure);
router.put('/structures/:id', authorize('admin', 'super_admin', 'staff'), updateFeeStructure);
router.delete('/structures/:id', authorize('admin', 'super_admin'), deleteFeeStructure);

// 4. Invoices
router.get('/invoices', getFeeInvoices);
router.get('/invoices/:id', getFeeInvoiceById);
router.post('/invoices/bulk', authorize('admin', 'super_admin', 'staff'), generateBulkInvoices);
router.post('/invoices/custom', authorize('admin', 'super_admin', 'staff'), createCustomInvoice);

// 5. Fee Collection & Payment Transactions
router.post('/payments/collect', authorize('admin', 'super_admin', 'staff'), collectFeePayment);
router.get('/payments', authorize('admin', 'super_admin', 'staff'), getFeePayments);
router.get('/payments/receipt/:id', getFeeReceiptById);
router.post('/payments/:id/void', authorize('admin', 'super_admin'), voidFeePayment);

// 6. Defaulters & Reminders
router.get('/defaulters', authorize('admin', 'super_admin', 'staff'), getFeeDefaulters);
router.post('/reminders/send', authorize('admin', 'super_admin', 'staff'), sendFeeReminders);

// 7. Parent & Student view
router.get('/child/:studentId', getChildFeeDetails);

module.exports = router;
