// src/components/events/PrintableBadgesView.jsx
import React, { useState, useEffect } from 'react';
import {
  PrinterIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  IdentificationIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export default function PrintableBadgesView({ eventId, groups = [], categories = [] }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (eventId) {
      loadBadges();
    }
  }, [eventId, selectedGroup, selectedCategory]);

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

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden in Print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <IdentificationIcon className="w-5 h-5 text-purple-400" />
            Printable Participant Chest Badges & ID Cards
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4 print:m-0 print:p-0">
          {participants.map((p) => (
            <div
              key={p._id}
              className="relative bg-white text-slate-900 rounded-2xl border-2 border-slate-300 shadow-md p-5 flex flex-col justify-between overflow-hidden print:border-slate-800 print:shadow-none print:break-inside-avoid print:page-break-inside-avoid min-h-[320px]"
            >
              {/* Top House Color Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{ backgroundColor: p.groupColor || '#3b82f6' }}
              />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mt-1">
                <div className="flex items-center gap-2.5">
                  {schoolProfile?.logoUrl ? (
                    <img
                      src={schoolProfile.logoUrl}
                      alt="Logo"
                      className="w-9 h-9 object-contain rounded"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                      SCH
                    </div>
                  )}
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-tight text-slate-800 line-clamp-1">
                      {schoolProfile?.name || 'School Fest'}
                    </div>
                    <div className="text-[9px] font-bold text-purple-700 tracking-wider uppercase">
                      {event?.name || 'Annual Sports & Arts Fest'}
                    </div>
                  </div>
                </div>

                <div
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
                  style={{ backgroundColor: p.groupColor || '#3b82f6' }}
                >
                  {p.groupName}
                </div>
              </div>

              {/* Chest Hero Digits */}
              <div className="text-center py-4 my-auto">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  CHEST NUMBER
                </div>
                <div className="text-5xl font-black font-mono tracking-tight text-slate-950 mt-1">
                  #{p.chestNumber}
                </div>
                <div className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  {p.category} Section
                </div>
              </div>

              {/* Student Details & QR Code Bar */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-black text-slate-900 line-clamp-1">
                    {p.student?.fullName || 'Participant Student'}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Adm: <strong>{p.student?.admissionNo || 'N/A'}</strong> • Class: <strong>{p.student?.currentClass?.name || 'Student'}</strong>
                  </div>
                  {p.registeredItems && p.registeredItems.length > 0 && (
                    <div className="text-[10px] text-purple-700 font-semibold mt-1 line-clamp-1">
                      Items: {p.registeredItems.map((i) => i.name).join(', ')}
                    </div>
                  )}
                </div>

                {/* QR Code / Verification Stamp */}
                <div className="w-14 h-14 bg-slate-50 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-1 text-center">
                  <QrCodeIcon className="w-7 h-7 text-slate-800" />
                  <span className="text-[7px] font-mono font-bold text-slate-500">#{p.chestNumber}</span>
                </div>
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
    </div>
  );
}
