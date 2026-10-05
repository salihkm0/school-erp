'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sparkles,
  FileSpreadsheet,
  FileCheck,
  BellRing,
  Trophy,
  FileText
} from 'lucide-react';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenBrochureModal: () => void;
}

export default function Hero({ onOpenDemoModal, onOpenBrochureModal }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white">
      {/* Soft Ambient Pastel Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-tr from-indigo-100/70 via-purple-100/50 to-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10 animate-ambient-glow" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-50 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-900">New Release:</span>
            <span>Sports Meet, House Division &amp; Chest Number Generator</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            The Modern Operating System for Schools That Value{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
              Academic Excellence
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            Eliminate exam season chaos. Effortlessly collect continuous evaluation marks, generate 
            <strong className="text-slate-900 font-semibold"> board-ready PDF report cards</strong>, automate 
            daily parent SMS attendance, and coordinate sports meet houses &amp; student chest numbers in one unified cloud platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Book a Personalized Live Demo</span>
            </button>
            <Link
              href="/screens"
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-xs transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Interactive Screens (16)</span>
            </Link>
            <button
              onClick={onOpenBrochureModal}
              className="w-full sm:w-auto px-5 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Brochure</span>
            </button>
            <a
              href="#events-sports"
              className="w-full sm:w-auto px-5 py-4 rounded-xl text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-rose-500" />
              <span>Sports Fest</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Software Installation Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kerala SSLC &amp; CBSE Format Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>45-Minute Data Migration Support</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Software Simulation Mockup */}
        <div className="relative max-w-5xl mx-auto mt-12 sm:mt-16">
          {/* Mac-Style Clean White Window Container */}
          <div className="rounded-2xl p-2 sm:p-3 bg-slate-100/80 border border-slate-200/90 shadow-2xl shadow-slate-300/40">
            <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">
                    manage.ppmhsskottukkara.com/exams/first-term-2026
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    All Marks Verified
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden md:inline">
                    Academic Year 2026-2027
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

                {/* Table: Class Submission Status */}
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Class Mark Submissions &amp; Edit Safeguards
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                      Dual-Tier Verification Active
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5 font-bold">Class</th>
                          <th className="px-4 py-2.5 font-bold text-center">Status</th>
                          <th className="px-4 py-2.5 font-bold">Faculty Contributors</th>
                          <th className="px-4 py-2.5 font-bold">Submission Date</th>
                          <th className="px-4 py-2.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>Class 10-A</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                9/9 Submitted
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                100% Entered
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                              Reviewed
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-medium">
                            Abdul Azees, Aseena &amp; 7 Teachers
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                            07 Sept 2026, 19:27
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600 text-white shadow-xs">
                                Reviewed ✓
                              </span>
                              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                Subjects (9)
                              </span>
                            </div>
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>Class 10-B</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                8/9 Submitted
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                89% Entered
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                              Draft
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-medium">
                            3 Teachers Submitted
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                            07 Sept 2026, 16:31
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Set to Draft
                              </span>
                              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                Subjects (9)
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pill 1: Report Card Badge */}
          <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200 z-20">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Board-Compliant PDF</p>
              <p className="text-[11px] text-slate-500">Official Seal + CE Breakdown</p>
            </div>
          </div>

          {/* Floating Pill 2: Parent SMS Alert */}
          <div className="hidden sm:flex absolute -top-6 -right-6 items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200 z-20">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Sports &amp; Arts Fest</p>
              <p className="text-[11px] text-slate-500">Houses, Chest Nos &amp; Live Points</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
