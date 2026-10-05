'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoModal from '@/components/DemoModal';
import BrochureModal from '@/components/BrochureModal';
import { 
  ExamSubmissionDrawerMockup, 
  ContestantBibCardMockup, 
  ExamDashboardBrowserMockup,
  AttendanceRollCallMockup,
  SamboornaImportMockup,
  StaffSupervisionRosterMockup,
  SportsChampionshipTallyMockup,
  StaffAssignedMarkEntryMockup,
  ConsolidatedMarkListMockup,
  PdfReportsMockup,
  StaffDashboardMockup,
  ParentDashboardMockup,
  NotificationsCenterMockup,
  ClassesAndSubjectsMappingMockup,
  ExamsConfigurationMockup,
  SystemSettingsMockup
} from '@/components/screens/VisualMockups';
import { 
  Sparkles, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Trophy, 
  CalendarCheck, 
  GraduationCap, 
  Layers, 
  Maximize2,
  Lock,
  ArrowRight,
  FileText,
  Smartphone,
  Bell,
  Settings,
  BookOpen,
  Award,
  Users
} from 'lucide-react';

export default function ScreensPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  const phoneNumber = '918157024638';
  const displayPhone = '+91 81570 24638';
  const email = 'salihkm000@gmail.com';
  const defaultWhatsAppMsg = 'Hello Salih, I would like to know more about the KlassDesk School Management System and schedule a live demo for our school.';

  const handleWhatsAppRedirect = (customMsg?: string) => {
    const text = customMsg || defaultWhatsAppMsg;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const categories = [
    { id: 'all', label: 'All Screens (16 Modules)', icon: Layers },
    { id: 'staff-marks', label: 'Staff & Mark Entry', icon: GraduationCap },
    { id: 'reports', label: 'PDF Reports & Mark Lists', icon: FileText },
    { id: 'parent', label: 'Parent Portal & App', icon: Smartphone },
    { id: 'faculty', label: 'Staff Cockpit & Duties', icon: Users },
    { id: 'exams', label: 'Exams & Timetables', icon: FileSpreadsheet },
    { id: 'notifications', label: 'Notifications & SMS', icon: Bell },
    { id: 'classes-settings', label: 'Classes, Subjects & Settings', icon: Settings },
    { id: 'sports', label: 'Sports & Arts Fest', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar 
        onOpenDemoModal={() => setDemoModalOpen(true)} 
        onOpenBrochureModal={() => setBrochureModalOpen(true)} 
      />

      <main className="pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50/40 to-transparent pb-12 mb-10 border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="pt-2 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Home</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">Interactive Visual Screens</span>
              </Link>
            </div>

            {/* Headline */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-xs text-indigo-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Visual Product Tour • Authentic Live Module Previews</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Inspect Every <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 bg-clip-text text-transparent">Page &amp; Feature</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Explore real, interactive UI simulations of the KlassDesk School Operating System. 
                From staff assigned subject mark entry and vector PDF report cards to parent dashboards, automated SMS notifications, and system settings.
              </p>

              {/* Direct WhatsApp & Call Strip */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleWhatsAppRedirect()}
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp ({displayPhone})</span>
                </button>
                <a
                  href={`tel:+${phoneNumber}`}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call {displayPhone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{email}</span>
                </a>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Visual Screens Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* SCREEN 1: STAFF ASSIGNED SUBJECT MARK ENTRY */}
          {(activeCategory === 'all' || activeCategory === 'staff-marks' || activeCategory === 'faculty') && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-1">
                    <span>Core Feature: Staff Mark Entry</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Faculty Assigned Subject Mark Entry &amp; Draft/Submit Workflow
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Teachers log into their dedicated portal and only see classes and subjects officially assigned to them. 
                    Includes live Theory and Continuous Evaluation (CE) inputs, instant grade calculation, Absent (AB) tagging, and lockable submission to the Examination Controller.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppRedirect('Hello Salih, I want to see how staff can enter their assigned subject marks in KlassDesk.')}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ask About Mark Entry</span>
                </button>
              </div>

              <StaffAssignedMarkEntryMockup />
            </div>
          )}

          {/* SCREEN 2: CONSOLIDATED CLASS MARK LIST & TABULATION SHEET */}
          {(activeCategory === 'all' || activeCategory === 'staff-marks' || activeCategory === 'reports' || activeCategory === 'exams') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-1">
                    <span>Core Feature: Class Tabulation</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Consolidated Class Mark List &amp; Tabulation Register
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Multi-subject class master register consolidating all student scores into a single sheet. Automatically computes student ranks (#1 to #45), class pass percentages, distinction counts, and total aggregates with one-click Excel and PDF export.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Request Sample Register</span>
                </button>
              </div>

              <ConsolidatedMarkListMockup />
            </div>
          )}

          {/* SCREEN 3: OFFICIAL PDF REPORTS & PROGRESS REPORT CARDS */}
          {(activeCategory === 'all' || activeCategory === 'reports' || activeCategory === 'parent') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-1">
                    <span>Core Feature: Official PDF Generation</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Official Student Progress Report &amp; Term Mark Sheet (PDF)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Generate pixel-perfect, vector-sharp PDF report cards with official school crest, Kerala State Board affiliation code, subject marks, attendance rate, teacher remarks, and triple signature authentication (Class Teacher, Controller, Principal with stamp).
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppRedirect('Hello Salih, please share a sample PDF report card generated by KlassDesk.')}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Request Sample PDF</span>
                </button>
              </div>

              <PdfReportsMockup />
            </div>
          )}

          {/* SCREEN 4: PARENT DASHBOARD & STUDENT MOBILE/WEB PORTAL */}
          {(activeCategory === 'all' || activeCategory === 'parent') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-1">
                    <span>Core Feature: Parent Experience</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Parent Dashboard with Sibling Switcher &amp; Academic Dossier
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Parents can toggle between multiple enrolled siblings from one login. Provides live daily attendance tracking (96.2%), term examination scorecards, active homework deadlines, fee payment receipts, and school announcements.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Explore Parent App</span>
                </button>
              </div>

              <ParentDashboardMockup />
            </div>
          )}

          {/* SCREEN 5: FACULTY DAILY DASHBOARD & COCKPIT */}
          {(activeCategory === 'all' || activeCategory === 'faculty') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold mb-1">
                    <span>Core Feature: Faculty Operations</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Staff Daily Cockpit, Timetable Periods &amp; Quick Roll Call
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Each teacher&apos;s personal command center: today&apos;s assigned periods, 1-click morning attendance roll-call with automated SMS absence trigger, assigned subjects mark entry status, and upcoming exam invigilation duties.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>See Faculty Workflow</span>
                </button>
              </div>

              <StaffDashboardMockup />
            </div>
          )}

          {/* SCREEN 6: MULTI-CHANNEL NOTIFICATION ENGINE */}
          {(activeCategory === 'all' || activeCategory === 'notifications') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold mb-1">
                    <span>Core Feature: Instant Communication</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Unified Multi-Channel Notification Engine (SMS &amp; WhatsApp)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Dispatch carrier-grade, DND-compliant SMS alerts and official WhatsApp Business notifications. Supports dynamic tags like &#123;student_name&#125; and &#123;class&#125; for absence alerts, fee reminders, exam announcements, and rainy day holidays.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppRedirect('Hello Salih, I want to test the automated WhatsApp notification feature in KlassDesk.')}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Test Notification Flow</span>
                </button>
              </div>

              <NotificationsCenterMockup />
            </div>
          )}

          {/* SCREEN 7: CLASSES & SUBJECT-TEACHER ALLOCATION MATRIX */}
          {(activeCategory === 'all' || activeCategory === 'classes-settings' || activeCategory === 'staff-marks') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-1">
                    <span>Core Feature: Academic Architecture</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Classes &amp; Subject-Teacher Allocation Matrix
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Map teachers to specific subjects for each standard and division. Enforces strict role isolation so faculty cannot tamper with other teachers&apos; mark sheets, while maintaining statutory weekly teaching period quotas (28 hrs/week).
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-teal-600" />
                  <span>Configure Allocations</span>
                </button>
              </div>

              <ClassesAndSubjectsMappingMockup />
            </div>
          )}

          {/* SCREEN 8: EXAMS & TIMETABLES CONFIGURATION */}
          {(activeCategory === 'all' || activeCategory === 'exams' || activeCategory === 'classes-settings') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-1">
                    <span>Core Feature: Examination Management</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Institutional Exam Schedules, Theory/CE Split &amp; 9-Point Grading
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Set up examination timetables with exact dates and time slots, allocate Theory vs. Continuous Evaluation (CE) marks, define pass thresholds (35%), and configure statutory state board 9-point grading brackets (A+ to D).
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Set Up Exam Blueprint</span>
                </button>
              </div>

              <ExamsConfigurationMockup />
            </div>
          )}

          {/* SCREEN 9: INSTITUTIONAL SETTINGS & SAMBOORNA INTEGRATION */}
          {(activeCategory === 'all' || activeCategory === 'classes-settings') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold mb-1">
                    <span>Core Feature: Governance &amp; Administration</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Institutional Governance, Academic Rollover &amp; Samboorna Sync
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Manage academic year rollovers, school affiliation credentials, crest letterheads, Kerala Samboorna database synchronization, and multi-tier Role-Based Access Control (Admin, Principal, Class Teacher, Subject Teacher, Parent).
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Inspect Admin Panel</span>
                </button>
              </div>

              <SystemSettingsMockup />
            </div>
          )}

          {/* SCREEN 10: CLASS SUBJECTS SUBMISSION DRAWER (Reference 1) */}
          {(activeCategory === 'all' || activeCategory === 'exams' || activeCategory === 'staff-marks') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold mb-1">
                    <span>Feature: Dual-Tier Safeguard</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Class Subjects Submission Drawer &amp; Single-Subject Revert
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Administrators inspect subject-by-subject submission completeness (0% to 100%). 
                    If a single subject (e.g. Mathematics) needs corrections, click <strong>&ldquo;Revert to Draft&rdquo;</strong> to unlock only that subject while keeping Malayalam, English, and other submitted subjects completely untouched!
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Test Single-Subject Revert</span>
                </button>
              </div>

              <ExamSubmissionDrawerMockup />
            </div>
          )}

          {/* SCREEN 11: 60-SECOND MORNING ATTENDANCE ROLL CALL */}
          {(activeCategory === 'all' || activeCategory === 'faculty' || activeCategory === 'parent') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-1">
                    <span>Feature: Daily Operations</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    60-Second Attendance Roll Call with Automatic Parent SMS Alerts
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    All students default to &ldquo;Present&rdquo;. Teachers tap only the few absentees, and a verified SMS is automatically queued and dispatched to absent students&apos; parents.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test Attendance Speed</span>
                </button>
              </div>

              <AttendanceRollCallMockup />
            </div>
          )}

          {/* SCREEN 12: CONTESTANT BIB CARDS GENERATOR */}
          {(activeCategory === 'all' || activeCategory === 'sports' || activeCategory === 'reports') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-1">
                    <span>Feature: Sports &amp; Arts Fest</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Chest Number Bib Card Generator with Scannable QR Codes
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Generate printable chest bibs for 1,000+ competitors with 4-digit numbers, student name, house color, and scannable verification barcodes.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-blue-600" />
                  <span>Generate Sample Bib</span>
                </button>
              </div>

              <ContestantBibCardMockup />
            </div>
          )}

          {/* SCREEN 13: SAMBOORNA CSV PARSER */}
          {(activeCategory === 'all' || activeCategory === 'classes-settings') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-1">
                    <span>Feature: Government Data Portability</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Instant Kerala Samboorna CSV Importer with Duplicate Detection
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Import 3,000+ student rosters from Kerala Samboorna CSV in under 4 seconds with automatic column mapping, duplicate admission validation, and caste/religion classification.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Test CSV Import</span>
                </button>
              </div>

              <SamboornaImportMockup />
            </div>
          )}

          {/* SCREEN 14: FACULTY SUPERVISION ROSTER */}
          {(activeCategory === 'all' || activeCategory === 'faculty') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold mb-1">
                    <span>Feature: Supervision Automation</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Staff Timetable Initials &amp; Conflict-Free Exam Supervision
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Unique 3-letter timetable initials for 120+ faculty members. Our intelligent exam duty engine prevents teachers from invigilating their own exam subjects, ensuring strict academic integrity.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Test Staff Duties</span>
                </button>
              </div>

              <StaffSupervisionRosterMockup />
            </div>
          )}

          {/* SCREEN 15: LIVE SPORTS & ARTS POINTS TALLY */}
          {(activeCategory === 'all' || activeCategory === 'sports') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-1">
                    <span>Feature: Inter-House Championship</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Annual Kalolsavam &amp; Sports Live Championship Scoreboard
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Real-time inter-house scoreboards with instant medal counts (Gold, Silver, Bronze), automated event scoring, and student certificate generator.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-rose-600" />
                  <span>Test Points Tally</span>
                </button>
              </div>

              <SportsChampionshipTallyMockup />
            </div>
          )}

          {/* SCREEN 16: FULL BROWSER EXAM DASHBOARD */}
          {(activeCategory === 'all' || activeCategory === 'exams') && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-1">
                    <span>Feature: Executive Dashboard</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Complete Examination Control Center &amp; Status Browser
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    High-level view of all active classes, marks entry status across 14 divisions, pass rates, and teacher submission timetables in a single desktop cockpit.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open Full Dashboard</span>
                </button>
              </div>

              <ExamDashboardBrowserMockup />
            </div>
          )}

        </div>

        {/* Direct Contact & Live Demo CTA Section */}
        <section className="mt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/15 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Personalized On-Site or Zoom Walkthrough</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                Want to See KlassDesk Running with Your School&apos;s Classes?
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect directly with Salih K M. We will set up a sample sandbox loaded with your school&apos;s divisions, subjects, and grading schemes within 45 minutes.
              </p>

              {/* Direct Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <button
                  onClick={() => handleWhatsAppRedirect()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp ({displayPhone})</span>
                </button>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Schedule Free Live Demo</span>
                </button>

                <a
                  href={`tel:+${phoneNumber}`}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call {displayPhone}</span>
                </a>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                Direct Email: <a href={`mailto:${email}`} className="text-indigo-300 underline font-semibold">{email}</a> • Headquarters: Kozhikode &amp; Malappuram, Kerala
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <BrochureModal isOpen={brochureModalOpen} onClose={() => setBrochureModalOpen(false)} />
    </div>
  );
}
