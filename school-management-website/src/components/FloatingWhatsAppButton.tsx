'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function FloatingWhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '918157024638';
  const displayPhone = '+91 81570 24638';
  const defaultMsg = 'Hello Salih, I would like to know more about the KlassDesk School Management System and schedule a live demo for our school.';
  const [userMsg, setUserMsg] = useState(defaultMsg);

  const handleSend = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(userMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* WhatsApp Mini Popup Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
                  SK
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white absolute bottom-0 right-0" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white leading-tight">Salih K M</h4>
                <p className="text-[11px] text-emerald-100">KlassDesk Product Lead • Typically replies in 5m</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-2xs text-slate-700 leading-relaxed">
              Hello! 👋 Welcome to KlassDesk. How can we help your school today? You can send a direct WhatsApp message to <strong className="text-slate-900">{displayPhone}</strong>.
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Your Message:
              </label>
              <textarea
                rows={3}
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Conversation</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300 cursor-pointer active:scale-95"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white stroke-[2]" />
        <span className="font-bold text-xs sm:text-sm tracking-tight hidden sm:inline">
          Chat with Salih
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
        <span className="w-2.5 h-2.5 rounded-full bg-white absolute -top-0.5 -right-0.5" />
      </button>
    </div>
  );
}
