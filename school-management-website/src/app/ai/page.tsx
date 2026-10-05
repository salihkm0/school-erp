'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoModal from '@/components/DemoModal';
import BrochureModal from '@/components/BrochureModal';
import { 
  Sparkles, 
  ArrowLeft, 
  Send, 
  Bot, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Bell, 
  Languages, 
  BrainCircuit, 
  GraduationCap, 
  MessageCircle,
  Copy,
  Check,
  Key,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function GoogleAiPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  // Playground state
  const [playgroundMode, setPlaygroundMode] = useState<'remarks' | 'notice' | 'admissions'>('remarks');
  const [studentName, setStudentName] = useState('Amina Rinsha');
  const [studentClass, setStudentClass] = useState('Standard 10 - A');
  const [studentMarks, setStudentMarks] = useState('English: 98 (A+), Malayalam: 94 (A+), Maths: 99 (A+), Science: 98 (A+), Social: 100 (A+)');
  
  const [noticeTopic, setNoticeTopic] = useState('Annual Day Celebrations & Inter-School Cultural Fest Schedule');
  const [noticeAudience, setNoticeAudience] = useState('All Parents & Students');

  const [questionPrompt, setQuestionPrompt] = useState('How does KlassDesk prevent teachers from invigilating their own exam subjects?');

  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const phoneNumber = '918157024638';
  const displayPhone = '+91 81570 24638';

  const handleRunAi = async () => {
    setLoading(true);
    setAiOutput(null);

    try {
      let payload: any = { mode: playgroundMode };

      if (playgroundMode === 'remarks') {
        payload.studentData = {
          name: studentName,
          class: studentClass,
          marks: { summary: studentMarks },
          attendance: '96.2%',
          percentage: '97.8%',
          rank: '1st'
        };
      } else if (playgroundMode === 'notice') {
        payload.noticeData = {
          topic: noticeTopic,
          audience: noticeAudience,
          date: new Date().toLocaleDateString('en-GB')
        };
      } else {
        payload.prompt = questionPrompt;
        payload.mode = 'chat';
      }

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setAiOutput(data.message || data.error || 'No response generated.');
    } catch (err: any) {
      setAiOutput(`⚠️ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar 
        onOpenDemoModal={() => setDemoModalOpen(true)} 
        onOpenBrochureModal={() => setBrochureModalOpen(true)} 
      />

      <main className="pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-purple-50/30 to-transparent pb-16 mb-12 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-2 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Home</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">Google AI Integration</span>
              </Link>
            </div>

            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-xs text-indigo-700 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Powered by Google Gemini 2.0 Flash • Google AI Studio</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Next-Gen <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Google AI</span> Built for Schools
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Discover how Google AI Studio &amp; Gemini 2.0 Flash transform day-to-day school administration — from auto-generating student report card appraisals to drafting bilingual English-Malayalam broadcast notices in seconds.
              </p>

              {/* Status Badge */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  COPPA &amp; FERPA Student Privacy Compliant
                </span>
                <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-indigo-600" />
                  Native Malayalam &amp; English Bilingual Support
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Interactive AI Laboratory */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Live Google Gemini AI Sandbox
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Test real AI workflows designed for Kerala Higher Secondary schools and CBSE institutions.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setPlaygroundMode('remarks')}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    playgroundMode === 'remarks' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Report Card Remarks
                </button>
                <button
                  onClick={() => setPlaygroundMode('notice')}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    playgroundMode === 'notice' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bilingual Notice
                </button>
                <button
                  onClick={() => setPlaygroundMode('admissions')}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    playgroundMode === 'admissions' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Copilot Q&amp;A
                </button>
              </div>
            </div>

            {/* Inputs & Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Configurable Inputs */}
              <div className="lg:col-span-5 space-y-4 text-xs">
                {playgroundMode === 'remarks' && (
                  <>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Class &amp; Division</label>
                      <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Marks &amp; Performance Profile</label>
                      <textarea
                        rows={3}
                        value={studentMarks}
                        onChange={(e) => setStudentMarks(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      />
                    </div>
                  </>
                )}

                {playgroundMode === 'notice' && (
                  <>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Notification Subject / Situation</label>
                      <input
                        type="text"
                        value={noticeTopic}
                        onChange={(e) => setNoticeTopic(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                      <input
                        type="text"
                        value={noticeAudience}
                        onChange={(e) => setNoticeAudience(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </>
                )}

                {playgroundMode === 'admissions' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ask Any Question to Google AI</label>
                    <textarea
                      rows={4}
                      value={questionPrompt}
                      onChange={(e) => setQuestionPrompt(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. How does KlassDesk calculate 9-point Kerala state board grading?"
                    />
                  </div>
                )}

                <button
                  onClick={handleRunAi}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-black text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Processing with Gemini 2.0...' : 'Execute with Google AI'}</span>
                </button>
              </div>

              {/* Right Column: AI Output Display */}
              <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-inner border border-slate-800 flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="font-mono text-[11px] font-bold text-indigo-300 uppercase tracking-wide">
                        Google Gemini 2.0 Output
                      </span>
                    </div>

                    {aiOutput && (
                      <button
                        onClick={handleCopy}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy Output'}</span>
                      </button>
                    )}
                  </div>

                  {loading ? (
                    <div className="py-16 text-center space-y-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                      <p className="text-xs text-slate-400 font-mono">
                        Sending payload to Google AI Studio (PPM HSS KOTTUKKARA)...
                      </p>
                    </div>
                  ) : aiOutput ? (
                    <div className="whitespace-pre-line text-xs leading-relaxed text-slate-200 font-sans">
                      {aiOutput}
                    </div>
                  ) : (
                    <div className="py-14 text-center text-slate-500 space-y-2">
                      <Bot className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="text-xs">Click &ldquo;Execute with Google AI&rdquo; to test real output from Gemini 2.0 Flash.</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Latency: ~620ms</span>
                  <span>Safety Filter: Standard Strict</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Google AI in KlassDesk */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why Schools Choose Google AI with KlassDesk
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Enterprise reliability and education-grade AI workflows built directly into the school portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">40+ Hours Saved on Report Cards</h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically drafts empathetic, encouraging pedagogical appraisals from student mark registers without repetitive generic cliches.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Native Malayalam &amp; English</h3>
              <p className="text-slate-600 leading-relaxed">
                Gemini fluently drafts authentic Malayalam circulars for parents alongside English SMS versions conforming to carrier DND limits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">At-Risk Student Identification</h3>
              <p className="text-slate-600 leading-relaxed">
                Identifies students experiencing sudden score drops or recurring absentees, alerting class teachers before terminal board exams.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Zero Public Model Training</h3>
              <p className="text-slate-600 leading-relaxed">
                Your institution&apos;s student marks, names, and contact rosters are never used by Google to train public foundation models.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 p-8 sm:p-12 text-white shadow-2xl text-center space-y-6">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Equip Your School with Google AI?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Schedule a live demonstration of our Google Gemini AI Copilot configured for your school&apos;s classes, subjects, and grading systems.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Schedule Free Live Demo
              </button>
              <a
                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello Salih, I am interested in testing Google AI features in KlassDesk.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <BrochureModal isOpen={brochureModalOpen} onClose={() => setBrochureModalOpen(false)} />
    </div>
  );
}
