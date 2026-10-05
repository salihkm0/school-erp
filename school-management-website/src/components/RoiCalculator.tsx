'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenDemoModal: () => void;
}

export default function RoiCalculator({ onOpenDemoModal }: RoiCalculatorProps) {
  const [students, setStudents] = useState<number>(1200);
  const [examCount, setExamCount] = useState<number>(3);

  // Dynamic calculations based on realistic school operations
  const hoursSavedPerYear = Math.round((students * 0.35 * examCount) + (students * 0.15));
  const paperAndPrintingSaved = Math.round(students * 45 * (examCount / 3));
  const errorRateReduction = 100;

  return (
    <section id="calculator" className="py-24 bg-slate-50/70 relative border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Calculate How Much Time &amp; Money Your School Saves
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Manual mark entry, calculating grade percentages, printing registers, and checking report cards cost schools hundreds of teacher hours each term.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
          {/* Sliders Area */}
          <div className="lg:col-span-6 space-y-7">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800">Student Enrollment</label>
                <span className="text-base font-extrabold text-indigo-700 font-mono bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                  {students.toLocaleString()} Students
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="50"
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>200</span>
                <span>2,500</span>
                <span>5,000+</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800">Exams &amp; Evaluations Per Year</label>
                <span className="text-base font-extrabold text-purple-700 font-mono bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                  {examCount} Terms / Year
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={examCount}
                onChange={(e) => setExamCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>1 Term</span>
                <span>3 Terms (Standard)</span>
                <span>6 Terms</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              💡 <strong>Faculty Impact:</strong> Teachers spend an average of 45 hours each exam term entering marks on paper, calculating averages, and preparing report cards. KlassDesk eliminates 90% of this manual workload.
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/80 p-6 sm:p-8 rounded-2xl border border-indigo-200/80 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Estimated Annual School Savings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Teacher Hours</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {hoursSavedPerYear.toLocaleString()} hrs
                </p>
                <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Saved each academic year</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <span className="text-emerald-600 font-bold text-sm">₹</span>
                  <span>Printing &amp; Paper</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">
                  ₹{paperAndPrintingSaved.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Direct cost savings</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Mark Transcription Error Reduction:</span>
              <span className="font-extrabold text-emerald-700 font-mono text-sm">{errorRateReduction}% Guaranteed</span>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Detailed School Quote &amp; Free Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
