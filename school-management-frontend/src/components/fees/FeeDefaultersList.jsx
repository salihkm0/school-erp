// src/components/fees/FeeDefaultersList.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFeeDefaulters, 
  sendFeeReminders 
} from '../../store/slices/feeSlice';
import { 
  ExclamationTriangleIcon, 
  PaperAirplaneIcon, 
  CheckCircleIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FeeDefaultersList = ({ onNavigateToCounter }) => {
  const dispatch = useDispatch();
  const { defaulters = [], totalOverdueAmount = 0, loading } = useSelector((state) => state.fees);
  const { classes = [] } = useSelector((state) => state.classes);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [minAmount, setMinAmount] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  const loadDefaulters = () => {
    dispatch(fetchFeeDefaulters({
      classId: selectedClassId || undefined,
      minAmount: Number(minAmount) || 0
    }));
  };

  useEffect(() => {
    loadDefaulters();
  }, [dispatch, selectedClassId, minAmount]);

  const filteredDefaulters = defaulters.filter(inv => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.studentName?.toLowerCase().includes(q) ||
      inv.admissionNo?.toLowerCase().includes(q) ||
      inv.rollNumber?.toLowerCase().includes(q) ||
      inv.invoiceNumber?.toLowerCase().includes(q)
    );
  });

  const handleSelectAll = () => {
    if (selectedInvoiceIds.length === filteredDefaulters.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(filteredDefaulters.map(i => i._id));
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedInvoiceIds.includes(id)) {
      setSelectedInvoiceIds(selectedInvoiceIds.filter(i => i !== id));
    } else {
      setSelectedInvoiceIds([...selectedInvoiceIds, id]);
    }
  };

  const handleSendMassReminders = async () => {
    if (filteredDefaulters.length === 0) {
      toast.error('No pending invoices available');
      return;
    }

    const idsToSend = selectedInvoiceIds.length > 0 ? selectedInvoiceIds : undefined;
    const confirmMsg = idsToSend
      ? `Send fee reminders to parents of ${idsToSend.length} selected students?`
      : `Send fee reminders to ALL ${filteredDefaulters.length} defaulting students?`;

    if (!window.confirm(confirmMsg)) return;

    setIsSendingReminders(true);
    try {
      await dispatch(sendFeeReminders({
        invoiceIds: idsToSend,
        classId: selectedClassId || undefined
      })).unwrap();

      setSelectedInvoiceIds([]);
      loadDefaulters();
    } catch (err) {
      // Handled in slice toast
    } finally {
      setIsSendingReminders(false);
    }
  };

  const handleSendSingleReminder = async (invoiceId) => {
    setIsSendingReminders(true);
    try {
      await dispatch(sendFeeReminders({
        invoiceIds: [invoiceId]
      })).unwrap();
      loadDefaulters();
    } catch (err) {
      // Handled
    } finally {
      setIsSendingReminders(false);
    }
  };

  const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      
      {/* Overdue Summary Hero Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-200 mb-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-300" />
            <span>Defaulters & Payment Recovery Console</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Pending Dues & Smart Reminders</h2>
          <p className="text-rose-100 text-xs mt-1">
            Automated tracking of overdue tuition/facilities fees with 1-click multi-channel push & WhatsApp reminders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-200 block">Total Overdue Dues</span>
            <p className="font-mono font-black text-2xl text-white">
              ₹{totalOverdueAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-200 block">Defaulting Bills</span>
            <p className="font-mono font-bold text-xl text-amber-300">
              {filteredDefaulters.length} Invoices
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Student, Adm No, Roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.displayName || `${c.name} - ${c.section}`}</option>
              ))}
            </select>

            {/* Min Amount */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Min Due:</span>
              <select
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="px-2 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
              >
                <option value="0">Any Dues (&gt; ₹0)</option>
                <option value="1000">&gt; ₹1,000</option>
                <option value="5000">&gt; ₹5,000</option>
                <option value="10000">&gt; ₹10,000</option>
              </select>
            </div>
          </div>

          {/* Mass Reminder Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendMassReminders}
              disabled={isSendingReminders || filteredDefaulters.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              {isSendingReminders ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-4 h-4" />
              )}
              {selectedInvoiceIds.length > 0 
                ? `Send Reminder (${selectedInvoiceIds.length} Selected)`
                : `Broadcast to All (${filteredDefaulters.length}) Defaulters`}
            </button>
          </div>

        </div>
      </div>

      {/* Defaulters Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredDefaulters.length > 0 && selectedInvoiceIds.length === filteredDefaulters.length}
                    onChange={handleSelectAll}
                    className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-5 py-3.5">Class</th>
                <th className="px-5 py-3.5">Parent Contact</th>
                <th className="px-5 py-3.5">Fee Particulars</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5 text-center">Overdue By</th>
                <th className="px-5 py-3.5 text-right">Outstanding Due</th>
                <th className="px-5 py-3.5 text-center">Reminders</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p>Loading defaulters ledger...</p>
                  </td>
                </tr>
              ) : filteredDefaulters.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-gray-400">
                    <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">All Clear! No Pending Defaulters</p>
                    <p className="text-xs text-gray-400 mt-1">There are no outstanding fee dues for the selected filters.</p>
                  </td>
                </tr>
              ) : (
                filteredDefaulters.map((inv) => {
                  const daysOverdue = calculateDaysOverdue(inv.dueDate);
                  const isChecked = selectedInvoiceIds.includes(inv._id);
                  const parentPhone = inv.studentId?.phone || inv.studentId?.fatherPhone || 'N/A';

                  return (
                    <tr 
                      key={inv._id} 
                      className={`hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition ${
                        isChecked ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(inv._id)}
                          className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-gray-900 dark:text-white">{inv.studentName}</p>
                        <p className="text-[11px] text-gray-500">
                          Adm: <span className="font-mono">{inv.admissionNo || '—'}</span> | Roll: <span className="font-mono">{inv.rollNumber || '—'}</span>
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-semibold">
                        {inv.className || inv.classId?.displayName || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                          <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono">{parentPhone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium max-w-[160px] truncate">
                        {inv.title}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                        {new Date(inv.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          daysOverdue > 30 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 font-black' 
                            : daysOverdue > 0 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {daysOverdue > 0 ? `${daysOverdue} days` : 'Due soon'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-black text-sm text-rose-600 dark:text-rose-400">
                        ₹{inv.balanceAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="text-[11px] font-semibold text-gray-500">
                          {inv.reminderCount || 0} sent
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSendSingleReminder(inv._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition"
                            title="Send instant push/WhatsApp reminder"
                          >
                            <PaperAirplaneIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onNavigateToCounter(inv)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                            title="Collect Fee at Counter"
                          >
                            <BanknotesIcon className="w-3.5 h-3.5" />
                            Collect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FeeDefaultersList;
