import React from 'react';
import { TESTIMONIALS, TRUST_METRICS } from '@/data/testimonials';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {TRUST_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-2xs"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {metric.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">{metric.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
            Real School Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
            Trusted by Respected Educators &amp; Administrators
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Discover why leading state-board and CBSE institutions switched from legacy software to KlassDesk.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>

                <div className="inline-block px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-200">
                  ✨ {t.highlight}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  {t.avatarText}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-indigo-600 font-semibold">{t.role}</p>
                  <p className="text-[11px] text-slate-500">{t.school}, {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
