// src/components/attendance/DailyAttendanceDashboard.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchDailyAttendanceDashboardStats, 
  notifyPendingAttendance 
} from '../../store/slices/attendanceSlice'
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  RefreshCw,
  Bell
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function DailyAttendanceDashboard({ onSelectClass }) {
  const dispatch = useDispatch()
  const { dailyDashboardStats } = useSelector((state) => state.attendance)
  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotifyingAll, setIsNotifyingAll] = useState(false)

  useEffect(() => {
    loadStats()
  }, [selectedDate])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      await dispatch(fetchDailyAttendanceDashboardStats(selectedDate)).unwrap()
    } catch (error) {
      console.error('Failed to load daily attendance dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemindPending = async (classId = null) => {
    setIsNotifyingAll(true)
    try {
      await dispatch(notifyPendingAttendance({
        classId: classId || undefined,
        allPending: !classId
      })).unwrap()
      toast.success(classId ? 'Reminder sent to class teacher' : 'Reminders sent to all pending class teachers')
    } catch (error) {
      console.error('Failed to send reminders:', error)
    } finally {
      setIsNotifyingAll(false)
    }
  }

  const overall = dailyDashboardStats?.overall || {
    totalCampusStudents: 0,
    totalMarkedStudents: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    overallPercentage: 0,
    submittedClassesCount: 0,
    totalClassesCount: 0,
    submissionRate: 0
  }

  const classList = dailyDashboardStats?.classes || []

  return (
    <div className="space-y-6">
      {/* Date Header & Quick Refresh */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Campus Live Cockpit</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Real-Time
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Daily Campus Attendance Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time attendance rates and roll-call status across all classes</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-0 text-xs font-bold text-slate-800 focus:ring-0 p-0 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={loadStats}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Campus Attendance Rate */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md shadow-emerald-600/15">
          <div className="flex items-center justify-between text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <span>Campus Attendance</span>
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="text-3xl font-black mt-2">{overall.overallPercentage}%</div>
          <div className="text-xs text-emerald-100/90 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{overall.totalPresent} Present of {overall.totalMarkedStudents} Marked</span>
          </div>
        </div>

        {/* Classes Submitted Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Roll Calls Submitted</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {overall.submittedClassesCount} / {overall.totalClassesCount}
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overall.submissionRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1.5">
            {overall.submissionRate}% of classes marked today
          </div>
        </div>

        {/* Absentees Count */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold uppercase tracking-wider">
            <span>Total Absentees</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-700 mt-2">{overall.totalAbsent}</div>
          <p className="text-xs text-slate-500 mt-1">Students marked absent today</p>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase tracking-wider">
            <span>Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-700 mt-2">{overall.totalLate}</div>
          <p className="text-xs text-slate-500 mt-1">Students marked late today</p>
        </div>
      </div>

      {/* Classes Roll Call Status Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Class-by-Class Roll Call Status</h3>
            <p className="text-xs text-slate-500">Monitor teacher submissions and attendance rates for each division</p>
          </div>

          {overall.submittedClassesCount < overall.totalClassesCount && (
            <button
              type="button"
              onClick={() => handleRemindPending()}
              disabled={isNotifyingAll}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span>{isNotifyingAll ? 'Sending Reminders...' : 'Send Reminder to Pending Teachers'}</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <LoadingSpinner />
          </div>
        ) : classList.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No active classes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Class Teacher</th>
                  <th className="py-3 px-4">Roll Call Status</th>
                  <th className="py-3 px-4 text-center">Present</th>
                  <th className="py-3 px-4 text-center">Absent</th>
                  <th className="py-3 px-4 text-center">Late</th>
                  <th className="py-3 px-4 text-center">Attendance %</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classList.map((cls) => (
                  <tr key={cls.classId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Class Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {cls.className}
                    </td>

                    {/* Class Teacher */}
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                      {cls.classTeacher}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {cls.isMarked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Submitted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Present */}
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                      {cls.isMarked ? cls.presentCount : '-'}
                    </td>

                    {/* Absent */}
                    <td className="py-3.5 px-4 text-center font-bold text-rose-700">
                      {cls.isMarked ? cls.absentCount : '-'}
                    </td>

                    {/* Late */}
                    <td className="py-3.5 px-4 text-center font-bold text-amber-700">
                      {cls.isMarked ? cls.lateCount : '-'}
                    </td>

                    {/* Attendance % */}
                    <td className="py-3.5 px-4 text-center">
                      {cls.isMarked ? (
                        <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                          cls.attendancePercentage >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : cls.attendancePercentage >= 75
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {cls.attendancePercentage}%
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onSelectClass && (
                          <button
                            type="button"
                            onClick={() => onSelectClass(cls.classId)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            Open Roll Call
                          </button>
                        )}

                        {!cls.isMarked && (
                          <button
                            type="button"
                            onClick={() => handleRemindPending(cls.classId)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Remind Class Teacher"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
