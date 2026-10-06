import React from 'react';
import { useSelector } from 'react-redux';
import { XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';

const PrintableTimetableModal = ({ 
  isOpen, 
  onClose, 
  printType, // 'class' | 'teacher' | 'master' | 'substitution' | 'room'
  printData 
}) => {
  if (!isOpen || !printData) return null;

  const { profile: schoolProfile } = useSelector((state) => state.schoolProfile);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-5xl w-full shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-150">
        {/* Modal Toolbar (hidden during print) */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-base">Print Preview</span>
            <span className="text-xs text-gray-400 capitalize">({printType} Timetable)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              <PrinterIcon className="w-4 h-4" />
              Print Now
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-timetable-content" className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-900">
          {/* Institutional Header */}
          <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4">
            <div className="flex items-center gap-4">
              <img 
                src={schoolProfile?.branding?.logoUrl || "https://res.cloudinary.com/dmjqgjcut/image/upload/v1777479500/school_logo-Photoroom_xcljv5.png"} 
                alt="School Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  {schoolProfile?.name || 'School Management System'}
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  {schoolProfile?.address?.city ? `${schoolProfile.address.city}, ${schoolProfile.address.state || ''}` : 'Official Academic Schedule'}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Contact: {schoolProfile?.contact?.phone || ''} • Email: {schoolProfile?.contact?.email || ''}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                {printType === 'class' && 'Class Timetable'}
                {printType === 'teacher' && 'Teacher Schedule Card'}
                {printType === 'master' && 'Master School Timetable'}
                {printType === 'substitution' && 'Daily Substitution Notice'}
                {printType === 'room' && 'Lab / Room Timetable'}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Generated: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* 1. Class Timetable Print View */}
          {printType === 'class' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span>Class: <strong className="text-gray-900 text-sm">{printData.name}{printData.section ? `-${printData.section}` : ''}</strong></span>
                <span>Class Teacher: <strong className="text-gray-900">{printData.classTeacherId?.name || 'N/A'}</strong></span>
                <span>Room: <strong className="text-gray-900">Room {printData.name}</strong></span>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-xs text-center">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-gray-300 p-2 w-28 text-left">Day</th>
                    {(printData.timetable?.[0]?.periods || []).map((p, idx) => (
                      <th key={idx} className="border border-gray-300 p-2 min-w-[90px]">
                        <div>P{p.periodNumber || (idx + 1)}</div>
                        <div className="text-[9px] font-normal text-gray-500">{p.startTime}-{p.endTime}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(printData.timetable || []).map((dayItem) => (
                    <tr key={dayItem.day}>
                      <td className="border border-gray-300 p-2 font-bold text-left bg-gray-50">{dayItem.day}</td>
                      {dayItem.periods.map((period, pIdx) => (
                        <td key={pIdx} className="border border-gray-300 p-2">
                          {period.isBreak ? (
                            <span className="text-[10px] font-semibold text-gray-400">BREAK</span>
                          ) : period.subjectId ? (
                            <div>
                              <div className="font-bold text-gray-900">{period.subjectId?.name || 'Subject'}</div>
                              <div className="text-[10px] text-gray-600">{period.teacherId?.name || period.teacherName || ''}</div>
                              {period.room && <div className="text-[9px] text-gray-400">{period.room}</div>}
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. Teacher Timetable Print View */}
          {printType === 'teacher' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span>Teacher: <strong className="text-gray-900 text-sm">{printData.teacher?.name}</strong></span>
                <span>Staff Code: <strong className="text-gray-900">{printData.teacher?.staffCode || 'N/A'}</strong></span>
                <span>Total Workload: <strong className="text-gray-900">{printData.scheduleData?.analytics?.totalPeriodsPerWeek || 0} periods / week</strong></span>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-xs text-center">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-gray-300 p-2 w-28 text-left">Day</th>
                    {(printData.scheduleData?.structure?.periods || []).map(p => (
                      <th key={p.periodNumber} className="border border-gray-300 p-2 min-w-[90px]">
                        <div>{p.name}</div>
                        <div className="text-[9px] font-normal text-gray-500">{p.startTime}-{p.endTime}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(printData.scheduleData?.structure?.workingDays || []).map(day => {
                    const daySlots = printData.scheduleData?.weeklySchedule?.[day] || {};
                    return (
                      <tr key={day}>
                        <td className="border border-gray-300 p-2 font-bold text-left bg-gray-50">{day}</td>
                        {(printData.scheduleData?.structure?.periods || []).map(p => {
                          if (p.isBreak) return <td key={p.periodNumber} className="border border-gray-300 p-2 text-gray-400 text-[10px]">BREAK</td>;
                          const slot = daySlots[p.periodNumber];
                          return (
                            <td key={p.periodNumber} className="border border-gray-300 p-2">
                              {slot ? (
                                <div>
                                  <div className="font-bold text-gray-900">Class {slot.className}</div>
                                  <div className="text-[10px] text-gray-600">{slot.subjectName}</div>
                                  {slot.room && <div className="text-[9px] text-gray-400">{slot.room}</div>}
                                </div>
                              ) : (
                                <span className="text-gray-300 font-light">Free</span>
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
          )}

          {/* 3. Daily Substitution Notice Board Sheet */}
          {printType === 'substitution' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span>Date: <strong className="text-amber-950 text-sm">{printData.selectedDate} ({printData.dayName})</strong></span>
                <span>Total Substitutions Arranged: <strong className="text-amber-950">{printData.substitutions?.length || 0}</strong></span>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-xs text-left">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-gray-300 p-2">Period & Time</th>
                    <th className="border border-gray-300 p-2">Class</th>
                    <th className="border border-gray-300 p-2">Absent Teacher</th>
                    <th className="border border-gray-300 p-2">Substitute Teacher Assigned</th>
                    <th className="border border-gray-300 p-2">Subject / Room</th>
                    <th className="border border-gray-300 p-2">Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {(printData.substitutions || []).map((sub, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2.5 font-bold">
                        Period {sub.periodNumber} ({sub.startTime} - {sub.endTime})
                      </td>
                      <td className="border border-gray-300 p-2.5 font-semibold">
                        Class {sub.classId?.section ? `${sub.classId.name}-${sub.classId.section}` : sub.classId?.name || ''}
                      </td>
                      <td className="border border-gray-300 p-2.5 text-rose-700 font-medium">
                        {sub.originalTeacherId?.name || sub.originalTeacherName}
                      </td>
                      <td className="border border-gray-300 p-2.5 font-bold text-emerald-800">
                        {sub.substituteTeacherId?.name || sub.substituteTeacherName || 'Pending'}
                      </td>
                      <td className="border border-gray-300 p-2.5 text-gray-600">
                        {sub.subjectId?.name || sub.subjectName} • {sub.room || 'Classroom'}
                      </td>
                      <td className="border border-gray-300 p-2.5 w-24"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between pt-12 text-xs font-bold text-gray-700">
                <div>Timetable In-Charge</div>
                <div>Principal / Headmaster</div>
              </div>
            </div>
          )}

          {/* 4. Master Wall Chart Print View */}
          {printType === 'master' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                Day: {printData.selectedDay} • All Classes Matrix
              </div>

              <table className="w-full border-collapse border border-gray-300 text-[10px] text-center">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-gray-300 p-1.5 w-24 text-left">Class</th>
                    {(printData.structure?.periods || []).map(p => (
                      <th key={p.periodNumber} className="border border-gray-300 p-1.5">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(printData.classes || []).map(cls => {
                    const cName = cls.section ? `${cls.name}-${cls.section}` : cls.name;
                    const dayData = cls.timetable?.find(d => d.day === printData.selectedDay);
                    return (
                      <tr key={cls._id}>
                        <td className="border border-gray-300 p-1.5 font-bold text-left bg-gray-50">Class {cName}</td>
                        {(printData.structure?.periods || []).map(p => {
                          if (p.isBreak) return <td key={p.periodNumber} className="border border-gray-300 p-1 text-gray-400">|</td>;
                          const slot = dayData?.periods?.find(slot => (slot.periodNumber || 0) === p.periodNumber);
                          return (
                            <td key={p.periodNumber} className="border border-gray-300 p-1">
                              {slot?.subjectId ? (
                                <div>
                                  <div className="font-bold">{slot.subjectId?.name || ''}</div>
                                  <div className="text-gray-500">{slot.teacherId?.name || slot.teacherName || ''}</div>
                                </div>
                              ) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintableTimetableModal;
