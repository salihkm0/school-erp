import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  UserIcon, 
  ClockIcon, 
  PrinterIcon,
  CheckBadgeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { FlaskConical, Laptop, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import timetableService from '../../services/timetableService';

const RoomLabScheduleView = ({ 
  structure, 
  onOpenPrint 
}) => {
  const rooms = structure?.rooms || [];
  const [selectedRoomName, setSelectedRoomName] = useState(rooms[0]?.name || 'Physics Lab');
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRoomSchedule = async (roomName) => {
    if (!roomName) return;
    setIsLoading(true);
    try {
      const res = await timetableService.getRoomTimetable(roomName);
      if (res.success) {
        setScheduleData(res);
      }
    } catch (err) {
      console.error('Error loading room schedule:', err);
      toast.error('Failed to load room schedule');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoomName) {
      loadRoomSchedule(selectedRoomName);
    }
  }, [selectedRoomName]);

  const selectedRoomObj = rooms.find(r => r.name === selectedRoomName) || { name: selectedRoomName, type: 'Classroom', capacity: 50 };
  const workingDays = structure?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = structure?.periods || [];
  const weeklySchedule = scheduleData?.weeklySchedule || {};
  const totalOccupied = scheduleData?.totalOccupiedPeriods || 0;
  const totalAvailableSlots = (workingDays.length || 6) * (periods.filter(p => !p.isBreak).length || 7);
  const utilizationPercentage = Math.min(100, Math.round((totalOccupied / (totalAvailableSlots || 1)) * 100));

  const getRoomIcon = (type) => {
    if (type?.includes('Lab') || type === 'Physics Lab' || type === 'Chemistry Lab' || type === 'Biology Lab') {
      return <FlaskConical className="w-6 h-6 text-purple-600" />;
    }
    if (type?.includes('Computer')) {
      return <Laptop className="w-6 h-6 text-blue-600" />;
    }
    if (type === 'Library') {
      return <BookOpen className="w-6 h-6 text-emerald-600" />;
    }
    return <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Room Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 flex-shrink-0">
            {getRoomIcon(selectedRoomObj.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Room & Lab Allocation</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {selectedRoomObj.type || 'Room'} • Capacity: {selectedRoomObj.capacity || 50}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <select
                value={selectedRoomName}
                onChange={(e) => setSelectedRoomName(e.target.value)}
                className="text-lg font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 pb-0.5 focus:outline-none cursor-pointer"
              >
                {rooms.map(r => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({r.type})
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-400">
                {selectedRoomObj.building ? `${selectedRoomObj.building}, Floor ${selectedRoomObj.floor || '1'}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Room Utilization Badge & Print */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium">Room Utilization</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-extrabold text-gray-900">{utilizationPercentage}%</span>
              <span className="text-xs text-gray-500 font-medium">({totalOccupied} / {totalAvailableSlots} slots)</span>
            </div>
          </div>

          <button
            onClick={() => onOpenPrint && onOpenPrint('room', { room: selectedRoomObj, scheduleData })}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <PrinterIcon className="w-4 h-4 text-gray-500" />
            Print Room Schedule
          </button>
        </div>
      </div>

      {/* Weekly Grid */}
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
                    <div className="text-[10px] text-gray-400 mt-0.5">{periodSlot.startTime} - {periodSlot.endTime}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {workingDays.map((day) => {
                const daySchedule = weeklySchedule[day] || {};

                return (
                  <tr key={day} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4 border-r border-gray-100 bg-gray-50/30 font-bold text-gray-800 text-sm">
                      {day}
                    </td>

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
                            <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 shadow-2xs space-y-1">
                              <div className="font-extrabold text-xs text-purple-950 truncate">
                                Class {slotData.className}
                              </div>
                              <div className="text-xs font-semibold text-purple-800 truncate">
                                {slotData.subjectName}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-purple-500 truncate">
                                <UserIcon className="w-2.5 h-2.5 flex-shrink-0" />
                                <span>{slotData.teacherName || 'Staff'}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 rounded-xl border border-dashed border-gray-200 bg-gray-50/30 flex items-center justify-center">
                              <span className="text-[10px] font-semibold text-gray-400">Available</span>
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

export default RoomLabScheduleView;
