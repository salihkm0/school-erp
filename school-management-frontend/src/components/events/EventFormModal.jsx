// src/components/events/EventFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent, updateEvent } from '../../store/slices/eventSlice';
import Modal from '../common/Modal';
import {
  PlusIcon,
  TrashIcon,
  SparklesIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  HashtagIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DEFAULT_HOUSES = [
  { name: 'Red House', code: 'RED', color: '#EF4444' },
  { name: 'Blue House', code: 'BLU', color: '#3B82F6' },
  { name: 'Green House', code: 'GRN', color: '#10B981' },
  { name: 'Yellow House', code: 'YEL', color: '#F59E0B' },
];

const EventFormModal = ({ isOpen, onClose, event, academicYears = [] }) => {
  const dispatch = useDispatch();
  const isEditing = !!event;

  const [formData, setFormData] = useState({
    name: '',
    eventType: 'sports',
    academicYear: '',
    startDate: '',
    endDate: '',
    venue: '',
    description: '',
    groupingType: 'house',
    groups: DEFAULT_HOUSES,
    categories: ['Sub-Junior', 'Junior', 'Senior', 'General'],
    chestNumberConfig: {
      prefix: '',
      startNumber: 101,
      digits: 3,
      allocationStrategy: 'sequential',
    },
    pointSystem: {
      individualFirst: 5,
      individualSecond: 3,
      individualThird: 1,
      groupFirst: 10,
      groupSecond: 6,
      groupThird: 2,
      gradePoints: { A: 5, B: 3, C: 1 },
    },
  });

  const [newCategoryInput, setNewCategoryInput] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        eventType: event.eventType || 'sports',
        academicYear: event.academicYear?._id || event.academicYear || '',
        startDate: event.startDate ? event.startDate.substring(0, 10) : '',
        endDate: event.endDate ? event.endDate.substring(0, 10) : '',
        venue: event.venue || '',
        description: event.description || '',
        groupingType: event.groupingType || 'house',
        groups: event.groups && event.groups.length > 0 ? event.groups : DEFAULT_HOUSES,
        categories: event.categories || ['Sub-Junior', 'Junior', 'Senior', 'General'],
        chestNumberConfig: {
          prefix: event.chestNumberConfig?.prefix || '',
          startNumber: event.chestNumberConfig?.startNumber || 101,
          digits: event.chestNumberConfig?.digits || 3,
          allocationStrategy: event.chestNumberConfig?.allocationStrategy || 'sequential',
        },
        pointSystem: {
          individualFirst: event.pointSystem?.individualFirst ?? 5,
          individualSecond: event.pointSystem?.individualSecond ?? 3,
          individualThird: event.pointSystem?.individualThird ?? 1,
          groupFirst: event.pointSystem?.groupFirst ?? 10,
          groupSecond: event.pointSystem?.groupSecond ?? 6,
          groupThird: event.pointSystem?.groupThird ?? 2,
          gradePoints: event.pointSystem?.gradePoints || { A: 5, B: 3, C: 1 },
        },
      });
    } else {
      const activeYear = academicYears.find((y) => y.isCurrent || y.status === 'active');
      setFormData({
        name: '',
        eventType: 'sports',
        academicYear: activeYear?._id || '',
        startDate: new Date().toISOString().substring(0, 10),
        endDate: new Date().toISOString().substring(0, 10),
        venue: 'School Ground / Auditorium',
        description: '',
        groupingType: 'house',
        groups: DEFAULT_HOUSES,
        categories: ['Sub-Junior', 'Junior', 'Senior', 'General'],
        chestNumberConfig: {
          prefix: '',
          startNumber: 101,
          digits: 3,
          allocationStrategy: 'sequential',
        },
        pointSystem: {
          individualFirst: 5,
          individualSecond: 3,
          individualThird: 1,
          groupFirst: 10,
          groupSecond: 6,
          groupThird: 2,
          gradePoints: { A: 5, B: 3, C: 1 },
        },
      });
    }
  }, [event, academicYears, isOpen]);

  // Handle House / Group Changes
  const handleGroupChange = (index, field, value) => {
    const updated = [...formData.groups];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, groups: updated }));
  };

  const handleAddGroup = () => {
    setFormData((prev) => ({
      ...prev,
      groups: [
        ...prev.groups,
        { name: `House ${prev.groups.length + 1}`, code: `H${prev.groups.length + 1}`, color: '#6366F1' },
      ],
    }));
  };

  const handleRemoveGroup = (index) => {
    if (formData.groups.length <= 2) {
      toast.error('An event must have at least 2 groups');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      groups: prev.groups.filter((_, i) => i !== index),
    }));
  };

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    if (formData.categories.includes(newCategoryInput.trim())) {
      toast.error('Category already exists');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategoryInput.trim()],
    }));
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (catToRemove) => {
    if (formData.categories.length <= 1) {
      toast.error('At least one category is required');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter an event name');
      return;
    }
    if (!formData.academicYear) {
      toast.error('Please select an academic year');
      return;
    }

    if (isEditing) {
      await dispatch(updateEvent({ id: event._id, eventData: formData }));
    } else {
      await dispatch(createEvent(formData));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Event / Fest' : 'Create New Sports / Arts Event'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
        {/* Basic Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-1">
            1. Event Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Event Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Annual Sports Meet 2026, Arts Fest / Kalolsavam"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Event Type *</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="sports">🏅 Sports Day / Meet</option>
                <option value="arts">🎭 Arts Fest / Kalolsavam</option>
                <option value="cultural">🎨 Cultural Festival</option>
                <option value="academic">📚 Science & Academic Fair</option>
                <option value="other">⭐ Other School Fest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year *</label>
              <select
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((yr) => (
                  <option key={yr._id} value={yr._id}>
                    {yr.name} {yr.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / Location</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. School Stadium, Auditorium, Main Ground"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* House & Team Setup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              2. Groups & Houses ({formData.groups.length})
            </h4>
            <button
              type="button"
              onClick={handleAddGroup}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add House
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.groups.map((grp, idx) => (
              <div key={idx} className="p-3 border rounded-xl bg-gray-50 flex items-center gap-2">
                <input
                  type="color"
                  value={grp.color || '#3B82F6'}
                  onChange={(e) => handleGroupChange(idx, 'color', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  title="Pick House Theme Color"
                />
                <input
                  type="text"
                  value={grp.name}
                  onChange={(e) => handleGroupChange(idx, 'name', e.target.value)}
                  placeholder="House Name"
                  className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={grp.code || ''}
                  onChange={(e) => handleGroupChange(idx, 'code', e.target.value.toUpperCase())}
                  placeholder="Code (e.g. RED)"
                  className="w-16 px-2 py-1.5 text-xs font-mono font-bold bg-white border border-gray-300 rounded-lg uppercase"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(idx)}
                  className="p-1 text-gray-400 hover:text-rose-600 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-1">
            3. Age / Class Categories
          </h4>

          <div className="flex flex-wrap gap-2 items-center">
            {formData.categories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-emerald-500 hover:text-emerald-800 font-bold"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Add category (e.g. LP, UP, HS, HSS)"
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Chest Number Settings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-1">
            4. Chest Number Configuration
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">Prefix (Optional)</label>
              <input
                type="text"
                value={formData.chestNumberConfig.prefix}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chestNumberConfig: { ...formData.chestNumberConfig, prefix: e.target.value },
                  })
                }
                placeholder="e.g. SPT-"
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">Start Number</label>
              <input
                type="number"
                value={formData.chestNumberConfig.startNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chestNumberConfig: {
                      ...formData.chestNumberConfig,
                      startNumber: parseInt(e.target.value) || 101,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">Allocation Format</label>
              <select
                value={formData.chestNumberConfig.allocationStrategy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chestNumberConfig: {
                      ...formData.chestNumberConfig,
                      allocationStrategy: e.target.value,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
              >
                <option value="sequential">Sequential (101, 102, 103...)</option>
                <option value="house_prefix">House Prefix (RED-101, BLU-101)</option>
                <option value="category_prefix">Category Prefix (JUN-101, SEN-101)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Point Rules */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-1">
            5. Points Distribution System
          </h4>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-800 block">Ind. 1st</span>
              <input
                type="number"
                value={formData.pointSystem.individualFirst}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointSystem: { ...formData.pointSystem, individualFirst: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-12 text-center text-sm font-black border border-amber-300 rounded mt-1"
              />
            </div>

            <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-300 text-center">
              <span className="text-[10px] font-bold text-slate-700 block">Ind. 2nd</span>
              <input
                type="number"
                value={formData.pointSystem.individualSecond}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointSystem: { ...formData.pointSystem, individualSecond: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-12 text-center text-sm font-black border border-slate-300 rounded mt-1"
              />
            </div>

            <div className="bg-amber-100/50 p-2.5 rounded-lg border border-amber-700/30 text-center">
              <span className="text-[10px] font-bold text-amber-900 block">Ind. 3rd</span>
              <input
                type="number"
                value={formData.pointSystem.individualThird}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointSystem: { ...formData.pointSystem, individualThird: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-12 text-center text-sm font-black border border-amber-300 rounded mt-1"
              />
            </div>

            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">Grp. 1st</span>
              <input
                type="number"
                value={formData.pointSystem.groupFirst}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointSystem: { ...formData.pointSystem, groupFirst: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-12 text-center text-sm font-black border border-emerald-300 rounded mt-1"
              />
            </div>

            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">Grp. 2nd</span>
              <input
                type="number"
                value={formData.pointSystem.groupSecond}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointSystem: { ...formData.pointSystem, groupSecond: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-12 text-center text-sm font-black border border-emerald-300 rounded mt-1"
              />
            </div>

            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">Grp. 3rd</span>
              <input
                type="number"
                value={formData.pointSystem.groupThird}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointSystem: { ...formData.pointSystem, groupThird: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-12 text-center text-sm font-black border border-emerald-300 rounded mt-1"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
          >
            {isEditing ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
