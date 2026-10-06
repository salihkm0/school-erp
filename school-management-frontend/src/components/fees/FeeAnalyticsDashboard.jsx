// src/components/fees/FeeAnalyticsDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFeeStats, 
  setCurrentReceipt 
} from '../../store/slices/feeSlice';
import { 
  CurrencyRupeeIcon, 
  BanknotesIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  QrCodeIcon,
  BuildingLibraryIcon,
  PrinterIcon,
  ArrowPathIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const FeeAnalyticsDashboard = ({ onNavigateTab, onOpenReceipt }) => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.fees);

  useEffect(() => {
    dispatch(fetchFeeStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchFeeStats());
  };

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi': return <QrCodeIcon className="w-5 h-5 text-purple-600" />;
      case 'card': return <CreditCardIcon className="w-5 h-5 text-blue-600" />;
      case 'bank_transfer': return <BuildingLibraryIcon className="w-5 h-5 text-indigo-600" />;
      default: return <BanknotesIcon className="w-5 h-5 text-emerald-600" />;
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading fee financial analytics...</p>
      </div>
    );
  }

  const invoiceCounts = stats?.invoiceCounts || { paid: 0, unpaid: 0, partiallyPaid: 0, overdue: 0, total: 0 };
  const collectionRate = stats?.collectionRate || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 mb-2">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>Institutional Financial Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Fee Collection & Revenue Analytics</h2>
          <p className="text-emerald-100 text-sm mt-1">Real-time revenue monitoring, payment gateway reconciliation & automated dues tracking</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium backdrop-blur-sm transition"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => onNavigateTab('counter')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 rounded-xl text-sm font-bold shadow-lg transition"
          >
            <BanknotesIcon className="w-4 h-4" />
            Fast Fee Counter
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Today's Collection */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Today's Collection</span>
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <BanknotesIcon className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white font-mono">
              ₹{(stats?.todayCollected || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-semibold text-emerald-600">{stats?.todayTransactionsCount || 0}</span> receipts issued today
            </p>
          </div>
        </div>

        {/* Month to Date */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Month-to-Date (MTD)</span>
            <span className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <ArrowTrendingUpIcon className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white font-mono">
              ₹{(stats?.monthCollected || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Current calendar month revenue</p>
          </div>
        </div>

        {/* Total Year Revenue */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Year Collection</span>
            <span className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <CurrencyRupeeIcon className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white font-mono">
              ₹{(stats?.totalCollected || 0).toLocaleString('en-IN')}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, collectionRate)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600">{collectionRate}%</span>
            </div>
          </div>
        </div>

        {/* Total Outstanding Dues */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Outstanding</span>
            <span className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <ExclamationCircleIcon className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              ₹{(stats?.totalOutstanding || 0).toLocaleString('en-IN')}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>{invoiceCounts.overdue} overdue bills</span>
              <button
                onClick={() => onNavigateTab('defaulters')}
                className="text-rose-600 hover:underline font-semibold"
              >
                View Defaulters →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Invoices Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Invoices Breakdown</span>
            <span className="text-xs font-normal text-gray-500">Total: {invoiceCounts.total}</span>
          </h3>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 dark:text-emerald-400">Fully Paid</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{invoiceCounts.paid}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${invoiceCounts.total ? (invoiceCounts.paid / invoiceCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-700 dark:text-blue-400">Partially Paid</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{invoiceCounts.partiallyPaid}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${invoiceCounts.total ? (invoiceCounts.partiallyPaid / invoiceCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 dark:text-amber-400">Unpaid / Pending</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{invoiceCounts.unpaid}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${invoiceCounts.total ? (invoiceCounts.unpaid / invoiceCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700 dark:text-rose-400">Overdue (Past Grace Period)</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{invoiceCounts.overdue}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full" 
                  style={{ width: `${invoiceCounts.total ? (invoiceCounts.overdue / invoiceCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
            <span className="text-gray-500">Need to issue term invoices?</span>
            <button
              onClick={() => onNavigateTab('invoices')}
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Generate Invoices →
            </button>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Payment Mode Distribution
          </h3>

          <div className="space-y-3">
            {(stats?.methodBreakdown || []).length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No payment transactions recorded yet.</p>
            ) : (
              (stats?.methodBreakdown || []).map((m) => {
                const total = stats.totalCollected || 1;
                const pct = Math.round((m.amount / total) * 100);
                return (
                  <div key={m.method} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-xs">
                        {getMethodIcon(m.method)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">{m.method}</p>
                        <p className="text-[10px] text-gray-500">{m.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-gray-900 dark:text-white">
                        ₹{m.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-600">{pct}%</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Operations Portal */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Quick Operations & Tools
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => onNavigateTab('counter')}
                className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100/60 transition text-left"
              >
                <BanknotesIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Rapid Fee Collection</p>
                  <p className="text-[11px] text-gray-500">Collect cash/UPI, auto-distribute heads & print receipt</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('invoices')}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/60 transition text-left"
              >
                <CurrencyRupeeIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Mass Invoicing & Billing</p>
                  <p className="text-[11px] text-gray-500">Generate class-wide term fee bills from templates</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('defaulters')}
                className="flex items-center gap-3 p-3 rounded-xl border border-rose-200 dark:border-rose-800/40 bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-100/60 transition text-left"
              >
                <ClockIcon className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Due Reminders Dispatch</p>
                  <p className="text-[11px] text-gray-500">Send WhatsApp/SMS/In-app push notifications to parents</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('structures')}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/60 transition text-left"
              >
                <BuildingLibraryIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Fee Heads & Structure Templates</p>
                  <p className="text-[11px] text-gray-500">Manage tuition, lab, sports, bus fee schedules</p>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Payment Transactions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Live stream of fee payments collected at the counter</p>
          </div>
          <button
            onClick={() => onNavigateTab('ledger')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            View Complete Ledger →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Receipt No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Date & Time</th>
                <th className="px-5 py-3">Payment Mode</th>
                <th className="px-5 py-3 text-right">Amount Paid</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {(stats?.recentTransactions || []).length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-400">
                    No transactions recorded yet today.
                  </td>
                </tr>
              ) : (
                (stats?.recentTransactions || []).map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-gray-900 dark:text-white">
                      {t.receiptNumber}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                      {t.studentName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                      {t.className || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                      {new Date(t.paymentDate).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 uppercase font-bold text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                      ₹{t.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => onOpenReceipt(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-lg transition"
                      >
                        <PrinterIcon className="w-3.5 h-3.5" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FeeAnalyticsDashboard;
