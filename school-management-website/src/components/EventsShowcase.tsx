'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Hash, 
  CheckCircle2, 
  Lock, 
  Award, 
  Calendar, 
  PlusCircle, 
  Printer, 
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Flame
} from 'lucide-react';

interface EventsShowcaseProps {
  onOpenDemoModal: () => void;
}

export default function EventsShowcase({ onOpenDemoModal }: EventsShowcaseProps) {
  const [activeView, setActiveView] = useState<'houses' | 'chest-no' | 'rules' | 'scoring'>('chest-no');

  const houses = [
    { name: "Sapphire House", color: "blue", border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-700", badgeBg: "bg-blue-600", points: 142, students: 358, rank: "1st Place 🏆" },
    { name: "Ruby House", color: "red", border: "border-rose-500", bg: "bg-rose-50", text: "text-rose-700", badgeBg: "bg-rose-600", points: 128, students: 362, rank: "2nd Place" },
    { name: "Emerald House", color: "green", border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", badgeBg: "bg-emerald-600", points: 118, students: 365, rank: "3rd Place" },
    { name: "Topaz House", color: "amber", border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-700", badgeBg: "bg-amber-600", points: 105, students: 366, rank: "4th Place" },
  ];

  return (
    <section id="events-sports" className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white relative border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>Annual Sports Meet &amp; Arts Fest (Kalolsavam)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Complete Fest Management: Houses, Chest Numbers &amp; Live Scoring
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Say goodbye to chaotic paper registrations and disputed points. Create houses, auto-divide students, 
            generate chest number bibs, enforce item participation caps, and broadcast live championship leaderboards.
          </p>
        </div>

        {/* Mini Feature Highlight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div 
            onClick={() => setActiveView('houses')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'houses' 
                ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-50' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. House Division</h3>
            <p className="text-xs text-slate-500 mt-1">Auto-balance students across 4+ school houses</p>
          </div>

          <div 
            onClick={() => setActiveView('chest-no')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'chest-no' 
                ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-50' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3">
              <Hash className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Chest No. Generator</h3>
            <p className="text-xs text-slate-500 mt-1">Unique bib numbers &amp; printable badge sheets</p>
          </div>

          <div 
            onClick={() => setActiveView('rules')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'rules' 
                ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-50' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Admin Item Limits</h3>
            <p className="text-xs text-slate-500 mt-1">Cap max items (e.g. 3 Individual + 2 Group)</p>
          </div>

          <div 
            onClick={() => setActiveView('scoring')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              activeView === 'scoring' 
                ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-50' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Live Championship</h3>
            <p className="text-xs text-slate-500 mt-1">Real-time house points &amp; merit certificates</p>
          </div>
        </div>

        {/* Interactive Simulation Display */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          {/* VIEW 1: CHEST NUMBER & STUDENT ITEM REGISTRATION */}
          {activeView === 'chest-no' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Student Chest No. &amp; Item Selector
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Automated Chest Numbers with Guardrailed Item Selection
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Every participant gets an official Chest Number. Students or house captains select items from 
                  the sports and arts catalog. If a student tries to select more items than allowed, the system 
                  instantly locks further registrations.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>One-click batch generation of chest numbers (101 to 999 or House-wise H-101)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Printable Chest Number Bib sheets with student details, house badge & category</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Automated category mapping: Sub-Junior (Class 5-7), Junior (8-10), Senior (11-12)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenDemoModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Test Event &amp; Chest Number Module</span>
                  </button>
                </div>
              </div>

              {/* Student Chest No. Mockup */}
              <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                {/* Official Student Participant Card */}
                <div className="bg-white rounded-2xl border-2 border-blue-500 p-5 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Official Contestant
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-blue-700">
                        <span className="text-[9px] font-bold uppercase">CHEST NO</span>
                        <span className="text-xl font-extrabold font-mono -mt-1">#248</span>
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">Muhammed Farhan</h4>
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                          <span className="text-slate-500">Class 10-A (Admn: 8921)</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="font-bold text-blue-600">Sapphire House (Blue)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">
                        Senior Boys
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">Annual Sports 2026</span>
                    </div>
                  </div>

                  {/* Registered Items with Enforced Limits */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5 text-xs">
                      <span className="font-bold text-slate-800">Participating Items Selection</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Individual Limit: 3/3 (Max Cap Reached)
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-slate-900">100m Sprint (Athletics)</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Confirmed (Individual #1)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-slate-900">Long Jump (Field Events)</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Confirmed (Individual #2)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-slate-900">Classical Recitation (Arts)</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Confirmed (Individual #3)
                        </span>
                      </div>

                      {/* Locked item demonstration */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100/80 border border-dashed border-slate-300 text-xs opacity-75">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500 font-medium">Shot Put / 200m Sprint</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          Locked (Limit Reached)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-slate-900">4 x 100m Relay (Sapphire House Team)</span>
                        </div>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                          Group Item (1/2 Selected)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 text-[11px]">Official Bib ID: CH-248</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 transition-colors">
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bib</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: HOUSES & BALANCED STUDENT ALLOCATION */}
          {activeView === 'houses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">House System</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">School Houses &amp; Student Division</h3>
                  <p className="text-xs sm:text-sm text-slate-600">Automatically distribute 1,451 students across 4 houses maintaining equal gender and grade representation.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Auto-Balanced (50% M / 50% F)</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {houses.map((h) => (
                  <div key={h.name} className={`p-5 rounded-2xl bg-white border-2 ${h.border} shadow-xs space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${h.badgeBg} uppercase tracking-wider`}>
                        {h.color} house
                      </span>
                      <span className="text-xs font-bold text-slate-700">{h.rank}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{h.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{h.students} Active Students</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900">{h.points}</span>
                        <span className="text-[11px] text-slate-500 block font-medium">Championship Pts</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                        Roster →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: ADMIN RULES & PARTICIPATION CAPS */}
          {activeView === 'rules' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Enforce Fair Participation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Admin Configurable Event Rules &amp; Limits
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Avoid favoritism or a few students monopolizing all items. Administrators define strict maximums per contestant 
                  for individual and group items, as well as category restrictions.
                </p>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                    <span><strong>Individual Items Rule:</strong> Maximum 3 individual events per student</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span><strong>Group Items Rule:</strong> Maximum 2 group items (Relay, Mime, Group Song)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Scoring Hierarchy:</strong> 1st: 5 pts | 2nd: 3 pts | 3rd: 1 pt | Group x2</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-900 block">Pre-Configured Item Catalog (Arts &amp; Sports)</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["100m, 200m, 400m, 800m", "High Jump & Long Jump", "Shot Put & Javelin", "4x100m Relay", "Classical Dance (Bharatanatyam)", "Light Music (Malayalam / Arabic)", "Elocution (Eng, Mal, Hindi)", "Pencil Drawing & Oil Painting", "Patriotic Group Song", "Mime & Skit"].map((item) => (
                    <div key={item} className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: LIVE CHAMPIONSHIP POINTS TABLE */}
          {activeView === 'scoring' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Results</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">Overall House Championship Leaderboard</h3>
                  <p className="text-xs sm:text-sm text-slate-600">Points auto-calculate in real time as judges confirm each event result.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>32/45 Events Completed</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {houses.map((h, index) => (
                  <div key={h.name} className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 font-extrabold text-xs flex items-center justify-center text-slate-700">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <span>{h.name}</span>
                          {index === 0 && <span className="text-amber-500 text-xs">🏆 Leading</span>}
                        </h4>
                        <span className="text-xs text-slate-500">{h.students} Competitors</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                      <div className="w-32 sm:w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${h.badgeBg}`} 
                          style={{ width: `${(h.points / 150) * 100}%` }}
                        />
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 font-mono w-16 text-right">
                        {h.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
