'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileText, 
  CalendarCheck, 
  Clock, 
  Smartphone, 
  CheckCircle, 
  Award
} from 'lucide-react';

export default function FeatureExplorer() {
  const [activeTab, setActiveTab] = useState<'exams' | 'reports' | 'attendance' | 'duties' | 'app'>('exams');

  const tabs = [
    { id: 'exams', label: 'Exam & Mark Workflow', icon: GraduationCap },
    { id: 'reports', label: 'PDF Report Card Studio', icon: FileText },
    { id: 'attendance', label: 'Smart Attendance & SMS', icon: CalendarCheck },
    { id: 'duties', label: 'Staff Duty & Timetables', icon: Clock },
    { id: 'app', label: 'Parent Mobile App', icon: Smartphone },
  ] as const;

  return (
    <section id="features" className="py-24 bg-slate-50/80 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
            <span>Modular Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Real-World School Challenges
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From the chaotic exam hall to the principal&apos;s office, see how KlassDesk automates everyday administrative friction with precision.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Showcase Panel */}
        <div className="mt-8 rounded-2xl bg-white p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/60">
          {activeTab === 'exams' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Dual-Tier Verification System
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Foolproof Mark Entry with Single-Subject Reversion
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Subject teachers enter marks easily. School administrators verify submission status with live 
                  percentage audits before approving. If an error is noticed in Mathematics, revert 
                  <strong className="text-slate-900"> only Mathematics</strong> to draft without locking out other teachers!
                </p>
                <ul className="space-y-3">
                  {[
                    "Continuous Evaluation (CE) + Theory score integration",
                    "Missing Mark Audit: Disables submission until all students have valid marks",
                    "Individual subject draft revert preserves all other submitted subjects in the class",
                    "Live 0% to 100% progress meters for every single subject"
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Visual Card */}
              <div className="lg:col-span-7 bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Class 10-A Subjects Submission Drawer
                  </span>
                  <span className="text-xs text-indigo-600 font-mono font-semibold">Exam: Mid-Term 2026</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Subject Card 1: Submitted & Reviewed */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">FIRST LANGUAGE (MALAYALAM)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        SUBMITTED
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Marks Entered</span>
                        <span className="font-bold text-emerald-600">45/45 (100%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 truncate">By: Abdul Azees (Teacher)</span>
                      <span className="text-amber-600 font-semibold cursor-pointer hover:underline">Revert to Draft</span>
                    </div>
                  </div>

                  {/* Subject Card 2: Submitted */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">ENGLISH LANGUAGE</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        SUBMITTED
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Marks Entered</span>
                        <span className="font-bold text-emerald-600">45/45 (100%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 truncate">By: Fathima S.</span>
                      <span className="text-amber-600 font-semibold cursor-pointer hover:underline">Revert to Draft</span>
                    </div>
                  </div>

                  {/* Subject Card 3: Draft (Complete) */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">MATHEMATICS</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        DRAFT
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Marks Entered</span>
                        <span className="font-bold text-emerald-600">45/45 (100%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">Ready to Submit</span>
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded shadow-2xs">
                        Submit Subject
                      </span>
                    </div>
                  </div>

                  {/* Subject Card 4: Draft (Incomplete) */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">PHYSICS &amp; CHEMISTRY</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        DRAFT
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Marks Entered</span>
                        <span className="font-bold text-amber-600">24/45 (53%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full w-[53%]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-amber-600 text-[10px] font-semibold">Pending 21 marks</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded border border-slate-200 cursor-not-allowed">
                        Locked (Pending)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Instant Board-Compliant PDF Generation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  High-Resolution Report Cards with Complete Board Analytics
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Generate print-perfect report cards in bulk. Every student sheet includes school branding, 
                  Continuous Evaluation (CE) &amp; Terminal Evaluation (TE) score breakdowns, letter grades, attendance percentage, 
                  and official principal &amp; class teacher endorsement blocks.
                </p>
                <ul className="space-y-3">
                  {[
                    "One-click bulk PDF generation & ZIP downloads for entire classes",
                    "Customized for Kerala State Board (SSLC/HSE), CBSE, and ICSE formats",
                    "Automatic calculation of Class Rank, GPA, and Percentage",
                    "Official school seal, signature endorsement & board grading schemes"
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Report Card Mockup Preview */}
              <div className="lg:col-span-7 bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                <div className="bg-white text-slate-900 rounded-xl p-5 shadow-lg border border-slate-200">
                  {/* Report Card Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-900 flex items-center justify-center text-white font-bold text-xl">
                      PPM
                    </div>
                    <div className="text-center">
                      <h4 className="text-base font-extrabold uppercase tracking-wide text-indigo-950">
                        PPM HIGHER SECONDARY SCHOOL
                      </h4>
                      <p className="text-[10px] text-slate-600 font-medium">
                        Kottukkara, Kondotty, Malappuram | Affiliated to State Board Kerala
                      </p>
                      <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                        ACADEMIC EVALUATION REPORT (2026 - 2027)
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                      <p className="font-bold text-slate-800">CLASS 10-A</p>
                      <p>TERM-II</p>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3">
                    <div><span className="text-slate-500">Name:</span> <strong className="text-slate-900">Muhammed Farhan</strong></div>
                    <div><span className="text-slate-500">Roll No:</span> <strong className="text-slate-900">1024</strong></div>
                    <div><span className="text-slate-500">Class &amp; Sec:</span> <strong className="text-slate-900">10-A</strong></div>
                    <div><span className="text-slate-500">Admission No:</span> <strong className="text-slate-900">8921/2024</strong></div>
                    <div><span className="text-slate-500">Attendance:</span> <strong className="text-emerald-700">96.4% (92/95)</strong></div>
                    <div><span className="text-slate-500">Result:</span> <strong className="text-indigo-700 font-bold">PASSED (A+)</strong></div>
                  </div>

                  {/* Mark Sheet Table */}
                  <table className="w-full text-[10px] border-collapse border border-slate-200 text-center mb-3">
                    <thead className="bg-indigo-50/80 font-bold text-indigo-950">
                      <tr>
                        <th className="border border-slate-200 p-1 text-left">Subject</th>
                        <th className="border border-slate-200 p-1">CE (20)</th>
                        <th className="border border-slate-200 p-1">Theory (80)</th>
                        <th className="border border-slate-200 p-1">Total (100)</th>
                        <th className="border border-slate-200 p-1">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-800">
                      <tr>
                        <td className="border border-slate-200 p-1 text-left font-medium">Malayalam I</td>
                        <td className="border border-slate-200 p-1">19</td>
                        <td className="border border-slate-200 p-1">74</td>
                        <td className="border border-slate-200 p-1 font-bold">93</td>
                        <td className="border border-slate-200 p-1 font-bold text-emerald-700">A+</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-1 text-left font-medium">English</td>
                        <td className="border border-slate-200 p-1">18</td>
                        <td className="border border-slate-200 p-1">72</td>
                        <td className="border border-slate-200 p-1 font-bold">90</td>
                        <td className="border border-slate-200 p-1 font-bold text-emerald-700">A+</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-1 text-left font-medium">Mathematics</td>
                        <td className="border border-slate-200 p-1">20</td>
                        <td className="border border-slate-200 p-1">76</td>
                        <td className="border border-slate-200 p-1 font-bold">96</td>
                        <td className="border border-slate-200 p-1 font-bold text-emerald-700">A+</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Seal and Signatures */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[9px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-[7px] font-bold text-indigo-600 uppercase tracking-tighter text-center leading-none">
                        SEAL
                      </div>
                      <span>Official School Seal &amp; Affiliation</span>
                    </div>
                    <div className="flex items-center gap-5 text-right">
                      <div>
                        <p className="font-bold text-slate-800">Class Teacher</p>
                        <p className="text-slate-400">Signature</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Principal</p>
                        <p className="text-slate-400">Endorsement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Real-Time Parent Alerts
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Morning Roll Call Done in 60 Seconds with Instant SMS
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  No paper registers. Class teachers open the attendance dashboard on their phone or laptop. 
                  All students are present by default—just tap the absent students. The moment attendance is saved, 
                  our SMS gateway instantly alerts parents, keeping student safety first.
                </p>
                <ul className="space-y-3">
                  {[
                    "Single-tap absentee toggle with fast multi-select",
                    "Immediate automated SMS and push notifications to parents",
                    "Visual attendance distribution brackets (90%+, 75-89%, &lt;75% warnings)",
                    "Official education department monthly register exports"
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attendance UI Simulation */}
              <div className="lg:col-span-7 bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">Attendance Distribution (Class 10-A)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    95.2% School Today
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-2xl font-extrabold text-emerald-700">38</span>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">&gt; 90% Attendance</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
                    <span className="text-2xl font-extrabold text-amber-700">5</span>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">75% - 89% Warning</p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <span className="text-2xl font-extrabold text-rose-700">2</span>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">&lt; 75% Critical Risk</p>
                  </div>
                </div>

                {/* Simulated SMS Alert Card */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Automated SMS to Parent (+91 98471XXXXX)</span>
                      <span className="text-[10px] text-slate-500 font-mono">09:14 AM</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      &quot;Dear Guardian, your ward Muhammed Farhan (10-A) is marked ABSENT today (08-Sep-2026). Please contact the class teacher if this was unexpected. - PPM HSS&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'duties' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Staff Schedule Optimization
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Conflict-Free Exam Supervision &amp; Duty Rosters
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Avoid double-booking faculty and eliminate staff complaints about unfair exam duty loads. 
                  Our Duty Engine calculates supervisor allocations, accounts for subject teachers who cannot invigilate 
                  their own exams, and generates room-wise duty allocation charts instantly.
                </p>
                <ul className="space-y-3">
                  {[
                    "Automatic load-balancing across junior and senior teaching staff",
                    "Prevents subject teachers from invigilating their own exam subjects",
                    "One-click printable duty allocation charts for staffroom notice boards",
                    "Instant WhatsApp and SMS duty assignment dispatch"
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duty Table Visual */}
              <div className="lg:col-span-7 bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-slate-900">Exam Hall Supervision Roster</span>
                  <span className="text-xs text-amber-700 font-mono font-bold">Hall #1 to #8</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { hall: "Hall 1 (Main Auditorium)", teacher: "Dr. K. Narayanan", time: "09:30 AM - 12:30 PM", status: "Confirmed" },
                    { hall: "Hall 2 (Block A - Room 101)", teacher: "Abdul Azees K.", time: "09:30 AM - 12:30 PM", status: "Confirmed" },
                    { hall: "Hall 3 (Block A - Room 102)", teacher: "Suhra Fathima", time: "09:30 AM - 12:30 PM", status: "Confirmed" },
                    { hall: "Hall 4 (Science Lab Block)", teacher: "Thomas Abraham", time: "09:30 AM - 12:30 PM", status: "Confirmed" },
                  ].map((d) => (
                    <div key={d.hall} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{d.hall}</span>
                        <span className="text-[11px] text-slate-500">{d.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-indigo-700 block">{d.teacher}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{d.status} ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Android &amp; iOS Native Apps
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Engage Parents with a World-Class Mobile Experience
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Bridge the gap between classrooms and homes. Parents can check daily homework, view marks the 
                  minute teachers submit and review them, track bus locations, and pay school fees—all from their smartphone.
                </p>
                <ul className="space-y-3">
                  {[
                    "Multi-student profile support for parents with siblings",
                    "Push notifications for exam schedules, holidays, and fee due dates",
                    "Download and share digital PDF report cards in one tap",
                    "End-to-end encrypted messaging between teachers and parents"
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Phone Mockup */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-72 bg-slate-900 rounded-3xl p-3 border-4 border-slate-800 shadow-xl shadow-slate-300">
                  <div className="rounded-2xl bg-white p-4 border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">PPM HSS Parent App</span>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold">LIVE</span>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                      <span className="text-[10px] text-indigo-700 font-bold uppercase">Exam Result Released</span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">First Term Examination</p>
                      <p className="text-xs text-emerald-700 font-bold mt-1">Grade: A+ (94.2% Total)</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Today&apos;s Attendance</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-900">Present (Morning &amp; Afternoon)</span>
                      </div>
                    </div>

                    <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200">
                      Download PDF Report Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
