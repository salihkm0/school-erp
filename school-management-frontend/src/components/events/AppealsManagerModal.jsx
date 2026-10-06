// src/components/events/AppealsManagerModal.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ScaleIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export default function AppealsManagerModal({ eventId, items = [], isOpen, onClose, isAdmin = false }) {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  
  // Submit Form State
  const [selectedItem, setSelectedItem] = useState('');
  const [chestNumber, setChestNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [appellantName, setAppellantName] = useState('');
  const [appellantRole, setAppellantRole] = useState('House Master');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Review State
  const [reviewingAppealId, setReviewingAppealId] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('accepted');
  const [reviewNotes, setReviewNotes] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      loadAppeals();
    }
  }, [isOpen, eventId]);

  const loadAppeals = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAppeals(eventId);
      setAppeals(res || []);
    } catch (err) {
      toast.error('Failed to load appeals');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmitAppeal = async (e) => {
    e.preventDefault();
    if (!selectedItem || !chestNumber || !appellantName || !reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await eventService.submitAppeal(eventId, {
        itemId: selectedItem,
        chestNumber,
        studentName,
        appellantName,
        appellantRole,
        phone,
        reason,
        feePaid: true,
        feeAmount: 500,
      });

      toast.success('Appeal submitted to the Appeals Committee!');
      setShowSubmitForm(false);
      setReason('');
      setChestNumber('');
      setStudentName('');
      await loadAppeals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit appeal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewAppeal = async (appealId) => {
    try {
      setSavingReview(true);
      await eventService.reviewAppeal(eventId, appealId, {
        status: reviewStatus,
        reviewNotes,
      });

      toast.success(`Appeal marked as ${reviewStatus}`);
      setReviewingAppealId(null);
      setReviewNotes('');
      await loadAppeals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update appeal');
    } finally {
      setSavingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
              <ScaleIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Appeals & Grievances Committee</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage protest appeals, evaluation re-tabulations and committee review decisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showSubmitForm && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <PlusIcon className="w-4 h-4" />
                Submit Protest Appeal
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {showSubmitForm ? (
            /* Submit Appeal Form */
            <form onSubmit={handleSubmitAppeal} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <DocumentMagnifyingGlassIcon className="w-4 h-4 text-rose-400" />
                  New Appeal Submission Form
                </h4>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Competition Item *
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
                  >
                    <option value="">Select Item</option>
                    {items.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name} ({i.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Participant Chest No. *
                  </label>
                  <input
                    type="text"
                    value={chestNumber}
                    onChange={(e) => setChestNumber(e.target.value)}
                    placeholder="e.g. 101 or RED-101"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Full name of candidate"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Appellant / Teacher In-Charge *
                  </label>
                  <input
                    type="text"
                    value={appellantName}
                    onChange={(e) => setAppellantName(e.target.value)}
                    placeholder="Name of house master / teacher"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Detailed Reason / Grievance Statement *
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State specific reasons for protest (e.g. accompaniment disruption, criteria scoring anomaly, timing error)..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Appeal Caution Deposit: <strong className="text-white font-mono">₹500</strong> (Refundable if appeal accepted)
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {submitting ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Confirm & Submit Appeal
                </button>
              </div>
            </form>
          ) : null}

          {/* Appeals List Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-rose-400 mb-3" />
              <p className="text-sm">Loading appeals...</p>
            </div>
          ) : appeals.length > 0 ? (
            <div className="space-y-4">
              {appeals.map((app) => (
                <div
                  key={app._id}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 text-white rounded-lg">
                          #{app.chestNumber}
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {app.item?.name || 'Item'}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                          {app.groupName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Appellant: <strong>{app.appellantName}</strong> ({app.appellantRole}) • Submitted on {new Date(app.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          app.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{app.reason}"
                  </p>

                  {app.reviewNotes && (
                    <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                      <strong>Committee Notes:</strong> {app.reviewNotes}
                    </div>
                  )}

                  {/* Review Action for Admin/Staff */}
                  {isAdmin && reviewingAppealId === app._id ? (
                    <div className="pt-3 border-t border-slate-700/60 flex items-center gap-3">
                      <select
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2"
                      >
                        <option value="under_review">Under Review</option>
                        <option value="accepted">Accept Appeal</option>
                        <option value="rejected">Reject Appeal</option>
                      </select>
                      <input
                        type="text"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Committee decision notes..."
                        className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2"
                      />
                      <button
                        onClick={() => handleReviewAppeal(app._id)}
                        disabled={savingReview}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
                      >
                        Save Decision
                      </button>
                      <button
                        onClick={() => setReviewingAppealId(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : isAdmin && app.status === 'submitted' ? (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setReviewingAppealId(app._id);
                          setReviewStatus('accepted');
                        }}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                      >
                        Review Appeal &rarr;
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-16 text-center text-slate-500">
              <ScaleIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No appeals registered</h4>
              <p className="text-xs mt-1">All festival events and score evaluations are uncontested.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
