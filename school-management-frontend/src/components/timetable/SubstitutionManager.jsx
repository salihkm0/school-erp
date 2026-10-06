import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  UserMinusIcon, 
  UserPlusIcon, 
  ArrowPathIcon, 
  PrinterIcon, 
  CheckCircleIcon, 
  ClockIcon,
  TrashIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import timetableService from '../../services/timetableService';

const SubstitutionManager = ({ 
  staffList = [], 
  classes = [], 
  structure, 
  onOpenPrint 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [substitutions, setSubstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Wizard Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [absentTeacherId, setAbsentTeacherId] = useState('');
  const [absenceReason, setAbsenceReason] = useState('Casual Leave');
  const [affectedPeriods, setAffectedPeriods] = useState([]);
  const [isAnalyzingAbsence, setIsAnalyzingAbsence] = useState(false);

  // Free teacher lookup modal state
  const [activeSlotLookup, setActiveSlotLookup] = useState(null); // { periodIdx, day, periodNumber, subjectId }
  const [freeTeachers, setFreeTeachers] = useState([]);
  const [isLoadingFreeTeachers, setIsLoadingFreeTeachers] = useState(false);

  // Helper to get day name from date string
  const getDayName = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const dayName = getDayName(selectedDate);

  // Load substitutions for selected date
  const loadSubstitutions = async (date) => {
    setIsLoading(true);
    try {
      const res = await timetableService.getSubstitutions({ date });
      if (res.success) {
        setSubstitutions(res.substitutions || []);
      }
    } catch (err) {
      console.error('Error loading substitutions:', err);
      toast.error('Failed to load daily substitutions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubstitutions(selectedDate);
  }, [selectedDate]);

  // Analyze absent teacher's periods for selected date
  const handleSelectAbsentTeacher = (teacherId) => {
    setAbsentTeacherId(teacherId);
    if (!teacherId) {
      setAffectedPeriods([]);
      return;
    }

    setIsAnalyzingAbsence(true);
    const teacher = staffList.find(s => s._id === teacherId);
    const affected = [];

    classes.forEach(cls => {
      const className = cls.section ? `${cls.name}-${cls.section}` : cls.name;
      const daySchedule = cls.timetable?.find(d => d.day === dayName);

      daySchedule?.periods?.forEach((p, idx) => {
        const tId = p.teacherId?._id || p.teacherId;
        if (tId && tId.toString() === teacherId.toString()) {
          const pNum = p.periodNumber || (idx + 1);
          affected.push({
            classId: cls._id,
            className,
            periodNumber: pNum,
            startTime: p.startTime,
            endTime: p.endTime,
            subjectId: p.subjectId?._id || p.subjectId,
            subjectName: p.subjectId?.name || 'Class Subject',
            room: p.room || `Room ${cls.name}`,
            originalTeacherId: teacher._id,
            originalTeacherName: teacher.name,
            substituteTeacherId: '',
            substituteTeacherName: '',
            reason: absenceReason
          });
        }
      });
    });

    // Sort by periodNumber
    affected.sort((a, b) => a.periodNumber - b.periodNumber);
    setAffectedPeriods(affected);
    setIsAnalyzingAbsence(false);

    if (affected.length === 0) {
      toast('Selected teacher has no scheduled classes on this day.', { icon: 'ℹ️' });
    }
  };

  // Open Free Teacher finder for a specific period
  const handleOpenFreeTeacherFinder = async (periodItem, idx) => {
    setActiveSlotLookup({ ...periodItem, index: idx });
    setIsLoadingFreeTeachers(true);
    try {
      const res = await timetableService.getFreeTeachersForPeriod({
        date: selectedDate,
        day: dayName,
        periodNumber: periodItem.periodNumber,
        subjectId: periodItem.subjectId
      });
      if (res.success) {
        // Exclude the absent teacher
        const filtered = (res.freeTeachers || []).filter(t => t._id !== absentTeacherId);
        setFreeTeachers(filtered);
      }
    } catch (err) {
      console.error('Error finding free teachers:', err);
      toast.error('Failed to load free teachers');
    } finally {
      setIsLoadingFreeTeachers(false);
    }
  };

  // Assign substitute from lookup modal
  const handleAssignSubstitute = (teacher) => {
    if (activeSlotLookup === null) return;
    const updated = [...affectedPeriods];
    updated[activeSlotLookup.index].substituteTeacherId = teacher._id;
    updated[activeSlotLookup.index].substituteTeacherName = teacher.name;
    setAffectedPeriods(updated);
    setActiveSlotLookup(null);
    toast.success(`Assigned ${teacher.name} to Period ${activeSlotLookup.periodNumber}`);
  };

  // Submit and save substitutions
  const handleSaveSubstitutions = async () => {
    if (affectedPeriods.length === 0) return;

    try {
      const payload = affectedPeriods.map(item => ({
        date: selectedDate,
        day: dayName,
        periodNumber: item.periodNumber,
        startTime: item.startTime,
        endTime: item.endTime,
        classId: item.classId,
        originalTeacherId: item.originalTeacherId,
        originalTeacherName: item.originalTeacherName,
        substituteTeacherId: item.substituteTeacherId || null,
        substituteTeacherName: item.substituteTeacherName || '',
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        room: item.room,
        reason: absenceReason,
        status: item.substituteTeacherId ? 'assigned' : 'pending'
      }));

      const res = await timetableService.createSubstitution({ substitutions: payload });
      if (res.success) {
        toast.success('Substitutions recorded successfully!');
        setIsWizardOpen(false);
        setAbsentTeacherId('');
        setAffectedPeriods([]);
        loadSubstitutions(selectedDate);
      }
    } catch (err) {
      console.error('Error saving substitutions:', err);
      toast.error(err.response?.data?.message || 'Failed to save substitutions');
    }
  };

  // Update status or delete substitution
  const handleStatusChange = async (id, status) => {
    try {
      const res = await timetableService.updateSubstitution(id, { status });
      if (res.success) {
        toast.success(`Status changed to ${status}`);
        loadSubstitutions(selectedDate);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteSubstitution = async (id) => {
    if (!window.confirm('Delete this substitution record?')) return;
    try {
      const res = await timetableService.deleteSubstitution(id);
      if (res.success) {
        toast.success('Substitution deleted');
        loadSubstitutions(selectedDate);
      }
    } catch (err) {
      toast.error('Failed to delete substitution');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 flex-shrink-0">
            <ArrowPathIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Daily Substitution Roster
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {substitutions.length} Arrangement(s)
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-amber-500 pb-0.5 focus:outline-none cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-500">
                ({dayName})
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200"
          >
            Today
          </button>

          <button
            onClick={() => onOpenPrint && onOpenPrint('substitution', { selectedDate, dayName, substitutions })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <PrinterIcon className="w-4 h-4 text-gray-500" />
            Print Daily Roster Sheet
          </button>

          <button
            onClick={() => {
              setIsWizardOpen(true);
              setAbsentTeacherId('');
              setAffectedPeriods([]);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all"
          >
            <UserMinusIcon className="w-4 h-4" />
            Mark Teacher Absent & Auto-Arrange
          </button>
        </div>
      </div>

      {/* Daily Substitutions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">
            Substitutions for {dayName}, {selectedDate}
          </h3>
          <span className="text-xs text-gray-400">
            {substitutions.filter(s => s.status === 'assigned' || s.status === 'completed').length} of {substitutions.length} covered
          </span>
        </div>

        {substitutions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">No Teacher Absences Logged</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              All classes on {dayName} are running with their regular teachers. Click "Mark Teacher Absent" to arrange replacements if needed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent Teacher</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Substitute</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject & Room</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-xs">
                {substitutions.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                      Period {sub.periodNumber}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {sub.startTime} - {sub.endTime}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                      Class {sub.classId?.section ? `${sub.classId.name}-${sub.classId.section}` : sub.classId?.name || ''}
                    </td>
                    <td className="px-5 py-3.5 text-rose-700 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        {sub.originalTeacherId?.name || sub.originalTeacherName}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold whitespace-nowrap">
                      {sub.substituteTeacherId ? (
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>{sub.substituteTeacherId?.name || sub.substituteTeacherName}</span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Assignment
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">{sub.subjectId?.name || sub.subjectName || 'Regular Class'}</div>
                      <div className="text-[10px] text-gray-400">{sub.room || 'Classroom'}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {sub.reason || 'Leave'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <select
                        value={sub.status}
                        onChange={(e) => handleStatusChange(sub._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${
                          sub.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          sub.status === 'assigned' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          sub.status === 'notified' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="notified">Notified</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteSubstitution(sub._id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete record"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Absence & Substitution Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Arrange Teacher Absence & Substitutions
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Date: <span className="font-semibold text-gray-700">{selectedDate} ({dayName})</span>
                </p>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Absent Teacher Selector & Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Absent Teacher
                  </label>
                  <select
                    value={absentTeacherId}
                    onChange={(e) => handleSelectAbsentTeacher(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="">-- Select Teacher --</option>
                    {staffList.filter(s => s.role === 'teacher' || !s.role).map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name} {s.shortName ? `(${s.shortName})` : ''} - {s.staffCode || ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Reason for Absence
                  </label>
                  <select
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Official Duty">Official Duty</option>
                    <option value="Training / Workshop">Training / Workshop</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Affected Periods Breakdown */}
              {absentTeacherId && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                      Affected Periods on {dayName} ({affectedPeriods.length})
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      Click "Find Free Teachers" to auto-suggest available staff
                    </span>
                  </div>

                  {affectedPeriods.length === 0 ? (
                    <div className="p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400">
                      No classes scheduled for this teacher on {dayName}.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {affectedPeriods.map((slot, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                                Period {slot.periodNumber}
                              </span>
                              <span className="font-bold text-gray-900 text-xs">
                                Class {slot.className}
                              </span>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-gray-600 text-xs font-medium">
                                {slot.subjectName}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {slot.startTime} - {slot.endTime} • Room: {slot.room}
                            </div>
                          </div>

                          {/* Substitute Selection Button */}
                          <div className="flex items-center gap-2">
                            {slot.substituteTeacherName ? (
                              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{slot.substituteTeacherName}</span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenFreeTeacherFinder(slot, idx)}
                                  className="ml-1 text-[10px] text-emerald-600 underline"
                                >
                                  Change
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenFreeTeacherFinder(slot, idx)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
                              >
                                <SparklesIcon className="w-3.5 h-3.5 text-amber-600" />
                                Find Free Teachers
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubstitutions}
                disabled={affectedPeriods.length === 0}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 shadow-sm"
              >
                Save & Publish Substitutions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Teacher Picker Sub-Modal */}
      {activeSlotLookup && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Available Teachers (Period {activeSlotLookup.periodNumber})
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Subject: <span className="font-semibold text-gray-700">{activeSlotLookup.subjectName}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveSlotLookup(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {isLoadingFreeTeachers ? (
              <div className="py-8 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-4 h-4 animate-spin text-amber-500" />
                Scanning active schedules...
              </div>
            ) : freeTeachers.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No free teachers found for this period.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {freeTeachers.map(teacher => (
                  <div
                    key={teacher._id}
                    onClick={() => handleAssignSubstitute(teacher)}
                    className="p-3 rounded-2xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-xs">{teacher.name}</span>
                        {teacher.isSubjectMatch && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            Subject Match
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {teacher.staffCode || ''} {teacher.subjectExpertise?.length > 0 ? `• ${teacher.subjectExpertise.join(', ')}` : ''}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1 rounded-xl text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubstitutionManager;
