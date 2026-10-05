'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Sparkles, School, Mail, Phone, User, Calendar } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    schoolName: '',
    email: '',
    phone: '',
    role: 'Principal / Head of School',
    studentCount: '500 - 1500 Students',
    preferredDate: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResponse, setSuccessResponse] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setSuccessResponse(data.message || 'Demo request submitted successfully.');
      } else {
        setErrorMessage(data.message || 'Could not submit your request. Please check details.');
      }
    } catch {
      setErrorMessage('Network error. Please try again or reach us via phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl shadow-slate-900/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Demo Scheduled Successfully!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {successResponse}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                Back to Website
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Software Walkthrough</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Schedule a 1-on-1 Live School Demo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
              See continuous evaluation marksheets, automated board-compliant PDF report cards, and parent SMS roll calls tailored to your school.
            </p>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. K. Narayanan"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-indigo-600" />
                    <span>School / Institution Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PPM Higher Secondary School"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Official Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="principal@school.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>WhatsApp / Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98471 23456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Your Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  >
                    <option value="Principal / Head of School">Principal / Head of School</option>
                    <option value="Vice Principal / Academic Dean">Vice Principal / Academic Dean</option>
                    <option value="School Management Committee / Trust">School Management Committee / Trust</option>
                    <option value="Examination Controller">Examination Controller</option>
                    <option value="Senior Faculty / IT Coordinator">Senior Faculty / IT Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Total Student Strength</label>
                  <select
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  >
                    <option value="Under 500 Students">Under 500 Students</option>
                    <option value="500 - 1500 Students">500 - 1500 Students</option>
                    <option value="1500 - 3000 Students">1500 - 3000 Students</option>
                    <option value="3000+ Students (Large/Chain)">3000+ Students (Large/Chain)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preferred Demo Date / Timing (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tomorrow afternoon at 2:30 PM"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling Your Session...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Demo Request &amp; Get Free Pilot</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-500 mt-2">
                🔒 We respect your school&apos;s privacy. No spam. Instant confirmation via WhatsApp &amp; Email.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
