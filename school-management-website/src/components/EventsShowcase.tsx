'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Hash, 
  CheckCircle2, 
  Lock, 
  Award, 
  Printer, 
  Sparkles,
  ChevronRight,
  Scale,
  Tv,
  TableProperties,
  QrCode,
  Bell,
  Play,
  RotateCcw,
  Star
} from 'lucide-react';

interface EventsShowcaseProps {
  onOpenDemoModal: () => void;
}

export default function EventsShowcase({ onOpenDemoModal }: EventsShowcaseProps) {
  const [activeView, setActiveView] = useState<'chest-no' | 'points-table' | 'judge-tabulation' | 'stage-manager' | 'championships'>('chest-no');

  // Interactive state for Badge Templates
  const [selectedBadgeTemplate, setSelectedBadgeTemplate] = useState<'kalolsavam' | 'jersey' | 'lanyard' | 'eco'>('kalolsavam');

  // Interactive state for Point Schemes
  const [selectedPointScheme, setSelectedPointScheme] = useState<'kalolsavam' | 'athletics' | 'cbse'>('kalolsavam');

  // Interactive state for Stage Stopwatch simulation
  const [timerRunning, setTimerRunning] = useState(false);
  const [simSeconds, setSimSeconds] = useState(274); // 4:34 min (warning bell triggered)

  const houses = [
    { name: "Sapphire Dragons", color: "blue", border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-700", badgeBg: "bg-blue-600", points: 142, gold: 8, silver: 5, bronze: 3, rank: "1st Place 🏆" },
    { name: "Ruby Titans", color: "red", border: "border-rose-500", bg: "bg-rose-50", text: "text-rose-700", badgeBg: "bg-rose-600", points: 128, gold: 6, silver: 7, bronze: 4, rank: "2nd Place" },
    { name: "Emerald Warriors", color: "green", border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", badgeBg: "bg-emerald-600", points: 118, gold: 5, silver: 4, bronze: 8, rank: "3rd Place" },
    { name: "Topaz Knights", color: "amber", border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-700", badgeBg: "bg-amber-600", points: 105, gold: 4, silver: 5, bronze: 5, rank: "4th Place" },
  ];

  return (
    <section id="events-sports" className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white relative border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-4 shadow-2xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>All-in-One Kalolsavam &amp; Sports Meet Enterprise Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Complete Fest Management: Badges, Point Tables, Judges &amp; Live Stage
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From automated chest bib template design and multi-judge rubric tabulation to live stage timers, 
            royal championship titles (Kalaprathibha &amp; Kalathilakam), and cross-tabulated house point tables.
          </p>
        </div>

        {/* 5 Feature Highlight Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-10">
          <div 
            onClick={() => setActiveView('chest-no')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'chest-no' 
                ? 'bg-white border-purple-600 shadow-md shadow-purple-100 ring-2 ring-purple-100' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-2.5">
              <Hash className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">1. Chest Badges</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Template designer with QR &amp; barcode</p>
          </div>

          <div 
            onClick={() => setActiveView('points-table')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'points-table' 
                ? 'bg-white border-amber-600 shadow-md shadow-amber-100 ring-2 ring-amber-100' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-2.5">
              <TableProperties className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">2. Point Tables</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Custom schemes &amp; cross-tab matrices</p>
          </div>

          <div 
            onClick={() => setActiveView('judge-tabulation')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'judge-tabulation' 
                ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-100' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-2.5">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">3. Judge Tabulation</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Multi-judge rubric scorecards</p>
          </div>

          <div 
            onClick={() => setActiveView('stage-manager')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'stage-manager' 
                ? 'bg-white border-rose-600 shadow-md shadow-rose-100 ring-2 ring-rose-100' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-2.5">
              <Tv className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">4. Live Stage Monitor</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Now performing, timer &amp; bells</p>
          </div>

          <div 
            onClick={() => setActiveView('championships')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'championships' 
                ? 'bg-white border-emerald-600 shadow-md shadow-emerald-100 ring-2 ring-emerald-100' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2.5">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">5. Royal Champions</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Kalaprathibha &amp; Merit certificates</p>
          </div>
        </div>

        {/* Interactive Simulation Display Box */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          
          {/* VIEW 1: CHEST NUMBER BADGE TEMPLATE DESIGNER */}
          {activeView === 'chest-no' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Customizable Chest ID Card Templates
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Choose, Edit &amp; Batch Print Chest Number Badges
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Design bespoke chest number badges with school branding, QR code verification, student photos, and house colors. Switch between 4 standard layouts with 1 click.
                </p>

                {/* Template Selector Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Choose Design Template:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'kalolsavam', label: 'Royal Kalolsavam Badge' },
                      { id: 'jersey', label: 'Classic Jersey Sport Card' },
                      { id: 'lanyard', label: 'Lanyard Photo ID Badge' },
                      { id: 'eco', label: 'Compact Eco Tag (8/A4)' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedBadgeTemplate(t.id as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition border ${
                          selectedBadgeTemplate === t.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Auto sequential or house-prefixed chest allocation (e.g. #101, #RED-101)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Print-ready A4 sheet grid (4, 6, or 8 badges per page with cut-lines)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenDemoModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>Try Chest Template Designer</span>
                  </button>
                </div>
              </div>

              {/* Live Badge Preview Card */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 flex items-center justify-center">
                <div
                  className={`w-full max-w-sm rounded-2xl border-2 p-6 shadow-2xl relative flex flex-col justify-between transition-all duration-300 min-h-[360px] ${
                    selectedBadgeTemplate === 'kalolsavam'
                      ? 'bg-gradient-to-br from-[#faf7ee] to-[#fef9c3] border-[#ca8a04] text-slate-900'
                      : selectedBadgeTemplate === 'lanyard'
                      ? 'bg-slate-900 border-purple-500 text-white'
                      : selectedBadgeTemplate === 'jersey'
                      ? 'bg-white border-slate-950 text-slate-950'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-3 bg-blue-600 rounded-t-2xl" />

                  <div className="flex items-center justify-between border-b pb-2.5 mt-1 border-slate-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                        SCH
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-tight">P.P.M. Higher Secondary School</div>
                        <div className="text-[8px] font-bold text-purple-700 uppercase">Annual Kalolsavam &amp; Sports 2026</div>
                      </div>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold uppercase">
                      Sapphire House
                    </span>
                  </div>

                  <div className="text-center py-4 my-auto">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">CHEST NUMBER</div>
                    <div className="text-6xl font-black font-mono tracking-tight my-1 text-slate-950">
                      #248
                    </div>
                    <span className="inline-block px-3 py-0.5 rounded bg-slate-200/80 font-bold text-xs">
                      Senior Boys Section
                    </span>
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between border-slate-300">
                    <div>
                      <div className="font-extrabold text-sm text-slate-950">Muhammed Farhan</div>
                      <div className="text-[11px] text-slate-600">Adm: 8921 • Class: 10-A</div>
                      <div className="text-[9px] text-purple-700 font-bold mt-0.5">
                        Items: 100m Sprint, Long Jump, Classical Recitation
                      </div>
                    </div>

                    <div className="w-12 h-12 bg-white border border-slate-300 rounded-xl flex items-center justify-center shadow-2xs">
                      <QrCode className="w-7 h-7 text-slate-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: POINT TABLE SCHEMES & CROSS-TABULATION MATRIX */}
          {activeView === 'points-table' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
                    Point Table Rules &amp; Cross-Tabulation Matrix
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Configurable Scoring Schemes with Real-Time Auto-Tally
                  </h3>
                </div>

                {/* Scheme Picker */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setSelectedPointScheme('kalolsavam')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedPointScheme === 'kalolsavam' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Kalolsavam (5-3-1 + Grades)
                  </button>
                  <button
                    onClick={() => setSelectedPointScheme('athletics')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedPointScheme === 'athletics' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Athletics (5-3-1 / 10-6-2)
                  </button>
                  <button
                    onClick={() => setSelectedPointScheme('cbse')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedPointScheme === 'cbse' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    CBSE Sahodaya (10-7-5)
                  </button>
                </div>
              </div>

              {/* Cross-Tabulation Matrix Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-4">House Name</th>
                      <th className="py-3.5 px-4 text-center">Sub-Junior</th>
                      <th className="py-3.5 px-4 text-center">Junior</th>
                      <th className="py-3.5 px-4 text-center">Senior</th>
                      <th className="py-3.5 px-4 text-center">🥇 Gold</th>
                      <th className="py-3.5 px-4 text-center">🥈 Silver</th>
                      <th className="py-3.5 px-4 text-center">🥉 Bronze</th>
                      <th className="py-3.5 px-4 text-right font-black text-amber-600">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {houses.map((h, idx) => (
                      <tr key={h.name} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-4 font-extrabold text-slate-900 flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full ${h.badgeBg}`} />
                          {h.name}
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">38 pts</td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">46 pts</td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">{h.points - 84} pts</td>
                        <td className="py-4 px-4 text-center font-bold text-amber-500">{h.gold}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-400">{h.silver}</td>
                        <td className="py-4 px-4 text-center font-bold text-amber-700">{h.bronze}</td>
                        <td className="py-4 px-4 text-right font-black text-amber-600 font-mono text-base">
                          {h.points} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: MULTI-JUDGE SCORING & TABULATION */}
          {activeView === 'judge-tabulation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Judges Tabulation &amp; Evaluation Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Multi-Judge Scoring with Automated Percentile Grades
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Judges evaluate candidates on customizable rubrics (Rhythm/Tala, Bhava/Expression, Costume, Perfection). The system computes exact averages, handles deductions, and generates official results.
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Blind/Independent score entry for Judge 1, Judge 2, Judge 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Auto-grades: A Grade (≥70%), B Grade (≥60%), C Grade (≥50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1-Click publishing instantly broadcasts points to live stadium scoreboards</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenDemoModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                  >
                    <Scale className="w-4 h-4 text-indigo-200" />
                    <span>Explore Judge Tabulation Modal</span>
                  </button>
                </div>
              </div>

              {/* Tabulation Matrix Mockup */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 shadow-xl text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-extrabold text-base">Mohiniyattam (Senior Girls)</h4>
                    <span className="text-xs text-purple-400">Consolidated Tabulation Sheet • 3 Judges</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Official Published
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { rank: "1st", chest: "#108", name: "Ananya Ramesh", house: "Emerald Warriors", j1: 92, j2: 95, j3: 94, avg: 93.6, grade: "A Grade" },
                    { rank: "2nd", chest: "#214", name: "Fathima Hiba", house: "Sapphire Dragons", j1: 88, j2: 90, j3: 89, avg: 89.0, grade: "A Grade" },
                    { rank: "3rd", chest: "#305", name: "Devika Nair", house: "Ruby Titans", j1: 84, j2: 82, j3: 86, avg: 84.0, grade: "B Grade" },
                  ].map((entry) => (
                    <div key={entry.chest} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center border border-amber-400/30">
                          {entry.rank}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">{entry.name} ({entry.chest})</div>
                          <div className="text-slate-400 text-[11px]">{entry.house}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right font-mono">
                        <div>
                          <div className="text-slate-400 text-[10px]">J1:{entry.j1} J2:{entry.j2} J3:{entry.j3}</div>
                          <div className="font-extrabold text-amber-300 text-sm">{entry.avg} pts</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          {entry.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: LIVE STAGE & VENUE CONTROLLER */}
          {activeView === 'stage-manager' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Live Stage Controller &amp; Timetable
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Real-Time Stage Stopwatch with Warning Bells &amp; Lot Orders
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Stage managers control performance lots, broadcast &quot;Now Performing&quot; chest numbers, and trigger live warning bells when participants near item time limits.
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Randomized performance lot numbers generated in 1 click</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>&quot;On Deck&quot; call queue shows the next 3 waiting candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Live WebSocket broadcast to judge iPads and auditorium screens</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenDemoModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
                  >
                    <Tv className="w-4 h-4 text-rose-200" />
                    <span>Test Stage Manager Console</span>
                  </button>
                </div>
              </div>

              {/* Stage Controller Screen Mockup */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                      Main Auditorium (Stage 1)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Item Limit: 5:00 min</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NOW PERFORMING</div>
                    <div className="text-xl font-extrabold text-white mt-1">Bharatanatyam (Junior)</div>
                    <div className="text-4xl font-black text-rose-400 font-mono mt-2">
                      Chest #104
                    </div>
                    <div className="text-xs text-slate-300 mt-1">Ranya Mariyam • Sapphire Dragons</div>
                  </div>

                  <div className="text-center bg-slate-950 p-4 rounded-2xl border border-slate-800 min-w-[160px]">
                    <div className="text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Bell className="w-3.5 h-3.5 animate-bounce" />
                      WARNING BELL RING
                    </div>
                    <div className="text-4xl font-mono font-black text-amber-400 my-1">
                      04:34
                    </div>
                    <span className="text-[10px] text-slate-500">Warning @ 4:00 min</span>
                  </div>
                </div>

                {/* Queue */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Deck Call Queue:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center text-xs">
                      <span className="text-amber-400 font-bold">#1 Next:</span> #109 (Ruby)
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center text-xs">
                      <span className="text-slate-400 font-bold">#2 Next:</span> #115 (Emerald)
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center text-xs">
                      <span className="text-slate-400 font-bold">#3 Next:</span> #121 (Topaz)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: ROYAL TITLES & CERTIFICATES */}
          {activeView === 'championships' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Individual Championships &amp; Trophies
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Kalaprathibha, Kalathilakam &amp; Gold Merit Certificates
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Automatic individual champion calculation for boys and girls with tie-breaker logic. Generate official printable Merit &amp; Participation certificates in seconds.
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Kalaprathibha (Male Champion) &amp; Kalathilakam (Female Champion)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gold-filigree ornamental certificates with school crest and digital signature lines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Category champions for Sub-Junior, Junior &amp; Senior sections</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenDemoModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-200 transition-all cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Request Full Festival Suite Demo</span>
                  </button>
                </div>
              </div>

              {/* Royal Champion Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-400 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-amber-300/60 pb-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-800">
                      <Star className="w-4 h-4 text-amber-600" />
                      Kalaprathibha (Male)
                    </div>
                    <span className="font-mono font-black text-amber-900 text-base">42 pts</span>
                  </div>
                  <div className="font-black text-lg text-slate-900">Adhil Rahman</div>
                  <div className="text-xs text-slate-700 mt-0.5">Chest #201 • Sapphire Dragons</div>
                  <div className="mt-4 pt-3 border-t border-amber-300/60 flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>🥇 4 Gold</span>
                    <span>🥈 2 Silver</span>
                    <span>🥉 1 Bronze</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-100 border-2 border-rose-300 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-rose-200 pb-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-rose-800">
                      <Star className="w-4 h-4 text-rose-600" />
                      Kalathilakam (Female)
                    </div>
                    <span className="font-mono font-black text-rose-900 text-base">48 pts</span>
                  </div>
                  <div className="font-black text-lg text-slate-900">Fathima Ranya</div>
                  <div className="text-xs text-slate-700 mt-0.5">Chest #104 • Ruby Titans</div>
                  <div className="mt-4 pt-3 border-t border-rose-200 flex items-center justify-between text-xs font-bold text-rose-900">
                    <span>🥇 5 Gold</span>
                    <span>🥈 1 Silver</span>
                    <span>🥉 0 Bronze</span>
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
