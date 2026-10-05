// src/components/events/ResultEntryModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import eventService from '../../services/eventService';
import {
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ResultEntryModal = ({ isOpen, onClose, eventId, item, event, onResultRecorded }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State: 1st, 2nd, 3rd place winners
  const [winners, setWinners] = useState([
    { position: 1, participantId: '', studentId: '', studentName: '', chestNumber: '', groupId: '', groupName: '', groupColor: '', grade: 'A', scoreOrTime: '', pointsAwarded: 5 },
    { position: 2, participantId: '', studentId: '', studentName: '', chestNumber: '', groupId: '', groupName: '', groupColor: '', grade: 'A', scoreOrTime: '', pointsAwarded: 3 },
    { position: 3, participantId: '', studentId: '', studentName: '', chestNumber: '', groupId: '', groupName: '', groupColor: '', grade: 'B', scoreOrTime: '', pointsAwarded: 1 },
  ]);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (eventId && item && isOpen) {
      loadCallSheet();
    }
  }, [eventId, item, isOpen]);

  const loadCallSheet = async () => {
    setLoading(true);
    try {
      const data = await eventService.getItemCallSheet(eventId, item._id);
      const parts = data.participants || [];
      setParticipants(parts);

      // Pre-calculate point defaults
      const isGroup = item.itemType === 'group';
      const firstPts = item.pointsOverride?.first ?? (isGroup ? event.pointSystem?.groupFirst || 10 : event.pointSystem?.individualFirst || 5);
      const secondPts = item.pointsOverride?.second ?? (isGroup ? event.pointSystem?.groupSecond || 6 : event.pointSystem?.individualSecond || 3);
      const thirdPts = item.pointsOverride?.third ?? (isGroup ? event.pointSystem?.groupThird || 2 : event.pointSystem?.individualThird || 1);

      // If results already exist, populate them
      const resultsData = await eventService.getEventResults(eventId);
      const existing = resultsData.find((r) => r.item?._id === item._id || r.item === item._id);

      if (existing && existing.winners && existing.winners.length > 0) {
        setWinners(existing.winners);
        setRemarks(existing.remarks || '');
      } else {
        setWinners([
          { position: 1, participantId: '', studentId: '', studentName: '', chestNumber: '', groupId: '', groupName: '', groupColor: '', grade: 'None', scoreOrTime: '', pointsAwarded: firstPts },
          { position: 2, participantId: '', studentId: '', studentName: '', chestNumber: '', groupId: '', groupName: '', groupColor: '', grade: 'None', scoreOrTime: '', pointsAwarded: secondPts },
          { position: 3, participantId: '', studentId: '', studentName: '', chestNumber: '', groupId: '', groupName: '', groupColor: '', grade: 'None', scoreOrTime: '', pointsAwarded: thirdPts },
        ]);
        setRemarks('');
      }
    } catch (err) {
      toast.error('Failed to load item participant list');
    } finally {
      setLoading(false);
    }
  };

  const handleWinnerSelect = (index, participantId) => {
    const selected = participants.find((p) => p._id === participantId);
    const updated = [...winners];

    if (selected) {
      updated[index] = {
        ...updated[index],
        participantId: selected._id,
        studentId: selected.student?._id,
        studentName: selected.student?.fullName || '',
        admissionNo: selected.student?.admissionNo || '',
        chestNumber: selected.chestNumber || '',
        groupId: selected.group,
        groupName: selected.groupName,
        groupColor: selected.groupColor,
      };
    } else {
      updated[index] = {
        ...updated[index],
        participantId: '',
        studentId: '',
        studentName: '',
        chestNumber: '',
        groupId: '',
        groupName: '',
        groupColor: '',
      };
    }
    setWinners(updated);
  };

  // For group items where selection might be house-based directly
  const handleGroupWinnerSelect = (index, groupId) => {
    const selectedGroup = event.groups?.find((g) => g._id === groupId);
    const updated = [...winners];

    if (selectedGroup) {
      updated[index] = {
        ...updated[index],
        participantId: '',
        studentId: null,
        studentName: selectedGroup.name,
        groupId: selectedGroup._id,
        groupName: selectedGroup.name,
        groupColor: selectedGroup.color,
      };
    }
    setWinners(updated);
  };

  const handleWinnerFieldChange = (index, field, value) => {
    const updated = [...winners];
    updated[index] = { ...updated[index], [field]: value };
    setWinners(updated);
  };

  const handleAddWinnerRow = () => {
    setWinners((prev) => [
      ...prev,
      {
        position: prev.length + 1,
        participantId: '',
        studentId: '',
        studentName: '',
        chestNumber: '',
        groupId: '',
        groupName: '',
        groupColor: '',
        grade: 'None',
        scoreOrTime: '',
        pointsAwarded: 0,
      },
    ]);
  };

  const handleRemoveWinnerRow = (index) => {
    setWinners((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validWinners = winners.filter((w) => w.groupId || w.participantId || w.studentName);

    if (validWinners.length === 0) {
      toast.error('Please assign at least 1st place winner');
      return;
    }

    setSaving(true);
    try {
      await eventService.recordItemResult(eventId, item._id, {
        winners: validWinners,
        remarks,
        published: true,
      });
      toast.success('Results published live! Points table updated!');
      onResultRecorded?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record results');
    } finally {
      setSaving(false);
    }
  };

  const isGroupItem = item?.itemType === 'group';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enter & Publish Results: ${item?.name || ''}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
        {/* Item Summary Banner */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              {item?.category} · {item?.gender} · {item?.itemType}
            </span>
            <h4 className="text-base font-black">{item?.name}</h4>
          </div>
          <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Venue: {item?.stageVenue || 'Main Ground'}
          </span>
        </div>

        {/* Winner Rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Podium Winners & Score Entry
            </h4>
            <button
              type="button"
              onClick={handleAddWinnerRow}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Position
            </button>
          </div>

          <div className="space-y-2.5">
            {winners.map((winner, idx) => {
              const posLabel =
                winner.position === 1
                  ? '🥇 1st Place'
                  : winner.position === 2
                  ? '🥈 2nd Place'
                  : winner.position === 3
                  ? '🥉 3rd Place'
                  : `Position #${winner.position}`;

              return (
                <div
                  key={idx}
                  className="p-3 border rounded-xl bg-gray-50 flex flex-col md:flex-row items-start md:items-center gap-3"
                >
                  <div className="w-28 flex-shrink-0">
                    <span className="text-xs font-black text-gray-900 block">{posLabel}</span>
                  </div>

                  {/* Participant or House Selector */}
                  <div className="flex-1 w-full">
                    {isGroupItem ? (
                      <select
                        value={winner.groupId || ''}
                        onChange={(e) => handleGroupWinnerSelect(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="">Select Winning House / Team</option>
                        {event?.groups?.map((g) => (
                          <option key={g._id} value={g._id}>
                            {g.name} ({g.code || ''})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={winner.participantId || ''}
                        onChange={(e) => handleWinnerSelect(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="">Select Winner by Chest No / Name</option>
                        {participants.map((p) => (
                          <option key={p._id} value={p._id}>
                            [{p.chestNumber}] {p.student?.fullName || 'Student'} ({p.groupName})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Grade Selector */}
                  <div className="w-24">
                    <select
                      value={winner.grade}
                      onChange={(e) => handleWinnerFieldChange(idx, 'grade', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="None">Grade: None</option>
                      <option value="A">Grade A</option>
                      <option value="B">Grade B</option>
                      <option value="C">Grade C</option>
                    </select>
                  </div>

                  {/* Score / Timing */}
                  <div className="w-28">
                    <input
                      type="text"
                      value={winner.scoreOrTime || ''}
                      onChange={(e) => handleWinnerFieldChange(idx, 'scoreOrTime', e.target.value)}
                      placeholder="e.g. 10.82s / 88pts"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white font-mono"
                    />
                  </div>

                  {/* Points Awarded */}
                  <div className="w-20">
                    <input
                      type="number"
                      value={winner.pointsAwarded}
                      onChange={(e) =>
                        handleWinnerFieldChange(idx, 'pointsAwarded', parseInt(e.target.value) || 0)
                      }
                      title="Points Awarded"
                      className="w-full px-2 py-1.5 text-xs font-black text-emerald-700 border border-emerald-300 rounded-lg bg-white text-center"
                    />
                  </div>

                  {idx > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWinnerRow(idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Remarks / Judges Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Remarks / Judges Decision</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. New school record established by 0.12s"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-gray-500 italic">
            ⚡ Publishing updates the live leaderboard and broadcasts via WebSockets instantly.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {saving ? 'Publishing...' : 'Publish Results Live'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ResultEntryModal;
