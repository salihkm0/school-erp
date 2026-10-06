// src/components/fees/FeeInvoicesList.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFeeInvoices, 
  generateBulkInvoices,
  fetchFeeStructures,
  fetchFeeCategories
} from '../../store/slices/feeSlice';
import feeService from '../../services/feeService';
import studentService from '../../services/studentService';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
  CurrencyRupeeIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FeeInvoicesList = ({ onNavigateToCounter }) => {
  const dispatch = useDispatch();
  const { invoices = [], structures = [], categories = [], loading } = useSelector((state) => state.fees);
  const { classes = [] } = useSelector((state) => state.classes);
  const { activeAcademicYear } = useSelector((state) => state.academicYears || {});

  // Filters
  const [selectedClassId, setSelectedClassId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCustomBillModalOpen, setIsCustomBillModalOpen] = useState(false);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState(null);

  // Bulk Generator Form State
  const [bulkClassIds, setBulkClassIds] = useState([]);
  const [bulkStructureId, setBulkStructureId] = useState('');
  const [bulkTitle, setBulkTitle] = useState('');
  const [bulkDueDate, setBulkDueDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Custom Bill Form State
  const [customStudentSearch, setCustomStudentSearch] = useState('');
  const [customStudentList, setCustomStudentList] = useState([]);
  const [selectedCustomStudent, setSelectedCustomStudent] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDueDate, setCustomDueDate] = useState('');
  const [customItems, setCustomItems] = useState([
    { name: 'Special Activity / Fee', amount: 500 }
  ]);
  const [customDiscount, setCustomDiscount] = useState(0);
  const [customDiscountReason, setCustomDiscountReason] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  const loadInvoices = () => {
    dispatch(fetchFeeInvoices({
      classId: selectedClassId || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery.trim() || undefined,
      page
    }));
  };

  useEffect(() => {
    loadInvoices();
  }, [dispatch, selectedClassId, statusFilter, page]);

  useEffect(() => {
    dispatch(fetchFeeStructures());
    dispatch(fetchFeeCategories());
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      loadInvoices();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Handle student search in custom bill modal
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (customStudentSearch.trim().length > 1) {
        try {
          const res = await studentService.getStudents({ search: customStudentSearch.trim(), limit: 10 });
          if (res && res.data) setCustomStudentList(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setCustomStudentList([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [customStudentSearch]);

  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    if (bulkClassIds.length === 0) {
      toast.error('Please select at least one class');
      return;
    }
    if (!bulkStructureId) {
      toast.error('Please select a fee structure template');
      return;
    }
    if (!bulkDueDate) {
      toast.error('Please set a due date');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await dispatch(generateBulkInvoices({
        classIds: bulkClassIds,
        feeStructureId: bulkStructureId,
        title: bulkTitle,
        dueDate: bulkDueDate,
        academicYearId: activeAcademicYear?._id
      })).unwrap();

      setIsBulkModalOpen(false);
      setBulkClassIds([]);
      setBulkStructureId('');
      setBulkTitle('');
      setBulkDueDate('');
      loadInvoices();
    } catch (err) {
      // Error handled in slice toast
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCustomBill = async (e) => {
    e.preventDefault();
    if (!selectedCustomStudent) {
      toast.error('Please select a student');
      return;
    }
    if (!customTitle) {
      toast.error('Please provide a bill title');
      return;
    }
    if (!customDueDate) {
      toast.error('Please set a due date');
      return;
    }

    setIsCreatingCustom(true);
    try {
      const res = await feeService.createCustomInvoice({
        studentId: selectedCustomStudent._id,
        title: customTitle,
        items: customItems,
        discountAmount: Number(customDiscount) || 0,
        discountReason: customDiscountReason,
        dueDate: customDueDate,
        notes: customNotes,
        academicYearId: activeAcademicYear?._id
      });

      if (res.success) {
        toast.success('Custom invoice created successfully!');
        setIsCustomBillModalOpen(false);
        setSelectedCustomStudent(null);
        setCustomStudentSearch('');
        setCustomTitle('');
        setCustomItems([{ name: 'Special Activity / Fee', amount: 500 }]);
        setCustomDiscount(0);
        loadInvoices();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create custom bill');
    } finally {
      setIsCreatingCustom(false);
    }
  };

  const addCustomItemRow = () => {
    setCustomItems([...customItems, { name: '', amount: 0 }]);
  };

  const removeCustomItemRow = (idx) => {
    setCustomItems(customItems.filter((_, i) => i !== idx));
  };

  const updateCustomItem = (idx, field, val) => {
    const updated = [...customItems];
    updated[idx][field] = field === 'amount' ? Number(val) || 0 : val;
    setCustomItems(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header & Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative min-w-[240px] flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Invoice #, Student, Adm No..."
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Create / Bulk Invoicing buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCustomBillModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold transition"
            >
              <PlusIcon className="w-4 h-4" />
              Custom Bill
            </button>

            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
              Mass Invoicing (Bulk)
            </button>
          </div>

        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-5 py-3.5">Class</th>
                <th className="px-5 py-3.5">Fee Title</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5 text-right">Billed</th>
                <th className="px-5 py-3.5 text-right">Paid</th>
                <th className="px-5 py-3.5 text-right">Balance Due</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p>Loading fee invoices...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-gray-400">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="font-semibold text-gray-700 dark:text-gray-300">No Invoices Found</p>
                    <p className="text-[11px] text-gray-400 mt-1">Generate invoices for classes or create custom bills using the buttons above.</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-gray-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{inv.studentName}</p>
                      <p className="text-[11px] text-gray-500">
                        Adm: <span className="font-mono">{inv.admissionNo || '—'}</span> | Roll: <span className="font-mono">{inv.rollNumber || '—'}</span>
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 font-medium">
                      {inv.className || inv.classId?.displayName || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium max-w-[180px] truncate">
                      {inv.title}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                      {new Date(inv.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-gray-900 dark:text-white">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      ₹{inv.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                      ₹{inv.balanceAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block uppercase font-bold text-[10px] px-2 py-0.5 rounded-full ${
                        inv.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : inv.status === 'partially_paid'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : inv.status === 'overdue' || inv.isOverdue
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {inv.isOverdue ? 'overdue' : inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceForDetail(inv)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition"
                          title="View Invoice Details"
                        >
                          View
                        </button>
                        {inv.balanceAmount > 0 && (
                          <button
                            onClick={() => onNavigateToCounter(inv)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Collect payment at counter"
                          >
                            <BanknotesIcon className="w-3.5 h-3.5" />
                            Pay
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

      {/* MODAL 1: Bulk Invoices Generator */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <DocumentDuplicateIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Mass Invoicing Generator</h3>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkGenerate} className="p-6 space-y-4">
              
              {/* Fee Structure Template */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Select Fee Structure Template *
                </label>
                <select
                  required
                  value={bulkStructureId}
                  onChange={(e) => {
                    setBulkStructureId(e.target.value);
                    const struct = structures.find(s => s._id === e.target.value);
                    if (struct) {
                      setBulkTitle(`${struct.name} - Term Bill`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">-- Choose Template --</option>
                  {structures.map(st => (
                    <option key={st._id} value={st._id}>
                      {st.name} (₹{st.totalAmount} — {st.heads?.length || 0} Heads)
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Classes (Multi Select) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Target Classes ({bulkClassIds.length} selected) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (bulkClassIds.length === classes.length) setBulkClassIds([]);
                      else setBulkClassIds(classes.map(c => c._id));
                    }}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    {bulkClassIds.length === classes.length ? 'Deselect All' : 'Select All Classes'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600">
                  {classes.map(c => {
                    const isChecked = bulkClassIds.includes(c._id);
                    return (
                      <label
                        key={c._id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition ${
                          isChecked ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-gray-100 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setBulkClassIds([...bulkClassIds, c._id]);
                            else setBulkClassIds(bulkClassIds.filter(id => id !== c._id));
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="truncate">{c.displayName || `${c.name} - ${c.section}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Title *
                </label>
                <input
                  type="text"
                  required
                  value={bulkTitle}
                  onChange={(e) => setBulkTitle(e.target.value)}
                  placeholder="e.g. Term 1 Tuition & Lab Fee (2026-27)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={bulkDueDate}
                  onChange={(e) => setBulkDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Generate Invoices Now
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: Create Custom Student Bill */}
      {isCustomBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <CurrencyRupeeIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Create Custom Student Invoice</h3>
              </div>
              <button
                onClick={() => setIsCustomBillModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomBill} className="p-6 space-y-4">
              
              {/* Search & Select Student */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Select Student *
                </label>
                {selectedCustomStudent ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs">
                    <div>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300">{selectedCustomStudent.fullName}</p>
                      <p className="text-emerald-700 dark:text-emerald-400">
                        Adm: {selectedCustomStudent.admissionNo} | Class: {selectedCustomStudent.classId?.displayName || selectedCustomStudent.classId?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomStudent(null)}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Type student name or admission number..."
                      value={customStudentSearch}
                      onChange={(e) => setCustomStudentSearch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />

                    {customStudentList.length > 0 && (
                      <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-xl max-h-36 overflow-y-auto divide-y divide-gray-100">
                        {customStudentList.map(st => (
                          <div
                            key={st._id}
                            onClick={() => setSelectedCustomStudent(st)}
                            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 cursor-pointer text-xs flex justify-between items-center"
                          >
                            <span className="font-semibold">{st.fullName}</span>
                            <span className="text-gray-400 font-mono">{st.admissionNo}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Invoice Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Kit & Tour Fee"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Fee Line Items *
                  </label>
                  <button
                    type="button"
                    onClick={addCustomItemRow}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {customItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Item Description (e.g. Lab breakage fee)"
                        value={item.name}
                        onChange={(e) => updateCustomItem(idx, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none"
                      />
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => updateCustomItem(idx, 'amount', e.target.value)}
                          className="w-full pl-6 pr-2 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono font-bold outline-none"
                        />
                      </div>
                      {customItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCustomItemRow(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount & Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Concession / Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Payment Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsCustomBillModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCustom}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {isCreatingCustom ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Create Invoice
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DETAIL DRAWER / MODAL for Single Invoice */}
      {selectedInvoiceForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600">{selectedInvoiceForDetail.invoiceNumber}</span>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{selectedInvoiceForDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px]">Student</span>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedInvoiceForDetail.studentName}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px]">Class / Division</span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{selectedInvoiceForDetail.className}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-2">Particulars Breakdown</span>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase text-[10px]">
                      <th className="py-1.5">Head</th>
                      <th className="py-1.5 text-right">Amount</th>
                      <th className="py-1.5 text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {(selectedInvoiceForDetail.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 text-gray-800 dark:text-gray-200 font-medium">{it.name}</td>
                        <td className="py-2 text-right font-mono font-semibold">₹{it.amount}</td>
                        <td className="py-2 text-right font-mono text-emerald-600">₹{it.paidAmount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total calculation */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-mono font-semibold">₹{selectedInvoiceForDetail.subtotal}</span>
                </div>
                {selectedInvoiceForDetail.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount / Concession:</span>
                    <span className="font-mono font-semibold">- ₹{selectedInvoiceForDetail.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-300">
                  <span>Total Bill Amount:</span>
                  <span className="font-mono">₹{selectedInvoiceForDetail.totalAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-rose-600">
                  <span>Outstanding Balance:</span>
                  <span className="font-mono">₹{selectedInvoiceForDetail.balanceAmount}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedInvoiceForDetail(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
                >
                  Close
                </button>
                {selectedInvoiceForDetail.balanceAmount > 0 && (
                  <button
                    onClick={() => {
                      const inv = selectedInvoiceForDetail;
                      setSelectedInvoiceForDetail(null);
                      onNavigateToCounter(inv);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <BanknotesIcon className="w-4 h-4" />
                    Collect Payment at Counter
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeInvoicesList;
