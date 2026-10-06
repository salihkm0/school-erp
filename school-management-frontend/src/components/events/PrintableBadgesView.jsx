// src/components/events/PrintableBadgesView.jsx
import React, { useState, useEffect } from 'react';
import {
  PrinterIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  IdentificationIcon,
  QrCodeIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import ChestTemplateModal from './ChestTemplateModal';
import toast from 'react-hot-toast';

export default function PrintableBadgesView({ eventId, groups = [], categories = [], isStaff = false }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  useEffect(() => {
    if (eventId) {
      loadBadges();
      loadActiveTemplate();
    }
  }, [eventId, selectedGroup, selectedCategory]);

  const loadActiveTemplate = async () => {
    try {
      const templates = await eventService.getChestTemplates();
      const eventDetails = await eventService.getEventById(eventId);
      const chosenId = eventDetails?.selectedChestTemplate?._id || eventDetails?.selectedChestTemplate;
      const tpl = templates?.find((t) => t._id === chosenId) || templates?.[0] || null;
      setActiveTemplate(tpl);
    } catch (err) {
      console.error('Failed to load active template:', err);
    }
  };

  const loadBadges = async () => {
    try {
      setLoading(true);
      const res = await eventService.getPrintableBadges(eventId, {
        group: selectedGroup || undefined,
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load badges:', err);
      toast.error('Failed to load ID badges data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const participants = data?.participants || [];
  const schoolProfile = data?.schoolProfile;
  const event = data?.event;

  // Template settings fallback
  const theme = activeTemplate?.theme || 'classic_white';
  const layout = activeTemplate?.layout || '6_per_page';
  const showQr = activeTemplate?.showQr !== false;
  const showBarcode = !!activeTemplate?.showBarcode;
  const showPhoto = !!activeTemplate?.showPhoto;
  const showItems = activeTemplate?.showItemsList !== false;
  const showLogo = activeTemplate?.showSchoolLogo !== false;
  const showHouseBanner = activeTemplate?.showHouseBanner !== false;
  const fontSize = activeTemplate?.fontSize || 'large';

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden in Print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <IdentificationIcon className="w-5 h-5 text-purple-400" />
            Printable Participant Chest Badges & ID Cards
            {activeTemplate && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                Template: {activeTemplate.name}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-formatted with official school emblem, large chest digits, house colors & QR verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">All Houses / Groups</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Template Manager Button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold rounded-xl border border-purple-500/30 text-xs transition flex items-center gap-1.5"
          >
            <SparklesIcon className="w-4 h-4 text-purple-400" />
            Badge Template Options
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={participants.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 text-xs transition disabled:opacity-50"
          >
            <PrinterIcon className="w-4 h-4" />
            Print Badges ({participants.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 print:hidden">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Preparing printable chest cards...</p>
        </div>
      ) : participants.length > 0 ? (
        /* Printable Badges Grid */
        <div
          className={`grid gap-6 print:gap-4 print:m-0 print:p-0 ${
            layout === '4_per_page'
              ? 'grid-cols-1 md:grid-cols-2 print:grid-cols-2'
              : layout === '8_per_page'
              ? 'grid-cols-1 md:grid-cols-3 xl:grid-cols-4 print:grid-cols-4'
              : layout === 'single_jersey'
              ? 'grid-cols-1 md:grid-cols-2 print:grid-cols-1'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-3'
          }`}
        >
          {participants.map((p) => (
            <div
              key={p._id}
              className={`relative rounded-3xl border-2 shadow-md p-5 flex flex-col justify-between overflow-hidden print:shadow-none print:break-inside-avoid print:page-break-inside-avoid min-h-[320px] ${
                theme === 'royal_gold'
                  ? 'bg-gradient-to-br from-[#faf7ee] to-[#fef9c3] border-[#ca8a04] text-slate-900'
                  : theme === 'modern_neon'
                  ? 'bg-slate-900 border-purple-500 text-white print:bg-white print:text-black print:border-black'
                  : theme === 'sport_bold'
                  ? 'bg-white border-slate-950 text-slate-950'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {/* Top House Color Strip */}
              {showHouseBanner && (
                <div
                  className="absolute top-0 left-0 right-0 h-3"
                  style={{ backgroundColor: p.groupColor || '#3b82f6' }}
                />
              )}

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mt-1">
                <div className="flex items-center gap-2.5">
                  {showLogo && schoolProfile?.logoUrl ? (
                    <img
                      src={schoolProfile.logoUrl}
                      alt="Logo"
                      className="w-9 h-9 object-contain rounded"
                    />
                  ) : showLogo ? (
                    <div className="w-9 h-9 rounded bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                      SCH
                    </div>
                  ) : null}
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-tight line-clamp-1">
                      {schoolProfile?.name || 'School Fest'}
                    </div>
                    <div className="text-[9px] font-bold text-purple-700 tracking-wider uppercase">
                      {event?.name || 'Annual Sports & Arts Fest'}
                    </div>
                  </div>
                </div>

                <div
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider shadow-xs"
                  style={{ backgroundColor: p.groupColor || '#3b82f6' }}
                >
                  {p.groupName}
                </div>
              </div>

              {/* Chest Hero Digits & Photo */}
              <div className="text-center py-4 my-auto flex items-center justify-center gap-4">
                {showPhoto && (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.student?.photo ? (
                      <img src={p.student.photo} alt={p.student?.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    CHEST NUMBER
                  </div>
                  <div
                    className={`font-black font-mono tracking-tight my-0.5 ${
                      fontSize === 'extra_large'
                        ? 'text-6xl'
                        : fontSize === 'large'
                        ? 'text-5xl'
                        : fontSize === 'medium'
                        ? 'text-4xl'
                        : 'text-3xl'
                    }`}
                  >
                    #{p.chestNumber}
                  </div>
                  <div className="inline-block px-3 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                    {p.category} Section
                  </div>
                </div>
              </div>

              {/* Student Details & QR Code Bar */}
              <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-black line-clamp-1">
                    {p.student?.fullName || 'Participant Student'}
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Adm: <strong>{p.student?.admissionNo || 'N/A'}</strong> • Class: <strong>{p.student?.currentClass?.name || 'Student'}</strong>
                  </div>
                  {showItems && p.registeredItems && p.registeredItems.length > 0 && (
                    <div className="text-[10px] text-purple-700 font-semibold mt-1 line-clamp-1">
                      Items: {p.registeredItems.map((i) => i.name).join(', ')}
                    </div>
                  )}
                </div>

                {/* QR Code / Verification Stamp */}
                {showQr && (
                  <div className="w-14 h-14 bg-slate-50 border border-slate-300 rounded-xl flex flex-col items-center justify-center p-1 text-center shadow-xs">
                    <QrCodeIcon className="w-7 h-7 text-slate-800" />
                    <span className="text-[7px] font-mono font-bold text-slate-500">#{p.chestNumber}</span>
                  </div>
                )}
                {showBarcode && (
                  <div className="font-mono text-[9px] tracking-widest text-center border-l pl-2">
                    |||| || ||| ||||<br />#{p.chestNumber}
                  </div>
                )}
              </div>

              {/* Cut-line marker for printing */}
              <div className="print:block hidden absolute -bottom-2 left-0 right-0 text-center text-[7px] text-slate-400 font-mono">
                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center text-slate-500 print:hidden">
          <IdentificationIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No participant badges match the filter</h4>
          <p className="text-xs mt-1">Register participants or generate chest numbers in the Participants tab.</p>
        </div>
      )}

      {/* Chest Template Modal */}
      {isTemplateModalOpen && (
        <ChestTemplateModal
          eventId={eventId}
          currentTemplateId={activeTemplate?._id}
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onTemplateChosen={(tpl) => {
            setActiveTemplate(tpl);
            loadBadges();
          }}
        />
      )}
    </div>
  );
}
