// src/pages/parent/MyChildFeesPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BanknotesIcon, 
  CurrencyRupeeIcon, 
  CheckCircleIcon, 
  PrinterIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { fetchMyChildren, fetchMyParentProfile } from '../../store/slices/parentSlice';
import feeService from '../../services/feeService';
import PrintableReceiptModal from '../../components/fees/PrintableReceiptModal';
import toast from 'react-hot-toast';

const MyChildFeesPage = () => {
  const dispatch = useDispatch();
  const { myChildren = [], isLoading: loadingChildren } = useSelector((state) => state.parents || {});
  
  const [selectedChild, setSelectedChild] = useState(null);
  const [feeDetails, setFeeDetails] = useState(null);
  const [loadingFees, setLoadingFees] = useState(false);
  const [printableReceipt, setPrintableReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyParentProfile()).then((res) => {
      if (res.payload?.data?._id) {
        dispatch(fetchMyChildren(res.payload.data._id));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (myChildren.length > 0 && !selectedChild) {
      const firstStudent = myChildren[0]?.studentId || myChildren[0];
      setSelectedChild(firstStudent);
    }
  }, [myChildren, selectedChild]);

  useEffect(() => {
    if (selectedChild?._id) {
      loadChildFees(selectedChild._id);
    }
  }, [selectedChild]);

  const loadChildFees = async (studentId) => {
    setLoadingFees(true);
    try {
      const res = await feeService.getChildFeeDetails(studentId);
      if (res.success) {
        setFeeDetails(res);
      }
    } catch (err) {
      console.error('Error fetching child fee details:', err);
    } finally {
      setLoadingFees(false);
    }
  };

  const handleOpenReceipt = (receipt) => {
    setPrintableReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const invoices = feeDetails?.invoices || [];
  const payments = feeDetails?.payments || [];
  const summary = feeDetails?.summary || { totalBilled: 0, totalPaid: 0, totalDue: 0 };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Child Fee & Billing Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          View term invoices, payment receipts, fee breakdown, and outstanding balance for your children.
        </p>
      </div>

      {/* Child Switcher Tabs (if multiple children) */}
      {myChildren.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {myChildren.map((item) => {
            const st = item.studentId || item;
            const isSelected = selectedChild?._id === st._id;
            return (
              <button
                key={st._id}
                onClick={() => setSelectedChild(st)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserCircleIcon className="w-4 h-4" />
                <span>{st.fullName || st.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Billed Fee</span>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white font-mono mt-1">
            ₹{summary.totalBilled.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">Current Academic Year</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Paid</span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            ₹{summary.totalPaid.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
            {payments.length} Receipt(s) Issued
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Outstanding Balance Due</span>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
            ₹{summary.totalDue.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1">
            {summary.totalDue > 0 ? 'Payable at school counter or online' : 'All Clear! No Dues'}
          </p>
        </div>

      </div>

      {/* Main Fee Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Invoices List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Term Invoices & Fee Bills</span>
              <span className="text-xs font-semibold text-gray-400">{invoices.length} Invoices</span>
            </h3>

            {loadingFees ? (
              <div className="py-12 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Loading child's invoices...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-xs text-gray-500">No invoices billed for this student yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div
                    key={inv._id}
                    className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                            {inv.invoiceNumber}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'paid' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'partially_paid'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">{inv.title}</h4>
                        <p className="text-[11px] text-gray-500">
                          Due Date: {new Date(inv.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">Balance Due</span>
                        <p className={`font-mono font-bold text-base ${inv.balanceAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
                          ₹{inv.balanceAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-gray-400">Total: ₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Breakdown Particulars */}
                    {inv.items && inv.items.length > 0 && (
                      <div className="pt-2 border-t border-gray-200/60 dark:border-gray-600/60">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {inv.items.map((it, idx) => (
                            <div key={idx} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs">
                              <span className="text-gray-500 text-[10px] block truncate">{it.name}</span>
                              <span className="font-mono font-bold text-gray-800 dark:text-gray-200">₹{it.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Paid Receipts History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Paid Receipts & History</span>
              <span className="text-xs font-semibold text-emerald-600">{payments.length} Receipts</span>
            </h3>

            {payments.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-xs text-gray-500">No payment receipts issued yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div
                    key={p._id}
                    className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-gray-900 dark:text-white">{p.receiptNumber}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {new Date(p.paymentDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="ml-1 uppercase font-semibold text-[10px]">({p.paymentMethod})</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                          ₹{p.amountPaid.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenReceipt(p)}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition"
                        title="Download / Print Receipt"
                      >
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Printable Receipt Modal */}
      <PrintableReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receipt={printableReceipt}
      />

    </div>
  );
};

export default MyChildFeesPage;
