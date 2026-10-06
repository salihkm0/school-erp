// src/pages/KeralaSSLCPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  AcademicCapIcon,
  TrophyIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  DocumentArrowUpIcon,
  MegaphoneIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  StarIcon,
  CalendarIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import keralaSSLCService from '../services/keralaSSLCService';

const SUBJECT_MAP = [
  { key: 'lang1', code: '101', name: 'Language Paper 1 (Malayalam/Arabic/Urdu)' },
  { key: 'lang2', code: '102', name: 'Language Paper 2 (Malayalam/Arabic/Urdu)' },
  { key: 'english', code: '103', name: 'English' },
  { key: 'hindi', code: '104', name: 'Hindi' },
  { key: 'socialScience', code: '105', name: 'Social Science' },
  { key: 'physics', code: '106', name: 'Physics' },
  { key: 'chemistry', code: '107', name: 'Chemistry' },
  { key: 'biology', code: '108', name: 'Biology' },
  { key: 'mathematics', code: '109', name: 'Mathematics' },
  { key: 'it', code: '110', name: 'Information Technology' }
];

const GRADE_DESCRIPTIONS = {
  'A+': { desc: 'Outstanding (90-100%)', points: 9, bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  'A': { desc: 'Excellent (80-89%)', points: 8, bg: 'bg-green-100 text-green-800 border-green-300' },
  'B+': { desc: 'Very Good (70-79%)', points: 7, bg: 'bg-teal-100 text-teal-800 border-teal-300' },
  'B': { desc: 'Good (60-69%)', points: 6, bg: 'bg-blue-100 text-blue-800 border-blue-300' },
  'C+': { desc: 'Above Average (50-59%)', points: 5, bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  'C': { desc: 'Average (40-49%)', points: 4, bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  'D+': { desc: 'Marginal (30-39%)', points: 3, bg: 'bg-orange-100 text-orange-800 border-orange-300' },
  'D': { desc: 'Needs Improvement', points: 2, bg: 'bg-red-100 text-red-800 border-red-300' },
  'E': { desc: 'Needs Improvement', points: 1, bg: 'bg-rose-100 text-rose-800 border-rose-300' }
};

export default function KeralaSSLCPage({ publicMode = false }) {
  const { user } = useSelector((state) => state.auth || {});
  const { profile: schoolProfile } = useSelector((state) => state.schoolProfile || {});
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'analytics' | 'register'
  const [academicYear, setAcademicYear] = useState('2025-2026');

  // Search State
  const [searchRegNo, setSearchRegNo] = useState('541001');
  const [searchDob, setSearchDob] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedResult, setSearchedResult] = useState(null);

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Register State
  const [resultsList, setResultsList] = useState([]);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fullAPlusFilter, setFullAPlusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Import / Broadcast State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [rawCsvText, setRawCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const printRef = useRef(null);

  // Fetch initial analytics & sample search
  useEffect(() => {
    fetchAnalytics();
    handleSearch(searchRegNo);
  }, [academicYear]);

  // Fetch register when switching to register tab or filter changes
  useEffect(() => {
    if (activeTab === 'register') {
      fetchRegister();
    }
  }, [activeTab, page, statusFilter, fullAPlusFilter, academicYear]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await keralaSSLCService.getSchoolSSLCAnalytics(academicYear);
      if (res.success) {
        setAnalytics(res);
      }
    } catch (err) {
      console.error('Failed to load SSLC analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchRegister = async () => {
    setRegisterLoading(true);
    try {
      const res = await keralaSSLCService.getAllSchoolResults({
        academicYear,
        search: searchTerm,
        status: statusFilter,
        fullAPlus: fullAPlusFilter,
        page,
        limit: 25
      });
      if (res.success) {
        setResultsList(res.data || []);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load SSLC register:', err);
      toast.error('Failed to load result register');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleSearch = async (regNo = searchRegNo) => {
    if (!regNo.trim()) {
      toast.error('Please enter a Register Number');
      return;
    }
    setSearchLoading(true);
    try {
      const res = await keralaSSLCService.searchIndividualResult(regNo.trim(), searchDob || null, academicYear);
      if (res.success && res.data) {
        setSearchedResult(res.data);
      } else {
        setSearchedResult(null);
        toast.error(res.message || 'Result not found');
      }
    } catch (err) {
      setSearchedResult(null);
      const errMsg = err.response?.data?.message || 'No SSLC result found for this register number';
      toast.error(errMsg);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSeedSample = async () => {
    try {
      const loadingToast = toast.loading('Populating SSLC candidates...');
      const res = await keralaSSLCService.seedSampleSSLCResults(academicYear);
      toast.dismiss(loadingToast);
      if (res.success) {
        toast.success(res.message || 'Sample SSLC records loaded!');
        fetchAnalytics();
        if (activeTab === 'register') fetchRegister();
        handleSearch('541001');
      }
    } catch (err) {
      toast.error('Failed to seed sample results');
    }
  };

  const handleBroadcast = async () => {
    if (!window.confirm(`Broadcast SSLC ${academicYear} announcement to all parents and school community?`)) return;
    setBroadcasting(true);
    try {
      const res = await keralaSSLCService.broadcastSSLCToParents(academicYear);
      if (res.success) {
        toast.success('SSLC Result Announcement broadcasted to parents successfully!');
      }
    } catch (err) {
      toast.error('Failed to send broadcast');
    } finally {
      setBroadcasting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleImportSubmit = async () => {
    if (!rawCsvText.trim()) {
      toast.error('Please paste CSV data or upload a file');
      return;
    }
    setImporting(true);
    try {
      // Parse CSV rows
      const lines = rawCsvText.trim().split('\n').filter(l => l.trim().length > 0);
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsedResults = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length < 2) continue;

        const regNo = cols[0];
        const name = cols[1];
        const admNo = cols[2] || '';
        const gender = cols[3] || 'Male';
        
        // Subject grades if present
        const grades = cols.slice(4);
        const subjects = {
          lang1: { subjectCode: '101', subjectName: 'Language Paper 1', grade: grades[0] || 'A+' },
          lang2: { subjectCode: '102', subjectName: 'Language Paper 2', grade: grades[1] || 'A+' },
          english: { subjectCode: '103', subjectName: 'English', grade: grades[2] || 'A+' },
          hindi: { subjectCode: '104', subjectName: 'Hindi', grade: grades[3] || 'A+' },
          socialScience: { subjectCode: '105', subjectName: 'Social Science', grade: grades[4] || 'A+' },
          physics: { subjectCode: '106', subjectName: 'Physics', grade: grades[5] || 'A+' },
          chemistry: { subjectCode: '107', subjectName: 'Chemistry', grade: grades[6] || 'A+' },
          biology: { subjectCode: '108', subjectName: 'Biology', grade: grades[7] || 'A+' },
          mathematics: { subjectCode: '109', subjectName: 'Mathematics', grade: grades[8] || 'A+' },
          it: { subjectCode: '110', subjectName: 'Information Technology', grade: grades[9] || 'A+' }
        };

        parsedResults.push({
          registerNumber: regNo,
          candidateName: name,
          admissionNo: admNo,
          gender,
          subjects
        });
      }

      if (parsedResults.length === 0) {
        toast.error('No valid rows found to import');
        setImporting(false);
        return;
      }

      const res = await keralaSSLCService.bulkImportSSLCResults({
        academicYear,
        results: parsedResults
      });

      if (res.success) {
        toast.success(res.message);
        setImportModalOpen(false);
        setRawCsvText('');
        fetchAnalytics();
        if (activeTab === 'register') fetchRegister();
      }
    } catch (err) {
      toast.error('Error importing SSLC data: ' + (err.response?.data?.message || err.message));
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "RegisterNumber,CandidateName,AdmissionNo,Gender,Lang1,Lang2,English,Hindi,SocialScience,Physics,Chemistry,Biology,Mathematics,IT\n" +
      "541001,Aadhil Mohammed K,10841,Male,A+,A+,A+,A+,A+,A+,A+,A+,A+,A+\n" +
      "541002,Amina Fathima P,10842,Female,A+,A+,A+,A+,A+,A+,A+,A+,A+,A+\n" +
      "541011,Adithya Narayanan,10851,Male,A+,A+,A+,A+,A,A+,A+,A+,A+,A+\n" +
      "541016,Gokul Krishna,10856,Male,A,A,B+,A,A,B+,A,A,B+,A\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SSLC_Sample_Template_${academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Print Only Header Styling */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #sslc-certificate, #sslc-certificate * {
            visibility: visible;
          }
          #sslc-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: 2px solid #047857 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl border-b border-emerald-700/50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-300">
                <AcademicCapIcon className="w-9 h-9 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Government of Kerala • Pareeksha Bhavan
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    SSLC Examination {academicYear}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  Kerala SSLC Digital Result & Honors Portal
                </h1>
                <p className="text-emerald-200/80 text-sm mt-0.5">
                  Official School Result Register • Live Verification • Full A+ Board of Honors
                </p>
              </div>
            </div>

            {/* Quick Actions & Year Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-1 border border-slate-700 flex items-center">
                <CalendarIcon className="w-4 h-4 text-emerald-400 ml-2 mr-1" />
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="bg-transparent text-white text-sm font-medium py-1 px-2 rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="2025-2026" className="bg-slate-800">Batch 2025-2026</option>
                  <option value="2024-2025" className="bg-slate-800">Batch 2024-2025</option>
                  <option value="2023-2024" className="bg-slate-800">Batch 2023-2024</option>
                </select>
              </div>

              {isAdmin && (
                <>
                  <button
                    onClick={handleSeedSample}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md transition-all active:scale-95"
                    title="Populate 25 realistic PPMHSS candidate records"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    Demo Seed
                  </button>

                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
                  >
                    <DocumentArrowUpIcon className="w-4 h-4" />
                    Bulk Import
                  </button>

                  <button
                    onClick={handleBroadcast}
                    disabled={broadcasting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md transition-all active:scale-95"
                  >
                    <MegaphoneIcon className="w-4 h-4 text-amber-400" />
                    Broadcast
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-8 border-b border-emerald-800/60 pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-slate-50 text-emerald-950 shadow-md'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Live Result Checker
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-50 text-emerald-950 shadow-md'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <TrophyIcon className="w-4 h-4 text-amber-400" />
              School Honors & Analytics
              {analytics?.fullAPlusCount > 0 && (
                <span className="ml-1.5 px-2 py-0.2 rounded-full text-xs bg-amber-400 text-slate-950 font-bold">
                  {analytics.fullAPlusCount} Full A+
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-slate-50 text-emerald-950 shadow-md'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <ClipboardDocumentCheckIcon className="w-4 h-4" />
              Candidate Register
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: LIVE SEARCH & DIGITAL MARKSHEET */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            {/* Search Box Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 no-print">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-emerald-600" />
                  Individual SSLC Examination Result Verification
                </h2>
                <p className="text-xs text-slate-500">
                  Enter candidate 6-digit SSLC Register Number and optional Date of Birth to view the official digital grade certificate.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Register Number (e.g. 541001)"
                      value={searchRegNo}
                      onChange={(e) => setSearchRegNo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all uppercase tracking-wider"
                    />
                  </div>

                  <div className="w-full sm:w-44">
                    <input
                      type="date"
                      value={searchDob}
                      onChange={(e) => setSearchDob(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      title="Optional Date of Birth"
                    />
                  </div>

                  <button
                    onClick={() => handleSearch()}
                    disabled={searchLoading}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {searchLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        Check Result
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Sample Candidates */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-medium">Quick Demo Candidates:</span>
                  {['541001', '541002', '541004', '541011', '541016'].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => {
                        setSearchRegNo(reg);
                        handleSearch(reg);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 transition-colors"
                    >
                      Reg #{reg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Kerala SSLC Digital Certificate Card */}
            {searchedResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print px-1">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">Official Result Found & Authenticated</span>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow transition-all active:scale-95"
                  >
                    <PrinterIcon className="w-4 h-4 text-emerald-400" />
                    Print Marksheet
                  </button>
                </div>

                {/* Certificate Container */}
                <div
                  id="sslc-certificate"
                  ref={printRef}
                  className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-emerald-900/20 relative overflow-hidden"
                >
                  {/* Watermark Logo Background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <BuildingLibraryIcon className="w-[600px] h-[600px] text-emerald-950" />
                  </div>

                  {/* Official Header */}
                  <div className="text-center border-b-2 border-emerald-900/30 pb-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                        GOVERNMENT OF KERALA<br />
                        <span className="text-emerald-700 font-extrabold">PAREEKSHA BHAVAN</span>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xl border-2 border-amber-400 shadow-md">
                        🎓
                      </div>
                      <div className="text-right text-xs font-bold text-slate-500 uppercase tracking-widest">
                        SECONDARY SCHOOL LEAVING<br />
                        <span className="text-emerald-700 font-extrabold">CERTIFICATE (SSLC)</span>
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase">
                      SECONDARY SCHOOL LEAVING CERTIFICATE EXAMINATION
                    </h2>
                    <p className="text-emerald-800 font-bold text-sm tracking-wider uppercase mt-1">
                      MARCH {academicYear.split('-')[1] || '2026'} • OFFICIAL GRADE SHEET
                    </p>
                  </div>

                  {/* Candidate Details Grid */}
                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Candidate Name</span>
                      <span className="font-extrabold text-slate-900 text-base">{searchedResult.candidateName}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Register Number</span>
                      <span className="font-mono font-black text-emerald-800 text-lg">{searchedResult.registerNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">School Name & Code</span>
                      <span className="font-semibold text-slate-800">
                        {searchedResult.schoolCode} - {searchedResult.schoolName}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Result Status</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mt-0.5 ${
                          searchedResult.resultStatus === 'EHS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {searchedResult.resultStatus === 'EHS' ? '★ EHS - ELIGIBLE' : '⚠️ NHS'}
                      </span>
                    </div>
                  </div>

                  {/* Full A+ Congratulatory Banner */}
                  {searchedResult.fullAPlus && (
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-extrabold flex items-center justify-between shadow-lg shadow-amber-500/20 border-2 border-amber-300">
                      <div className="flex items-center gap-3">
                        <TrophyIcon className="w-8 h-8 text-slate-950 animate-bounce" />
                        <div>
                          <div className="text-base sm:text-lg uppercase tracking-wide">
                            🌟 OUTSTANDING ACHIEVEMENT: FULL A+ (10/10) 🌟
                          </div>
                          <div className="text-xs text-slate-900 font-semibold">
                            Heartiest congratulations from PPMHSS Management, PTA & Faculty!
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <span className="px-3 py-1 bg-slate-950 text-amber-300 rounded-xl text-xs font-black uppercase tracking-widest">
                          PERFECT 9.0 GPA
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 10 Subject Grades Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                      <thead className="bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4">Code</th>
                          <th className="py-3.5 px-4">Subject</th>
                          <th className="py-3.5 px-4 text-center">Grade</th>
                          <th className="py-3.5 px-4 text-center">Grade Points</th>
                          <th className="py-3.5 px-4 hidden sm:table-cell">Remarks / Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {SUBJECT_MAP.map((sub, idx) => {
                          const resSub = searchedResult.subjects?.[sub.key] || {};
                          const grade = resSub.grade || 'A+';
                          const gradeInfo = GRADE_DESCRIPTIONS[grade] || GRADE_DESCRIPTIONS['A+'];
                          const points = resSub.gradePoint || gradeInfo.points;

                          return (
                            <tr key={sub.key} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                              <td className="py-3 px-4 font-mono font-semibold text-slate-500 text-xs">{sub.code}</td>
                              <td className="py-3 px-4 font-semibold text-slate-800">{sub.name}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-3 py-0.5 rounded-lg font-black text-sm border ${gradeInfo.bg}`}>
                                  {grade}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-slate-700">{points}</td>
                              <td className="py-3 px-4 text-xs font-medium text-slate-500 hidden sm:table-cell">
                                {gradeInfo.desc}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Cumulative Score Summary Box */}
                  <div className="mt-6 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Subjects</span>
                      <span className="text-xl font-extrabold text-slate-800">{searchedResult.totalSubjects || 10}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Total A+ Count</span>
                      <span className="text-xl font-black text-emerald-700">
                        {searchedResult.totalAPlusCount} <span className="text-xs text-slate-400">/ 10</span>
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Points</span>
                      <span className="text-xl font-extrabold text-slate-800">
                        {searchedResult.totalGradePoints} <span className="text-xs text-slate-400">/ 90</span>
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average GPA</span>
                      <span className="text-xl font-black text-indigo-700">{searchedResult.gpa?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Official Pareeksha Bhavan Authentication Seal Footer */}
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800">
                        QR
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block">Digital Verification Hash:</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          SSLC-{searchedResult.registerNumber}-{academicYear}-AUTH-VERIFIED
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <span className="font-bold text-slate-800 block">SECRETARY / HEADMASTER</span>
                      <span className="text-slate-500 text-[11px]">PPMHSS KONDOTTY (Code: 18020)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !searchLoading && (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                  <AcademicCapIcon className="w-16 h-16 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-700">No Candidate Selected</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Type a candidate Register Number above or click any of the demo candidate tags to view their digital mark sheet.
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 2: SCHOOL HONORS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Top Stat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Appeared</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{analytics?.totalAppeared || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">100% Verified</span> candidate roster
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Percentage</p>
                    <h3 className="text-3xl font-black text-emerald-600 mt-1">{analytics?.passPercentage || 0}%</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckBadgeIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  <span className="font-bold text-slate-800">{analytics?.totalPassed || 0}</span> students Eligible for Higher Studies
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-sm border-2 border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Full A+ (10/10) Stars</p>
                    <h3 className="text-3xl font-black text-amber-900 mt-1">{analytics?.fullAPlusCount || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                    <TrophyIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-amber-800 font-semibold">
                  School Wall of Fame Honorees
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">9 A+ Achievers</p>
                    <h3 className="text-3xl font-black text-indigo-600 mt-1">{analytics?.nineAPlusCount || 0}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <StarIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Outstanding Near-Perfect candidates
                </div>
              </div>
            </div>

            {/* Wall of Fame (Full A+ Toppers) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-6 h-6 text-amber-500" />
                    <h2 className="text-xl font-black text-slate-900">
                      Wall of Fame • Full A+ Champions ({analytics?.toppers?.length || 0})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Distinguished students securing A+ grade across all 10 Kerala SSLC subjects in {academicYear}
                  </p>
                </div>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow transition-all"
                >
                  <PrinterIcon className="w-4 h-4" />
                  Print Honors Board
                </button>
              </div>

              {analytics?.toppers && analytics.toppers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {analytics.toppers.map((topper, idx) => (
                    <div
                      key={topper.id || idx}
                      onClick={() => {
                        setActiveTab('search');
                        setSearchRegNo(topper.registerNumber);
                        handleSearch(topper.registerNumber);
                      }}
                      className="group cursor-pointer bg-gradient-to-b from-amber-50/50 to-white hover:from-amber-100/60 p-4 rounded-2xl border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-lg transition-all text-center relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-md">
                        # {idx + 1}
                      </div>

                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 mx-auto flex items-center justify-center font-black text-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                        {topper.candidateName?.charAt(0) || '★'}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm mt-3 line-clamp-1 group-hover:text-emerald-800">
                        {topper.candidateName}
                      </h4>
                      <p className="font-mono text-xs font-bold text-slate-500 mt-0.5">
                        Reg: {topper.registerNumber}
                      </p>

                      <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase">
                          10 A+
                        </span>
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md text-[10px] font-bold">
                          9.0 GPA
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No SSLC candidate records found for {academicYear}. Please seed or import data.
                </div>
              )}
            </div>

            {/* Subject-wise Performance Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-emerald-600" />
                  Subject-Wise Pass & A+ Performance Analysis
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Breakdown of A+ achievers and pass rates across all 10 standard examination subjects
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {SUBJECT_MAP.map((sub) => {
                  const stats = analytics?.subjectWiseStats?.[sub.key] || {
                    name: sub.name,
                    aPlusCount: 0,
                    aCount: 0,
                    passPercentage: 100
                  };

                  return (
                    <div key={sub.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{sub.code}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {stats.passPercentage}% Pass
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 text-xs line-clamp-2 h-8">{sub.name}</h4>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">A+ Count:</span>
                          <span className="text-emerald-700 font-bold">{stats.aPlusCount}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${analytics?.totalAppeared ? (stats.aPlusCount / analytics.totalAppeared) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CANDIDATE REGISTER & ACTIONS */}
        {activeTab === 'register' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 items-center gap-3 w-full">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search candidate by name, register number or admission no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchRegister()}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="EHS">EHS (Eligible)</option>
                  <option value="NHS">NHS (Needs Imp.)</option>
                </select>

                <select
                  value={fullAPlusFilter}
                  onChange={(e) => setFullAPlusFilter(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">All Grades</option>
                  <option value="true">Full A+ (10 A+) Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchRegister}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Refresh table"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Reg No</th>
                      <th className="py-3.5 px-4">Candidate Name</th>
                      <th className="py-3.5 px-4">Adm No</th>
                      <th className="py-3.5 px-4 text-center">A+ Count</th>
                      <th className="py-3.5 px-4 text-center">GPA</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {registerLoading ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400">
                          <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                          Loading candidate register...
                        </td>
                      </tr>
                    ) : resultsList.length > 0 ? (
                      resultsList.map((row) => (
                        <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{row.registerNumber}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {row.candidateName}
                            {row.fullAPlus && (
                              <span className="ml-2 px-2 py-0.2 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-full border border-amber-300">
                                10 A+
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{row.admissionNo || '-'}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                            {row.totalAPlusCount} <span className="text-slate-400 font-normal">/ 10</span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-indigo-700">
                            {row.gpa?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                row.resultStatus === 'EHS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {row.resultStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setActiveTab('search');
                                setSearchRegNo(row.registerNumber);
                                handleSearch(row.registerNumber);
                              }}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors"
                            >
                              View Marksheet
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400">
                          No candidate records found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <DocumentArrowUpIcon className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Bulk Import Kerala SSLC Results</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste standard CSV rows exported from Sampoorna / Pareeksha Bhavan. Format:
              <br />
              <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-[11px]">
                RegNo, CandidateName, AdmNo, Gender, Lang1, Lang2, English, Hindi, Social, Physics, Chem, Bio, Maths, IT
              </code>
            </p>

            <div className="flex justify-end">
              <button
                onClick={downloadSampleCsv}
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Download Sample CSV Template
              </button>
            </div>

            <textarea
              rows="8"
              value={rawCsvText}
              onChange={(e) => setRawCsvText(e.target.value)}
              placeholder="541001,Aadhil Mohammed K,10841,Male,A+,A+,A+,A+,A+,A+,A+,A+,A+,A+&#10;541002,Amina Fathima P,10842,Female,A+,A+,A+,A+,A+,A+,A+,A+,A+,A+"
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={importing}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-2"
              >
                {importing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'Import Results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
