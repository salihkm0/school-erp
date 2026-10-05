import React from 'react';
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Klass<span className="text-indigo-600">Desk</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase -mt-0.5">
                  Academic Operating System
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              The modern cloud platform purpose-built for Indian schools. Seamlessly unifying Continuous Evaluation (CE) exams, 
              automated Kerala &amp; CBSE compliant PDF report cards, instant parent SMS roll calls, and staff duty management.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Cloud</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium shadow-2xs">
                <span>99.99% Uptime SLA</span>
              </span>
            </div>
          </div>

          {/* Col 2: Academic Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Academic Engine
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#exams" className="hover:text-indigo-600 transition-colors">CE + Theory Exam Grading</a></li>
              <li><a href="#exams" className="hover:text-indigo-600 transition-colors">Single Subject Revert to Draft</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">PDF Report Card Generator</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">State &amp; CBSE Grading Schemes</a></li>
              <li><a href="#exams" className="hover:text-indigo-600 transition-colors">Missing Marks Audit Check</a></li>
              <li><a href="#exams" className="hover:text-indigo-600 transition-colors">Class Rank &amp; GPA Calculation</a></li>
            </ul>
          </div>

          {/* Col 3: Operations & Admin */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Explore &amp; UI Tour
            </h4>
            <ul className="space-y-2.5">
              <li><a href="/screens" className="hover:text-indigo-600 transition-colors font-bold text-indigo-700">✨ Visual UI Screens &amp; Mockups</a></li>
              <li><a href="/gallery" className="hover:text-indigo-600 transition-colors font-semibold text-slate-700">📸 23-Screen Photo Gallery</a></li>
              <li><a href="/contact" className="hover:text-indigo-600 transition-colors font-semibold text-emerald-700">💬 Contact Salih &amp; WhatsApp</a></li>
              <li><a href="/#events-sports" className="hover:text-indigo-600 transition-colors font-semibold text-rose-600">Sports Meet &amp; Kalolsavam (Bibs)</a></li>
              <li><a href="/#events-sports" className="hover:text-indigo-600 transition-colors">House Division &amp; Chest # Generator</a></li>
              <li><a href="/#features" className="hover:text-indigo-600 transition-colors">Smart Parent SMS Attendance</a></li>
              <li><a href="/#features" className="hover:text-indigo-600 transition-colors">Exam Hall Supervision Planner</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Direct Contact &amp; Demos
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+918157024638" className="text-slate-900 font-extrabold hover:text-emerald-700 block transition-colors">
                    +91 81570 24638
                  </a>
                  <span className="text-[11px] text-slate-500">Call or WhatsApp (Salih K M)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:salihkm000@gmail.com" className="text-slate-800 font-semibold hover:text-indigo-600 transition-colors block">
                    salihkm000@gmail.com
                  </a>
                  <span className="text-[11px] text-slate-500">Official Product Inquiries</span>
                </div>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/918157024638?text=Hello%20Salih%2C%20I%20would%20like%20to%20know%20more%20about%20the%20KlassDesk%20School%20Management%20System%20and%20schedule%20a%20live%20demo%20for%20our%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold shadow-xs transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-500 text-[11px]">Kozhikode &amp; Malappuram, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} KlassDesk Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Security Architecture</a>
            <span className="flex items-center gap-1 text-slate-600">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for educators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
