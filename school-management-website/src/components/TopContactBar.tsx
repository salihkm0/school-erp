'use client';

import React from 'react';
import { Phone, Mail, MessageCircle, Sparkles } from 'lucide-react';

export default function TopContactBar() {
  const phoneNumber = '918157024638';
  const displayPhone = '+91 81570 24638';
  const email = 'salihkm000@gmail.com';
  const automatedMessage = 'Hello Salih, I would like to know more about the KlassDesk School Management System and schedule a live demo for our school.';

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(automatedMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] font-medium border-b border-slate-800 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between flex-wrap gap-2">
        {/* Left: Direct Contacts */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <a
            href={`tel:+${phoneNumber}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Call: <strong className="text-white font-semibold">{displayPhone}</strong></span>
          </a>

          <a
            href={`mailto:${email}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3 h-3 text-indigo-400" />
            <span>Email: <strong className="text-white font-semibold">{email}</strong></span>
          </a>
        </div>

        {/* Right: Instant WhatsApp & Live Demo badge */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handleWhatsAppRedirect}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-[10px] transition-all cursor-pointer shadow-2xs"
          >
            <MessageCircle className="w-3 h-3 fill-white" />
            <span>WhatsApp Quick Connect</span>
          </button>

          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-slate-400">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Fast On-Site &amp; Zoom Demos</span>
          </span>
        </div>
      </div>
    </div>
  );
}
