'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Lock, 
  Unlock,
  Printer, 
  AlertCircle, 
  CalendarCheck, 
  Smartphone, 
  FileSpreadsheet, 
  Users, 
  GraduationCap, 
  Clock, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  FileText,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Download,
  Bell,
  BookOpen,
  Award,
  BarChart3,
  MessageSquare,
  Share2,
  UserCheck,
  ShieldAlert,
  FileCheck,
  Layers,
  ArrowRight,
  Settings,
  RefreshCw,
  CheckCheck
} from 'lucide-react';

/* =========================================================================
   1. EXAM SUBJECT SUBMISSION DRAWER (Matches User Reference Image 1)
   ========================================================================= */
export function ExamSubmissionDrawerMockup({ className = "w-full" }: { className?: string }) {
  const [subjects, setSubjects] = useState([
    {
      name: "FIRST LANGUAGE (MALAYALAM)",
      status: "SUBMITTED",
      marksEntered: 45,
      totalStudents: 45,
      percent: 100,
      teacher: "Abdul Azees (Teacher)",
      canRevert: true,
      canSubmit: false,
    },
    {
      name: "ENGLISH LANGUAGE",
      status: "SUBMITTED",
      marksEntered: 45,
      totalStudents: 45,
      percent: 100,
      teacher: "Fathima S.",
      canRevert: true,
      canSubmit: false,
    },
    {
      name: "MATHEMATICS",
      status: "DRAFT",
      marksEntered: 45,
      totalStudents: 45,
      percent: 100,
      teacher: "Ready to Submit",
      canRevert: false,
      canSubmit: true,
    },
    {
      name: "PHYSICS & CHEMISTRY",
      status: "DRAFT",
      marksEntered: 24,
      totalStudents: 45,
      percent: 53,
      teacher: "Pending 21 marks",
      canRevert: false,
      canSubmit: false,
      locked: true,
    }
  ]);

  const toggleStatus = (index: number) => {
    setSubjects(prev => prev.map((s, i) => {
      if (i !== index) return s;
      if (s.status === 'SUBMITTED' && s.canRevert) {
        return { ...s, status: 'DRAFT', canRevert: false, canSubmit: true, teacher: 'Reverted to Draft (Teacher Editable)' };
      }
      if (s.status === 'DRAFT' && s.canSubmit) {
        return { ...s, status: 'SUBMITTED', canRevert: true, canSubmit: false, teacher: 'Submitted by Faculty' };
      }
      return s;
    }));
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50 p-5 sm:p-7 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
            Class 10-A Subjects Submission Drawer
          </h3>
        </div>
        <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
          Exam: Mid-Term 2026
        </div>
      </div>

      {/* 2x2 Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub, idx) => {
          const isSubmitted = sub.status === 'SUBMITTED';
          const isPending = sub.percent < 100;

          return (
            <div 
              key={sub.name}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Subject name & status badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                    {sub.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                    isSubmitted 
                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                {/* Marks Entered Progress */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Marks Entered</span>
                    <span className={`font-bold ${isPending ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {sub.marksEntered}/{sub.totalStudents} ({sub.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isPending ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sub.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action strip */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className={`text-[11px] font-medium ${isPending ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
                  {sub.teacher}
                </span>

                {isSubmitted && (
                  <button
                    onClick={() => toggleStatus(idx)}
                    className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer text-xs"
                  >
                    Revert to Draft
                  </button>
                )}

                {!isSubmitted && sub.canSubmit && (
                  <button
                    onClick={() => toggleStatus(idx)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs hover:shadow transition-all cursor-pointer text-xs"
                  >
                    Submit Subject
                  </button>
                )}

                {sub.locked && (
                  <button
                    disabled
                    className="px-3 py-1 bg-slate-100 text-slate-400 font-medium rounded-lg border border-slate-200 cursor-not-allowed text-xs"
                  >
                    Locked (Pending)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   2. CONTESTANT BIB & ITEM REGISTRATION CARD (Matches User Reference Image 2)
   ========================================================================= */
export function ContestantBibCardMockup({ className = "w-full" }: { className?: string }) {
  const [items, setItems] = useState([
    { id: 1, name: "100m Sprint (Athletics)", type: "individual", status: "Confirmed (Individual #1)", checked: true },
    { id: 2, name: "Long Jump (Field Events)", type: "individual", status: "Confirmed (Individual #2)", checked: true },
    { id: 3, name: "Classical Recitation (Arts)", type: "individual", status: "Confirmed (Individual #3)", checked: true },
    { id: 4, name: "Shot Put / 200m Sprint", type: "individual", status: "Locked (Limit Reached)", checked: false, locked: true },
    { id: 5, name: "4 x 100m Relay (Sapphire House Team)", type: "group", status: "Group Item (1/2 Selected)", checked: true }
  ]);

  return (
    <div className={`rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8 relative overflow-hidden ${className}`}>
      {/* Top Blue Accent Border Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600" />

      {/* Official Contestant Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Blue Chest Bib Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-blue-50 border-2 border-blue-400 text-blue-800 text-center shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest block text-blue-600">CHEST NO</span>
            <span className="text-xl sm:text-2xl font-black text-blue-900 leading-none">#248</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Muhammed Farhan
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Class 10-A (Admn: 8921) • <strong className="text-blue-700 font-semibold">Sapphire House (Blue)</strong>
            </p>
          </div>
        </div>

        <div className="sm:text-right space-y-1">
          <span className="inline-block px-3 py-1 rounded-md bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
            OFFICIAL CONTESTANT
          </span>
          <div className="flex sm:justify-end items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
              Senior Boys
            </span>
            <span className="text-xs text-slate-400 font-medium">Annual Sports 2026</span>
          </div>
        </div>
      </div>

      {/* Participating Items Selection Header */}
      <div className="mt-5 mb-4 flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-extrabold text-sm text-slate-900">
          Participating Items Selection
        </h4>
        <span className="px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
          Individual Limit: 3/3 (Max Cap Reached)
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {items.map((item) => {
          if (item.locked) {
            return (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-dashed border-slate-300 text-slate-400 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium line-through">{item.name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-slate-200/80 text-slate-500 text-[10px] font-bold">
                  {item.status}
                </span>
              </div>
            );
          }

          const isGroup = item.type === 'group';

          return (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all text-xs ${
                isGroup 
                  ? 'bg-blue-50/40 border-blue-200 text-slate-900' 
                  : 'bg-white border-slate-200 shadow-2xs text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isGroup ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="font-bold text-slate-900">{item.name}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                isGroup 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Strip */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-mono text-slate-500 text-[11px]">
          Official Bib ID: <strong>CH-248</strong>
        </span>
        <button
          onClick={() => alert('Print Bib Preview: Generating official PDF Bib for Chest #248 (Muhammed Farhan - Sapphire House)')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer text-xs"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print Bib</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   3. EXAM DASHBOARD BROWSER WINDOW MOCKUP (Matches User Reference Image 3)
   ========================================================================= */
export function ExamDashboardBrowserMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`relative rounded-2xl p-2 sm:p-3 bg-slate-100/90 border border-slate-200/90 shadow-2xl shadow-slate-300/40 ${className}`}>
      {/* Outer Floating Pill 1: Sports & Arts Fest */}
      <div className="hidden sm:flex absolute -top-5 -right-3 z-20 items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-xl text-slate-900 animate-bounce-subtle">
        <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
          <Trophy className="w-4 h-4" />
        </div>
        <div>
          <span className="font-black text-xs text-slate-900 block">Sports &amp; Arts Fest</span>
          <span className="text-[10px] text-slate-500 font-medium">Houses, Chest Nos &amp; Live Points</span>
        </div>
      </div>

      {/* Outer Floating Pill 2: Board Compliant PDF */}
      <div className="hidden sm:flex absolute -bottom-5 -left-3 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl text-slate-900">
        <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <span className="font-black text-xs text-slate-900 block">Board-Compliant PDF</span>
          <span className="text-[10px] text-slate-500 font-medium">Official Seal + CE Breakdown</span>
        </div>
      </div>

      {/* Mac-Style Clean White Window Container */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">
              manage.ppmhsskottukkara.com/exams/first-term-2026
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Marks Verified
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-5 bg-white">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">1,451</p>
              <span className="text-[10px] text-emerald-600 font-semibold">100% Enrolled</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Exam Term</span>
              <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1">First Term</p>
              <span className="text-[10px] text-slate-500 font-medium">9 Subjects Evaluated</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Class Progress</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">27 / 27</p>
              <span className="text-[10px] text-emerald-600 font-semibold">100% Marks Submitted</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PDF Status</span>
              <p className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-1">Ready</p>
              <span className="text-[10px] text-purple-600 font-semibold">Batch Print Enabled</span>
            </div>
          </div>

          {/* Class Mark Submissions & Edit Safeguards Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>Class Mark Submissions &amp; Edit Safeguards</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Dual-Tier Verification Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Faculty Contributors</th>
                    <th className="py-2.5 px-3">Submission Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Row 1: Class 10-A */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">Class 10-A</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          9/9 Submitted
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          100% Entered
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                        REVIEWED
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      Abdul Azees, Aseena &amp; 7 Teachers
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      07 Sept 2026, 19:27
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button className="px-2.5 py-1 text-[11px] font-bold bg-purple-600 text-white rounded-lg shadow-2xs hover:bg-purple-700 transition-colors">
                        Reviewed ✓
                      </button>
                      <button className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                        Subjects
                      </button>
                    </td>
                  </tr>

                  {/* Row 2: Class 10-B */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">Class 10-B</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                          8/9 Submitted
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                          89% Entered
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        DRAFT
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      3 Teachers Submitted
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      07 Sept 2026, 16:31
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
                        Set to Draft
                      </button>
                      <button className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                        Subjects
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. 60-SECOND ATTENDANCE & SMS ROLL CALL MOCKUP
   ========================================================================= */
export function AttendanceRollCallMockup({ className = "w-full" }: { className?: string }) {
  const [absentStudents, setAbsentStudents] = useState<number[]>([1024, 1032]);

  const toggleAbsent = (roll: number) => {
    setAbsentStudents(prev => 
      prev.includes(roll) ? prev.filter(r => r !== roll) : [...prev, roll]
    );
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-lg shadow-slate-200/50 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Morning Roll Call — Class 10-A
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          45 Enrolled • {45 - absentStudents.length} Present
        </span>
      </div>

      {/* Distribution Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="text-2xl font-black text-emerald-700">38</span>
          <p className="text-[11px] text-slate-600 font-semibold mt-0.5">&gt; 90% Safe Zone</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
          <span className="text-2xl font-black text-amber-700">5</span>
          <p className="text-[11px] text-slate-600 font-semibold mt-0.5">75% - 89% Warning</p>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
          <span className="text-2xl font-black text-rose-700">2</span>
          <p className="text-[11px] text-slate-600 font-semibold mt-0.5">&lt; 75% Critical Risk</p>
        </div>
      </div>

      {/* Student Attendance Tap Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-slate-500 font-medium">Tap student to mark Absent (Present by default):</span>
          <span className="text-[11px] text-indigo-600 font-bold">Quick 60-Sec Tap</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { roll: 1021, name: "Aadhavan K." },
            { roll: 1022, name: "Aisha Mariyam" },
            { roll: 1023, name: "Bilal Roshan" },
            { roll: 1024, name: "Muhammed Farhan" },
            { roll: 1025, name: "Fathima Nihala" },
            { roll: 1026, name: "Gokul Das" },
            { roll: 1032, name: "Rishad Kareem" },
            { roll: 1033, name: "Zuhaira Banu" },
          ].map((st) => {
            const isAbsent = absentStudents.includes(st.roll);
            return (
              <button
                key={st.roll}
                onClick={() => toggleAbsent(st.roll)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isAbsent 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs ring-2 ring-rose-300' 
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block">#{st.roll}</span>
                  <span className="font-bold text-xs truncate block">{st.name}</span>
                </div>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                  isAbsent ? 'bg-rose-600 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {isAbsent ? 'ABSENT' : 'PRESENT'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Automated SMS Parent Alert Preview */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Live Parent SMS &amp; WhatsApp Alert Gateway</span>
            <span className="text-[10px] text-slate-400 font-mono">09:15 AM</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            &quot;Dear Parent, your ward <strong>Muhammed Farhan (Class 10-A)</strong> has been marked <strong>ABSENT</strong> for morning roll call on 09-Sep-2026. - PPM HSS Administration&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. SAMBOORNA KERALA BULK IMPORT & VALIDATION MOCKUP
   ========================================================================= */
export function SamboornaImportMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-lg shadow-slate-200/50 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Kerala Samboorna Bulk Excel Import Engine
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
          Auto-Mapper Active
        </span>
      </div>

      {/* File Upload Status Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            XLS
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">Class_10_Samboorna_Master_Export.xlsx</span>
            <span className="text-[10px] text-emerald-700 font-semibold">45 Records Parsed • 0 Duplicate Errors Detected</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold shadow-2xs">
          Validated ✓
        </span>
      </div>

      {/* Field Mapping Grid */}
      <div className="space-y-2 text-xs">
        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
          Auto-Mapped Government Schema Attributes:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { samboorna: "Admn_No", erp: "Admission Number", match: "100%" },
            { samboorna: "Student_Name_Eng", erp: "Full Legal Name", match: "100%" },
            { samboorna: "DOB_DDMMYYYY", erp: "Birth Date", match: "100%" },
            { samboorna: "Lang_Paper_1", erp: "Malayalam / Arabic", match: "100%" },
            { samboorna: "Caste_Category", erp: "OBC / SC / General", match: "100%" },
            { samboorna: "Guardian_Mobile", erp: "SMS Alert Phone", match: "100%" },
          ].map((m) => (
            <div key={m.samboorna} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono text-[10px] text-indigo-600 block font-semibold">{m.samboorna}</span>
              <span className="font-bold text-slate-800 block text-[11px] mt-0.5">{m.erp}</span>
              <span className="text-[9px] text-emerald-600 font-bold">Matched ({m.match})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Strip */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
        <span className="text-slate-500 text-[11px]">Ready to ingest into 2026-2027 Academic Database</span>
        <button
          onClick={() => alert('Import Complete: 45 student profiles loaded into Class 10-A!')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer text-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Execute Ingestion</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   6. STAFF DIRECTORY & EXAM SUPERVISION ROSTER MOCKUP
   ========================================================================= */
export function StaffSupervisionRosterMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-lg shadow-slate-200/50 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Faculty Directory &amp; Exam Supervision Allocator
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
          Conflict-Free Engine
        </span>
      </div>

      {/* Staff Roster Sample */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold px-2">
          <span>Teacher &amp; Timetable Initials</span>
          <span>Designated Exam Room (09:30 AM - 12:30 PM)</span>
        </div>

        {[
          { initials: "AKA", name: "Abdul Azees K.", role: "Senior Math Teacher", room: "Hall 1 (Main Auditorium)", status: "Assigned" },
          { initials: "SFT", name: "Suhra Fathima", role: "English Dept Head", room: "Hall 2 (Room 101)", status: "Assigned" },
          { initials: "TAB", name: "Thomas Abraham", role: "Physics Lecturer", room: "Hall 3 (Science Block)", status: "Assigned" },
          { initials: "NKM", name: "Dr. K. Narayanan", role: "Vice Principal", room: "Supervision Controller", status: "Chief" },
        ].map((f) => (
          <div 
            key={f.initials}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-black text-xs flex items-center justify-center border border-indigo-200">
                {f.initials}
              </span>
              <div>
                <span className="font-bold text-slate-900 block">{f.name}</span>
                <span className="text-[11px] text-slate-500">{f.role}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-slate-800 text-xs block">{f.room}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{f.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Safeguard Notice */}
      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span><strong>Invigilation Rule Enforced:</strong> Teachers are strictly barred from supervising rooms containing their own subject exams.</span>
      </div>
    </div>
  );
}

/* =========================================================================
   7. INTER-HOUSE CHAMPIONSHIP & POINTS SCOREBOARD MOCKUP
   ========================================================================= */
export function SportsChampionshipTallyMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-lg shadow-slate-200/50 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Annual Sports &amp; Kalolsavam Live Points Tally
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold animate-pulse">
          LIVE TALLY
        </span>
      </div>

      {/* 4 Houses Leaderboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Sapphire House */}
        <div className="p-4 rounded-xl bg-blue-50/60 border-2 border-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              1st
            </span>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Sapphire House</span>
              <span className="text-[11px] text-blue-700 font-semibold">14 Gold • 9 Silver • 6 Bronze</span>
            </div>
          </div>
          <span className="text-xl font-black text-blue-900">482 <span className="text-[10px] font-normal text-slate-500">pts</span></span>
        </div>

        {/* Emerald House */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              2nd
            </span>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Emerald House</span>
              <span className="text-[11px] text-emerald-700 font-semibold">12 Gold • 11 Silver • 8 Bronze</span>
            </div>
          </div>
          <span className="text-xl font-black text-emerald-900">465 <span className="text-[10px] font-normal text-slate-500">pts</span></span>
        </div>

        {/* Ruby House */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              3rd
            </span>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Ruby House</span>
              <span className="text-[11px] text-rose-700 font-semibold">9 Gold • 8 Silver • 12 Bronze</span>
            </div>
          </div>
          <span className="text-xl font-black text-rose-900">410 <span className="text-[10px] font-normal text-slate-500">pts</span></span>
        </div>

        {/* Topaz House */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              4th
            </span>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Topaz House</span>
              <span className="text-[11px] text-amber-700 font-semibold">8 Gold • 10 Silver • 7 Bronze</span>
            </div>
          </div>
          <span className="text-xl font-black text-amber-900">395 <span className="text-[10px] font-normal text-slate-500">pts</span></span>
        </div>
      </div>

      {/* Auto-House Balancing note */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
        <span>Automatic gender and class division balancing across all 4 houses</span>
        <span className="text-indigo-600 font-bold cursor-pointer hover:underline">
          View Detailed Event Results →
        </span>
      </div>
    </div>
  );
}


/* =========================================================================
   8. STAFF ASSIGNED SUBJECT MARK ENTRY MOCKUP (Staff Dashboard View)
   ========================================================================= */
export function StaffAssignedMarkEntryMockup({ className = "w-full" }: { className?: string }) {
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [isLocked, setIsLocked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [studentMarks, setStudentMarks] = useState([
    { roll: 1, admn: "8480", name: "Aadhil Rahman", theory: 74, ce: 19, status: "PRESENT" },
    { roll: 2, admn: "8492", name: "Amina Rinsha", theory: 78, ce: 20, status: "PRESENT" },
    { roll: 3, admn: "8504", name: "Bilal Hassan", theory: 62, ce: 18, status: "PRESENT" },
    { roll: 4, admn: "8515", name: "Dilshad K", theory: 48, ce: 16, status: "PRESENT" },
    { roll: 5, admn: "8522", name: "Fahad P", theory: 0, ce: 0, status: "ABSENT" },
  ]);

  const maxTheory = 80;
  const maxCe = 20;

  const handleMarkChange = (roll: number, field: 'theory' | 'ce', val: string) => {
    if (isLocked) return;
    const num = Math.max(0, Math.min(field === 'theory' ? maxTheory : maxCe, Number(val) || 0));
    setStudentMarks(prev => prev.map(s => s.roll === roll ? { ...s, [field]: num, status: "PRESENT" } : s));
  };

  const toggleAbsent = (roll: number) => {
    if (isLocked) return;
    setStudentMarks(prev => prev.map(s => {
      if (s.roll !== roll) return s;
      const nextStatus = s.status === "ABSENT" ? "PRESENT" : "ABSENT";
      return { ...s, status: nextStatus, theory: nextStatus === "ABSENT" ? 0 : 40, ce: nextStatus === "ABSENT" ? 0 : 15 };
    }));
  };

  const calculateGrade = (total: number, isAbsent: boolean) => {
    if (isAbsent) return { grade: "AB", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (total >= 90) return { grade: "A+", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (total >= 80) return { grade: "A", color: "text-teal-700 bg-teal-50 border-teal-200" };
    if (total >= 70) return { grade: "B+", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (total >= 60) return { grade: "B", color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
    if (total >= 50) return { grade: "C+", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (total >= 35) return { grade: "C", color: "text-orange-700 bg-orange-50 border-orange-200" };
    return { grade: "D", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  const handleSaveDraft = () => {
    setSaveStatus("Draft marks saved locally at " + new Date().toLocaleTimeString());
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleSubmitToController = () => {
    setIsLocked(true);
    setSaveStatus("Marks submitted and locked for evaluation review.");
    setTimeout(() => setSaveStatus(null), 4000);
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Top Banner: Logged-in Staff & Assignment Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 text-white text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
            AZ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">Mr. Abdul Azees</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono text-[10px] border border-indigo-400/30">
                STF260012
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">High School Assistant • Assigned: 10-A English, 10-B English, 9-B English</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Assigned Subject Access Granted
          </span>
        </div>
      </div>

      {/* Control bar: Selector & Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Class & Division</label>
          <div className="flex gap-1.5">
            {["10-A", "10-B", "9-B"].map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedClass === cls 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Assigned Subject</label>
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-extrabold text-slate-800 flex items-center justify-between">
            <span>{selectedSubject} (Theory 80 + CE 20)</span>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono font-bold">MAX 100</span>
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Examination Term</label>
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 flex items-center justify-between">
            <span>Mid-Term Examination 2026</span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold">Active Entry</span>
          </div>
        </div>
      </div>

      {/* Live Mark Entry Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200">
              <th className="py-2.5 px-3 w-12 text-center">Roll</th>
              <th className="py-2.5 px-3 w-20">Admn No</th>
              <th className="py-2.5 px-3 min-w-[160px]">Student Name</th>
              <th className="py-2.5 px-3 w-24 text-center">Status</th>
              <th className="py-2.5 px-3 w-28 text-center">Theory (80)</th>
              <th className="py-2.5 px-3 w-28 text-center">CE (20)</th>
              <th className="py-2.5 px-3 w-24 text-center">Total (100)</th>
              <th className="py-2.5 px-3 w-20 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white font-medium">
            {studentMarks.map((s) => {
              const isAbsent = s.status === "ABSENT";
              const total = isAbsent ? 0 : s.theory + s.ce;
              const gradeInfo = calculateGrade(total, isAbsent);

              return (
                <tr key={s.roll} className={`hover:bg-indigo-50/30 transition-colors ${isAbsent ? 'bg-rose-50/30' : ''}`}>
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-600">
                    {String(s.roll).padStart(2, '0')}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-500">
                    #{s.admn}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      disabled={isLocked}
                      onClick={() => toggleAbsent(s.roll)}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                        isAbsent 
                          ? 'bg-rose-600 text-white shadow-xs' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {isAbsent ? 'ABSENT (AB)' : 'PRESENT'}
                    </button>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      disabled={isLocked || isAbsent}
                      min={0}
                      max={maxTheory}
                      value={isAbsent ? '' : s.theory}
                      placeholder={isAbsent ? 'AB' : '0'}
                      onChange={(e) => handleMarkChange(s.roll, 'theory', e.target.value)}
                      className="w-16 py-1 px-2 text-center rounded border border-slate-300 font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-xs"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      disabled={isLocked || isAbsent}
                      min={0}
                      max={maxCe}
                      value={isAbsent ? '' : s.ce}
                      placeholder={isAbsent ? 'AB' : '0'}
                      onChange={(e) => handleMarkChange(s.roll, 'ce', e.target.value)}
                      className="w-16 py-1 px-2 text-center rounded border border-slate-300 font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-xs"
                    />
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-black text-slate-800">
                    {isAbsent ? '-' : total}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black border ${gradeInfo.color}`}>
                      {gradeInfo.grade}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toast message if saved or submitted */}
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="font-bold">Progress:</span>
          <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full w-[95%]" />
          </div>
          <span className="font-mono font-bold text-slate-700">43 / 45 Entered (95%)</span>
        </div>

        <div className="flex items-center gap-2">
          {!isLocked ? (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmitToController}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Submit to Controller</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                Locked & Submitted to Office
              </span>
              <button
                onClick={() => setIsLocked(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] cursor-pointer"
              >
                Request Re-open
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   9. CONSOLIDATED CLASS MARK LIST & TABULATION SHEET MOCKUP
   ========================================================================= */
export function ConsolidatedMarkListMockup({ className = "w-full" }: { className?: string }) {
  const students = [
    { rank: 1, roll: 12, name: "Amina Rinsha", eng: 98, mal: 94, math: 99, sci: 98, soc: 100, total: 489, pct: "97.8%", grade: "A+", result: "Distinction" },
    { rank: 2, roll: 1, name: "Aadhil Rahman", eng: 93, mal: 95, math: 96, sci: 94, soc: 94, total: 472, pct: "94.4%", grade: "A+", result: "Distinction" },
    { rank: 3, roll: 18, name: "Fathima Nihala", eng: 91, mal: 92, math: 92, sci: 91, soc: 90, total: 456, pct: "91.2%", grade: "A+", result: "Distinction" },
    { rank: 4, roll: 3, name: "Bilal Hassan", eng: 80, mal: 86, math: 85, sci: 83, soc: 84, total: 418, pct: "83.6%", grade: "A", result: "First Class" },
    { rank: 5, roll: 4, name: "Dilshad K", eng: 64, mal: 74, math: 75, sci: 73, soc: 76, total: 362, pct: "72.4%", grade: "B+", result: "First Class" },
  ];

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Header with KPI cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-base text-slate-900">
              Class 10-A Consolidated Tabulation Register
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mid-Term Examination 2026 • 5 Core Subjects (Total 500 Marks) • Generated by Office Controller
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tabulation</span>
          </button>
        </div>
      </div>

      {/* 4 Statistical KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-emerald-700 font-bold block text-[11px]">Pass Percentage</span>
          <span className="text-lg font-black text-emerald-900">95.5%</span>
          <span className="text-[10px] text-emerald-600 block">43 of 45 passed</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
          <span className="text-blue-700 font-bold block text-[11px]">Class Average</span>
          <span className="text-lg font-black text-blue-900">78.4%</span>
          <span className="text-[10px] text-blue-600 block">392 / 500 points</span>
        </div>
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
          <span className="text-purple-700 font-bold block text-[11px]">Top Aggregate</span>
          <span className="text-lg font-black text-purple-900">489 <span className="text-xs font-normal">/ 500</span></span>
          <span className="text-[10px] text-purple-600 block font-semibold">Amina Rinsha (#1)</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-amber-700 font-bold block text-[11px]">Distinction Count</span>
          <span className="text-lg font-black text-amber-900">14</span>
          <span className="text-[10px] text-amber-600 block">Scored &gt; 90% aggregate</span>
        </div>
      </div>

      {/* Tabulation Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <th className="py-2.5 px-3 w-12 text-center">Rank</th>
              <th className="py-2.5 px-3 w-12 text-center">Roll</th>
              <th className="py-2.5 px-3 min-w-[140px]">Student Name</th>
              <th className="py-2.5 px-2.5 text-center font-mono">ENG (100)</th>
              <th className="py-2.5 px-2.5 text-center font-mono">MAL (100)</th>
              <th className="py-2.5 px-2.5 text-center font-mono">MATH (100)</th>
              <th className="py-2.5 px-2.5 text-center font-mono">SCI (100)</th>
              <th className="py-2.5 px-2.5 text-center font-mono">SOC (100)</th>
              <th className="py-2.5 px-3 text-center font-mono font-black text-indigo-900">Total (500)</th>
              <th className="py-2.5 px-3 text-center font-mono">Pct %</th>
              <th className="py-2.5 px-3 text-center">Grade</th>
              <th className="py-2.5 px-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white font-medium">
            {students.map((st) => (
              <tr key={st.roll} className="hover:bg-indigo-50/30 transition-colors">
                <td className="py-2 px-3 text-center">
                  <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-[11px] ${
                    st.rank === 1 ? 'bg-amber-400 text-amber-950 shadow-xs' :
                    st.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    st.rank === 3 ? 'bg-amber-600 text-white' :
                    'text-slate-600'
                  }`}>
                    {st.rank}
                  </span>
                </td>
                <td className="py-2 px-3 text-center font-mono font-bold text-slate-600">
                  {String(st.roll).padStart(2, '0')}
                </td>
                <td className="py-2 px-3 font-bold text-slate-900">
                  {st.name}
                </td>
                <td className="py-2 px-2.5 text-center font-mono text-slate-700">{st.eng}</td>
                <td className="py-2 px-2.5 text-center font-mono text-slate-700">{st.mal}</td>
                <td className="py-2 px-2.5 text-center font-mono text-slate-700">{st.math}</td>
                <td className="py-2 px-2.5 text-center font-mono text-slate-700">{st.sci}</td>
                <td className="py-2 px-2.5 text-center font-mono text-slate-700">{st.soc}</td>
                <td className="py-2 px-3 text-center font-mono font-black text-indigo-700">{st.total}</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">{st.pct}</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {st.grade}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {st.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   10. OFFICIAL PDF REPORT CARD & STUDENT PROGRESS REPORT MOCKUP
   ========================================================================= */
export function PdfReportsMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-4 sm:p-8 space-y-6 max-w-3xl mx-auto ${className}`}>
      {/* PDF Actions Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <FileText className="w-4 h-4 text-rose-600" />
          <span>Vector PDF Generated • High-Resolution Print Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1 hover:bg-rose-100 cursor-pointer">
            <Download className="w-3 h-3" />
            <span>Download .PDF</span>
          </button>
          <button className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 hover:bg-slate-800 cursor-pointer">
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Simulated A4 Document Sheet */}
      <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white to-slate-50/50 border-2 border-slate-300 shadow-inner relative overflow-hidden">
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-slate-900 font-black text-5xl rotate-[-25deg]">
          PPMHSS KOTTUKKARA
        </div>

        {/* School Crest & Header */}
        <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4 mb-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-900 text-amber-400 font-serif font-black flex items-center justify-center text-lg border-2 border-amber-400 shadow-xs">
            PPM
          </div>
          <h2 className="font-serif font-black text-base sm:text-xl text-slate-900 tracking-wide uppercase">
            P.P.M. Higher Secondary School
          </h2>
          <p className="text-[11px] text-slate-600 font-medium">
            Kottukkara, Kondotty, Malappuram Dt., Kerala - 673638 • Affiliation Code: 18020
          </p>
          <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 border border-slate-300 font-bold text-[10px] text-slate-800 tracking-wider uppercase mt-1">
            Continuous Evaluation &amp; Term Examination Progress Report
          </div>
        </div>

        {/* Student Meta Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 rounded-lg bg-slate-50 border border-slate-200 mb-4 font-mono">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Student Name</span>
            <span className="font-bold text-slate-900 font-sans text-xs">Amina Rinsha</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Class &amp; Div</span>
            <span className="font-bold text-slate-900">Standard 10 - A</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Roll No / Admn</span>
            <span className="font-bold text-slate-900">12 / #8492</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Attendance</span>
            <span className="font-bold text-emerald-700">178 / 185 (96.2%)</span>
          </div>
        </div>

        {/* Performance Breakdown Table */}
        <div className="overflow-x-auto rounded border border-slate-300 mb-4">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-200/90 text-slate-800 font-black border-b border-slate-300">
                <th className="py-1.5 px-2.5">Subject Title</th>
                <th className="py-1.5 px-2 text-center">Max</th>
                <th className="py-1.5 px-2 text-center">Theory</th>
                <th className="py-1.5 px-2 text-center">CE</th>
                <th className="py-1.5 px-2 text-center">Obtained</th>
                <th className="py-1.5 px-2 text-center">Grade</th>
                <th className="py-1.5 px-2.5 text-center">Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-medium">
              {[
                { sub: "First Language (Malayalam)", max: 100, th: 74, ce: 20, obt: 94, gr: "A+", rem: "Outstanding eloquence" },
                { sub: "English Language", max: 100, th: 78, ce: 20, obt: 98, gr: "A+", rem: "Exemplary composition" },
                { sub: "Mathematics", max: 100, th: 70, ce: 19, obt: 89, gr: "A", rem: "Excellent problem solving" },
                { sub: "Basic Science (Phy/Chem/Bio)", max: 100, th: 72, ce: 18, obt: 90, gr: "A+", rem: "High conceptual mastery" },
                { sub: "Social Science", max: 100, th: 68, ce: 19, obt: 87, gr: "A", rem: "Very good analytical depth" },
                { sub: "Information Technology", max: 50, th: 30, ce: 20, obt: 50, gr: "A+", rem: "Full practical score" },
              ].map((row) => (
                <tr key={row.sub} className="hover:bg-slate-50">
                  <td className="py-1.5 px-2.5 font-bold text-slate-900">{row.sub}</td>
                  <td className="py-1.5 px-2 text-center font-mono text-slate-600">{row.max}</td>
                  <td className="py-1.5 px-2 text-center font-mono text-slate-700">{row.th}</td>
                  <td className="py-1.5 px-2 text-center font-mono text-slate-700">{row.ce}</td>
                  <td className="py-1.5 px-2 text-center font-mono font-black text-slate-900">{row.obt}</td>
                  <td className="py-1.5 px-2 text-center font-black text-emerald-700">{row.gr}</td>
                  <td className="py-1.5 px-2.5 text-center text-slate-600 text-[10px]">{row.rem}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-black border-t-2 border-slate-300 text-slate-900">
                <td className="py-2 px-2.5">GRAND TOTAL &amp; RESULT</td>
                <td className="py-2 px-2 text-center font-mono">550</td>
                <td className="py-2 px-2 text-center font-mono">392</td>
                <td className="py-2 px-2 text-center font-mono">116</td>
                <td className="py-2 px-2 text-center font-mono text-indigo-700 text-xs">508 (92.4%)</td>
                <td className="py-2 px-2 text-center text-emerald-700">A+</td>
                <td className="py-2 px-2.5 text-center text-indigo-700 uppercase tracking-wide">PASSED DISTINCTION (RANK 1)</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Teacher Remarks & Tri-Signatory Block */}
        <div className="p-3 rounded bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950 mb-6">
          <span className="font-bold block mb-0.5">Class Teacher&apos;s Appraisal:</span>
          <span>Amina exhibits superior analytical focus and active classroom leadership. Recommended for State Science Olympiad coaching.</span>
        </div>

        {/* 3 Authentic Signatures */}
        <div className="grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600 pt-6 border-t border-slate-200">
          <div>
            <div className="font-serif italic font-bold text-slate-800 text-sm mb-1">Abdul Azees</div>
            <div className="border-t border-slate-400 pt-1 font-semibold uppercase">Class Teacher</div>
          </div>
          <div>
            <div className="font-serif italic font-bold text-slate-800 text-sm mb-1">Dr. K. Narayanan</div>
            <div className="border-t border-slate-400 pt-1 font-semibold uppercase">Exam Controller</div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-rose-500/40 text-rose-500/80 font-bold text-[7px] flex items-center justify-center uppercase rotate-12 mx-auto absolute -top-5 left-0 right-0 pointer-events-none">
              Seal Verified
            </div>
            <div className="font-serif italic font-bold text-slate-800 text-sm mb-1">P. Mohammedkutty</div>
            <div className="border-t border-slate-400 pt-1 font-semibold uppercase">Principal / Headmaster</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   11. FACULTY DAILY DASHBOARD & COCKPIT MOCKUP
   ========================================================================= */
export function StaffDashboardMockup({ className = "w-full" }: { className?: string }) {
  const [attendanceDone, setAttendanceDone] = useState(false);

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Header Profile Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-base shadow-sm">
            AZ
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">
              Abdul Azees (HSA English)
            </h3>
            <span className="text-xs text-slate-500">
              Class Teacher: 10-A • Staff Code: STF260012 • 4 Periods Scheduled Today
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            Biometric Check-In: 08:42 AM
          </span>
        </div>
      </div>

      {/* 3 Quick Cockpit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: 1-Click Roll Call */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-indigo-600" />
              Morning Roll Call
            </span>
            <span className="text-[10px] font-bold text-slate-500">Class 10-A</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">43 Present • 2 Absent</span>
            <span className="text-rose-600 font-bold font-mono">#07, #24</span>
          </div>
          <button
            onClick={() => setAttendanceDone(true)}
            className={`w-full py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              attendanceDone
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {attendanceDone ? '✓ Attendance Dispatched to Parents' : 'Confirm Roll Call (SMS Trigger)'}
          </button>
        </div>

        {/* Card 2: Assigned Marks Submissions */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-purple-600" />
              Subject Mark Tasks
            </span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              1 Pending
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">10-A English</span>
              <span className="font-bold text-emerald-600">43/45 (Draft)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">10-B English</span>
              <span className="font-bold text-purple-600">Submitted (Locked)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Next Invigilation Duty */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Exam Supervision
            </span>
            <span className="text-[10px] font-bold text-indigo-600">Tomorrow</span>
          </div>
          <div className="text-[11px] text-slate-600">
            <span className="font-bold text-slate-900 block">Science Block - Hall 3</span>
            <span>Maths Mid-Term • 10:00 AM - 12:30 PM</span>
          </div>
        </div>
      </div>

      {/* Today's Timetable Row */}
      <div className="space-y-2 pt-2">
        <span className="font-extrabold text-xs text-slate-900 block">
          Today&apos;s Class Schedule &amp; Assigned Periods
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          {[
            { period: "P1", time: "09:30 - 10:15", class: "10-A English", room: "Room 204", active: true },
            { period: "P3", time: "11:15 - 12:00", class: "9-B English", room: "Room 108", active: false },
            { period: "P5", time: "01:45 - 02:30", class: "10-B English", room: "Room 205", active: false },
            { period: "P7", time: "03:00 - 03:45", class: "Library / Remedial", room: "Hall 1", active: false },
          ].map(p => (
            <div 
              key={p.period}
              className={`p-3 rounded-xl border transition-all ${
                p.active 
                  ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-indigo-700">{p.period}</span>
                <span className="text-[10px] text-slate-500">{p.time}</span>
              </div>
              <span className="font-extrabold text-slate-900 text-xs block">{p.class}</span>
              <span className="text-[10px] text-slate-500">{p.room}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   12. PARENT DASHBOARD & STUDENT PORTAL MOCKUP
   ========================================================================= */
export function ParentDashboardMockup({ className = "w-full" }: { className?: string }) {
  const [activeChild, setActiveChild] = useState<'amina' | 'adil'>('amina');

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Parent Top Bar with Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-base text-slate-900">
              Parent Portal • Mohammed Faris
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between enrolled siblings to view real-time academic records, fees, and attendance.
          </p>
        </div>

        {/* Sibling Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveChild('amina')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeChild === 'amina' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amina Rinsha (10-A)
          </button>
          <button
            onClick={() => setActiveChild('adil')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeChild === 'adil' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Adil Mohammed (7-B)
          </button>
        </div>
      </div>

      {/* Child Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Attendance Card */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              Today&apos;s Attendance
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
              PRESENT
            </span>
          </div>
          <div className="pt-1">
            <span className="text-2xl font-black text-emerald-900">
              {activeChild === 'amina' ? '96.2%' : '98.5%'}
            </span>
            <span className="text-[11px] text-emerald-700 block">
              {activeChild === 'amina' ? '178 of 185 days attended (7 excused absences)' : '182 of 185 days attended'}
            </span>
          </div>
        </div>

        {/* Recent Exam Card */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Latest Exam Result
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-black">
              RANK #1
            </span>
          </div>
          <div className="pt-1">
            <span className="text-2xl font-black text-indigo-900">
              {activeChild === 'amina' ? '508 / 550' : '470 / 500'}
            </span>
            <span className="text-[11px] text-indigo-700 block font-semibold">
              Mid-Term 2026 • Grade A+ (Passed Distinction)
            </span>
          </div>
        </div>

        {/* Fee Payment Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Fee Payment Status
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              CLEAR
            </span>
          </div>
          <div className="pt-1">
            <span className="text-sm font-black text-slate-800 block">
              Term 1 &amp; 2 Tuition Paid
            </span>
            <span className="text-[11px] text-slate-500 block">
              Receipt #PPM-88219 • Next due: Dec 2026
            </span>
          </div>
        </div>
      </div>

      {/* Homework & Direct Notification Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Homework */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
          <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600" />
            Active Homework &amp; Assignments
          </span>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Mathematics: Theorem 4.2 Proofs</span>
                <span className="text-slate-500 text-[10px]">Submission due Monday • Mrs. Sumathi</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">Due Soon</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">English: Literary Essay on Hamlet</span>
                <span className="text-slate-500 text-[10px]">Submission due Friday • Mr. Abdul Azees</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">Submitted</span>
            </div>
          </div>
        </div>

        {/* Notices & Announcements */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
          <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-indigo-600" />
            Official Announcements &amp; Circulars
          </span>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
              <span className="font-bold text-indigo-950 block">Parent-Teacher Association (PTA) General Meet</span>
              <span className="text-indigo-700 text-[10px]">Saturday at 10:00 AM in School Auditorium to discuss term results.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block">Annual Sports &amp; Kalolsavam Schedule</span>
              <span className="text-slate-500 text-[10px]">Interschool house competitions begin 14th October 2026.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   13. MULTI-CHANNEL NOTIFICATION & SMS BROADCASTER MOCKUP
   ========================================================================= */
export function NotificationsCenterMockup({ className = "w-full" }: { className?: string }) {
  const [selectedAudience, setSelectedAudience] = useState("Class 10-A (45 Parents)");
  const [channels, setChannels] = useState({ sms: true, whatsapp: true, push: false });

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-black text-base text-slate-900">
              Unified Multi-Channel Notification Engine
            </h3>
            <span className="text-xs text-slate-500">
              Broadcast instant SMS, WhatsApp messages, and Mobile push alerts to parents and staff.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 font-mono">
            SMS Balance: 8,420 Credits
          </span>
        </div>
      </div>

      {/* Target Audience & Channel Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">Recipient Audience</label>
          <div className="space-y-1.5">
            {["Class 10-A (45 Parents)", "Absent Students Today (2 Parents)", "All Secondary School Parents (420)"].map(aud => (
              <button
                key={aud}
                onClick={() => setSelectedAudience(aud)}
                className={`w-full text-left px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedAudience === aud 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-1.5">Dispatch Channels</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
              <input 
                type="checkbox" 
                checked={channels.sms} 
                onChange={e => setChannels({ ...channels, sms: e.target.checked })} 
                className="rounded text-indigo-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">DND-Compliant SMS Gateway</span>
                <span className="text-[10px] text-slate-500">Guaranteed 5-second delivery across all Indian telecom networks</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
              <input 
                type="checkbox" 
                checked={channels.whatsapp} 
                onChange={e => setChannels({ ...channels, whatsapp: e.target.checked })} 
                className="rounded text-emerald-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">Official WhatsApp Business API</span>
                <span className="text-[10px] text-slate-500">Sends rich template message with PDF progress report attachment</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Message Composer & Live Preview */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-slate-900">Live Dynamic Message Preview</span>
          <span className="text-[11px] text-slate-500 font-mono">Tags: &#123;student_name&#125;, &#123;date&#125;, &#123;class&#125;</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed space-y-2 shadow-inner">
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            Message Template Preview (Target: {selectedAudience})
          </div>
          <p className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-slate-200">
            &ldquo;Dear Parent, your ward <span className="text-amber-400 font-bold">&#123;student_name&#125;</span> (Class <span className="text-amber-400 font-bold">&#123;class&#125;</span>) has been marked <span className="text-rose-400 font-bold">ABSENT</span> for morning session on <span className="text-amber-400 font-bold">09-Sep-2026</span>. If this absence is without prior notice, please contact the class teacher at +91 81570 24638. - Principal, PPMHSS Kottukkara.&rdquo;
          </p>
        </div>
      </div>

      {/* Dispatch Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
        <span className="text-slate-500">Estimated cost: <strong>45 SMS Credits</strong> (₹ 0.12/msg)</span>
        <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Notification Now</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   14. CLASSES & SUBJECT-TEACHER ALLOCATION MATRIX MOCKUP
   ========================================================================= */
export function ClassesAndSubjectsMappingMockup({ className = "w-full" }: { className?: string }) {
  const [mappings] = useState([
    { subject: "First Language (Malayalam)", code: "MAL101", teacher: "Mrs. Suhra Fathima", periods: 4, type: "Compulsory" },
    { subject: "English Language", code: "ENG102", teacher: "Mr. Abdul Azees", periods: 5, type: "Compulsory" },
    { subject: "Mathematics", code: "MTH103", teacher: "Mrs. K. Sumathi", periods: 6, type: "Compulsory" },
    { subject: "Basic Science (Physics/Chem)", code: "SCI104", teacher: "Mr. Thomas Abraham", periods: 5, type: "Compulsory" },
    { subject: "Social Science", code: "SOC105", teacher: "Mr. N. Jayakumar", periods: 5, type: "Compulsory" },
    { subject: "Arabic / Sanskrit (Elective)", code: "ELC106", teacher: "Mr. M. Faisal", periods: 3, type: "Elective Option" },
  ]);

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-base text-slate-900">
              Class 10-A Subject-Teacher Allocation Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Enforces strict role-based assignment: only designated faculty can input marks or manage course curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
            Total Workload: 28 Periods/Week
          </span>
        </div>
      </div>

      {/* Allocation Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <th className="py-2.5 px-3">Subject Name</th>
              <th className="py-2.5 px-3 w-24">Code</th>
              <th className="py-2.5 px-3 min-w-[160px]">Designated Faculty</th>
              <th className="py-2.5 px-3 w-28 text-center">Periods / Wk</th>
              <th className="py-2.5 px-3 w-28 text-center">Type</th>
              <th className="py-2.5 px-3 w-24 text-center">Privilege</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white font-medium">
            {mappings.map(m => (
              <tr key={m.code} className="hover:bg-indigo-50/30 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">{m.subject}</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">{m.code}</td>
                <td className="py-2.5 px-3 font-bold text-indigo-700 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{m.teacher}</span>
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">{m.periods} hrs</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.type === 'Compulsory' ? 'bg-slate-100 text-slate-700' : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {m.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Authorized
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 text-indigo-950 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        <span><strong>Access Security Rule:</strong> Teachers attempting to open subjects outside their authorized roster are automatically barred with audit logging.</span>
      </div>
    </div>
  );
}

/* =========================================================================
   15. EXAMS & GRADING CONFIGURATION MASTER MOCKUP
   ========================================================================= */
export function ExamsConfigurationMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-base text-slate-900">
              Institutional Exam Schedule &amp; Assessment Rules
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Theory vs. CE marks distribution, pass benchmarks, and statutory board grading brackets.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          Academic Year 2025-26
        </span>
      </div>

      {/* Timetable Schedule Grid */}
      <div className="space-y-2 text-xs">
        <span className="font-extrabold text-slate-900 block">
          Mid-Term 2026 Examination Schedule &amp; Mark Breakdown
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                <th className="py-2.5 px-3">Exam Date</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Time Slot</th>
                <th className="py-2.5 px-3 text-center">Theory</th>
                <th className="py-2.5 px-3 text-center">CE / Pract</th>
                <th className="py-2.5 px-3 text-center font-bold text-slate-900">Max Marks</th>
                <th className="py-2.5 px-3 text-center">Min Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-medium">
              {[
                { date: "15-Sep-2026", sub: "First Language (Paper 1)", time: "09:30 AM - 12:00 PM", th: 80, ce: 20, max: 100, pass: 35 },
                { date: "17-Sep-2026", sub: "English Language", time: "09:30 AM - 12:00 PM", th: 80, ce: 20, max: 100, pass: 35 },
                { date: "19-Sep-2026", sub: "Mathematics", time: "09:30 AM - 12:30 PM", th: 80, ce: 20, max: 100, pass: 35 },
                { date: "22-Sep-2026", sub: "General Science", time: "09:30 AM - 12:00 PM", th: 80, ce: 20, max: 100, pass: 35 },
                { date: "24-Sep-2026", sub: "Social Science", time: "09:30 AM - 12:00 PM", th: 80, ce: 20, max: 100, pass: 35 },
              ].map(r => (
                <tr key={r.sub} className="hover:bg-indigo-50/30">
                  <td className="py-2 px-3 font-mono font-bold text-slate-800">{r.date}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{r.sub}</td>
                  <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{r.time}</td>
                  <td className="py-2 px-3 text-center font-mono text-slate-700">{r.th}</td>
                  <td className="py-2 px-3 text-center font-mono text-slate-700">{r.ce}</td>
                  <td className="py-2 px-3 text-center font-mono font-black text-indigo-700">{r.max}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">{r.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Scale Brackets */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <span className="font-extrabold text-slate-900 block">
          Standard 9-Point Board Grading Scale
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center">
          {[
            { grade: "A+", range: "90-100%", desc: "Outstanding" },
            { grade: "A", range: "80-89%", desc: "Excellent" },
            { grade: "B+", range: "70-79%", desc: "Very Good" },
            { grade: "B", range: "60-69%", desc: "Good" },
            { grade: "C+", range: "50-59%", desc: "Above Avg" },
            { grade: "C", range: "35-49%", desc: "Passed" },
            { grade: "D", range: "< 35%", desc: "Needs Impr" },
          ].map(g => (
            <div key={g.grade} className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="font-black text-slate-900 text-sm block">{g.grade}</span>
              <span className="font-mono text-[10px] text-indigo-600 font-bold block">{g.range}</span>
              <span className="text-[9px] text-slate-500">{g.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   16. SYSTEM SETTINGS & INSTITUTIONAL ADMINISTRATION MOCKUP
   ========================================================================= */
export function SystemSettingsMockup({ className = "w-full" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-7 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-black text-base text-slate-900">
              Institutional Settings &amp; Governance Panel
            </h3>
            <span className="text-xs text-slate-500">
              Manage academic sessions, Kerala Samboorna synchronization, and role-based permissions.
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">
          System v4.2 • Stable
        </span>
      </div>

      {/* 3 Config Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Section 1: Academic Session */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
            Academic Session
          </span>
          <div className="space-y-1 text-[11px]">
            <span className="text-slate-500 block">Active Academic Year:</span>
            <span className="font-bold text-slate-900 text-xs block">2025-2026 (01 Jun - 31 Mar)</span>
          </div>
          <button className="w-full py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors text-[11px] cursor-pointer">
            Run Year Rollover Wizard →
          </button>
        </div>

        {/* Section 2: School Letterhead & Seal */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            Institutional Identity
          </span>
          <div className="space-y-1 text-[11px]">
            <span className="text-slate-500 block">School Code:</span>
            <span className="font-mono font-bold text-slate-900">18020 (PPMHSS Kottukkara)</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">Crest Uploaded</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">Seal Active</span>
          </div>
        </div>

        {/* Section 3: Samboorna Sync */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            Kerala Samboorna Sync
          </span>
          <div className="space-y-1 text-[11px]">
            <span className="text-slate-500 block">Last synchronized:</span>
            <span className="font-bold text-slate-900">Yesterday at 05:30 PM</span>
          </div>
          <button className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors text-[11px] cursor-pointer">
            Sync New Admissions Now
          </button>
        </div>
      </div>

      {/* Role-Based Permissions Grid */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
        <span className="font-extrabold text-slate-900 block">
          Role-Based Access Control (RBAC) Permissions Matrix
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-indigo-700 block">Principal &amp; Admin</span>
            <span className="text-slate-500 text-[10px]">Full institutional control, mark locks, fee collections, user provisioning.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-emerald-700 block">Class Teacher</span>
            <span className="text-slate-500 text-[10px]">Daily roll-call SMS trigger, student dossier, progress report appraisal.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-amber-700 block">Subject Teacher</span>
            <span className="text-slate-500 text-[10px]">Enters marks ONLY for allocated classes and subjects. No cross-subject access.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-purple-700 block">Parent &amp; Student</span>
            <span className="text-slate-500 text-[10px]">Read-only report cards, homework feed, payment portal, attendance alerts.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
