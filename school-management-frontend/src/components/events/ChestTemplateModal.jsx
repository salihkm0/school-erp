// src/components/events/ChestTemplateModal.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
  QrCodeIcon,
  UserIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export default function ChestTemplateModal({ eventId, currentTemplateId, isOpen, onClose, onTemplateChosen }) {
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
    layout: '6_per_page',
    theme: 'classic_white',
    showPhoto: false,
    showQr: true,
    showBarcode: false,
    showItemsList: true,
    showSchoolLogo: true,
    showHouseBanner: true,
    fontSize: 'large',
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await eventService.getChestTemplates();
      setTemplates(res || []);
      if (res && res.length > 0) {
        const active = res.find((t) => t._id === currentTemplateId) || res[0];
        setSelectedTemplate(active);
      }
    } catch (err) {
      toast.error('Failed to load chest templates');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setFormData({
      name: '',
      description: '',
      layout: '6_per_page',
      theme: 'royal_gold',
      showPhoto: false,
      showQr: true,
      showBarcode: false,
      showItemsList: true,
      showSchoolLogo: true,
      showHouseBanner: true,
      fontSize: 'large',
    });
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  const handleStartEdit = (tpl) => {
    setFormData({
      name: tpl.name,
      description: tpl.description || '',
      layout: tpl.layout || '6_per_page',
      theme: tpl.theme || 'classic_white',
      showPhoto: !!tpl.showPhoto,
      showQr: !!tpl.showQr,
      showBarcode: !!tpl.showBarcode,
      showItemsList: !!tpl.showItemsList,
      showSchoolLogo: !!tpl.showSchoolLogo,
      showHouseBanner: !!tpl.showHouseBanner,
      fontSize: tpl.fontSize || 'large',
    });
    setSelectedTemplate(tpl);
    setIsEditing(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    try {
      setSaving(true);
      if (selectedTemplate && selectedTemplate._id) {
        await eventService.updateChestTemplate(selectedTemplate._id, formData);
        toast.success('Chest template updated');
      } else {
        await eventService.createChestTemplate(formData);
        toast.success('New chest template created');
      }
      setIsEditing(false);
      await loadTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (tpl) => {
    if (tpl.isDefault) {
      toast.error('Default templates cannot be deleted');
      return;
    }
    if (!window.confirm(`Delete template "${tpl.name}"?`)) return;

    try {
      await eventService.deleteChestTemplate(tpl._id);
      toast.success('Template deleted');
      await loadTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete template');
    }
  };

  const handleChooseTemplate = async (tpl) => {
    try {
      setApplying(true);
      await eventService.applyChestTemplate(eventId, tpl._id);
      toast.success(`Chosen "${tpl.name}" for event badges!`);
      if (onTemplateChosen) onTemplateChosen(tpl);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to choose template');
    } finally {
      setApplying(false);
    }
  };

  const activeTpl = isEditing ? formData : selectedTemplate;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
              <IdentificationIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Chest Number Template Designer</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Create, customize and choose print-ready badge layouts for your sports & arts fest.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                <PlusIcon className="w-4 h-4" />
                Create New Template
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
              <ArrowPathIcon className="w-8 h-8 animate-spin text-purple-400 mb-3" />
              <p className="text-sm">Loading chest badge templates...</p>
            </div>
          ) : isEditing ? (
            /* Create / Edit Form */
            <form onSubmit={handleSaveTemplate} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                  {selectedTemplate?._id ? 'Edit Template' : 'Design New Chest Badge Template'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sports Day Jersey Card"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief note about the design layout"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Print Layout
                      </label>
                      <select
                        value={formData.layout}
                        onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="6_per_page">6 Badges per A4 Sheet (Standard)</option>
                        <option value="4_per_page">4 Badges per A4 (Large)</option>
                        <option value="8_per_page">8 Badges per A4 (Compact Tag)</option>
                        <option value="single_jersey">Single Jersey Card (Full Size)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Color Theme
                      </label>
                      <select
                        value={formData.theme}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="classic_white">Classic White Card</option>
                        <option value="royal_gold">Royal Gold Kalolsavam</option>
                        <option value="modern_neon">Modern Neon Tech</option>
                        <option value="sport_bold">Sports High-Contrast</option>
                        <option value="minimal_clean">Minimal Clean</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Chest Digit Font Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['small', 'medium', 'large', 'extra_large'].map((fs) => (
                        <button
                          type="button"
                          key={fs}
                          onClick={() => setFormData({ ...formData, fontSize: fs })}
                          className={`py-2 rounded-xl text-xs font-bold capitalize transition ${
                            formData.fontSize === fs
                              ? 'bg-purple-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          {fs.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Badge Content Toggles
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showSchoolLogo}
                          onChange={(e) => setFormData({ ...formData, showSchoolLogo: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Show School Crest / Logo
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showHouseBanner}
                          onChange={(e) => setFormData({ ...formData, showHouseBanner: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Show House Color Ribbon
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showQr}
                          onChange={(e) => setFormData({ ...formData, showQr: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Show QR Verification Stamp
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showBarcode}
                          onChange={(e) => setFormData({ ...formData, showBarcode: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Show Barcode Strip
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showItemsList}
                          onChange={(e) => setFormData({ ...formData, showItemsList: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Show Registered Items
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showPhoto}
                          onChange={(e) => setFormData({ ...formData, showPhoto: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Show Student Photo Box
                      </label>
                    </div>
                  </div>
                </div>

                {/* Real-Time Live Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Live Design Preview
                  </label>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[360px]">
                    <div
                      className={`w-full max-w-sm rounded-2xl border-2 p-5 shadow-2xl relative flex flex-col justify-between ${
                        formData.theme === 'royal_gold'
                          ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-400 text-slate-900'
                          : formData.theme === 'modern_neon'
                          ? 'bg-slate-900 border-purple-500 text-white'
                          : formData.theme === 'sport_bold'
                          ? 'bg-white border-slate-900 text-slate-950'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {formData.showHouseBanner && (
                        <div className="absolute top-0 left-0 right-0 h-3 bg-red-600 rounded-t-2xl" />
                      )}

                      <div className="flex items-center justify-between border-b pb-2 mt-1">
                        <div className="flex items-center gap-2">
                          {formData.showSchoolLogo && (
                            <div className="w-8 h-8 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                              SCH
                            </div>
                          )}
                          <div>
                            <div className="text-[10px] font-black uppercase">P.P.M. Higher Secondary School</div>
                            <div className="text-[8px] font-bold text-purple-600 uppercase">Annual Fest 2026</div>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">
                          RED DRAGONS
                        </span>
                      </div>

                      <div className="text-center py-4 my-auto">
                        <div className="text-[9px] font-bold uppercase tracking-wider opacity-70">CHEST NUMBER</div>
                        <div
                          className={`font-black font-mono tracking-tight my-1 ${
                            formData.fontSize === 'extra_large'
                              ? 'text-6xl'
                              : formData.fontSize === 'large'
                              ? 'text-5xl'
                              : formData.fontSize === 'medium'
                              ? 'text-4xl'
                              : 'text-3xl'
                          }`}
                        >
                          #101
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/60 font-bold">
                          Senior Boys
                        </span>
                      </div>

                      <div className="border-t pt-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs">Muhammed Zayan</div>
                          <div className="text-[10px] opacity-70">Adm: 4082 • Class 10-A</div>
                          {formData.showItemsList && (
                            <div className="text-[8px] text-purple-600 font-semibold mt-0.5">
                              Items: 100m Sprint, Long Jump
                            </div>
                          )}
                        </div>

                        {formData.showQr && (
                          <div className="w-10 h-10 border rounded bg-white flex items-center justify-center">
                            <QrCodeIcon className="w-6 h-6 text-slate-800" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit / Cancel buttons */}
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
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 text-xs flex items-center gap-2 transition disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Save Template
                </button>
              </div>
            </form>
          ) : (
            /* Templates Gallery */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tpl) => {
                  const isSelected = selectedTemplate?._id === tpl._id;
                  const isCurrentActive = currentTemplateId === tpl._id;

                  return (
                    <div
                      key={tpl._id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-purple-950/20 border-purple-500 shadow-xl shadow-purple-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-white">{tpl.name}</h4>
                            {tpl.isDefault && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          {isCurrentActive && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              ACTIVE FOR EVENT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400">{tpl.description}</p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                            Layout: {tpl.layout?.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 font-mono capitalize">
                            Theme: {tpl.theme?.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono capitalize">
                            Font: {tpl.fontSize}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(tpl);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          {!tpl.isDefault && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTemplate(tpl);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChooseTemplate(tpl);
                          }}
                          disabled={applying}
                          className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition"
                        >
                          Choose Template &rarr;
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
