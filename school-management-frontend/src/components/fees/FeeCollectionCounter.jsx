// src/components/fees/FeeCollectionCounter.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  collectFeePayment, 
  fetchFeeStats 
} from '../../store/slices/feeSlice';
import feeService from '../../services/feeService';
import studentService from '../../services/studentService';
import { 
  MagnifyingGlassIcon, 
  BanknotesIcon, 
  CheckCircleIcon,
  UserCircleIcon,
  CreditCardIcon,
  QrCodeIcon,
  BuildingLibraryIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FeeCollectionCounter = ({ onOpenReceipt }) => {
  const dispatch = useDispatch();
  const { classes = [] } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);

  // Search & Student Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Student Fee Invoices State
  const [studentInvoices, setStudentInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');

  // Payment Form Fields
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionReference, setTransactionReference] = useState('');
  const [bankName, setBankName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search for students when query or class changes
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1 || selectedClassId) {
        setIsSearching(true);
        try {
          const params = { limit: 15 };
          if (searchQuery.trim()) params.search = searchQuery.trim();
          if (selectedClassId) params.classId = selectedClassId;

          const res = await studentService.getStudents(params);
          if (res && res.data) {
            setStudentsList(res.data);
          }
        } catch (err) {
          console.error('Error searching students:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setStudentsList([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedClassId]);

  // Load selected student's invoices
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingInvoices(true);
    try {
      const res = await feeService.getFeeInvoices({
        studentId: student._id,
        status: 'all'
      });

      if (res && res.data) {
        setStudentInvoices(res.data);
        // Pre-select first unpaid or partially paid invoice
        const activeInv = res.data.find(i => i.status !== 'paid' && i.balanceAmount > 0);
        if (activeInv) {
          setSelectedInvoiceId(activeInv._id);
          setAmountPaid(String(activeInv.balanceAmount));
        } else {
          setSelectedInvoiceId('');
          setAmountPaid('');
        }
      }
    } catch (err) {
      console.error('Error loading invoices for student:', err);
      toast.error('Failed to load student fee invoices');
    } finally {
      setLoadingInvoices(false);
    }
  };

  const selectedInvoice = studentInvoices.find(i => i._id === selectedInvoiceId);
  const totalStudentBalance = studentInvoices.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0);

  // Quick Amount Selectors
  const setQuickAmount = (type) => {
    if (!selectedInvoice) return;
    if (type === 'full') {
      setAmountPaid(String(selectedInvoice.balanceAmount));
    } else if (type === 'half') {
      setAmountPaid(String(Math.round(selectedInvoice.balanceAmount / 2)));
    } else if (type === 'total_all') {
      setAmountPaid(String(totalStudentBalance));
    }
  };

  const handleCollectPayment = async (e) => {
    e.preventDefault();

    if (!selectedInvoiceId) {
      toast.error('Please select an invoice to allocate payment');
      return;
    }

    const payNum = Number(amountPaid);
    if (!payNum || payNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (selectedInvoice && payNum > selectedInvoice.balanceAmount) {
      toast.error(`Amount cannot exceed invoice balance (₹${selectedInvoice.balanceAmount})`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await feeService.collectFeePayment({
        invoiceId: selectedInvoiceId,
        amountPaid: payNum,
        paymentMethod,
        transactionReference,
        bankName,
        remarks,
        paymentDate
      });

      if (res.success) {
        toast.success(`Receipt #${res.payment.receiptNumber} generated!`);
        // Trigger printable receipt modal immediately
        onOpenReceipt(res.payment);

        // Refresh stats & reload student invoices
        dispatch(fetchFeeStats());
        if (selectedStudent) {
          handleSelectStudent(selectedStudent);
        }

        // Reset collection fields
        setTransactionReference('');
        setRemarks('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record payment';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Student by Name, Admission No, or Roll No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3.5 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value="">All Classes & Sections</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.displayName || `${c.name} - ${c.section}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Search Suggestions dropdown if searching */}
        {studentsList.length > 0 && !selectedStudent && (
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Student ({studentsList.length} matching)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto">
              {studentsList.map(st => (
                <div
                  key={st._id}
                  onClick={() => handleSelectStudent(st)}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-400 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-emerald-50/40 cursor-pointer transition"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{st.fullName}</p>
                    <p className="text-[11px] text-gray-500">
                      Adm: <span className="font-mono">{st.admissionNo || '—'}</span> | Roll: <span className="font-mono">{st.rollNumber || '—'}</span>
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {st.classId?.displayName || st.classId?.name || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Counter Workspace (When student selected) */}
      {selectedStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Student Details & Pending Invoices (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Student Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {selectedStudent.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedStudent.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      Class: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedStudent.classId?.displayName || selectedStudent.classId?.name}</span> | 
                      Adm: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 ml-1">{selectedStudent.admissionNo || 'N/A'}</span> | 
                      Roll: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 ml-1">{selectedStudent.rollNumber || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentInvoices([]);
                    setSelectedInvoiceId('');
                  }}
                  className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Change Student
                </button>
              </div>

              {/* Dues Summary Pill */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Total Outstanding</span>
                  <p className="font-mono font-bold text-base text-rose-600 dark:text-rose-400">
                    ₹{totalStudentBalance.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Parent Phone</span>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {selectedStudent.phone || selectedStudent.fatherPhone || 'Not Registered'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Invoices Count</span>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {studentInvoices.length} Bills ({studentInvoices.filter(i => i.balanceAmount > 0).length} Unpaid)
                  </p>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Student Invoices (Select Invoice to Collect)
              </h4>

              {loadingInvoices ? (
                <div className="py-10 text-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs">Fetching student fee bills...</p>
                </div>
              ) : studentInvoices.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-500">No invoices generated for this student yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentInvoices.map((inv) => {
                    const isSelected = selectedInvoiceId === inv._id;
                    const isPaid = inv.status === 'paid' || inv.balanceAmount <= 0;

                    return (
                      <div
                        key={inv._id}
                        onClick={() => {
                          if (!isPaid) {
                            setSelectedInvoiceId(inv._id);
                            setAmountPaid(String(inv.balanceAmount));
                          }
                        }}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                            : isPaid
                            ? 'border-gray-100 dark:border-gray-700/60 bg-gray-50/40 opacity-70 cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                                {inv.invoiceNumber}
                              </span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                inv.status === 'paid' 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                  : inv.status === 'partially_paid'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1">{inv.title}</p>
                            <p className="text-[11px] text-gray-500">
                              Due: {new Date(inv.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-400">Balance Due</p>
                            <p className={`font-mono font-bold text-sm ${inv.balanceAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
                              ₹{inv.balanceAmount.toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] text-gray-400">Total: ₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        {/* Fee Heads item breakdown snippet */}
                        {inv.items && inv.items.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap gap-2">
                            {inv.items.map((it, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                {it.name}: ₹{it.amount}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Payment Collection Fast Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700 mb-5">
                <BanknotesIcon className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Fee Collection Counter</h3>
              </div>

              {selectedInvoice ? (
                <form onSubmit={handleCollectPayment} className="space-y-4">
                  
                  {/* Selected invoice banner */}
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs">
                    <p className="font-bold text-emerald-900 dark:text-emerald-300">Target Invoice: {selectedInvoice.invoiceNumber}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">{selectedInvoice.title}</p>
                  </div>

                  {/* Amount Field & Quick Buttons */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Amount to Collect (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                      <input
                        type="number"
                        required
                        min="1"
                        max={selectedInvoice.balanceAmount}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl font-mono font-bold text-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setQuickAmount('full')}
                        className="flex-1 py-1 px-2 text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 transition"
                      >
                        Full Due (₹{selectedInvoice.balanceAmount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickAmount('half')}
                        className="flex-1 py-1 px-2 text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition"
                      >
                        50% Due
                      </button>
                    </div>
                  </div>

                  {/* Payment Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Payment Mode *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cash', label: 'Cash' },
                        { id: 'upi', label: 'UPI / QR' },
                        { id: 'card', label: 'Card (POS)' },
                        { id: 'bank_transfer', label: 'Net Banking' },
                        { id: 'cheque', label: 'Cheque' },
                        { id: 'dd', label: 'Demand Draft' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold uppercase transition ${
                            paymentMethod === m.id
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Ref / Cheque No (for non-cash) */}
                  {paymentMethod !== 'cash' && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {paymentMethod === 'upi' ? 'UPI Ref / UTR No' : paymentMethod === 'cheque' ? 'Cheque No' : 'Transaction Ref'}
                        </label>
                        <input
                          type="text"
                          value={transactionReference}
                          onChange={(e) => setTransactionReference(e.target.value)}
                          placeholder="e.g. 334589214782"
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      {(paymentMethod === 'cheque' || paymentMethod === 'bank_transfer' || paymentMethod === 'dd') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. State Bank of India"
                            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cashier Remarks */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cashier Remarks / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Term 1 partial fee received"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedInvoice || selectedInvoice.balanceAmount <= 0}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition"
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          Processing Transaction...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          Collect ₹{Number(amountPaid || 0).toLocaleString('en-IN')} & Print Receipt
                        </>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <ExclamationTriangleIcon className="w-10 h-10 mx-auto mb-2 text-amber-500" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">No Invoice Selected</p>
                  <p className="text-[11px] text-gray-400 mt-1">Please select an unpaid invoice from the student list on the left to proceed with payment.</p>
                </div>
              )}

            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
          <UserCircleIcon className="w-16 h-16 mx-auto text-emerald-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fast Fee Collection Terminal</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Search for a student using name, admission number, or roll number above to view their fee bills, record payments, and print instantaneous receipts.
          </p>
        </div>
      )}

    </div>
  );
};

export default FeeCollectionCounter;
