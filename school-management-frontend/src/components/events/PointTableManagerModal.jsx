// src/components/events/PointTableManagerModal.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
  TrophyIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export default function PointTableManagerModal({ eventId, currentTemplateId, isOpen, onClose, onSchemeApplied }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventType: 'general',
    individualFirst: 5,
    individualSecond: 3,
    individualThird: 1,
    groupFirst: 10,
    groupSecond: 6,
    groupThird: 2,
    fourthPlacePoints: 0,
    consolationPoints: 0,
    gradePoints: {
      APlus: 7,
      A: 5,
      B: 3,
      C: 1,
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await eventService.getPointTemplates();
      setTemplates(res || []);
      if (res && res.length > 0) {
        const active = res.find((t) => t._id === currentTemplateId) || res[0];
        setSelectedTemplate(active);
      }
    } catch (err) {
      toast.error('Failed to load point schemes');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setFormData({
      name: '',
      description: '',
      eventType: 'general',
      individualFirst: 5,
      individualSecond: 3,
      individualThird: 1,
      groupFirst: 10,
      groupSecond: 6,
      groupThird: 2,
      fourthPlacePoints: 0,
      consolationPoints: 0,
      gradePoints: {
        APlus: 7,
        A: 5,
        B: 3,
        C: 1,
      },
    });
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  const handleStartEdit = (tpl) => {
    setFormData({
      name: tpl.name,
      description: tpl.description || '',
      eventType: tpl.eventType || 'general',
      individualFirst: tpl.individualFirst || 5,
      individualSecond: tpl.individualSecond || 3,
      individualThird: tpl.individualThird || 1,
      groupFirst: tpl.groupFirst || 10,
      groupSecond: tpl.groupSecond || 6,
      groupThird: tpl.groupThird || 2,
      fourthPlacePoints: tpl.fourthPlacePoints || 0,
      consolationPoints: tpl.consolationPoints || 0,
      gradePoints: {
        APlus: tpl.gradePoints?.APlus || 7,
        A: tpl.gradePoints?.A || 5,
        B: tpl.gradePoints?.B || 3,
        C: tpl.gradePoints?.C || 1,
      },
    });
    setSelectedTemplate(tpl);
    setIsEditing(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Point scheme name is required');
      return;
    }

    try {
      setSaving(true);
      if (selectedTemplate && selectedTemplate._id) {
        await eventService.updatePointTemplate(selectedTemplate._id, formData);
        toast.success('Point scheme updated');
      } else {
        await eventService.createPointTemplate(formData);
        toast.success('New point scheme created');
      }
      setIsEditing(false);
      await loadTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save point scheme');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (tpl) => {
    if (tpl.isDefault) {
      toast.error('Default system schemes cannot be deleted');
      return;
    }
    if (!window.confirm(`Delete point scheme "${tpl.name}"?`)) return;

    try {
      await eventService.deletePointTemplate(tpl._id);
      toast.success('Point scheme deleted');
      await loadTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete template');
    }
  };

  const handleApplyScheme = async (tpl) => {
    if (!window.confirm(`Apply "${tpl.name}" to this event? All house points and individual scores will be recalculated automatically.`)) {
      return;
    }

    try {
      setApplying(true);
      const res = await eventService.applyPointTemplate(eventId, tpl._id);
      toast.success(res.message || 'Point scheme applied & scores recalculated!');
      if (onSchemeApplied) onSchemeApplied(tpl);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply point scheme');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <CalculatorIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Point Table Rules & Schemes</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure points for 1st, 2nd, 3rd places, group multipliers, and grade bonuses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <PlusIcon className="w-4 h-4" />
                Create Custom Scheme
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-amber-400 mb-3" />
              <p className="text-sm">Loading point rule presets...</p>
            </div>
          ) : isEditing ? (
            /* Create / Edit Form */
            <form onSubmit={handleSaveTemplate} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-amber-400" />
                  {selectedTemplate?._id ? 'Edit Point Scheme' : 'Create Custom Point Scheme'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Scheme Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kerala Kalolsavam Standard Scheme"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs"
                  >
                    <option value="arts">Arts & Cultural Fest</option>
                    <option value="sports">Sports & Athletics Meet</option>
                    <option value="academic">Academic / Science Fair</option>
                    <option value="general">General All-Round Trophy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Standard 5-3-1 individual points with 10-6-2 group multipliers"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Individual Item Points */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <TrophyIcon className="w-4 h-4" />
                  Individual Item Points Distribution
                </h5>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">🥇 1st Place</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.individualFirst}
                      onChange={(e) => setFormData({ ...formData, individualFirst: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">🥈 2nd Place</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.individualSecond}
                      onChange={(e) => setFormData({ ...formData, individualSecond: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">🥉 3rd Place</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.individualThird}
                      onChange={(e) => setFormData({ ...formData, individualThird: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Group Item Points */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <TrophyIcon className="w-4 h-4" />
                  Group / Relay Item Points Distribution
                </h5>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">🥇 Group 1st</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.groupFirst}
                      onChange={(e) => setFormData({ ...formData, groupFirst: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">🥈 Group 2nd</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.groupSecond}
                      onChange={(e) => setFormData({ ...formData, groupSecond: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">🥉 Group 3rd</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.groupThird}
                      onChange={(e) => setFormData({ ...formData, groupThird: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Grade Bonus Points */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4" />
                  Grade Bonus Points (Kalolsavam / Performance Quality)
                </h5>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">A+ Grade</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.gradePoints.APlus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gradePoints: { ...formData.gradePoints, APlus: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">A Grade</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.gradePoints.A}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gradePoints: { ...formData.gradePoints, A: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">B Grade</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.gradePoints.B}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gradePoints: { ...formData.gradePoints, B: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">C Grade</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.gradePoints.C}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gradePoints: { ...formData.gradePoints, C: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs flex items-center gap-2 transition disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Save Point Scheme
                </button>
              </div>
            </form>
          ) : (
            /* Presets Gallery */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tpl) => {
                  const isCurrentActive = currentTemplateId === tpl._id;

                  return (
                    <div
                      key={tpl._id}
                      className="p-5 rounded-3xl border bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black text-white">{tpl.name}</h4>
                          {isCurrentActive && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              ACTIVE FOR EVENT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400">{tpl.description}</p>

                        {/* Point Pill Badges */}
                        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                            <div className="text-[10px] uppercase font-bold text-amber-400">Individual Points</div>
                            <div className="font-mono font-bold text-white mt-0.5">
                              {tpl.individualFirst} - {tpl.individualSecond} - {tpl.individualThird} pts
                            </div>
                          </div>
                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                            <div className="text-[10px] uppercase font-bold text-purple-400">Group Points</div>
                            <div className="font-mono font-bold text-white mt-0.5">
                              {tpl.groupFirst} - {tpl.groupSecond} - {tpl.groupThird} pts
                            </div>
                          </div>
                        </div>

                        {tpl.gradePoints && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-mono">
                            <span>Grades:</span>
                            <span className="text-emerald-400">A ({tpl.gradePoints.A || 5} pts)</span>
                            <span className="text-blue-400">B ({tpl.gradePoints.B || 3} pts)</span>
                            <span className="text-amber-400">C ({tpl.gradePoints.C || 1} pt)</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(tpl)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          {!tpl.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTemplate(tpl)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyScheme(tpl)}
                          disabled={applying}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition"
                        >
                          Choose & Recalculate &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
