'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoModal from '@/components/DemoModal';
import BrochureModal from '@/components/BrochureModal';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Building2,
  Calendar,
  Users
} from 'lucide-react';

export default function ContactPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const phoneNumber = '918157024638';
  const displayPhone = '+91 81570 24638';
  const email = 'salihkm000@gmail.com';
  const defaultWhatsAppMsg = 'Hello Salih, I would like to know more about the KlassDesk School Management System and schedule a live demo for our school.';

  const handleWhatsAppRedirect = (customMsg?: string) => {
    const text = customMsg || defaultWhatsAppMsg;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const [formData, setFormData] = useState({
    fullName: '',
    schoolName: '',
    email: '',
    phone: '',
    role: 'Principal / Management',
    studentCount: '500 - 1500 Students',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        alert('Thank you! Your demo inquiry has been noted. You can also chat directly with Salih on WhatsApp.');
        setSubmitSuccess(true);
      }
    } catch {
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar 
        onOpenDemoModal={() => setDemoModalOpen(true)} 
        onOpenBrochureModal={() => setBrochureModalOpen(true)} 
      />

      <main className="pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Support &amp; Onboarding Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Get in Touch with Our Team
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Have questions about exam tabulation, sports meet chest numbers, or report cards? 
              Connect directly with Salih K M for an immediate live demo or consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Contact Details & WhatsApp Banner */}
            <div className="lg:col-span-5 space-y-6">
              {/* WhatsApp Highlight Box */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 sm:p-7 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs">
                      <MessageCircle className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">
                        Instant WhatsApp Response
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white">
                        Chat Directly with Salih
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Click below to open WhatsApp with a pre-filled demo request message. We usually respond within minutes.
                  </p>

                  <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-500/40 text-xs text-emerald-50 italic">
                    &ldquo;{defaultWhatsAppMsg}&rdquo;
                  </div>

                  <button
                    onClick={() => handleWhatsAppRedirect()}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-700" />
                    <span>Open WhatsApp Now ({displayPhone})</span>
                  </button>
                </div>
              </div>

              {/* Direct Info Cards */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-lg shadow-slate-200/50 space-y-5">
                <h3 className="font-extrabold text-slate-900 text-base">Direct Channels</h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Phone */}
                  <a
                    href={`tel:+${phoneNumber}`}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Direct Call / Mobile</span>
                      <strong className="text-slate-900 text-sm font-extrabold group-hover:text-emerald-700 transition-colors">
                        {displayPhone}
                      </strong>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Mon - Sat, 08:30 AM - 07:00 PM IST</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Official Inquiries</span>
                      <strong className="text-slate-900 text-sm font-extrabold group-hover:text-indigo-700 transition-colors truncate block">
                        {email}
                      </strong>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Replies within 2 hours guaranteed</span>
                    </div>
                  </a>

                  {/* Office Location */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Headquarters &amp; Engineering</span>
                      <strong className="text-slate-900 text-sm font-extrabold">Kozhikode &amp; Malappuram</strong>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Kerala, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Demo Scheduling Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
                {submitSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Inquiry Received!
                    </h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Thank you for contacting KlassDesk. Salih K M will reach out to you shortly via phone/email, or you can start a WhatsApp conversation right now.
                    </p>
                    <button
                      onClick={() => handleWhatsAppRedirect()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Chat on WhatsApp Now</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="border-b border-slate-200 pb-4 mb-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        Schedule a Personalized School Demo
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Fill out this quick form or connect via WhatsApp for an immediate consultation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Dr. K. Narayanan"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
                        />
                      </div>

                      {/* School Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          School / Institution Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.schoolName}
                          onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                          placeholder="e.g. PPM Higher Secondary School"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98471 23456"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Official Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. principal@ppmhss.edu"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Role */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your Role in School
                        </label>
                        <select
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white cursor-pointer"
                        >
                          <option>Principal / Headmaster</option>
                          <option>School Management / Trustee</option>
                          <option>Exam Superintendent / Controller</option>
                          <option>IT Coordinator / Teacher</option>
                          <option>Sports &amp; Arts Convener</option>
                        </select>
                      </div>

                      {/* Student Count */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Total Student Strength
                        </label>
                        <select
                          value={formData.studentCount}
                          onChange={e => setFormData({ ...formData, studentCount: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white cursor-pointer"
                        >
                          <option>Under 500 Students</option>
                          <option>500 - 1,500 Students</option>
                          <option>1,500 - 3,000 Students</option>
                          <option>3,000+ Students (Campus)</option>
                        </select>
                      </div>
                    </div>

                    {/* Specific Requirements / Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Specific Requirements (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Tell us what modules you are most interested in (e.g. CE Mark Entry, Sports Meet Chest Numbers, WhatsApp Absentee SMS, Board Report Cards)..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Demo Request</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <BrochureModal isOpen={brochureModalOpen} onClose={() => setBrochureModalOpen(false)} />
    </div>
  );
}
