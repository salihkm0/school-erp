import React, { useState } from 'react';
import { 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon, 
  ClockIcon, 
  BuildingOfficeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import timetableService from '../../services/timetableService';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const roomTypes = [
  'Classroom',
  'Physics Lab',
  'Chemistry Lab',
  'Biology Lab',
  'Computer Lab',
  'Smart Class',
  'Library',
  'Auditorium',
  'Ground/Court',
  'Other'
];

const TimetableStructureModal = ({ 
  isOpen, 
  onClose, 
  structure, 
  onStructureUpdated 
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('periods'); // 'periods' | 'rooms' | 'workload'
  const [workingDays, setWorkingDays] = useState(structure?.workingDays || allDays);
  const [periods, setPeriods] = useState(structure?.periods || []);
  const [rooms, setRooms] = useState(structure?.rooms || []);
  const [maxTeacherPeriodsPerWeek, setMaxTeacherPeriodsPerWeek] = useState(structure?.maxTeacherPeriodsPerWeek || 28);
  const [maxTeacherPeriodsPerDay, setMaxTeacherPeriodsPerDay] = useState(structure?.maxTeacherPeriodsPerDay || 6);
  const [maxConsecutivePeriods, setMaxConsecutivePeriods] = useState(structure?.maxConsecutivePeriods || 3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle working day
  const handleToggleDay = (day) => {
    if (workingDays.includes(day)) {
      if (workingDays.length === 1) {
        toast.error('At least one working day is required');
        return;
      }
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  // Add Period
  const handleAddPeriod = () => {
    const nextNum = periods.length > 0 ? Math.max(...periods.map(p => p.periodNumber)) + 1 : 1;
    setPeriods([
      ...periods,
      {
        periodNumber: nextNum,
        name: `Period ${nextNum}`,
        startTime: '09:00',
        endTime: '09:45',
        type: 'regular',
        isBreak: false
      }
    ]);
  };

  // Remove Period
  const handleRemovePeriod = (index) => {
    setPeriods(periods.filter((_, idx) => idx !== index));
  };

  // Update Period
  const handleUpdatePeriod = (index, field, value) => {
    const updated = [...periods];
    updated[index][field] = value;
    if (field === 'isBreak' && value === true) {
      updated[index].type = 'break';
    }
    setPeriods(updated);
  };

  // Add Room
  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        name: `Room ${rooms.length + 101}`,
        type: 'Classroom',
        capacity: 50,
        building: 'Main Block',
        floor: 'Ground'
      }
    ]);
  };

  // Remove Room
  const handleRemoveRoom = (index) => {
    setRooms(rooms.filter((_, idx) => idx !== index));
  };

  // Update Room
  const handleUpdateRoom = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  // Save changes
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await timetableService.updateTimetableStructure({
        workingDays,
        periods,
        rooms,
        maxTeacherPeriodsPerWeek: Number(maxTeacherPeriodsPerWeek),
        maxTeacherPeriodsPerDay: Number(maxTeacherPeriodsPerDay),
        maxConsecutivePeriods: Number(maxConsecutivePeriods)
      });

      if (res.success) {
        toast.success('Timetable structure updated successfully');
        onStructureUpdated && onStructureUpdated(res.structure);
        onClose();
      }
    } catch (err) {
      console.error('Error saving structure:', err);
      toast.error(err.response?.data?.message || 'Failed to update structure');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Institutional Timetable Configuration
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Customize bell timings, break slots, working days, and room capacities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-100 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('periods')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'periods'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Period Timings & Days
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rooms'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Rooms & Laboratories ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'workload'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Teacher Workload Rules
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {activeTab === 'periods' && (
            <div className="space-y-5">
              {/* Working Days Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Institutional Working Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map(day => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        workingDays.includes(day)
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Periods List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Daily Period Schedule & Bell Timings ({periods.length} slots)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPeriod}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    <PlusIcon className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>

                <div className="space-y-2">
                  {periods.map((period, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex flex-wrap items-center gap-3 text-xs transition-all ${
                        period.isBreak ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50/70 border-gray-200'
                      }`}
                    >
                      <div className="w-8 font-bold text-gray-700 text-center">
                        #{period.periodNumber}
                      </div>

                      <div className="flex-1 min-w-[120px]">
                        <input
                          type="text"
                          value={period.name}
                          onChange={(e) => handleUpdatePeriod(idx, 'name', e.target.value)}
                          placeholder="Slot Label (e.g. Period 1)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-gray-800 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={period.startTime}
                          onChange={(e) => handleUpdatePeriod(idx, 'startTime', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700"
                        />
                        <span className="text-gray-400">to</span>
                        <input
                          type="time"
                          value={period.endTime}
                          onChange={(e) => handleUpdatePeriod(idx, 'endTime', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 cursor-pointer font-medium text-amber-800 bg-amber-100/60 px-2 py-1 rounded-lg">
                          <input
                            type="checkbox"
                            checked={period.isBreak}
                            onChange={(e) => handleUpdatePeriod(idx, 'isBreak', e.target.checked)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          Break / Interval
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemovePeriod(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Room & Laboratory Inventory
                </label>
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800"
                >
                  <PlusIcon className="w-3.5 h-3.5" /> Add Room / Lab
                </button>
              </div>

              <div className="space-y-2">
                {rooms.map((room, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-wrap items-center gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-[140px]">
                      <input
                        type="text"
                        value={room.name}
                        onChange={(e) => handleUpdateRoom(idx, 'name', e.target.value)}
                        placeholder="Room Name / Lab"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-gray-800"
                      />
                    </div>

                    <div className="w-36">
                      <select
                        value={room.type}
                        onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
                      >
                        {roomTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24">
                      <input
                        type="number"
                        value={room.capacity}
                        onChange={(e) => handleUpdateRoom(idx, 'capacity', Number(e.target.value))}
                        placeholder="Capacity"
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-white"
                      />
                    </div>

                    <div className="w-28">
                      <input
                        type="text"
                        value={room.building || ''}
                        onChange={(e) => handleUpdateRoom(idx, 'building', e.target.value)}
                        placeholder="Building Block"
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRoom(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Maximum Teaching Periods per Week
                </label>
                <input
                  type="number"
                  value={maxTeacherPeriodsPerWeek}
                  onChange={(e) => setMaxTeacherPeriodsPerWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">Standard recommendation: 24-28 periods / week.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Maximum Teaching Periods per Day
                </label>
                <input
                  type="number"
                  value={maxTeacherPeriodsPerDay}
                  onChange={(e) => setMaxTeacherPeriodsPerDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Maximum Consecutive Periods
                </label>
                <input
                  type="number"
                  value={maxConsecutivePeriods}
                  onChange={(e) => setMaxConsecutivePeriods(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
          >
            <CheckIcon className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableStructureModal;
