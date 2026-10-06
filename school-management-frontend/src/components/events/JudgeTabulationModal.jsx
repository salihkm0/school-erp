// src/components/events/JudgeTabulationModal.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  ScaleIcon,
  UserIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export default function JudgeTabulationModal({ eventId, item, isOpen, onClose, onPublished }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('tabulation'); // 'tabulation' | 'score_entry'
  const [selectedJudge, setSelectedJudge] = useState('J1');
  const [judgeName, setJudgeName] = useState('Judge 1');
  const [selectedChest, setSelectedChest] = useState('');
  const [criteriaScores, setCriteriaScores] = useState({});
  const [deductions, setDeductions] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [savingScore, setSavingScore] = useState(false);
  const [tabulating, setTabulating] = useState(false);

  useEffect(() => {
    if (isOpen && eventId && item?._id) {
      loadScoreSheets();
    }
  }, [isOpen, eventId, item]);

  const loadScoreSheets = async () => {
    try {
      setLoading(true);
      const res = await eventService.getItemScoreSheets(eventId, item._id);
      setData(res);
      if (res?.participants?.length > 0 && !selectedChest) {
        setSelectedChest(res.participants[0].chestNumber);
      }
    } catch (err) {
      toast.error('Failed to load judge scorecards');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill criteria scores when chest or judge changes
  useEffect(() => {
    if (!data || !selectedChest) return;
    const existing = data.scoreSheets?.find(
      (s) => s.chestNumber === selectedChest && s.judgeCode === selectedJudge
    );

    const defaultCriteria = {};
    (data.criteria || []).forEach((c) => {
      const match = existing?.criteriaScores?.find((cs) => cs.criteriaName === c.name);
      defaultCriteria[c.name] = match ? match.marksGiven : 0;
    });

    setCriteriaScores(defaultCriteria);
    setDeductions(existing?.deductions || 0);
    setRemarks(existing?.remarks || '');
    if (existing?.judgeName) {
      setJudgeName(existing.judgeName);
    }
  }, [selectedChest, selectedJudge, data]);

  if (!isOpen) return null;

  const currentParticipant = data?.participants?.find((p) => p.chestNumber === selectedChest);
  const criteriaList = data?.criteria && data.criteria.length > 0
    ? data.criteria
    : [
        { name: 'Performance & Expression', maxMarks: 30 },
        { name: 'Rhythm & Tala / Technique', maxMarks: 30 },
        { name: 'Costume & Presentation', maxMarks: 20 },
        { name: 'Overall Appeal & Perfection', maxMarks: 20 },
      ];

  const totalCalculatedMarks = Object.values(criteriaScores).reduce((a, b) => Number(a) + Number(b || 0), 0);
  const finalCalculatedMarks = Math.max(0, totalCalculatedMarks - Number(deductions || 0));

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChest) {
      toast.error('Please select a chest number');
      return;
    }

    const payloadCriteria = criteriaList.map((c) => ({
      criteriaName: c.name,
      maxMarks: c.maxMarks,
      marksGiven: Number(criteriaScores[c.name] || 0),
    }));

    try {
      setSavingScore(true);
      await eventService.submitJudgeScore(eventId, item._id, {
        chestNumber: selectedChest,
        judgeName: judgeName || `Judge ${selectedJudge}`,
        judgeCode: selectedJudge,
        criteriaScores: payloadCriteria,
        deductions: Number(deductions) || 0,
        remarks,
      });

      toast.success(`Score saved for Chest #${selectedChest} (${selectedJudge})`);
      await loadScoreSheets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit judge score');
    } finally {
      setSavingScore(false);
    }
  };

  const handleTabulate = async () => {
    if (!window.confirm(`Are you sure you want to tabulate scores and publish official results for "${item.name}"? This will compute averages and award House Points.`)) {
      return;
    }

    try {
      setTabulating(true);
      const res = await eventService.tabulateAndPublishItem(eventId, item._id);
      toast.success(res.message || 'Results published to Live Leaderboard!');
      if (onPublished) onPublished();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to tabulate scores');
    } finally {
      setTabulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
              <ScaleIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-wide">{item.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                  {item.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300">
                  {item.stageVenue || 'Main Stage'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Judges Tabulation & Evaluation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setActiveTab('tabulation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'tabulation'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabulation Matrix
              </button>
              <button
                onClick={() => setActiveTab('score_entry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'score_entry'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Judge Scorepad
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-purple-400 mb-3" />
              <p className="text-sm">Loading judge evaluation sheets...</p>
            </div>
          ) : activeTab === 'tabulation' ? (
            /* Tabulation Matrix View */
            <div className="space-y-6">
              {/* Summary Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Registered Candidates</div>
                  <div className="text-2xl font-black text-white mt-1">{data?.participants?.length || 0}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Scorecards Received</div>
                  <div className="text-2xl font-black text-purple-400 mt-1">{data?.scoreSheets?.length || 0}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Rubric Max Marks</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {criteriaList.reduce((a, b) => a + (b.maxMarks || 10), 0)} pts
                  </div>
                </div>
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Auto-Grading</div>
                    <div className="text-xs text-slate-400 mt-0.5">A ≥70% | B ≥60% | C ≥50%</div>
                  </div>
                  <CalculatorIcon className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              {/* Tabulation Table */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-800/70 border-b border-slate-700/50 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ScaleIcon className="w-4 h-4 text-purple-400" />
                    Consolidated Tabulation Sheet
                  </h4>
                  <div className="text-xs text-slate-400">
                    Sorted by Average Final Marks
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Chest No</th>
                        <th className="py-3 px-4">Participant & House</th>
                        <th className="py-3 px-4 text-center">J1 Marks</th>
                        <th className="py-3 px-4 text-center">J2 Marks</th>
                        <th className="py-3 px-4 text-center">J3 Marks</th>
                        <th className="py-3 px-4 text-center font-bold text-purple-300">Avg Marks</th>
                        <th className="py-3 px-4 text-center">Grade</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                      {data?.summaryByChest?.length > 0 ? (
                        data.summaryByChest.map((entry, idx) => {
                          const maxMarks = criteriaList.reduce((a, b) => a + (b.maxMarks || 10), 0);
                          const pct = (entry.averageFinalMarks / maxMarks) * 100;
                          let grade = '-';
                          if (entry.judgeCount > 0) {
                            if (pct >= 70) grade = 'A';
                            else if (pct >= 60) grade = 'B';
                            else if (pct >= 50) grade = 'C';
                          }

                          return (
                            <tr
                              key={entry.chestNumber}
                              className={`hover:bg-slate-800/30 transition ${
                                idx === 0 && entry.judgeCount > 0
                                  ? 'bg-amber-500/5'
                                  : idx === 1 && entry.judgeCount > 0
                                  ? 'bg-slate-400/5'
                                  : idx === 2 && entry.judgeCount > 0
                                  ? 'bg-amber-700/5'
                                  : ''
                              }`}
                            >
                              <td className="py-3.5 px-4 font-bold">
                                {entry.judgeCount > 0 ? (
                                  idx === 0 ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 text-xs border border-amber-400/30">
                                      1st
                                    </span>
                                  ) : idx === 1 ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 text-xs border border-slate-300/30">
                                      2nd
                                    </span>
                                  ) : idx === 2 ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-400 text-xs border border-amber-700/30">
                                      3rd
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-xs ml-2">{idx + 1}</span>
                                  )
                                ) : (
                                  <span className="text-slate-500 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-bold text-white px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs">
                                  #{entry.chestNumber}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-white">
                                  {entry.student?.fullName || 'Student'}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.groupColor }}
                                  />
                                  <span className="text-xs text-slate-400">{entry.groupName}</span>
                                  {entry.student?.admissionNo && (
                                    <span className="text-xs text-slate-500">
                                      • Adm: {entry.student.admissionNo}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                {entry.scoresByJudge['J1'] ? (
                                  <span className="font-semibold text-white">
                                    {entry.scoresByJudge['J1'].finalMarks}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                {entry.scoresByJudge['J2'] ? (
                                  <span className="font-semibold text-white">
                                    {entry.scoresByJudge['J2'].finalMarks}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                {entry.scoresByJudge['J3'] ? (
                                  <span className="font-semibold text-white">
                                    {entry.scoresByJudge['J3'].finalMarks}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="font-bold text-base text-purple-300">
                                  {entry.judgeCount > 0 ? entry.averageFinalMarks : '-'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                {grade !== '-' ? (
                                  <span
                                    className={`px-2 py-0.5 rounded font-black text-xs ${
                                      grade === 'A'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : grade === 'B'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                  >
                                    {grade} Grade
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedChest(entry.chestNumber);
                                    setActiveTab('score_entry');
                                  }}
                                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition"
                                >
                                  Enter Marks
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-12 text-slate-500">
                            No participants registered for this item.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Judge Scorepad View */
            <form onSubmit={handleScoreSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Select Chest Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Participant Chest No.
                  </label>
                  <select
                    value={selectedChest}
                    onChange={(e) => setSelectedChest(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                  >
                    {data?.participants?.map((p) => (
                      <option key={p.chestNumber} value={p.chestNumber}>
                        #{p.chestNumber} - {p.student?.fullName || 'Student'} ({p.groupName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Judge Slot */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Judge Slot
                  </label>
                  <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1">
                    {['J1', 'J2', 'J3'].map((j) => (
                      <button
                        type="button"
                        key={j}
                        onClick={() => setSelectedJudge(j)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                          selectedJudge === j
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Judge {j}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Judge Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Judge Name
                  </label>
                  <input
                    type="text"
                    value={judgeName}
                    onChange={(e) => setJudgeName(e.target.value)}
                    placeholder="e.g. Prof. Ramesh / External Judge"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>

              {/* Participant Profile Banner */}
              {currentParticipant && (
                <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-base">
                      #{currentParticipant.chestNumber}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">
                        {currentParticipant.student?.fullName || 'Student Participant'}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: currentParticipant.groupColor }}
                        />
                        <span>{currentParticipant.groupName}</span>
                        <span>• {currentParticipant.category}</span>
                        {currentParticipant.student?.admissionNo && (
                          <span>• Adm: {currentParticipant.student.admissionNo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Current Computed Total</div>
                    <div className="text-2xl font-black text-purple-300">
                      {finalCalculatedMarks} <span className="text-xs text-slate-500">/ {criteriaList.reduce((a, b) => a + (b.maxMarks || 10), 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Criteria Sliders / Inputs */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-3">
                  <CalculatorIcon className="w-4 h-4 text-purple-400" />
                  Evaluation Rubric & Criteria Marks
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {criteriaList.map((crit) => (
                    <div
                      key={crit.name}
                      className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 text-sm">{crit.name}</span>
                        <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          Max: {crit.maxMarks || 10}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max={crit.maxMarks || 10}
                          value={criteriaScores[crit.name] || 0}
                          onChange={(e) =>
                            setCriteriaScores({
                              ...criteriaScores,
                              [crit.name]: Number(e.target.value),
                            })
                          }
                          className="flex-1 accent-purple-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          min="0"
                          max={crit.maxMarks || 10}
                          value={criteriaScores[crit.name] ?? 0}
                          onChange={(e) =>
                            setCriteriaScores({
                              ...criteriaScores,
                              [crit.name]: Math.min(crit.maxMarks || 10, Math.max(0, Number(e.target.value))),
                            })
                          }
                          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-bold text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deductions & Remarks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-700/60">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Deductions / Penalty (Overtime, Disqualification)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={deductions}
                      onChange={(e) => setDeductions(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-rose-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Judge Remarks / Notes
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Excellent rhythm, slight timing delay"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Score Button */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('tabulation')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 text-sm transition"
                >
                  View Tabulation Sheet
                </button>
                <button
                  type="submit"
                  disabled={savingScore}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 text-sm transition disabled:opacity-50"
                >
                  {savingScore ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Saving Score...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Record Judge Scorecard
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-400" />
            Publishing tabulation will calculate House Points and broadcast live results instantly.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-slate-400 hover:text-white font-semibold text-sm transition"
            >
              Close
            </button>
            <button
              onClick={handleTabulate}
              disabled={tabulating || !data?.scoreSheets || data.scoreSheets.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {tabulating ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Tabulating & Publishing...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Approve & Publish to Scoreboard
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
