import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon, 
  PrinterIcon,
  ShieldCheckIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { LayoutGrid, Sparkles } from 'lucide-react';

const MasterMatrixView = ({ 
  masterData, 
  structure, 
  onOpenPrint 
}) => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [searchQuery, setSearchQuery] = useState('');

  const classes = masterData?.classes || [];
  const conflicts = masterData?.conflicts || [];
  const workingDays = structure?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = structure?.periods || [];

  // Filter classes by search query
  const filteredClasses = classes.filter(cls => {
    const name = cls.section ? `${cls.name}-${cls.section}` : cls.name;
    const matchClass = name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if any period matches teacher/subject
    const dayData = cls.timetable?.find(d => d.day === selectedDay);
    const matchPeriod = dayData?.periods?.some(p => 
      (p.teacherName && p.teacherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subjectId?.name && p.subjectId.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.room && p.room.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return matchClass || matchPeriod;
  });

  // Conflicts specific to selected day
  const dayConflicts = conflicts.filter(c => c.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Top Header & Day Selector Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 flex-shrink-0">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Master Day Matrix</span>
              {conflicts.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {conflicts.length} Clash(es) School-Wide
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheckIcon className="w-3.5 h-3.5" /> 100% Conflict-Free
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">
              All Classes Schedule for {selectedDay}
            </h2>
          </div>
        </div>

        {/* Day Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Day Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            {workingDays.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === day 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter teacher, subject, class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 md:w-56"
            />
          </div>

          <button
            onClick={() => onOpenPrint && onOpenPrint('master', { selectedDay, classes, structure })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <PrinterIcon className="w-3.5 h-3.5 text-gray-500" />
            Print Wall Chart
          </button>
        </div>
      </div>

      {/* Day Conflict Warning Banner */}
      {dayConflicts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 text-sm font-bold">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />
            <span>Scheduling Clashes Detected on {selectedDay} ({dayConflicts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-rose-700">
            {dayConflicts.map((c, idx) => (
              <div key={idx} className="bg-white/80 p-2 rounded-xl border border-rose-200 flex items-start gap-2">
                <span className="font-bold text-rose-600">Period {c.periodNumber}:</span>
                <span>{c.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Master Grid Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/90 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40 border-r border-gray-100 bg-gray-50">
                  Class / Section
                </th>
                {periods.map(slot => (
                  <th
                    key={slot.periodNumber}
                    className={`px-3 py-3 text-center border-r border-gray-100 last:border-r-0 ${
                      slot.isBreak ? 'bg-amber-50/60 w-16' : 'min-w-[140px]'
                    }`}
                  >
                    <div className="font-bold text-gray-900 text-xs">{slot.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{slot.startTime} - {slot.endTime}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredClasses.map(cls => {
                const className = cls.section ? `${cls.name}-${cls.section}` : cls.name;
                const daySchedule = cls.timetable?.find(d => d.day === selectedDay);

                return (
                  <tr key={cls._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Class Label Column */}
                    <td className="px-5 py-4 border-r border-gray-100 bg-gray-50/40">
                      <div className="font-bold text-gray-900 text-sm">Class {className}</div>
                      {cls.classTeacherId && (
                        <div className="text-[11px] text-gray-400 truncate max-w-[130px]">
                          CT: {cls.classTeacherId.name}
                        </div>
                      )}
                    </td>

                    {/* Periods */}
                    {periods.map(slot => {
                      if (slot.isBreak) {
                        return (
                          <td
                            key={slot.periodNumber}
                            className="px-1 py-3 bg-amber-50/30 border-r border-gray-100 text-center text-[10px] font-bold text-amber-500/70"
                          >
                            |
                          </td>
                        );
                      }

                      const periodData = daySchedule?.periods?.find(p => (p.periodNumber || 0) === slot.periodNumber);
                      const isClash = dayConflicts.some(c => 
                        c.periodNumber === slot.periodNumber && 
                        c.classes?.includes(className)
                      );

                      return (
                        <td
                          key={slot.periodNumber}
                          className={`px-2.5 py-2.5 border-r border-gray-100 last:border-r-0 align-top ${
                            isClash ? 'bg-rose-50/60 ring-1 ring-rose-400' : ''
                          }`}
                        >
                          {periodData?.subjectId ? (
                            <div className="p-2 rounded-lg bg-gray-50 border border-gray-200/80 shadow-2xs space-y-0.5">
                              <div className="font-bold text-xs text-gray-800 truncate">
                                {periodData.subjectId?.name || 'Subject'}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
                                <UserIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate">
                                  {periodData.teacherId?.name || periodData.teacherName || 'Staff'}
                                </span>
                              </div>
                              {periodData.room && (
                                <div className="text-[9px] text-gray-400 flex items-center gap-0.5 truncate">
                                  <MapPinIcon className="w-2.5 h-2.5" />
                                  <span>{periodData.room}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-14 rounded-lg border border-dashed border-gray-100 flex items-center justify-center">
                              <span className="text-gray-300 text-xs">-</span>
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

export default MasterMatrixView;
