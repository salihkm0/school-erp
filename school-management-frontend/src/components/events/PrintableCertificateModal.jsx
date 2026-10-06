// src/components/events/PrintableCertificateModal.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PrinterIcon,
  SparklesIcon,
  ArrowPathIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export default function PrintableCertificateModal({ eventId, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedWinnerOnly, setSelectedWinnerOnly] = useState('true');

  useEffect(() => {
    if (isOpen && eventId) {
      loadCertificates();
    }
  }, [isOpen, eventId, selectedWinnerOnly]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const res = await eventService.getPrintableCertificates(eventId, {
        winnerOnly: selectedWinnerOnly,
      });
      setData(res);
    } catch (err) {
      toast.error('Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const certificates = data?.certificates || [];
  const school = data?.schoolProfile;
  const event = data?.event;
  const config = event?.certificateConfig || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white">
        
        {/* Modal Header (Hidden in Print) */}
        <div className="print:hidden p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Merit & Participation Certificates</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official high-resolution print certificates with school seal & signatures ({certificates.length} generated).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedWinnerOnly}
              onChange={(e) => setSelectedWinnerOnly(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2"
            >
              <option value="true">Winners & Grades (1st, 2nd, 3rd, A/B/C)</option>
              <option value="false">All Registered Participants</option>
            </select>

            <button
              onClick={handlePrint}
              disabled={certificates.length === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 text-xs transition disabled:opacity-50"
            >
              <PrinterIcon className="w-4 h-4" />
              Print All Certificates
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body / Certificates List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 print:p-0 print:space-y-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 print:hidden">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-amber-400 mb-3" />
              <p className="text-sm">Rendering certificates...</p>
            </div>
          ) : certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <div
                key={index}
                className="relative bg-[#faf7ee] text-slate-900 border-8 border-double border-[#856404] rounded-2xl p-10 shadow-2xl mx-auto max-w-4xl min-h-[580px] flex flex-col justify-between print:border-8 print:border-double print:border-[#856404] print:shadow-none print:break-after-page print:page-break-after-always print:m-0 print:rounded-none"
                style={{
                  backgroundImage: 'radial-gradient(#eedc82 0.75px, transparent 0.75px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Certificate Number */}
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-2">
                  <span>Cert No: {cert.certificateNo}</span>
                  <span>Date: {new Date(cert.eventDate).toLocaleDateString()}</span>
                </div>

                {/* Top School Emblem & Header */}
                <div className="text-center space-y-1">
                  {school?.logoUrl ? (
                    <img
                      src={school.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 mx-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-600 flex items-center justify-center text-amber-800 font-bold text-lg mb-1">
                      SCH
                    </div>
                  )}

                  <h1 className="text-2xl font-serif font-black uppercase tracking-wider text-[#1e293b]">
                    {school?.name || 'School Name'}
                  </h1>
                  <p className="text-xs font-serif text-slate-600">
                    {school?.address?.city ? `${school.address.street}, ${school.address.city}, ${school.address.district}` : 'Affiliated to State Board of Education'}
                  </p>

                  <div className="pt-2">
                    <div className="inline-block px-4 py-1 bg-[#1e293b] text-[#fef08a] font-serif font-bold text-xs uppercase tracking-widest rounded shadow-sm">
                      {event?.name || 'Annual Arts & Sports Festival'}
                    </div>
                  </div>
                </div>

                {/* Certificate Main Title */}
                <div className="text-center my-4">
                  <h2 className="text-2xl font-serif font-bold italic tracking-wide text-[#b45309]">
                    {config.headerTitle || 'Certificate of Merit & Excellence'}
                  </h2>
                  <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#b45309] to-transparent mx-auto mt-1" />
                </div>

                {/* Certificate Body Paragraph */}
                <div className="text-center text-slate-800 text-sm leading-relaxed px-6 my-auto font-serif">
                  This is proudly awarded to Master / Kumari{' '}
                  <span className="font-bold text-base text-slate-950 underline decoration-[#b45309] decoration-2 underline-offset-4">
                    {cert.studentName}
                  </span>{' '}
                  (Chest No: <strong className="font-mono">#{cert.chestNumber}</strong>, Class:{' '}
                  <strong>{cert.currentClass}</strong>), representing{' '}
                  <span
                    className="font-bold px-2 py-0.5 rounded text-white text-xs inline-block"
                    style={{ backgroundColor: cert.groupColor || '#1e293b' }}
                  >
                    {cert.groupName}
                  </span>
                  , for securing{' '}
                  <span className="font-black text-amber-800 text-base uppercase bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {cert.rankLabel}
                  </span>{' '}
                  in the competition{' '}
                  <span className="font-bold text-slate-950 italic underline decoration-slate-400">
                    {cert.itemName}
                  </span>{' '}
                  ({cert.itemCategory} Category) held at{' '}
                  <strong>{event?.venue || 'School Campus'}</strong>.
                </div>

                {/* Bottom Signatures & Seal */}
                <div className="pt-8 border-t border-slate-300 flex items-end justify-between px-6 text-center">
                  <div className="space-y-1">
                    <div className="w-32 border-b border-slate-800 mx-auto" />
                    <div className="text-[11px] font-bold text-slate-900 font-serif">
                      {config.signatory1 || 'General Convener'}
                    </div>
                  </div>

                  {/* Golden Seal */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-[#b45309] flex items-center justify-center p-1 bg-amber-50 shadow-inner">
                      <SparklesIcon className="w-8 h-8 text-[#b45309]" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-1">
                      Official Seal
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-32 border-b border-slate-800 mx-auto" />
                    <div className="text-[11px] font-bold text-slate-900 font-serif">
                      {config.signatory2 || 'Principal'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-16 text-center text-slate-400 print:hidden">
              <TrophyIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No published winner results found</h4>
              <p className="text-xs mt-1">Record and publish competition results to generate merit certificates.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
