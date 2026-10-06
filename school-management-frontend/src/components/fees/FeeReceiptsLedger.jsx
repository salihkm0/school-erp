// src/components/fees/FeeReceiptsLedger.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeePayments } from '../../store/slices/feeSlice';
import feeService from '../../services/feeService';
import { 
  MagnifyingGlassIcon, 
  PrinterIcon, 
  NoSymbolIcon, 
  ArrowPathIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FeeReceiptsLedger = ({ onOpenReceipt }) => {
  const dispatch = useDispatch();
  const { payments = [], loading } = useSelector((state) => state.fees);
  const { classes = [] } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);

  // Filters
  const [selectedClassId, setSelectedClassId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Void Receipt Modal
  const [voidTargetReceipt, setVoidTargetReceipt] = useState(null);
  const [voidReason, setVoidReason] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);

  const loadLedger = () => {
    dispatch(fetchFeePayments({
      classId: selectedClassId || undefined,
      paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page
    }));
  };

  useEffect(() => {
    loadLedger();
  }, [dispatch, selectedClassId, paymentMethod, startDate, endDate, page]);

  const filteredPayments = payments.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.receiptNumber?.toLowerCase().includes(q) ||
      p.studentName?.toLowerCase().includes(q) ||
      p.admissionNo?.toLowerCase().includes(q) ||
      p.transactionReference?.toLowerCase().includes(q)
    );
  });

  const totalFilteredAmount = filteredPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  const handleVoidReceipt = async (e) => {
    e.preventDefault();
    if (!voidReason.trim()) {
      toast.error('Please specify a reason for voiding this receipt');
      return;
    }

    setIsVoiding(true);
    try {
      const res = await feeService.voidFeePayment(voidTargetReceipt._id, {
        reason: voidReason.trim()
      });

      if (res.success) {
        toast.success(res.message);
        setVoidTargetReceipt(null);
        setVoidReason('');
        loadLedger();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to void receipt');
    } finally {
      setIsVoiding(false);
    }
  };

  const getMethodBadge = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">UPI</span>;
      case 'card':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Card</span>;
      case 'bank_transfer':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">Bank</span>;
      case 'cheque':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Cheque</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Cash</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Receipt #, Student, Adm No, Ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.displayName || `${c.name} - ${c.section}`}</option>
              ))}
            </select>

            {/* Payment Mode */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            >
              <option value="all">All Modes</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI / QR</option>
              <option value="card">Card (POS)</option>
              <option value="bank_transfer">Net Banking</option>
              <option value="cheque">Cheque</option>
              <option value="dd">Demand Draft</option>
            </select>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                title="Start Date"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                title="End Date"
              />
            </div>
          </div>

          {/* Quick Stats Tally */}
          <div className="flex items-center gap-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
            <BanknotesIcon className="w-5 h-5 text-emerald-600" />
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block font-semibold">Tally Total:</span>
              <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                ₹{totalFilteredAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Receipt #</th>
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-5 py-3.5">Class</th>
                <th className="px-5 py-3.5">Payment Date & Time</th>
                <th className="px-5 py-3.5">Payment Mode</th>
                <th className="px-5 py-3.5">Transaction Ref</th>
                <th className="px-5 py-3.5">Cashier</th>
                <th className="px-5 py-3.5 text-right">Amount Received</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p>Loading financial transactions ledger...</p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-gray-400">
                    <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No Payment Transactions Recorded</p>
                    <p className="text-xs text-gray-400 mt-1">Receipts collected at the fast counter will appear here in real-time.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-gray-900 dark:text-white">
                      {p.receiptNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{p.studentName}</p>
                      <p className="text-[11px] text-gray-500">
                        Adm: <span className="font-mono">{p.admissionNo || '—'}</span> | Roll: <span className="font-mono">{p.rollNumber || '—'}</span>
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-semibold">
                      {p.className || p.classId?.displayName || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                      {new Date(p.paymentDate).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      {getMethodBadge(p.paymentMethod)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-gray-500 max-w-[120px] truncate">
                      {p.transactionReference || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                      {p.receiverName || p.receivedBy?.name || 'Accountant'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                      ₹{p.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenReceipt(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                          title="Print Receipt"
                        >
                          <PrinterIcon className="w-3.5 h-3.5" />
                          Print
                        </button>
                        {(user?.role === 'admin' || user?.role === 'super_admin') && (
                          <button
                            onClick={() => setVoidTargetReceipt(p)}
                            className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                            title="Void / Cancel Receipt"
                          >
                            <NoSymbolIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Void Receipt Prompt */}
      {voidTargetReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <NoSymbolIcon className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Void / Cancel Receipt</h3>
              </div>
              <button
                onClick={() => setVoidTargetReceipt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVoidReceipt} className="p-6 space-y-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800/40 text-xs">
                <p className="font-bold text-rose-900 dark:text-rose-300">
                  Voiding Receipt #{voidTargetReceipt.receiptNumber}
                </p>
                <p className="text-rose-700 dark:text-rose-400 mt-1">
                  Amount: ₹{voidTargetReceipt.amountPaid} for {voidTargetReceipt.studentName}.
                  This will deduct the paid amount and revert the student's invoice balance.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Cancellation Reason *
                </label>
                <textarea
                  required
                  rows="3"
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Wrong student selected / Cheque bounced / Cashier entry error"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setVoidTargetReceipt(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVoiding}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  {isVoiding ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <NoSymbolIcon className="w-4 h-4" />}
                  Confirm Void Receipt
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default FeeReceiptsLedger;
