import api from './api';

export const feeService = {
  // 1. Dashboard & Statistics
  getFeeDashboardStats: async (params) => {
    const res = await api.get('/fees/dashboard', { params });
    return res.data;
  },

  // 2. Fee Heads / Categories
  getFeeCategories: async () => {
    const res = await api.get('/fees/categories');
    return res.data;
  },

  createFeeCategory: async (data) => {
    const res = await api.post('/fees/categories', data);
    return res.data;
  },

  updateFeeCategory: async (id, data) => {
    const res = await api.put(`/fees/categories/${id}`, data);
    return res.data;
  },

  deleteFeeCategory: async (id) => {
    const res = await api.delete(`/fees/categories/${id}`);
    return res.data;
  },

  // 3. Fee Structures (Templates)
  getFeeStructures: async (params) => {
    const res = await api.get('/fees/structures', { params });
    return res.data;
  },

  getFeeStructureById: async (id) => {
    const res = await api.get(`/fees/structures/${id}`);
    return res.data;
  },

  createFeeStructure: async (data) => {
    const res = await api.post('/fees/structures', data);
    return res.data;
  },

  updateFeeStructure: async (id, data) => {
    const res = await api.put(`/fees/structures/${id}`, data);
    return res.data;
  },

  deleteFeeStructure: async (id) => {
    const res = await api.delete(`/fees/structures/${id}`);
    return res.data;
  },

  // 4. Invoices
  getFeeInvoices: async (params) => {
    const res = await api.get('/fees/invoices', { params });
    return res.data;
  },

  getFeeInvoiceById: async (id) => {
    const res = await api.get(`/fees/invoices/${id}`);
    return res.data;
  },

  generateBulkInvoices: async (data) => {
    const res = await api.post('/fees/invoices/bulk', data);
    return res.data;
  },

  createCustomInvoice: async (data) => {
    const res = await api.post('/fees/invoices/custom', data);
    return res.data;
  },

  // 5. Payments & Fast Counter Collection
  collectFeePayment: async (data) => {
    const res = await api.post('/fees/payments/collect', data);
    return res.data;
  },

  getFeePayments: async (params) => {
    const res = await api.get('/fees/payments', { params });
    return res.data;
  },

  getFeeReceiptById: async (id) => {
    const res = await api.get(`/fees/payments/receipt/${id}`);
    return res.data;
  },

  voidFeePayment: async (id, data) => {
    const res = await api.post(`/fees/payments/${id}/void`, data);
    return res.data;
  },

  // 6. Defaulters & Reminders
  getFeeDefaulters: async (params) => {
    const res = await api.get('/fees/defaulters', { params });
    return res.data;
  },

  sendFeeReminders: async (data) => {
    const res = await api.post('/fees/reminders/send', data);
    return res.data;
  },

  // 7. Child / Student Specific Fees
  getChildFeeDetails: async (studentId) => {
    const res = await api.get(`/fees/child/${studentId}`);
    return res.data;
  }
};

export default feeService;
