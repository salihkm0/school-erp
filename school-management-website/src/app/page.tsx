'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoreModulesGrid from '@/components/CoreModulesGrid';
import EventsShowcase from '@/components/EventsShowcase';
import TimetableShowcase from '@/components/TimetableShowcase';
import FeatureExplorer from '@/components/FeatureExplorer';
import DeepDiveFeatures from '@/components/DeepDiveFeatures';
import RoiCalculator from '@/components/RoiCalculator';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import DemoModal from '@/components/DemoModal';
import BrochureModal from '@/components/BrochureModal';
import Footer from '@/components/Footer';
import { Sparkles, PhoneCall, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  const openDemoModal = () => setDemoModalOpen(true);
  const closeDemoModal = () => setDemoModalOpen(false);

  const openBrochureModal = () => setBrochureModalOpen(true);
  const closeBrochureModal = () => setBrochureModalOpen(false);

  return (
    <main className="min-h-screen bg-white text-slate-900 relative">
      {/* Navigation */}
      <Navbar 
        onOpenDemoModal={openDemoModal} 
        onOpenBrochureModal={openBrochureModal}
      />

      {/* Hero Section */}
      <Hero 
        onOpenDemoModal={openDemoModal} 
        onOpenBrochureModal={openBrochureModal}
      />

      {/* 9 Core Campus Modules (matching the clean grid from Image 1) */}
      <CoreModulesGrid onOpenDemoModal={openDemoModal} />

      {/* Flagship New Section: Annual Sports Meet & Arts Fest (Kalolsavam) */}
      <EventsShowcase onOpenDemoModal={openDemoModal} />

      {/* Flagship New Section: Institutional Timetable & Clash Engine */}
      <TimetableShowcase onOpenDemoModal={openDemoModal} />

      {/* Interactive Academic & Examination Deep Dive */}
      <FeatureExplorer />

      {/* All Comprehensive Institutional Features */}
      <DeepDiveFeatures onOpenDemoModal={openDemoModal} />

      {/* Interactive ROI & Savings Calculator */}
      <RoiCalculator onOpenDemoModal={openDemoModal} />

      {/* Social Proof & Testimonials */}
      <Testimonials />

      {/* Pricing & Enrollment Plans */}
      <PricingSection onOpenDemoModal={openDemoModal} />

      {/* FAQ Accordion with Schema Markup */}
      <FaqSection onOpenDemoModal={openDemoModal} />

      {/* High-Converting Pre-Footer Banner */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/40 to-slate-50 relative border-t border-slate-200 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Risk-Free 30-Day Evaluation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ready to Transform Your School&apos;s Academic &amp; Administrative Workflow?
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Join forward-thinking schools that have simplified exam seasons, delighted parents with instant SMS alerts, streamlined sports &amp; arts fests, and cut teacher paperwork by 90%.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={openDemoModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Book Your Free Live Demo Today</span>
            </button>
            <button
              onClick={openBrochureModal}
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Download Product Brochure</span>
            </button>
            <a
              href="tel:+919847123456"
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>+91 98471 23456</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Free 45-minute on-site or Zoom demo
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Full test account with sample classes &amp; fests
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Zero long-term contract lock-in
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Interactive Demo Request Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={closeDemoModal} />

      {/* Official Brochure Download Modal */}
      <BrochureModal isOpen={brochureModalOpen} onClose={closeBrochureModal} />
    </main>
  );
}
