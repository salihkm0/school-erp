'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Phone, Mail } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = '918157024638';
  const displayPhone = '+91 81570 24638';
  const email = 'salihkm000@gmail.com';
  const defaultMessage = 'Hello Salih, I would like to know more about the KlassDesk School Management System and schedule a live demo for our school.';

  const handleWhatsAppRedirect = (customText?: string) => {
    const textToSend = customText || defaultMessage;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/20 overflow-hidden animate-fadeIn text-slate-900">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
              aria-label="Close WhatsApp card"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-700" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>Chat with Salih K M</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Typically replies within a few minutes</span>
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <p className="text-slate-600 leading-relaxed">
                👋 <strong>Hello!</strong> Have questions about our <strong>CE Exam Engine</strong>, <strong>Report Cards</strong>, or <strong>Annual Sports &amp; Arts Fest</strong>?
              </p>
              <p className="text-slate-500 text-[11px]">
                Click below to open WhatsApp with a pre-filled demo request message.
              </p>
            </div>

            {/* Pre-written message preview */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-slate-700 text-[11px] italic">
              &ldquo;{defaultMessage}&rdquo;
            </div>

            {/* Direct Action Button */}
            <button
              onClick={() => handleWhatsAppRedirect()}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message on WhatsApp</span>
            </button>

            {/* Secondary Direct Contact */}
            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
              <a
                href={`tel:+${phoneNumber}`}
                className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{displayPhone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium truncate max-w-[170px]"
                title={email}
              >
                <Mail className="w-3 h-3 text-indigo-600 shrink-0" />
                <span className="truncate">{email}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill / Trigger Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-xs font-bold shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Chat with us on WhatsApp</span>
          </button>
        )}

        <button
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              setIsOpen(true);
            }
          }}
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open WhatsApp Chat"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          <MessageCircle className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
