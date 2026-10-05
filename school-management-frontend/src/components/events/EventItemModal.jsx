// src/components/events/EventItemModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

const EventItemModal = ({ isOpen, onClose, eventId, item, categories = [], onSaved }) => {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: categories[0] || 'General',
    itemType: 'individual',
    gender: 'open',
    maxParticipantsPerGroup: 2,
    minGroupMembers: 1,
    maxGroupMembers: 10,
    stageVenue: 'Main Ground / Stage',
    scheduledDate: '',
    scheduledTime: '',
    rules: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        code: item.code || '',
        category: item.category || categories[0] || 'General',
        itemType: item.itemType || 'individual',
        gender: item.gender || 'open',
        maxParticipantsPerGroup: item.maxParticipantsPerGroup || 2,
        minGroupMembers: item.minGroupMembers || 1,
        maxGroupMembers: item.maxGroupMembers || 10,
        stageVenue: item.stageVenue || 'Main Ground / Stage',
        scheduledDate: item.scheduledDate ? item.scheduledDate.substring(0, 10) : '',
        scheduledTime: item.scheduledTime || '',
        rules: item.rules || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        category: categories[0] || 'General',
        itemType: 'individual',
        gender: 'open',
        maxParticipantsPerGroup: 2,
        minGroupMembers: 1,
        maxGroupMembers: 10,
        stageVenue: 'Main Ground / Stage',
        scheduledDate: '',
        scheduledTime: '',
        rules: '',
      });
    }
  }, [item, categories, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Item name is required');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await eventService.updateEventItem(eventId, item._id, formData);
        toast.success('Competition item updated');
      } else {
        await eventService.createEventItem(eventId, formData);
        toast.success('Competition item added successfully');
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Competition Item' : 'Add New Competition Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Item / Competition Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. 100m Sprint, 4x100m Relay, Bharatanatyam, Mime"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Item Code / Number</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SPT-01, ART-104"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Item Format *</label>
            <select
              value={formData.itemType}
              onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="individual">👤 Individual Item</option>
              <option value="group">👥 Group / Team Item</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Gender Division *</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="open">🌐 Open (All)</option>
              <option value="boys">👦 Boys Only</option>
              <option value="girls">👧 Girls Only</option>
              <option value="mixed">👫 Mixed / Co-Ed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Max Entries Per House / Group
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.maxParticipantsPerGroup}
              onChange={(e) =>
                setFormData({ ...formData, maxParticipantsPerGroup: parseInt(e.target.value) || 1 })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Stage / Track Venue</label>
            <input
              type="text"
              value={formData.stageVenue}
              onChange={(e) => setFormData({ ...formData, stageVenue: e.target.value })}
              placeholder="e.g. Stage 1, Track A, Auditorium"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Scheduled Time</label>
            <input
              type="text"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              placeholder="e.g. 10:00 AM"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Rules & Notes (Optional)</label>
            <textarea
              rows="2"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              placeholder="e.g. Time limit 5 mins, standard IAAF rules apply..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>
        </div>

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
            disabled={loading}
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventItemModal;
