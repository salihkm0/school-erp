'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Printer, 
  ArrowRight, 
  Users, 
  Layers, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface TimetableShowcaseProps {
  onOpenDemoModal: () => void;
}

export default function TimetableShowcase({ onOpenDemoModal }: TimetableShowcaseProps) {
  // Simulator states
  const [activeTab, setActiveTab] = useState<'clash' | 'substitution' | 'autodraft'>('clash');
  const [simulateClash, setSimulateClash] = useState(false);
  const [isAbsentSimulated, setIsAbsentSimulated] = useState(false);
  const [selectedSubstitute, setSelectedSubstitute] = useState<string | null>(null);
  const [isDraftRunning, setIsDraftRunning] = useState(false);

  const samplePeriods = [
    { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Dr. Anita Sharma', room: 'Room 101', isClashing: false },
    { period: 2, time: '09:45 - 10:30', subject: 'Physics', teacher: simulateClash ? 'Dr. Anita Sharma' : 'Mr. Rajesh Kumar', room: 'Physics Lab', isClashing: simulateClash },
    { period: 3, time: '10:45 - 11:30', subject: 'Chemistry', teacher: isAbsentSimulated ? (selectedSubstitute || 'Pending Substitute') : 'Mr. Suresh Menon', room: 'Chemistry Lab', isSubstituted: isAbsentSimulated },
    { period: 4, time: '11:30 - 12:15', subject: 'English Core', teacher: 'Mrs. Priya Varma', room: 'Room 101', isClashing: false },
    { period: 5, time: '01:15 - 02:00', subject: 'Computer Science', teacher: 'Mr. Arun Das', room: 'Computer Lab 1', isClashing: false },
    { period: 6, time: '02:00 - 02:45', subject: 'Biology / PE', teacher: 'Mrs. Bindu Nair', room: 'Bio Lab / Court', isClashing: false },
  ];

  const handleRunDraft = () => {
    setIsDraftRunning(true);
    setTimeout(() => {
      setIsDraftRunning(false);
      setSimulateClash(false);
    }, 900);
  };

  return (
    <section id="timetable-suite" className="py-24 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white relative border-t border-slate-200 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-200/30 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Master Timetable &amp; Clash Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Institutional Timetables With Zero Double-Bookings
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Generate balanced class grids, track teacher workload limits, auto-substitute absent staff in 1 click, and export wall charts ready for school notice boards.
          </p>
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Real-Time Clash Engine</h4>
              <p className="text-xs text-slate-500 mt-1">Prevents assigning a teacher or lab to two classes at the same period.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Daily Absence &amp; Sub</h4>
              <p className="text-xs text-slate-500 mt-1">Auto-finds free teachers matching subject skills for absent colleagues.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Auto-Draft Scheduler</h4>
              <p className="text-xs text-slate-500 mt-1">Heuristic solver arranges weekly subject targets evenly without conflicts.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Printable Studio</h4>
              <p className="text-xs text-slate-500 mt-1">Class cards, teacher pocket charts, and school wall charts with your logo.</p>
            </div>
          </div>
        </div>

        {/* Interactive Interactive Cockpit Simulator */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-indigo-100/60 overflow-hidden">
          {/* Cockpit Top Bar */}
          <div className="bg-slate-900 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">Interactive Timetable Cockpit</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Simulator
                  </span>
                </div>
                <p className="text-xs text-slate-400">Try real-time conflict detection and auto-substitution below</p>
              </div>
            </div>

            {/* Interactive Mode Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  setActiveTab('clash');
                  setSimulateClash(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'clash' && simulateClash
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ⚠️ Test Clash Detection
              </button>

              <button
                onClick={() => {
                  setActiveTab('substitution');
                  setIsAbsentSimulated(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'substitution' && isAbsentSimulated
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🔄 Test Absence &amp; Sub
              </button>

              <button
                onClick={() => {
                  setActiveTab('autodraft');
                  handleRunDraft();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'autodraft'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ✨ Test Auto-Scheduler
              </button>
            </div>
          </div>

          {/* Conflict Alert Banner (Dynamic) */}
          {simulateClash && (
            <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-rose-900">
                  <span className="font-bold">Clash Prevented!</span> Dr. Anita Sharma is scheduled in <strong>Class 10-A</strong> and <strong>Class 10-B</strong> simultaneously during Period 2.
                </div>
              </div>
              <button
                onClick={() => setSimulateClash(false)}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline flex-shrink-0 cursor-pointer"
              >
                Resolve Clash
              </button>
            </div>
          )}

          {/* Absence Alert Banner (Dynamic) */}
          {isAbsentSimulated && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-amber-900">
                  <span className="font-bold">Teacher On Leave:</span> Mr. Suresh Menon marked on Casual Leave today. Affected: Period 3 (Chemistry).
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-800 font-semibold">Available Free Staff:</span>
                <button
                  onClick={() => setSelectedSubstitute('Mrs. Deepa K. (Chemistry Match)')}
                  className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-300 shadow-2xs transition-colors cursor-pointer"
                >
                  Assign Mrs. Deepa K.
                </button>
                <button
                  onClick={() => {
                    setIsAbsentSimulated(false);
                    setSelectedSubstitute(null);
                  }}
                  className="text-xs text-amber-700 hover:text-amber-900 underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Schedule Grid Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Weekly Schedule</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Monday Schedule
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Class 10 - Section A
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunDraft}
                  className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDraftRunning ? 'animate-spin' : ''}`} />
                  <span>Auto-Distribute</span>
                </button>
                <button
                  onClick={onOpenDemoModal}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Class Card</span>
                </button>
              </div>
            </div>

            {/* Timetable Period Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {samplePeriods.map((slot) => (
                <div
                  key={slot.period}
                  className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                    slot.isClashing
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-100 ring-2 ring-rose-400'
                      : slot.isSubstituted
                        ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Period Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                      Period {slot.period}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {slot.time}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <div className="text-base font-bold text-slate-900 mb-1">
                    {slot.subject}
                  </div>

                  {/* Teacher & Status */}
                  <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
                    <span className={`font-semibold truncate max-w-[170px] ${
                      slot.isClashing ? 'text-rose-700' : slot.isSubstituted ? 'text-amber-800' : 'text-slate-600'
                    }`}>
                      {slot.teacher}
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {slot.room}
                    </span>
                  </div>

                  {/* Clash / Sub Badge */}
                  {slot.isClashing && (
                    <div className="mt-2 text-[11px] font-bold text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Teacher Double-Booked
                    </div>
                  )}

                  {slot.isSubstituted && (
                    <div className="mt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Substituted for today
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA Bar */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Full support for custom period bell timings, 5 or 6 working days, and laboratory allocations.</span>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group cursor-pointer"
            >
              <span>Explore full Timetable Cockpit in Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
