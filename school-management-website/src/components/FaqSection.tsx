'use client';

import React, { useState } from 'react';
import { FAQS } from '@/data/faqs';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  onOpenDemoModal: () => void;
}

export default function FaqSection({ onOpenDemoModal }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Have questions about implementation, curriculum compatibility, or pricing? We&apos;ve got answers.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-indigo-300 shadow-md shadow-indigo-50'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                    isOpen ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">Category:</span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-indigo-50/60 border border-indigo-200/80 text-center space-y-3 shadow-xs">
          <p className="text-sm font-bold text-slate-900">Have a specific question about your school&apos;s curriculum or setup?</p>
          <p className="text-xs text-slate-600">Our academic software engineers are available to walk through your exact requirements.</p>
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <span>Talk with an Education Specialist</span>
          </button>
        </div>
      </div>
    </section>
  );
}
