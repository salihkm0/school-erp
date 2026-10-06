// src/components/attendance/DailyAttendanceRollCall.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchDailyAttendanceByClass, 
  markDailyAttendance, 
  notifyDailyAbsentees 
} from '../../store/slices/attendanceSlice'
import { useAdminTeacherClasses } from '../../hooks/useAdminTeacherClasses'
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Search,
  Send,
  Save,
  CheckCheck,
  UserCheck,
  UserX,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function DailyAttendanceRollCall({ defaultClassId = null, isStaffView = false }) {
  const dispatch = useDispatch()
  const { myClasses: classes, isLoading: classesLoading } = useAdminTeacherClasses('class-teacher')
  const { dailyAttendance, isDailyLoading } = useSelector((state) => state.attendance)
  const { user } = useSelector((state) => state.auth)

  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [selectedClass, setSelectedClass] = useState(defaultClassId || '')
  const [session, setSession] = useState('full_day')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'absent', 'late', 'present'
  const [notifyParents, setNotifyParents] = useState(true)

  // Local state for interactive editing of attendance records
  // key: studentId -> { status: 'present'|'absent'|'late'|'half_day'|'excused', remarks: '' }
  const [recordsMap, setRecordsMap] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)

  // Set default class if available
  useEffect(() => {
    if (defaultClassId) {
      setSelectedClass(defaultClassId)
    } else if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id)
    }
  }, [classes, defaultClassId, selectedClass])

  // Load daily attendance when class or date or session changes
  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadDailyAttendance()
    }
  }, [selectedClass, selectedDate, session])

  const loadDailyAttendance = async () => {
    try {
      const response = await dispatch(fetchDailyAttendanceByClass({
        classId: selectedClass,
        date: selectedDate,
        session
      })).unwrap()

      // Populate local recordsMap from response
      const initialMap = {}
      if (response.students && Array.isArray(response.students)) {
        response.students.forEach(st => {
          initialMap[st.studentId] = {
            studentId: st.studentId,
            studentName: st.fullName,
            status: st.status || 'present',
            remarks: st.remarks || '',
            isNotified: st.isNotified || false
          }
        })
      }
      setRecordsMap(initialMap)
    } catch (error) {
      console.error('Failed to load daily attendance:', error)
    }
  }

  // Handle status toggle for a student
  const handleStatusChange = (studentId, newStatus) => {
    setRecordsMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: newStatus
      }
    }))
  }

  // Handle remarks change
  const handleRemarksChange = (studentId, remarks) => {
    setRecordsMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }))
  }

  // Batch actions
  const handleMarkAll = (targetStatus) => {
    setRecordsMap(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(sId => {
        next[sId] = {
          ...next[sId],
          status: targetStatus
        }
      })
      return next
    })
    toast.success(`Marked all students as ${targetStatus.toUpperCase()}`)
  }

  // Save Daily Attendance
  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      toast.error('Please select a class')
      return
    }

    const recordsArray = Object.values(recordsMap)
    if (recordsArray.length === 0) {
      toast.error('No student records to save')
      return
    }

    setIsSaving(true)
    try {
      await dispatch(markDailyAttendance({
        classId: selectedClass,
        dateString: selectedDate,
        session,
        records: recordsArray,
        notifyParents
      })).unwrap()

      await loadDailyAttendance()
    } catch (error) {
      console.error('Save daily attendance error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Trigger absentee notification
  const handleNotifyAbsentees = async () => {
    if (!selectedClass) return
    const absentees = Object.values(recordsMap).filter(r => r.status === 'absent' || r.status === 'late')
    if (absentees.length === 0) {
      toast.info('No absent or late students to notify')
      return
    }

    setIsNotifying(true)
    try {
      await dispatch(notifyDailyAbsentees({
        classId: selectedClass,
        dateString: selectedDate
      })).unwrap()
      await loadDailyAttendance()
    } catch (error) {
      console.error('Notify absentees error:', error)
    } finally {
      setIsNotifying(false)
    }
  }

  // Quick date navigation
  const handleDateOffset = (offsetDays) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + offsetDays)
    setSelectedDate(current.toISOString().split('T')[0])
  }

  // Computed counts from local state
  const rawStudents = dailyAttendance?.students || []
  const counts = useMemo(() => {
    let present = 0
    let absent = 0
    let late = 0
    let halfDay = 0
    let excused = 0

    Object.values(recordsMap).forEach(rec => {
      if (rec.status === 'present') present++
      else if (rec.status === 'absent') absent++
      else if (rec.status === 'late') late++
      else if (rec.status === 'half_day') halfDay++
      else if (rec.status === 'excused') excused++
    })

    const total = Object.keys(recordsMap).length
    const effectivePresent = present + late + (halfDay * 0.5)
    const percentage = total > 0 ? (effectivePresent / total) * 100 : 0

    return {
      total,
      present,
      absent,
      late,
      halfDay,
      excused,
      percentage: Math.round(percentage * 10) / 10
    }
  }, [recordsMap])

  // Filter students
  const filteredStudents = useMemo(() => {
    return rawStudents.filter(st => {
      const currentStatus = recordsMap[st.studentId]?.status || st.status || 'present'
      
      const matchesSearch = 
        st.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.rollNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'absent' && currentStatus === 'absent') ||
        (statusFilter === 'late' && currentStatus === 'late') ||
        (statusFilter === 'present' && currentStatus === 'present')

      return matchesSearch && matchesStatus
    })
  }, [rawStudents, recordsMap, searchTerm, statusFilter])

  const selectedClassObj = classes.find(c => c._id === selectedClass)

  return (
    <div className="space-y-6">
      {/* Top Filter & Control Cockpit */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Class, Date & Session Selectors */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Class Selector */}
            {!isStaffView && (
              <div className="min-w-[200px]">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.displayName || `${cls.name} - ${cls.section || 'All'}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Picker with Quick Step Controls */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Attendance Date
              </label>
              <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => handleDateOffset(-1)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-0 text-sm font-bold text-slate-800 focus:ring-0 px-2 py-1 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => handleDateOffset(1)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Today Button */}
            <div className="self-end">
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDate === todayStr
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
            </div>

            {/* Session Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Session
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="full_day">Full Day</option>
                <option value="morning">Morning Roll Call</option>
                <option value="afternoon">Afternoon Roll Call</option>
              </select>
            </div>
          </div>

          {/* Submission Status Indicator & Class Header */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 animate-pulse ${
              dailyAttendance?.isSubmitted ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {dailyAttendance?.isSubmitted ? 'Attendance Marked' : 'Attendance Pending'}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  dailyAttendance?.isSubmitted 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {dailyAttendance?.isSubmitted ? 'Submitted' : 'Not Saved Yet'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {dailyAttendance?.markedBy 
                  ? `Marked by ${dailyAttendance.markedBy}`
                  : `Class: ${selectedClassObj?.displayName || selectedClassObj?.name || 'Selected Class'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Live Daily Attendance Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Students</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">{counts.total}</div>
          </div>

          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/60">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>Present</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-800 mt-1">{counts.present}</div>
          </div>

          <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200/60">
            <div className="flex items-center justify-between text-xs text-rose-700 font-bold">
              <span>Absent</span>
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-800 mt-1">{counts.absent}</div>
          </div>

          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/60">
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
              <span>Late</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-800 mt-1">{counts.late}</div>
          </div>

          <div className="bg-sky-50/80 p-3.5 rounded-xl border border-sky-200/60">
            <div className="flex items-center justify-between text-xs text-sky-700 font-bold">
              <span>Half Day / Leave</span>
              <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-xl font-black text-sky-800 mt-1">{counts.halfDay + counts.excused}</div>
          </div>

          <div className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-200/60">
            <div className="flex items-center justify-between text-xs text-indigo-700 font-bold">
              <span>Attendance Rate</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-indigo-800 mt-1">{counts.percentage}%</div>
          </div>
        </div>
      </div>

      {/* Main Roll Call Interactive Table & Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Quick Batch Actions & Search Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* 1-Click Fast Marking Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('present')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkAll('absent')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 transition-colors cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Mark All Absent</span>
            </button>

            <button
              type="button"
              onClick={loadDailyAttendance}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search & Filter Chips */}
          <div className="flex items-center gap-2.5">
            <div className="relative min-w-[180px] sm:min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({counts.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('absent')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'absent' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Absent ({counts.absent})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('late')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'late' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Late ({counts.late})
              </button>
            </div>
          </div>
        </div>

        {/* Students Roll Call Table */}
        {isDailyLoading ? (
          <div className="p-12 text-center">
            <LoadingSpinner />
            <p className="text-xs text-slate-500 mt-2 font-medium">Loading student roll call list...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No students found</p>
            <p className="text-xs text-slate-400 mt-0.5">Please check class selection or clear search filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                  <th className="py-3 px-4 w-12 text-center">Roll</th>
                  <th className="py-3 px-4 min-w-[220px]">Student Name</th>
                  <th className="py-3 px-4 min-w-[340px]">Mark Status</th>
                  <th className="py-3 px-4 min-w-[200px]">Remarks / Reason</th>
                  <th className="py-3 px-4 w-28 text-center">Recent Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((st) => {
                  const currentRec = recordsMap[st.studentId] || { status: 'present', remarks: '' }
                  const currentStatus = currentRec.status || 'present'

                  return (
                    <tr
                      key={st.studentId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        currentStatus === 'absent' 
                          ? 'bg-rose-50/40' 
                          : currentStatus === 'late' 
                            ? 'bg-amber-50/40' 
                            : ''
                      }`}
                    >
                      {/* Roll Number */}
                      <td className="py-3.5 px-4 text-center font-black text-slate-700 text-xs">
                        {st.rollNumber || '-'}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            currentStatus === 'absent'
                              ? 'bg-rose-100 text-rose-800'
                              : currentStatus === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {st.fullName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm leading-snug">
                              {st.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Adm: {st.admissionNo || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Selector Pills */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'present')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600/30'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'absent')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/30'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          {/* Late Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'late')}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-500/30 font-extrabold'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>

                          {/* Half Day */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'half_day')}
                            className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                              currentStatus === 'half_day'
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500 hover:bg-sky-50'
                            }`}
                          >
                            Half Day
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'excused')}
                            className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                              currentStatus === 'excused'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500 hover:bg-purple-50'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>

                      {/* Remarks Input */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder={currentStatus === 'absent' ? 'Reason for absence...' : currentStatus === 'late' ? 'Arrival time / note...' : 'Optional remark...'}
                          value={currentRec.remarks || ''}
                          onChange={(e) => handleRemarksChange(st.studentId, e.target.value)}
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                            currentStatus === 'absent'
                              ? 'border-rose-300 bg-rose-50/50 focus:bg-white text-rose-900 focus:ring-1 focus:ring-rose-500'
                              : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:ring-1 focus:ring-emerald-500'
                          }`}
                        />
                      </td>

                      {/* Recent 5-Day Mini Trend Dots */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(st.recentHistory && st.recentHistory.length > 0) ? (
                            st.recentHistory.map((h, i) => (
                              <span
                                key={i}
                                title={`${h.dateString}: ${h.status.toUpperCase()}`}
                                className={`w-2 h-2 rounded-full inline-block ${
                                  h.status === 'present'
                                    ? 'bg-emerald-500'
                                    : h.status === 'absent'
                                      ? 'bg-rose-500'
                                      : h.status === 'late'
                                        ? 'bg-amber-400'
                                        : 'bg-slate-300'
                                }`}
                              />
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-300">No logs</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Submission Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Notification Checkbox */}
          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notifyParents}
              onChange={(e) => setNotifyParents(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instantly notify parents of absent / late students via Mobile App &amp; SMS</span>
            </div>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {counts.absent > 0 && dailyAttendance?.isSubmitted && (
              <button
                type="button"
                onClick={handleNotifyAbsentees}
                disabled={isNotifying}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isNotifying ? 'Sending Alerts...' : `Send Absentee Alert (${counts.absent})`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={isSaving || isDailyLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Attendance...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Daily Attendance</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
