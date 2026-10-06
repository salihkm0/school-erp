// src/pages/FeeManagementPage.jsx
import React, { useState } from 'react';
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  BuildingLibraryIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentListIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import FeeAnalyticsDashboard from '../components/fees/FeeAnalyticsDashboard';
import FeeCollectionCounter from '../components/fees/FeeCollectionCounter';
import FeeInvoicesList from '../components/fees/FeeInvoicesList';
import FeeStructuresManager from '../components/fees/FeeStructuresManager';
import FeeDefaultersList from '../components/fees/FeeDefaultersList';
import FeeReceiptsLedger from '../components/fees/FeeReceiptsLedger';
import PrintableReceiptModal from '../components/fees/PrintableReceiptModal';

const FeeManagementPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'counter' | 'invoices' | 'structures' | 'defaulters' | 'ledger'
  const [printableReceipt, setPrintableReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleOpenReceipt = (receipt) => {
    setPrintableReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const handleNavigateToCounterWithInvoice = (invoice) => {
    setActiveTab('counter');
  };

  const tabs = [
    { id: 'analytics', label: 'Overview & Analytics', icon: ChartBarIcon },
    { id: 'counter', label: 'Fast Fee Counter', icon: BanknotesIcon },
    { id: 'invoices', label: 'Invoices & Billing', icon: DocumentTextIcon },
    { id: 'structures', label: 'Fee Structures & Heads', icon: BuildingLibraryIcon },
    { id: 'defaulters', label: 'Defaulters & Reminders', icon: ExclamationTriangleIcon },
    { id: 'ledger', label: 'Receipts Ledger', icon: ClipboardDocumentListIcon }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Institutional Fee Management
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <SparklesIcon className="w-3 h-3 text-emerald-600" />
              Advanced Finance
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Fast billing counter, class-wise fee structures, multi-channel payment reconciliation, and automated overdue recovery.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="mt-4">
        {activeTab === 'analytics' && (
          <FeeAnalyticsDashboard 
            onNavigateTab={setActiveTab} 
            onOpenReceipt={handleOpenReceipt} 
          />
        )}

        {activeTab === 'counter' && (
          <FeeCollectionCounter 
            onOpenReceipt={handleOpenReceipt} 
          />
        )}

        {activeTab === 'invoices' && (
          <FeeInvoicesList 
            onNavigateToCounter={handleNavigateToCounterWithInvoice} 
          />
        )}

        {activeTab === 'structures' && (
          <FeeStructuresManager />
        )}

        {activeTab === 'defaulters' && (
          <FeeDefaultersList 
            onNavigateToCounter={handleNavigateToCounterWithInvoice} 
          />
        )}

        {activeTab === 'ledger' && (
          <FeeReceiptsLedger 
            onOpenReceipt={handleOpenReceipt} 
          />
        )}
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

export default FeeManagementPage;
