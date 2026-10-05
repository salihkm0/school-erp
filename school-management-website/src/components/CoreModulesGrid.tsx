'use client';

import React from 'react';
import { CORE_MODULES } from '@/data/features';
import { 
  ShieldCheck, 
  CalendarCheck, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  FileSpreadsheet, 
  Coins, 
  Bus, 
  Trophy,
  ArrowRight
} from 'lucide-react';

interface CoreModulesGridProps {
  onOpenDemoModal: () => void;
}

export default function CoreModulesGrid({ onOpenDemoModal }: CoreModulesGridProps) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5 text-cyan-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5 text-teal-600" />;
      case 'Coins': return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'Bus': return <Bus className="w-5 h-5 text-sky-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-rose-600" />;
      default: return <GraduationCap className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getTopBarColor = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-900';
      case 'cyan': return 'bg-cyan-500';
      case 'blue': return 'bg-blue-600';
      case 'emerald': return 'bg-emerald-500';
      case 'purple': return 'bg-purple-600';
      case 'sky': return 'bg-sky-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      default: return 'bg-indigo-600';
    }
  };

  return (
    <section id="modules" className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200">
            Unified Campus Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
            Modules that Power Every Campus
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A comprehensive institutional suite where academics, operations, fests, and administration seamlessly talk to each other.
          </p>
        </div>

        {/* 9 Cards Grid - Replicating Image 1 Style with Premium Polish */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="relative rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-6 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              {/* Top Colored Accent Strip (as seen in Image 1) */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${getTopBarColor(mod.color)}`} />

              <div>
                {/* Rounded Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-slate-100/80 border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {getIcon(mod.icon)}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5 group-hover:text-indigo-600 transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  {mod.badge}
                </span>
                <button
                  onClick={onOpenDemoModal}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
