'use client';

import React, { useState } from 'react';
import { 
  Banknote, 
  IndianRupee, 
  CreditCard, 
  QrCode, 
  Printer, 
  Send,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

interface FeeShowcaseProps {
  onOpenDemoModal: () => void;
}

export default function FeeManagementShowcase({ onOpenDemoModal }: FeeShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'counter' | 'reminders' | 'structures'>('counter');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [isReceiptGenerated, setIsReceiptGenerated] = useState(false);
  const [isSendingAlerts, setIsSendingAlerts] = useState(false);
  const [alertsSent, setAlertsSent] = useState(false);

  const sampleStudent = {
    name: 'Aysha Ridha',
    admNo: 'PPM-2026-8821',
    class: 'Class 10 - A (State Board)',
    invoiceTitle: 'Term 1 Tuition & Science Lab Fee',
    totalDue: 14500,
    paid: 0,
    balance: 14500,
    heads: [
      { name: 'Tuition & Academic Fund', amount: 9500 },
      { name: 'Science & Computer Lab Maintenance', amount: 2500 },
      { name: 'Annual Sports Day & Arts Fest Fund', amount: 1500 },
      { name: 'Library & Reading Room Fund', amount: 1000 }
    ]
  };

  const handleSimulatePayment = () => {
    setIsReceiptGenerated(true);
  };

  const handleSimulateReminders = () => {
    setIsSendingAlerts(true);
    setTimeout(() => {
      setIsSendingAlerts(false);
      setAlertsSent(true);
    }, 1000);
  };

  return (
    <section id="fee-management" className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 relative border-t border-slate-200 overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/20 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>Institutional Revenue & Finance Suite</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fast Fee Collection Counter & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Automated Dues Recovery
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Eliminate cashier queues and uncollected arrears with instantaneous student barcode/roll lookup, multi-channel payment reconciliation, and automated WhatsApp fee reminders.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">10-Second Collection</h4>
              <p className="text-xs text-slate-500 mt-0.5">Rapid student search & immediate thermal/A4 receipt printing.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">UPI, Card & Bank Mode</h4>
              <p className="text-xs text-slate-500 mt-0.5">Dynamic QR code generation & day-end cashier ledger reconciliation.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">1-Click Dues Reminders</h4>
              <p className="text-xs text-slate-500 mt-0.5">Multi-channel WhatsApp, SMS & In-app alerts to parent portals.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Class Fee Templates</h4>
              <p className="text-xs text-slate-500 mt-0.5">Custom heads, tuition, lab, sports funds & multi-term installments.</p>
            </div>
          </div>
        </div>

        {/* Interactive Live Finance Simulator Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
          
          {/* Simulator Tab Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('counter'); setIsReceiptGenerated(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'counter'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1. Fast Cashier Counter Simulator
              </button>
              <button
                onClick={() => { setActiveTab('reminders'); setAlertsSent(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'reminders'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2. Automated Overdue Reminder Dispatch
              </button>
              <button
                onClick={() => setActiveTab('structures')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'structures'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                3. Class Structure & Term Milestones
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Fee Engine Interactive Demo
            </div>
          </div>

          {/* TAB 1: Fast Fee Collection Simulator */}
          {activeTab === 'counter' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Student Bill Details */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Active Student Bill</span>
                      <h3 className="text-xl font-bold text-white mt-0.5">{sampleStudent.name}</h3>
                      <p className="text-xs text-slate-400">Adm: {sampleStudent.admNo} • {sampleStudent.class}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-lg uppercase">
                      Unpaid Bill
                    </span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-700 text-xs">
                    {sampleStudent.heads.map((h, i) => (
                      <div key={i} className="flex justify-between text-slate-300">
                        <span>{h.name}</span>
                        <span className="font-mono font-semibold">₹{h.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-slate-700 flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-200">Total Payable:</span>
                    <span className="font-mono font-black text-xl text-emerald-400">
                      ₹{sampleStudent.totalDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Mode selector */}
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <label className="text-xs font-bold text-slate-300 block mb-2">Select Payment Collection Channel:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR', icon: QrCode },
                      { id: 'cash', label: 'Cash', icon: Banknote },
                      { id: 'card', label: 'Card (POS)', icon: CreditCard },
                      { id: 'bank', label: 'NetBank', icon: Building2 }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMode(m.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition ${
                          paymentMode === m.id
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Collect ₹{sampleStudent.totalDue.toLocaleString('en-IN')} & Generate Receipt
                  </button>
                </div>
              </div>

              {/* Right Column: Printed Receipt Preview */}
              <div className="lg:col-span-6">
                <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 relative">
                  {isReceiptGenerated ? (
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-slate-300">
                        <div>
                          <h4 className="font-black text-sm uppercase text-slate-900">P.P.M. HIGHER SECONDARY SCHOOL</h4>
                          <p className="text-[10px] text-slate-500">Official Fee Payment Receipt</p>
                        </div>
                        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-3 text-xs border-b border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Receipt No:</span>
                          <p className="font-mono font-bold text-slate-800">REC-2026-0042-8912</p>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold mt-1 block">Date & Mode:</span>
                          <p className="font-medium text-slate-700">Today • <span className="uppercase font-bold text-emerald-700">{paymentMode}</span></p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Student:</span>
                          <p className="font-bold text-slate-800">{sampleStudent.name}</p>
                          <p className="text-[11px] text-slate-600">{sampleStudent.class}</p>
                        </div>
                      </div>

                      <div className="py-3 text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-slate-400 uppercase text-[9px] border-b border-slate-200">
                              <th className="py-1">Head Particulars</th>
                              <th className="py-1 text-right">Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {sampleStudent.heads.map((h, i) => (
                              <tr key={i}>
                                <td className="py-1 text-slate-700">{h.name}</td>
                                <td className="py-1 text-right font-mono font-semibold">₹{h.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-slate-900 font-bold">
                              <td className="py-2 text-slate-900">Total Received:</td>
                              <td className="py-2 text-right font-mono text-emerald-700 font-black text-sm">
                                ₹{sampleStudent.totalDue.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200">
                        <span>Digitally Logged by Central Cashier</span>
                        <span className="font-bold text-slate-800">Auth Signature: Verified ✔</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400">
                      <Printer className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-700 text-sm">Instant Receipt Preview</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Click "Collect & Generate Receipt" on the left to simulate instant serial receipt allocation.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Automated Overdue Recovery */}
          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Defaulting Students</span>
                  <h4 className="text-2xl font-mono font-bold text-white mt-1">48 Students</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Past due grace date</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Overdue Dues</span>
                  <h4 className="text-2xl font-mono font-bold text-rose-400 mt-1">₹3,84,000</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Across Term 1 & 2</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Recovery Dispatch</span>
                  <button
                    onClick={handleSimulateReminders}
                    disabled={isSendingAlerts}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSendingAlerts ? 'Dispatching...' : '1-Click Broadcast Reminders'}
                  </button>
                </div>
              </div>

              {/* Live Dispatch Stream */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Multi-Channel Reminder Logs:</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <span className="text-slate-300">📲 WhatsApp Notification to Parent (+91 98471*****): "Dear Parent, fee balance of ₹14,500 is due for Aysha Ridha..."</span>
                    <span className="text-emerald-400 font-bold">{alertsSent ? 'DELIVERED ✔' : 'QUEUED'}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <span className="text-slate-300">🔔 Parent Mobile App Push Notification: "⚠️ Fee Payment Due: Term 1 Tuition & Science Lab Fee"</span>
                    <span className="text-emerald-400 font-bold">{alertsSent ? 'DELIVERED ✔' : 'QUEUED'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Class Fee Structure Templates */}
          {activeTab === 'structures' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Class 10 Science Stream</span>
                <h4 className="font-bold text-white text-base">Annual Academic Template</h4>
                <p className="text-xs text-slate-400">Includes Tuition (₹12,000), Science Lab (₹3,000), Library (₹1,000), PTA (₹500).</p>
                <div className="pt-2 border-t border-slate-700 flex justify-between font-mono font-bold text-sm text-emerald-400">
                  <span>Total:</span>
                  <span>₹16,500 / Year</span>
                </div>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] uppercase font-bold text-blue-400">Higher Secondary Commerce</span>
                <h4 className="font-bold text-white text-base">Standard Term Schedule</h4>
                <p className="text-xs text-slate-400">Includes Tuition (₹14,000), Computer Lab (₹3,500), Examination (₹1,500).</p>
                <div className="pt-2 border-t border-slate-700 flex justify-between font-mono font-bold text-sm text-blue-400">
                  <span>Total:</span>
                  <span>₹19,000 / Year</span>
                </div>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[10px] uppercase font-bold text-purple-400">School Bus Transport</span>
                <h4 className="font-bold text-white text-base">Zonal Route Charges</h4>
                <p className="text-xs text-slate-400">Zonal slabs: Zone A (₹800/mo), Zone B (₹1,200/mo), Zone C (₹1,600/mo).</p>
                <div className="pt-2 border-t border-slate-700 flex justify-between font-mono font-bold text-sm text-purple-400">
                  <span>Monthly Slabs</span>
                  <span>Auto-allocated</span>
                </div>
              </div>
            </div>
          )}

          {/* CTA Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Ready to streamline your school's fee collection & accounts?</p>
              <p className="text-xs text-slate-400">Experience the fast cashier counter, multi-channel payment reconciliation and automated recovery.</p>
            </div>
            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition"
            >
              <span>Schedule Live Finance Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
