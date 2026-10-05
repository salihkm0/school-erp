'use client';

import React from 'react';
import { Check, Sparkles, Tag, AlertCircle } from 'lucide-react';

interface PricingSectionProps {
  onOpenDemoModal: () => void;
}

export default function PricingSection({ onOpenDemoModal }: PricingSectionProps) {
  const packageFeatures = [
    "Full Institutional ERP License & Source Deployment",
    "Continuous Evaluation (CE) + Theory Exam Grading Engine",
    "Single-Subject Revert to Draft & Dual-Tier Verification Safeguards",
    "Print-Ready Board-Compliant PDF Report Cards with Official Seals",
    "Sports Meet & Arts Fest (Kalolsavam) Engine with Auto House Division",
    "Automated Student Chest Number / Bib Generation with Printable Sheets",
    "Student Item Selection with Admin Participation Caps (Individual & Group)",
    "Live House Championship Leaderboard & Instant Certificates",
    "Smart Parent SMS Attendance & Monthly Education Dept Register Exports",
    "Conflict-Free Exam Hall Invigilation & Duty Scheduler",
    "Class Teacher, Subject Teacher & Student Role-Based Portals",
    "Complete Onboarding, Data Migration & Faculty Training Support"
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50/80 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Requested Offer Price & Actual Price */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>Limited Period School Inaugural Offer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Complete School ERP Pricing Starts At
          </h2>

          {/* Pricing Highlight Pill */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-baseline gap-3 bg-white px-6 py-3.5 rounded-2xl border-2 border-indigo-600 shadow-md shadow-indigo-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offer Price:</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-indigo-700 font-mono">
                ₹1.75 Lakh
              </span>
              <span className="text-base sm:text-lg text-slate-400 line-through font-semibold font-mono ml-2">
                ₹2.05 Lakh
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                Save ₹30,000
              </span>
            </div>
          </div>

          {/* Note as explicitly requested by the user */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Note: Excluded hosting, domain, database expenses.</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Main Complete Suite Card */}
          <div className="lg:col-span-8 rounded-3xl p-7 sm:p-10 bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-100/60 relative">
            <div className="absolute -top-3.5 left-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Complete All-In-One Institutional License
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Full School OS &amp; Fest Engine</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Everything included: Exams, Attendance, Sports &amp; Arts Fest, Timetables, and Student SIS.</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-400 line-through font-semibold">Actual Price: ₹2,05,000</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono">₹1,75,000</p>
                <span className="text-[11px] text-emerald-700 font-bold block">One-time License Starting Price</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              {packageFeatures.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">
                * Cloud hosting, domain &amp; database setup assistance provided.
              </span>
              <button
                onClick={onOpenDemoModal}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                Schedule Demo &amp; Lock Offer Price
              </button>
            </div>
          </div>

          {/* Quick FAQ / Pilot Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 uppercase">
                Free School Pilot
              </span>
              <h4 className="text-base font-bold text-slate-900">Try Before You Commit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test our Continuous Evaluation exam marksheet, board PDF report cards, and chest number generator with a live demo class at your institution.
              </p>
              <button
                onClick={onOpenDemoModal}
                className="w-full py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Request Free 30-Day Pilot
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Infrastructure Transparency</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schools retain 100% ownership of their data. We guide you in selecting affordable Indian cloud servers (AWS/DigitalOcean/Hostinger) to keep recurring hosting costs under ₹1,500/month.
              </p>
              <div className="text-[11px] font-bold text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                ⚠️ Note: Hosting, domain registration, and database fees are billed directly to the school at actual provider rates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
