import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  UserIcon, 
  MapPinIcon, 
  SparklesIcon, 
  PrinterIcon, 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { CheckCircle2, Building2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import timetableService from '../../services/timetableService';

const subjectColorPalette = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-teal-50 text-teal-700 border-teal-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  'bg-orange-50 text-orange-700 border-orange-200'
];

const getSubjectColor = (name) => {
  if (!name) return 'bg-gray-50 text-gray-700 border-gray-200';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % subjectColorPalette.length;
  return subjectColorPalette[index];
};

const ClassTimetableView = ({ 
  classes = [], 
  selectedClassId, 
  onSelectClass, 
  structure, 
  staffList = [], 
  onOpenPrint 
}) => {
  const [classData, setClassData] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [substitutions, setSubstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  
  // Single slot edit modal state
  const [activeSlot, setActiveSlot] = useState(null); // { day, periodNumber, dayIdx, periodIdx, subjectId, teacherId, room, type, notes }
  const [slotClash, setSlotClash] = useState(null);
  const [isCheckingClash, setIsCheckingClash] = useState(false);

  // Load Class Timetable
  const loadClassTimetable = async (classId) => {
    if (!classId) return;
    setIsLoading(true);
    try {
      const res = await timetableService.getClassTimetable(classId);
      if (res.success) {
        setClassData(res.classData);
        setSubstitutions(res.substitutions || []);
        
        // Ensure timetable is populated for all working days & periods
        const workingDays = structure?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const configuredPeriods = structure?.periods || [];

        let currentSchedule = res.classData.timetable || [];
        const normalized = workingDays.map(day => {
          const existingDay = currentSchedule.find(d => d.day === day);
          const periods = configuredPeriods.map(pConf => {
            const existingSlot = existingDay?.periods?.find(p => (p.periodNumber || 0) === pConf.periodNumber);
            if (existingSlot) {
              return {
                ...existingSlot,
                periodNumber: pConf.periodNumber,
                startTime: pConf.startTime,
                endTime: pConf.endTime,
                isBreak: pConf.isBreak,
                type: pConf.isBreak ? 'break' : (existingSlot.type || pConf.type || 'regular')
              };
            }
            return {
              periodNumber: pConf.periodNumber,
              startTime: pConf.startTime,
              endTime: pConf.endTime,
              subjectId: null,
              teacherId: null,
              teacherName: '',
              room: pConf.isBreak ? '' : (res.classData.name ? `Room ${res.classData.name}` : ''),
              type: pConf.isBreak ? 'break' : 'regular',
              isBreak: pConf.isBreak,
              notes: pConf.isBreak ? pConf.name : ''
            };
          });
          return { day, periods };
        });

        setTimetable(normalized);
      }
    } catch (err) {
      console.error('Error loading class timetable:', err);
      toast.error('Failed to load class schedule');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      loadClassTimetable(selectedClassId);
      setIsEditing(false);
    }
  }, [selectedClassId, structure]);

  // Handle cell edit change
  const handleCellChange = (dayIdx, periodIdx, field, value) => {
    const updated = [...timetable];
    const currentPeriod = updated[dayIdx].periods[periodIdx];
    currentPeriod[field] = value;

    // If teacher changed, update teacherName automatically
    if (field === 'teacherId') {
      const selectedStaff = staffList.find(s => s._id === value);
      currentPeriod.teacherName = selectedStaff ? selectedStaff.name : '';
    }
    // If subject changed and subject has default teacher in class mapping, suggest teacher
    if (field === 'subjectId' && value && classData?.subjectTeachers) {
      const mapping = classData.subjectTeachers.find(st => (st.subjectId?._id || st.subjectId) === value);
      if (mapping && mapping.teacherId) {
        currentPeriod.teacherId = mapping.teacherId._id || mapping.teacherId;
        currentPeriod.teacherName = mapping.teacherName || mapping.teacherId.name || '';
      }
    }

    setTimetable(updated);
  };

  // Open slot modal
  const openSlotModal = (day, dayIdx, period, periodIdx) => {
    if (period.isBreak) return;
    setActiveSlot({
      day,
      dayIdx,
      periodIdx,
      periodNumber: period.periodNumber,
      startTime: period.startTime,
      endTime: period.endTime,
      subjectId: period.subjectId?._id || period.subjectId || '',
      teacherId: period.teacherId?._id || period.teacherId || '',
      teacherName: period.teacherName || '',
      room: period.room || '',
      type: period.type || 'regular',
      notes: period.notes || ''
    });
    setSlotClash(null);
  };

  // Check clash when editing single slot
  const checkSlotConflict = async (teacherId, room, day, periodNumber) => {
    if (!teacherId && !room) {
      setSlotClash(null);
      return;
    }
    setIsCheckingClash(true);
    try {
      const res = await timetableService.checkClashes({
        classId: selectedClassId,
        day,
        periodNumber,
        teacherId,
        room
      });
      if (res.success && res.hasClash) {
        setSlotClash(res);
      } else {
        setSlotClash(null);
      }
    } catch (err) {
      console.error('Error checking conflict:', err);
    } finally {
      setIsCheckingClash(false);
    }
  };

  const handleSaveSlotModal = () => {
    if (!activeSlot) return;
    const { dayIdx, periodIdx, subjectId, teacherId, teacherName, room, type, notes } = activeSlot;
    const updated = [...timetable];
    const target = updated[dayIdx].periods[periodIdx];
    
    // Find subject name
    const subjectObj = classData?.subjects?.find(s => s._id === subjectId);

    target.subjectId = subjectId || null;
    target.teacherId = teacherId || null;
    target.teacherName = teacherName || '';
    target.room = room || '';
    target.type = type || 'regular';
    target.notes = notes || '';

    setTimetable(updated);
    setActiveSlot(null);
    setSlotClash(null);
    toast.success('Period updated');
  };

  // Save full class timetable
  const handleSaveTimetable = async (force = false) => {
    if (!selectedClassId) return;
    setIsSaving(true);
    try {
      // Prepare payload
      const cleanedTimetable = timetable.map(d => ({
        day: d.day,
        periods: d.periods.map(p => ({
          periodNumber: p.periodNumber,
          startTime: p.startTime,
          endTime: p.endTime,
          subjectId: p.subjectId?._id || p.subjectId || null,
          teacherId: p.teacherId?._id || p.teacherId || null,
          teacherName: p.teacherName || '',
          room: p.room || '',
          type: p.type || 'regular',
          notes: p.notes || ''
        }))
      }));

      const res = await timetableService.updateClassTimetable(selectedClassId, {
        timetable: cleanedTimetable,
        force
      });

      if (res.success) {
        toast.success('Class timetable saved successfully!');
        setIsEditing(false);
        loadClassTimetable(selectedClassId);
      }
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.clashes) {
        const clashes = err.response.data.clashes;
        const confirmForce = window.confirm(
          `⚠️ Found ${clashes.length} scheduling conflicts:\n\n` +
          clashes.slice(0, 3).map(c => `• ${c.message}`).join('\n') +
          (clashes.length > 3 ? `\n...and ${clashes.length - 3} more` : '') +
          `\n\nDo you want to override and save anyway?`
        );
        if (confirmForce) {
          handleSaveTimetable(true);
          return;
        }
      } else {
        toast.error(err.response?.data?.message || 'Failed to save timetable');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-Generate Draft
  const handleAutoGenerate = async () => {
    if (!selectedClassId) return;
    if (!window.confirm('Generate a balanced schedule draft automatically? Any unsaved changes will be replaced with the draft.')) {
      return;
    }
    setIsAutoGenerating(true);
    try {
      const res = await timetableService.autoGenerateTimetable({
        classId: selectedClassId,
        academicYearId: classData?.academicYearId
      });
      if (res.success && res.proposedTimetable) {
        setTimetable(res.proposedTimetable);
        setIsEditing(true);
        toast.success('✨ Intelligent draft generated without conflicts! Review and click Save.');
      }
    } catch (err) {
      console.error('Error auto generating timetable:', err);
      toast.error(err.response?.data?.message || 'Auto generation failed');
    } finally {
      setIsAutoGenerating(false);
    }
  };

  // Copy day
  const handleCopyDay = (fromIdx, toIdx) => {
    const updated = [...timetable];
    updated[toIdx].periods = JSON.parse(JSON.stringify(updated[fromIdx].periods));
    setTimetable(updated);
    toast.success(`Copied ${updated[fromIdx].day} schedule to ${updated[toIdx].day}`);
  };

  // Clear day
  const handleClearDay = (dayIdx) => {
    const updated = [...timetable];
    updated[dayIdx].periods = updated[dayIdx].periods.map(p => ({
      ...p,
      subjectId: null,
      teacherId: null,
      teacherName: '',
      room: p.isBreak ? '' : (classData?.name ? `Room ${classData.name}` : '')
    }));
    setTimetable(updated);
    toast.success(`Cleared ${updated[dayIdx].day} schedule`);
  };

  const getSubjectObj = (subId) => {
    if (!subId) return null;
    const id = subId._id || subId;
    return classData?.subjects?.find(s => s._id === id);
  };

  const getTeacherObj = (teachId) => {
    if (!teachId) return null;
    const id = teachId._id || teachId;
    return staffList.find(s => s._id === id);
  };

  // Find if a slot has a substitution for today
  const getSlotSubstitution = (day, periodNumber) => {
    return substitutions.find(sub => sub.day === day && sub.periodNumber === periodNumber);
  };

  return (
    <div className="space-y-6">
      {/* Top Class Selection & Quick Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Selected Class</label>
              {classData?.classTeacherId && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <UserIcon className="w-3 h-3" /> Class Teacher: {classData.classTeacherId.name}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3">
              <select
                value={selectedClassId || ''}
                onChange={(e) => onSelectClass(e.target.value)}
                className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-emerald-500 pb-0.5 focus:outline-none cursor-pointer"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>
                    Class {c.section ? `${c.name}-${c.section}` : c.name}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-400">
                ({classData?.subjects?.length || 0} Subjects Assigned)
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenPrint && onOpenPrint('class', classData)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <PrinterIcon className="w-4 h-4 text-gray-500" />
            Print Timetable
          </button>

          <button
            onClick={handleAutoGenerate}
            disabled={isAutoGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
          >
            <SparklesIcon className="w-4 h-4 text-purple-600" />
            {isAutoGenerating ? 'Generating...' : 'Auto-Draft Schedule'}
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  loadClassTimetable(selectedClassId);
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveTimetable(false)}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <CheckIcon className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Timetable
            </button>
          )}
        </div>
      </div>

      {/* Active Substitutions Alert Banner */}
      {substitutions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          </div>
          <div className="text-sm text-amber-800">
            <span className="font-semibold">{substitutions.length} Active Substitution(s) today</span> for this class. Substituted teachers are highlighted in gold badges below.
          </div>
        </div>
      )}

      {/* Quick Day Tools when in Edit Mode */}
      {isEditing && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-medium">
            <SparklesIcon className="w-4 h-4 text-emerald-600" />
            <span>Interactive Edit Mode Active: Click any cell or use quick tools:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {timetable.map((dayItem, idx) => (
              <div key={dayItem.day} className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-xs shadow-2xs">
                <span className="font-semibold text-gray-700 mr-2">{dayItem.day.slice(0, 3)}:</span>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleCopyDay(0, idx)}
                    className="text-emerald-600 hover:text-emerald-800 mr-2 flex items-center gap-0.5"
                    title={`Copy Mon to ${dayItem.day}`}
                  >
                    <DocumentDuplicateIcon className="w-3 h-3" /> Mon
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleClearDay(idx)}
                  className="text-rose-500 hover:text-rose-700 flex items-center gap-0.5"
                  title={`Clear ${dayItem.day}`}
                >
                  <TrashIcon className="w-3 h-3" /> Clear
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Grid Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36 border-r border-gray-100">
                  Day / Period
                </th>
                {structure?.periods?.map((periodSlot) => (
                  <th
                    key={periodSlot.periodNumber}
                    className={`px-3 py-3 text-center border-r border-gray-100 last:border-r-0 ${
                      periodSlot.isBreak ? 'bg-amber-50/50 w-20' : 'min-w-[150px]'
                    }`}
                  >
                    <div className="font-bold text-gray-900 text-xs">{periodSlot.name}</div>
                    <div className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
                      {periodSlot.startTime} - {periodSlot.endTime}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {timetable.map((dayItem, dayIdx) => (
                <tr key={dayItem.day} className="hover:bg-gray-50/40 transition-colors">
                  {/* Day Header Column */}
                  <td className="px-5 py-4 border-r border-gray-100 bg-gray-50/30">
                    <div className="font-bold text-gray-800 text-sm">{dayItem.day}</div>
                    <div className="text-[11px] text-gray-400">
                      {dayItem.periods.filter(p => !p.isBreak && p.subjectId).length} periods scheduled
                    </div>
                  </td>

                  {/* Period Slots */}
                  {dayItem.periods.map((period, periodIdx) => {
                    if (period.isBreak) {
                      return (
                        <td
                          key={periodIdx}
                          className="px-2 py-4 bg-amber-50/30 border-r border-gray-100 text-center text-xs font-semibold text-amber-600/70 select-none writing-mode-vertical"
                        >
                          <div className="text-[11px] uppercase tracking-wider font-bold">
                            {period.notes || 'BREAK'}
                          </div>
                        </td>
                      );
                    }

                    const subjectObj = getSubjectObj(period.subjectId);
                    const teacherObj = getTeacherObj(period.teacherId);
                    const subInfo = getSlotSubstitution(dayItem.day, period.periodNumber);

                    return (
                      <td
                        key={periodIdx}
                        onClick={() => isEditing && openSlotModal(dayItem.day, dayIdx, period, periodIdx)}
                        className={`px-3 py-3 border-r border-gray-100 last:border-r-0 align-top transition-all ${
                          isEditing ? 'cursor-pointer hover:bg-emerald-50/40 hover:border-emerald-300' : ''
                        }`}
                      >
                        {period.subjectId ? (
                          <div className={`p-2.5 rounded-xl border transition-all ${
                            subInfo 
                              ? 'bg-amber-50/90 border-amber-300 shadow-2xs' 
                              : getSubjectColor(subjectObj?.name)
                          }`}>
                            {/* Subject Title */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs leading-tight truncate">
                                {subjectObj?.name || 'Assigned Subject'}
                              </span>
                              {period.type === 'lab' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                  Lab
                                </span>
                              )}
                            </div>

                            {/* Teacher Name */}
                            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-600 font-medium truncate">
                              <UserIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="truncate">
                                {subInfo ? (
                                  <span className="text-amber-800 font-bold">
                                    Sub: {subInfo.substituteTeacherName || 'Substitute'}
                                  </span>
                                ) : (
                                  teacherObj?.name || period.teacherName || 'No Teacher'
                                )}
                              </span>
                            </div>

                            {/* Room Info */}
                            {period.room && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 truncate">
                                <MapPinIcon className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate">{period.room}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`h-16 rounded-xl border border-dashed flex flex-col items-center justify-center text-center p-2 transition-all ${
                            isEditing 
                              ? 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/60 text-emerald-600' 
                              : 'border-gray-200 text-gray-300'
                          }`}>
                            {isEditing ? (
                              <>
                                <PlusIcon className="w-4 h-4 mb-0.5" />
                                <span className="text-[10px] font-medium">Assign</span>
                              </>
                            ) : (
                              <span className="text-xs font-light text-gray-300">—</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Slot Modal for interactive assignment */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Edit Period {activeSlot.periodNumber} ({activeSlot.day})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeSlot.startTime} - {activeSlot.endTime}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSlot(null);
                  setSlotClash(null);
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Clash Alert in Modal */}
            {slotClash && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
                <ExclamationTriangleIcon className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Conflict Detected!</div>
                  {slotClash.teacherClash && <div>• {slotClash.teacherClash.message}</div>}
                  {slotClash.roomClash && <div>• {slotClash.roomClash.message}</div>}
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm">
              {/* Subject Selection */}
              <div>
                <label className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={activeSlot.subjectId}
                  onChange={(e) => {
                    const sId = e.target.value;
                    let tId = activeSlot.teacherId;
                    let tName = activeSlot.teacherName;
                    if (sId && classData?.subjectTeachers) {
                      const m = classData.subjectTeachers.find(st => (st.subjectId?._id || st.subjectId) === sId);
                      if (m && m.teacherId) {
                        tId = m.teacherId._id || m.teacherId;
                        tName = m.teacherName || m.teacherId.name || '';
                        checkSlotConflict(tId, activeSlot.room, activeSlot.day, activeSlot.periodNumber);
                      }
                    }
                    setActiveSlot({ ...activeSlot, subjectId: sId, teacherId: tId, teacherName: tName });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- No Subject / Free Period --</option>
                  {classData?.subjects?.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code || s.department || 'Subject'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Selection */}
              <div>
                <label className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1.5">
                  Assigned Teacher
                </label>
                <select
                  value={activeSlot.teacherId}
                  onChange={(e) => {
                    const tId = e.target.value;
                    const staff = staffList.find(s => s._id === tId);
                    const tName = staff ? staff.name : '';
                    setActiveSlot({ ...activeSlot, teacherId: tId, teacherName: tName });
                    checkSlotConflict(tId, activeSlot.room, activeSlot.day, activeSlot.periodNumber);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Select Teacher --</option>
                  {staffList.filter(s => s.role === 'teacher' || !s.role).map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} {s.shortName ? `(${s.shortName})` : ''} - {s.staffCode || ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room & Period Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1.5">
                    Room / Lab
                  </label>
                  <select
                    value={activeSlot.room}
                    onChange={(e) => {
                      const r = e.target.value;
                      setActiveSlot({ ...activeSlot, room: r });
                      checkSlotConflict(activeSlot.teacherId, r, activeSlot.day, activeSlot.periodNumber);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">Default Classroom</option>
                    {structure?.rooms?.map(room => (
                      <option key={room.name} value={room.name}>
                        {room.name} ({room.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1.5">
                    Period Type
                  </label>
                  <select
                    value={activeSlot.type}
                    onChange={(e) => setActiveSlot({ ...activeSlot, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="regular">Regular Lecture</option>
                    <option value="lab">Practical / Lab</option>
                    <option value="activity">Sports / Activity</option>
                    <option value="zero_period">Zero Period / Remedial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setActiveSlot({
                    ...activeSlot,
                    subjectId: '',
                    teacherId: '',
                    teacherName: '',
                    room: ''
                  });
                  setSlotClash(null);
                }}
                className="text-xs text-rose-600 hover:underline"
              >
                Clear Slot
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSlot(null);
                    setSlotClash(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSlotModal}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTimetableView;
