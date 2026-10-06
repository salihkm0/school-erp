// src/components/fees/FeeStructuresManager.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFeeStructures, 
  fetchFeeCategories, 
  createFeeStructure, 
  deleteFeeStructure,
  createFeeCategory,
  deleteFeeCategory
} from '../../store/slices/feeSlice';
import { 
  PlusIcon, 
  BuildingLibraryIcon, 
  TrashIcon, 
  PencilSquareIcon,
  XMarkIcon,
  CheckCircleIcon,
  TagIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FeeStructuresManager = () => {
  const dispatch = useDispatch();
  const { structures = [], categories = [], loading } = useSelector((state) => state.fees);
  const { classes = [] } = useSelector((state) => state.classes);
  const { activeAcademicYear } = useSelector((state) => state.academicYears || {});

  const [activeSubTab, setActiveSubTab] = useState('structures'); // 'structures' | 'heads'

  // Structure Modal State
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [structName, setStructName] = useState('');
  const [structClassIds, setStructClassIds] = useState([]);
  const [structHeads, setStructHeads] = useState([]);
  const [structInstallments, setStructInstallments] = useState([
    { name: '1st Term Milestone', percentage: 40, dueDate: '', lateFinePerDay: 5 },
    { name: '2nd Term Milestone', percentage: 30, dueDate: '', lateFinePerDay: 5 },
    { name: '3rd Term Milestone', percentage: 30, dueDate: '', lateFinePerDay: 5 }
  ]);
  const [structDescription, setStructDescription] = useState('');
  const [isSubmittingStruct, setIsSubmittingStruct] = useState(false);

  // Fee Head Modal State
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);
  const [headName, setHeadName] = useState('');
  const [headCode, setHeadCode] = useState('');
  const [headType, setHeadType] = useState('tuition');
  const [headDescription, setHeadDescription] = useState('');
  const [isSubmittingHead, setIsSubmittingHead] = useState(false);

  useEffect(() => {
    dispatch(fetchFeeStructures());
    dispatch(fetchFeeCategories());
  }, [dispatch]);

  // Total Structure Fee Calculator
  const totalStructureAmount = structHeads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

  const handleOpenNewStructure = () => {
    setStructName('');
    setStructClassIds([]);
    // Default heads with first few categories
    if (categories.length > 0) {
      setStructHeads(
        categories.slice(0, 4).map(c => ({
          categoryId: c._id,
          categoryName: c.name,
          amount: c.type === 'tuition' ? 12000 : c.type === 'facility' ? 3000 : 1500
        }))
      );
    } else {
      setStructHeads([]);
    }
    setIsStructureModalOpen(true);
  };

  const addHeadToStructure = () => {
    if (categories.length === 0) {
      toast.error('Please create at least one fee head first');
      return;
    }
    const defaultCat = categories[0];
    setStructHeads([
      ...structHeads,
      { categoryId: defaultCat._id, categoryName: defaultCat.name, amount: 1000 }
    ]);
  };

  const removeHeadFromStructure = (idx) => {
    setStructHeads(structHeads.filter((_, i) => i !== idx));
  };

  const updateHeadRow = (idx, field, val) => {
    const updated = [...structHeads];
    if (field === 'categoryId') {
      const cat = categories.find(c => c._id === val);
      updated[idx].categoryId = val;
      updated[idx].categoryName = cat ? cat.name : '';
    } else if (field === 'amount') {
      updated[idx].amount = Number(val) || 0;
    }
    setStructHeads(updated);
  };

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    if (!structName.trim()) {
      toast.error('Template name is required');
      return;
    }
    if (structHeads.length === 0) {
      toast.error('Please add at least one fee head');
      return;
    }

    setIsSubmittingStruct(true);
    try {
      await dispatch(createFeeStructure({
        name: structName.trim(),
        academicYearId: activeAcademicYear?._id,
        classIds: structClassIds,
        heads: structHeads,
        installments: structInstallments.map(inst => ({
          ...inst,
          amount: Math.round((totalStructureAmount * inst.percentage) / 100)
        })),
        description: structDescription
      })).unwrap();

      setIsStructureModalOpen(false);
    } catch (err) {
      // handled
    } finally {
      setIsSubmittingStruct(false);
    }
  };

  const handleDeleteStructure = (id) => {
    if (window.confirm('Are you sure you want to delete this fee structure template?')) {
      dispatch(deleteFeeStructure(id));
    }
  };

  const handleCreateHead = async (e) => {
    e.preventDefault();
    if (!headName.trim() || !headCode.trim()) {
      toast.error('Name and Code are required');
      return;
    }

    setIsSubmittingHead(true);
    try {
      await dispatch(createFeeCategory({
        name: headName.trim(),
        code: headCode.trim().toUpperCase(),
        type: headType,
        description: headDescription
      })).unwrap();

      setIsHeadModalOpen(false);
      setHeadName('');
      setHeadCode('');
      setHeadDescription('');
    } catch (err) {
      // handled
    } finally {
      setIsSubmittingHead(false);
    }
  };

  const handleDeleteHead = (id) => {
    if (window.confirm('Are you sure you want to delete this fee head?')) {
      dispatch(deleteFeeCategory(id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub Tab Switcher & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('structures')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'structures'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Class Fee Templates ({structures.length})
          </button>
          <button
            onClick={() => setActiveSubTab('heads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'heads'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Fee Heads & Categories ({categories.length})
          </button>
        </div>

        <div>
          {activeSubTab === 'structures' ? (
            <button
              onClick={handleOpenNewStructure}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <PlusIcon className="w-4 h-4" />
              New Structure Template
            </button>
          ) : (
            <button
              onClick={() => setIsHeadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <PlusIcon className="w-4 h-4" />
              Add Fee Head
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: Fee Structure Templates */}
      {activeSubTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {structures.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <BuildingLibraryIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No Fee Structure Templates Created</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Create class templates with tuition, lab, library, sports fee breakdown and installment milestones.
              </p>
              <button
                onClick={handleOpenNewStructure}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                + Create First Template
              </button>
            </div>
          ) : (
            structures.map((st) => (
              <div
                key={st._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        {st.heads?.length || 0} Fee Heads
                      </span>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1.5">{st.name}</h3>
                    </div>

                    <button
                      onClick={() => handleDeleteStructure(st._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete Structure"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Total Amount Badge */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Total Year Fee:</span>
                    <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">
                      ₹{st.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Fee Heads Breakdown */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <p className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Line Items:</p>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {(st.heads || []).map((h, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700/50">
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[170px]">
                            {h.categoryName || h.categoryId?.name || 'Fee Head'}
                          </span>
                          <span className="font-mono font-semibold text-gray-900 dark:text-white">
                            ₹{h.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applicable Classes */}
                  <div className="mt-4">
                    <p className="font-bold text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Applicable To:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(st.classIds || []).length === 0 ? (
                        <span className="text-[11px] text-gray-400 italic">All or unspecified</span>
                      ) : (
                        st.classIds.map(cls => (
                          <span key={cls._id || cls} className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md">
                            {cls.displayName || `${cls.name}-${cls.section}` || 'Class'}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Installments Info */}
                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 text-[11px] text-gray-500 flex justify-between">
                  <span>{st.installments?.length || 0} Installment Milestones</span>
                  <span className="text-emerald-600 font-semibold">Active</span>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB 2: Fee Heads & Categories */}
      {activeSubTab === 'heads' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Standard Fee Categories & Ledger Heads</h3>
              <p className="text-xs text-gray-500 mt-0.5">Pre-configured and custom fee heads for invoicing and receipt allocation</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Fee Head Name</th>
                  <th className="px-5 py-3.5">Type / Ledger</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {categories.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {c.code}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-800 dark:text-gray-200">
                      {c.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block uppercase font-bold text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {c.description || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleDeleteHead(c._id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Create Structure Template */}
      {isStructureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden my-6">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <BuildingLibraryIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Create Fee Structure Template</h3>
              </div>
              <button
                onClick={() => setIsStructureModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStructure} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Structure / Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={structName}
                  onChange={(e) => setStructName(e.target.value)}
                  placeholder="e.g. Higher Secondary Science Standard Fee (2026-27)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Target Classes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Applicable Classes ({structClassIds.length} selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600">
                  {classes.map(c => {
                    const isChecked = structClassIds.includes(c._id);
                    return (
                      <label key={c._id} className="flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setStructClassIds([...structClassIds, c._id]);
                            else setStructClassIds(structClassIds.filter(id => id !== c._id));
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span className="truncate">{c.displayName || `${c.name} - ${c.section}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Fee Heads Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Fee Heads & Amounts *
                  </label>
                  <button
                    type="button"
                    onClick={addHeadToStructure}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    + Add Head Row
                  </button>
                </div>

                <div className="space-y-2">
                  {structHeads.map((head, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={head.categoryId}
                        onChange={(e) => updateHeadRow(idx, 'categoryId', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none"
                      >
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name} ({cat.code})</option>
                        ))}
                      </select>

                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          required
                          value={head.amount}
                          onChange={(e) => updateHeadRow(idx, 'amount', e.target.value)}
                          className="w-full pl-6 pr-2 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      {structHeads.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHeadFromStructure(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total Calc */}
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300">Total Computed Fee:</span>
                  <span className="font-mono font-black text-base text-emerald-700 dark:text-emerald-400">
                    ₹{totalStructureAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Installments Breakdown Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Default Term Installments Schedule
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {structInstallments.map((inst, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600 text-xs">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{inst.name}</p>
                      <p className="text-[11px] text-gray-500">{inst.percentage}% of total</p>
                      <p className="font-mono font-bold text-emerald-600 mt-1">
                        ₹{Math.round((totalStructureAmount * inst.percentage) / 100)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsStructureModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStruct}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {isSubmittingStruct ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Save Fee Structure
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: Create Fee Head */}
      {isHeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Add Fee Head</h3>
              </div>
              <button
                onClick={() => setIsHeadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Fee Head Name *
                </label>
                <input
                  type="text"
                  required
                  value={headName}
                  onChange={(e) => setHeadName(e.target.value)}
                  placeholder="e.g. Smart Classroom Digital Fund"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Code (Unique) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={headCode}
                    onChange={(e) => setHeadCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DIGI"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Category Type *
                  </label>
                  <select
                    value={headType}
                    onChange={(e) => setHeadType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                  >
                    <option value="tuition">Tuition</option>
                    <option value="facility">Facility / Lab</option>
                    <option value="co_curricular">Sports / Arts</option>
                    <option value="transport">Transport</option>
                    <option value="examination">Exam</option>
                    <option value="one_time">One Time</option>
                    <option value="miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={headDescription}
                  onChange={(e) => setHeadDescription(e.target.value)}
                  placeholder="Optional notes or details"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsHeadModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHead}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {isSubmittingHead ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Save Fee Head
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default FeeStructuresManager;
