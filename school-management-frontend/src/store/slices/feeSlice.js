// src/store/slices/feeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feeService from '../../services/feeService';
import toast from 'react-hot-toast';

export const fetchFeeStats = createAsyncThunk(
  'fees/fetchFeeStats',
  async (params, { rejectWithValue }) => {
    try {
      return await feeService.getFeeDashboardStats(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fee analytics');
    }
  }
);

export const fetchFeeCategories = createAsyncThunk(
  'fees/fetchFeeCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await feeService.getFeeCategories();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fee categories');
    }
  }
);

export const createFeeCategory = createAsyncThunk(
  'fees/createFeeCategory',
  async (data, { rejectWithValue }) => {
    try {
      const res = await feeService.createFeeCategory(data);
      toast.success('Fee head created successfully');
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create fee head';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteFeeCategory = createAsyncThunk(
  'fees/deleteFeeCategory',
  async (id, { rejectWithValue }) => {
    try {
      const res = await feeService.deleteFeeCategory(id);
      toast.success('Fee head deleted successfully');
      return { id, ...res };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete fee head';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchFeeStructures = createAsyncThunk(
  'fees/fetchFeeStructures',
  async (params, { rejectWithValue }) => {
    try {
      return await feeService.getFeeStructures(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fee structures');
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  'fees/createFeeStructure',
  async (data, { rejectWithValue }) => {
    try {
      const res = await feeService.createFeeStructure(data);
      toast.success('Fee structure template created!');
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create fee structure';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteFeeStructure = createAsyncThunk(
  'fees/deleteFeeStructure',
  async (id, { rejectWithValue }) => {
    try {
      const res = await feeService.deleteFeeStructure(id);
      toast.success('Fee structure deleted!');
      return { id, ...res };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete fee structure';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchFeeInvoices = createAsyncThunk(
  'fees/fetchFeeInvoices',
  async (params, { rejectWithValue }) => {
    try {
      return await feeService.getFeeInvoices(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const generateBulkInvoices = createAsyncThunk(
  'fees/generateBulkInvoices',
  async (data, { rejectWithValue }) => {
    try {
      const res = await feeService.generateBulkInvoices(data);
      toast.success(res.message || 'Invoices generated successfully!');
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate bulk invoices';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const collectFeePayment = createAsyncThunk(
  'fees/collectFeePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const res = await feeService.collectFeePayment(paymentData);
      toast.success(res.message || 'Payment recorded successfully!');
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to record fee payment';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchFeePayments = createAsyncThunk(
  'fees/fetchFeePayments',
  async (params, { rejectWithValue }) => {
    try {
      return await feeService.getFeePayments(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment ledger');
    }
  }
);

export const fetchFeeDefaulters = createAsyncThunk(
  'fees/fetchFeeDefaulters',
  async (params, { rejectWithValue }) => {
    try {
      return await feeService.getFeeDefaulters(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch defaulters');
    }
  }
);

export const sendFeeReminders = createAsyncThunk(
  'fees/sendFeeReminders',
  async (data, { rejectWithValue }) => {
    try {
      const res = await feeService.sendFeeReminders(data);
      toast.success(res.message || 'Reminders dispatched successfully!');
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to dispatch reminders';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  stats: null,
  categories: [],
  structures: [],
  invoices: [],
  invoicesPagination: { page: 1, limit: 50, total: 0, pages: 1 },
  payments: [],
  paymentsPagination: { page: 1, limit: 50, total: 0, pages: 1 },
  defaulters: [],
  totalOverdueAmount: 0,
  currentReceipt: null,
  childFeeDetails: null,
  loading: false,
  error: null,
  collectionLoading: false
};

const feeSlice = createSlice({
  name: 'fees',
  initialState,
  reducers: {
    setCurrentReceipt: (state, action) => {
      state.currentReceipt = action.payload;
    },
    clearCurrentReceipt: (state) => {
      state.currentReceipt = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchFeeStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchFeeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Categories
      .addCase(fetchFeeCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data || [];
      })
      .addCase(createFeeCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.data);
      })
      .addCase(deleteFeeCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload.id);
      })

      // Structures
      .addCase(fetchFeeStructures.fulfilled, (state, action) => {
        state.structures = action.payload.data || [];
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.structures.unshift(action.payload.data);
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.structures = state.structures.filter(s => s._id !== action.payload.id);
      })

      // Invoices
      .addCase(fetchFeeInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data || [];
        state.invoicesPagination = action.payload.pagination || state.invoicesPagination;
      })
      .addCase(fetchFeeInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Payments & Fast Collection
      .addCase(collectFeePayment.pending, (state) => {
        state.collectionLoading = true;
      })
      .addCase(collectFeePayment.fulfilled, (state, action) => {
        state.collectionLoading = false;
        state.currentReceipt = action.payload.payment;
        if (action.payload.payment) {
          state.payments.unshift(action.payload.payment);
        }
      })
      .addCase(collectFeePayment.rejected, (state, action) => {
        state.collectionLoading = false;
        state.error = action.payload;
      })

      // Payment Ledger
      .addCase(fetchFeePayments.fulfilled, (state, action) => {
        state.payments = action.payload.data || [];
        state.paymentsPagination = action.payload.pagination || state.paymentsPagination;
      })

      // Defaulters
      .addCase(fetchFeeDefaulters.fulfilled, (state, action) => {
        state.defaulters = action.payload.data || [];
        state.totalOverdueAmount = action.payload.totalOverdueAmount || 0;
      });
  }
});

export const { setCurrentReceipt, clearCurrentReceipt } = feeSlice.actions;
export default feeSlice.reducer;
