'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoModal from '@/components/DemoModal';
import BrochureModal from '@/components/BrochureModal';
import { GALLERY_ITEMS, GalleryItem } from '@/data/galleryData';
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Users,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  CalendarCheck,
  ShieldCheck,
  Smartphone,
  Search,
  Lock,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  Columns3
} from 'lucide-react';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; badgeBg: string }> = {
  students: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badgeBg: 'bg-emerald-600' },
  staff: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badgeBg: 'bg-blue-600' },
  exams: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badgeBg: 'bg-indigo-600' },
  reports: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', badgeBg: 'bg-sky-600' },
  attendance: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badgeBg: 'bg-amber-600' },
  administration: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badgeBg: 'bg-purple-600' },
  mobile: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badgeBg: 'bg-rose-600' }
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeImage) return;
      if (e.key === 'Escape') setActiveImage(null);
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const categories = [
    { id: 'all', label: 'All Modules', count: GALLERY_ITEMS.length, icon: Layers },
    { id: 'students', label: 'Students & Admissions', count: GALLERY_ITEMS.filter(i => i.category === 'students').length, icon: Users },
    { id: 'staff', label: 'Faculty & Staff', count: GALLERY_ITEMS.filter(i => i.category === 'staff').length, icon: GraduationCap },
    { id: 'exams', label: 'Exams & Marks', count: GALLERY_ITEMS.filter(i => i.category === 'exams').length, icon: FileSpreadsheet },
    { id: 'reports', label: 'Report Cards & Registers', count: GALLERY_ITEMS.filter(i => i.category === 'reports').length, icon: FileText },
    { id: 'attendance', label: 'Attendance & Analytics', count: GALLERY_ITEMS.filter(i => i.category === 'attendance').length, icon: CalendarCheck },
    { id: 'administration', label: 'Admin & Security', count: GALLERY_ITEMS.filter(i => i.category === 'administration').length, icon: ShieldCheck },
    { id: 'mobile', label: 'Mobile App', count: GALLERY_ITEMS.filter(i => i.category === 'mobile').length, icon: Smartphone },
  ];

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.route.toLowerCase().includes(q) ||
        item.highlights.some(h => h.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleNextImage = () => {
    if (!activeImage) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === activeImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveImage(filteredItems[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!activeImage) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === activeImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveImage(filteredItems[prevIndex]);
  };

  const activeIndex = activeImage ? filteredItems.findIndex(i => i.id === activeImage.id) : -1;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar 
        onOpenDemoModal={() => setDemoModalOpen(true)}
        onOpenBrochureModal={() => setBrochureModalOpen(true)}
      />

      <main className="pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50/40 to-transparent pb-10 mb-8 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="pt-4 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Home Overview</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">Visual Gallery</span>
              </Link>
            </div>

            {/* Title & Headline */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-sm text-indigo-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Real System Tour • {GALLERY_ITEMS.length} Live Production Screens</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                KlassDesk <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 bg-clip-text text-transparent">Visual Gallery</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Explore authentic high-resolution screenshots from our operational ERP. Inspect student 360° dossiers, printable board-compliant report cards, Kerala Samboorna imports, marks ledgers, and attendance analytics.
              </p>
            </div>

            {/* Search & Control Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-sm rounded-2xl bg-white border border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                <Search className="w-4 h-4 text-slate-400 ml-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages (e.g. Samboorna, Student Dossier, Marks, Attendance, Report Card)..."
                  className="w-full py-3.5 pl-3 pr-10 text-xs sm:text-sm bg-transparent text-slate-800 placeholder:text-slate-400 outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mr-3 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active search filter notice */}
            {searchQuery && (
              <div className="mt-3 text-center text-xs text-slate-500">
                Found <strong>{filteredItems.length}</strong> matching screen{filteredItems.length === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-indigo-600 hover:underline font-semibold"
                >
                  Clear filter
                </button>
              </div>
            )}
            {/* Interactive Live Simulators Callout Banner */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                    <span>Explore 16 Interactive Live UI Simulators</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">Live Now</span>
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5 max-w-xl">
                    Test live module mockups: Staff Assigned Subject Mark Entry, Printable Vector PDF Report Cards, Parent Portal with Attendance, Timetables, and SMS Alerts.
                  </p>
                </div>
              </div>
              <Link
                href="/screens"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2 group"
              >
                <span>Launch Interactive Screens</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row with View Controls */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/70">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
              <span>Showing {filteredItems.length} Screen{filteredItems.length === 1 ? '' : 's'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold">100% Authentic School UI</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-indigo-600 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Showcase Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Showcase</span>
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'detailed' 
                    ? 'bg-white text-indigo-600 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Detailed Overview"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Detailed</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching screens found</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Try searching for broader terms like &ldquo;Student&rdquo;, &ldquo;Marks&rdquo;, &ldquo;Exam&rdquo;, or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Grid View Mode */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => {
                const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.students;
                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/8 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Realistic macOS Web Frame */}
                      <div className="px-3.5 py-2 bg-slate-100/90 border-b border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200/70 text-[10px] font-mono text-slate-500 max-w-[170px] truncate">
                          <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.route}</span>
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${style.bg} ${style.text} border ${style.border}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Screenshot Container with Interactive Zoom Overlay */}
                      <div 
                        onClick={() => setActiveImage(item)}
                        className="relative h-56 sm:h-64 bg-slate-100/70 cursor-zoom-in overflow-hidden group/img flex items-center justify-center p-2"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain object-top p-1 transition-transform duration-500 group-hover/img:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-950/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                          <div className="px-3.5 py-2 rounded-xl bg-white/95 text-slate-900 font-bold text-xs shadow-xl flex items-center gap-2 transform translate-y-1 group-hover/img:translate-y-0 transition-transform">
                            <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="p-5 space-y-2.5">
                        <h3 
                          onClick={() => setActiveImage(item)}
                          className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Top 2 Highlights as Badges */}
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {item.highlights.slice(0, 2).map((h, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-700 font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[200px]">{h}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setActiveImage(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Details</span>
                      </button>
                      <button
                        onClick={() => setDemoModalOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <span>Demo</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Detailed Row View Mode */
            <div className="space-y-6">
              {filteredItems.map((item) => {
                const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.students;
                return (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group"
                  >
                    {/* Left: Preview with Frame */}
                    <div className="lg:col-span-6 bg-slate-100/70 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
                      <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="ml-2 text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                            {item.route}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${style.bg} ${style.text} border ${style.border}`}>
                          {item.badge}
                        </span>
                      </div>
                      <div 
                        onClick={() => setActiveImage(item)}
                        className="relative aspect-[16/10] bg-slate-100/50 cursor-zoom-in overflow-hidden group/img flex items-center justify-center p-3"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-2 transition-transform duration-500 group-hover/img:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                          <div className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg flex items-center gap-2">
                            <Maximize2 className="w-4 h-4 text-indigo-600" />
                            <span>Click to Zoom Fullscreen</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Content & Bullet Features */}
                    <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
                            {item.category.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ID: #{item.id}
                          </span>
                        </div>

                        <h3 
                          onClick={() => setActiveImage(item)}
                          className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.summary}
                        </p>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                            Key Administrative Features:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.highlights.map((h, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setActiveImage(item)}
                          className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors cursor-pointer"
                        >
                          Inspect Screenshot
                        </button>
                        <button
                          onClick={() => setDemoModalOpen(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                        >
                          <span>Schedule Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Call to Action Card */}
          <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 shadow-2xl p-8 sm:p-14 text-center border border-indigo-500/30">
            {/* Ambient Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold border border-indigo-400/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Zero Commitment • Tailored To Your School Standards</span>
              </span>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Want to Experience These Screens with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-white">Your School Data?</span>
              </h2>
              
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
                We provide a guided 40-minute live demonstration customized to your school&apos;s exact grading scheme, Kerala Samboorna roll numbers, and examination schedule.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-indigo-950 bg-white hover:bg-indigo-50 shadow-lg shadow-white/10 transition-all cursor-pointer"
                >
                  Schedule Free 1-on-1 School Demo
                </button>
                <button
                  onClick={() => setBrochureModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer"
                >
                  Download Brochure (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-fadeIn overflow-hidden"
          onClick={() => setActiveImage(null)}
        >
          {/* Lightbox Floating Header */}
          <div 
            className="w-full px-4 sm:px-8 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white">
                {activeImage.badge}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-sm sm:max-w-xl">
                  {activeImage.title}
                </h3>
                <span className="text-[11px] font-mono text-indigo-300">
                  manage.ppmhsskottukkara.com{activeImage.route}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400 font-mono mr-2">
                {activeIndex + 1} / {filteredItems.length}
              </span>
              <button
                onClick={handlePrevImage}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Previous image (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Next image (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImage(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
                title="Close viewer (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Scrollable Image Canvas */}
          <div 
            className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center"
            onClick={() => setActiveImage(null)}
          >
            <div 
              className="relative max-w-5xl w-full my-auto rounded-2xl bg-white/5 border border-white/10 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full min-h-[60vh] max-h-[82vh] flex items-center justify-center">
                <img
                  src={activeImage.image}
                  alt={activeImage.title}
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Lightbox Bottom Metadata Bar */}
          <div 
            className="px-4 sm:px-8 py-3 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl truncate">
              <strong className="text-white">{activeImage.title}:</strong> {activeImage.summary}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveImage(null);
                  setDemoModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer transition-all"
              >
                Request Live Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <BrochureModal isOpen={brochureModalOpen} onClose={() => setBrochureModalOpen(false)} />
    </div>
  );
}
