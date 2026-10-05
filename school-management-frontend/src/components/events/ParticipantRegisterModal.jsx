// src/components/events/ParticipantRegisterModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import eventService from '../../services/eventService';
import studentService from '../../services/studentService';
import {
  HashtagIcon,
  UserPlusIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ParticipantRegisterModal = ({ isOpen, onClose, event, onRegistered }) => {
  const [students, setStudents] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    groupId: event?.groups?.[0]?._id || '',
    category: event?.categories?.[0] || 'General',
    chestNumber: '',
    registeredItems: [],
  });

  useEffect(() => {
    if (isOpen && event) {
      loadData();
      setFormData({
        studentId: '',
        groupId: event.groups?.[0]?._id || '',
        category: event.categories?.[0] || 'General',
        chestNumber: '',
        registeredItems: [],
      });
    }
  }, [isOpen, event]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, itemsRes] = await Promise.all([
        studentService.getAllStudents({ limit: 500 }),
        eventService.getEventItems(event._id),
      ]);
      setStudents(studentsRes.data || studentsRes || []);
      setItems(itemsRes || []);
    } catch (err) {
      toast.error('Failed to load students and items');
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (itemId) => {
    setFormData((prev) => {
      const exists = prev.registeredItems.includes(itemId);
      return {
        ...prev,
        registeredItems: exists
          ? prev.registeredItems.filter((id) => id !== itemId)
          : [...prev.registeredItems, itemId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      toast.error('Please select a student');
      return;
    }
    if (!formData.groupId) {
      toast.error('Please select a house / group');
      return;
    }

    setSubmitting(true);
    try {
      await eventService.registerParticipant(event._id, formData);
      toast.success('Student registered for event successfully');
      onRegistered?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Student & Allocate Chest No" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
        {/* Student Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Select Student *</label>
          <select
            required
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Choose a student from roster...</option>
            {students.map((st) => (
              <option key={st._id} value={st._id}>
                {st.fullName} ({st.admissionNo}) - Class {st.currentClass?.name || ''}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* House / Group Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">House / Team *</label>
            <select
              required
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {event?.groups?.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name} ({g.code || ''})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Age / Class Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {event?.categories?.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chest Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Chest Number <span className="text-gray-400 font-normal">(Leave blank to auto-generate)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.chestNumber}
              onChange={(e) => setFormData({ ...formData, chestNumber: e.target.value.toUpperCase() })}
              placeholder="e.g. 101, RED-105"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono font-bold"
            />
          </div>
        </div>

        {/* Competition Items Checklist */}
        <div className="space-y-2 pt-2 border-t">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Registered Competition Items ({formData.registeredItems.length} selected)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-gray-50 rounded-xl border">
            {items.length === 0 ? (
              <p className="text-xs text-gray-400 p-2 sm:col-span-2 text-center">
                No items added yet. You can add items first in the Items tab.
              </p>
            ) : (
              items.map((it) => {
                const isChecked = formData.registeredItems.includes(it._id);
                return (
                  <button
                    key={it._id}
                    type="button"
                    onClick={() => handleItemToggle(it._id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{it.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {it.category} · {it.itemType}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ParticipantRegisterModal;
