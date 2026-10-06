import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  PrinterIcon, 
  ChartBarIcon, 
  BuildingOffice2Icon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Sparkles, UserCheck, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import timetableService from '../../services/timetableService';

const TeacherTimetableView = ({ 
  staffList = [], 
  selectedTeacherId, 
  onSelectTeacher, 
  structure, 
  onOpenPrint 
}) => {
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTeacherSchedule = async (teacherId) => {
    if (!teacherId) return;
    setIsLoading(true);
    try {
      const res = await timetableService.getTeacherTimetable(teacherId);
      if (res.success) {
        setScheduleData(res);
      }
    } catch (err) {
      console.error('Error loading teacher schedule:', err);
      toast.error('Failed to load teacher schedule');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTeacherId) {
      loadTeacherSchedule(selectedTeacherId);
    }
  }, [selectedTeacherId]);

  const filteredTeachers = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.staffCode && s.staffCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.shortName && s.shortName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const teacher = scheduleData?.teacher;
  const analytics = scheduleData?.analytics;
  const weeklySchedule = scheduleData?.weeklySchedule || {};
  const workingDays = structure?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = structure?.periods || [];

  return (
    <div className="space-y-6">
      {/* Top Selector & Quick Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
            {teacher?.photoUrl ? (
              <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <UserIcon className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Teacher Schedule</span>
              {analytics?.status && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  analytics.status === 'overloaded' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  analytics.status === 'optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {analytics.status} Load
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3">
              <select
                value={selectedTeacherId || ''}
                onChange={(e) => onSelectTeacher(e.target.value)}
                className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-indigo-500 pb-0.5 focus:outline-none cursor-pointer max-w-xs md:max-w-md truncate"
              >
                {filteredTeachers.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.shortName ? `(${s.shortName})` : ''} - {s.staffCode || ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenPrint && onOpenPrint('teacher', { teacher, scheduleData })}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <PrinterIcon className="w-4 h-4 text-gray-500" />
            Print Teacher Schedule
          </button>
        </div>
      </div>

      {/* Analytics & Workload Summary Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Workload */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <span>Weekly Workload</span>
              <ChartBarIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900">{analytics.totalPeriodsPerWeek}</span>
                <span className="text-sm font-medium text-gray-400">/ {analytics.maxWeeklyPeriods} max periods</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    analytics.workloadPercentage > 100 ? 'bg-rose-500' :
                    analytics.workloadPercentage >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, analytics.workloadPercentage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subjects Taught */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <span>Subjects Taught</span>
              <BookOpen className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {Object.entries(analytics.subjectBreakdown || {}).map(([sub, count]) => (
                <span key={sub} className="px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {sub} ({count}p)
                </span>
              ))}
              {Object.keys(analytics.subjectBreakdown || {}).length === 0 && (
                <span className="text-xs text-gray-400">No subjects assigned</span>
              )}
            </div>
          </div>

          {/* Classes Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <span>Assigned Classes</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {Object.entries(analytics.classBreakdown || {}).map(([cls, count]) => (
                <span key={cls} className="px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  Class {cls} ({count}p)
                </span>
              ))}
              {Object.keys(analytics.classBreakdown || {}).length === 0 && (
                <span className="text-xs text-gray-400">No classes assigned</span>
              )}
            </div>
          </div>

          {/* Free Periods Summary */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <span>Free Periods</span>
              <ClockIcon className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-3 text-xs text-gray-600 space-y-1">
              <div className="font-semibold text-gray-800">
                Avg {Math.round((Object.values(analytics.freePeriodsPerDay || {}).reduce((a, b) => a + b.length, 0)) / (workingDays.length || 1))} free periods / day
              </div>
              <p className="text-[11px] text-gray-400">
                Available for substitution & preparation duties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Substitutions Banner if any */}
      {scheduleData?.substitutions?.todayAssignedSubstitutions?.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="text-sm text-indigo-900">
            <span className="font-bold">You are assigned {scheduleData.substitutions.todayAssignedSubstitutions.length} substitution period(s) today: </span>
            {scheduleData.substitutions.todayAssignedSubstitutions.map(s => `Class ${s.classId?.name || ''} (Period ${s.periodNumber})`).join(', ')}
          </div>
        </div>
      )}

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36 border-r border-gray-100">
                  Day / Period
                </th>
                {periods.map((periodSlot) => (
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
              {workingDays.map((day) => {
                const daySchedule = weeklySchedule[day] || {};
                const periodCount = Object.keys(daySchedule).length;

                return (
                  <tr key={day} className="hover:bg-gray-50/40 transition-colors">
                    {/* Day Column */}
                    <td className="px-5 py-4 border-r border-gray-100 bg-gray-50/30">
                      <div className="font-bold text-gray-800 text-sm">{day}</div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {periodCount} Teaching periods
                      </div>
                    </td>

                    {/* Period Slots */}
                    {periods.map((periodSlot) => {
                      if (periodSlot.isBreak) {
                        return (
                          <td
                            key={periodSlot.periodNumber}
                            className="px-2 py-4 bg-amber-50/30 border-r border-gray-100 text-center text-xs font-semibold text-amber-600/70 select-none"
                          >
                            <div className="text-[10px] uppercase tracking-wider font-bold">
                              {periodSlot.name}
                            </div>
                          </td>
                        );
                      }

                      const slotData = daySchedule[periodSlot.periodNumber];

                      return (
                        <td
                          key={periodSlot.periodNumber}
                          className="px-3 py-3 border-r border-gray-100 last:border-r-0 align-top"
                        >
                          {slotData ? (
                            <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 shadow-2xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-xs text-indigo-950 truncate">
                                  Class {slotData.className}
                                </span>
                                {slotData.type === 'lab' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                    Lab
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-indigo-800 truncate">
                                {slotData.subjectName}
                              </div>
                              {slotData.room && (
                                <div className="flex items-center gap-1 text-[10px] text-indigo-500 truncate">
                                  <MapPinIcon className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span>{slotData.room}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-16 rounded-xl border border-dashed border-gray-200 bg-gray-50/30 flex flex-col items-center justify-center text-center p-2">
                              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                Free Slot
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetableView;
