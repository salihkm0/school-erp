// src/components/attendance/DailyAttendanceMatrix.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDailyAttendanceMatrix } from '../../store/slices/attendanceSlice'
import { useAdminTeacherClasses } from '../../hooks/useAdminTeacherClasses'
import {
  Calendar,
  Download,
  Printer,
  Search,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function DailyAttendanceMatrix({ defaultClassId = null }) {
  const dispatch = useDispatch()
  const { myClasses: classes } = useAdminTeacherClasses('class-teacher')
  const { dailyMatrix, isDailyLoading } = useSelector((state) => state.attendance)

  const now = new Date()
  const [selectedClass, setSelectedClass] = useState(defaultClassId || '')
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (defaultClassId) {
      setSelectedClass(defaultClassId)
    } else if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id)
    }
  }, [classes, defaultClassId, selectedClass])

  useEffect(() => {
    if (selectedClass && selectedYear && selectedMonth) {
      dispatch(fetchDailyAttendanceMatrix({
        classId: selectedClass,
        year: selectedYear,
        month: selectedMonth
      }))
    }
  }, [dispatch, selectedClass, selectedYear, selectedMonth])

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate()
  }, [selectedYear, selectedMonth])

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }, [daysInMonth])

  const studentsList = dailyMatrix?.students || []

  // Filter students
  const filteredStudents = useMemo(() => {
    return studentsList.filter(st =>
      st.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.rollNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [studentsList, searchTerm])

  // Class monthly stats
  const classStats = useMemo(() => {
    if (!studentsList.length) return { avgPercentage: 0, totalMarkedDays: 0 }
    const totalPerc = studentsList.reduce((acc, s) => acc + (s.percentage || 0), 0)
    return {
      avgPercentage: Math.round((totalPerc / studentsList.length) * 10) / 10,
      totalMarkedDays: dailyMatrix?.markedDaysCount || 0
    }
  }, [studentsList, dailyMatrix])

  // Export matrix to Excel (.xlsx)
  const handleExportExcel = () => {
    if (!studentsList.length) {
      toast.error('No attendance matrix data to export')
      return
    }

    const selectedClassObj = classes.find(c => c._id === selectedClass)
    const className = selectedClassObj?.displayName || selectedClassObj?.name || 'Class'
    const monthName = MONTH_NAMES[selectedMonth - 1]

    const exportRows = studentsList.map(st => {
      const row = {
        'Roll No': st.rollNumber || '',
        'Admission No': st.admissionNo || '',
        'Student Name': st.fullName || ''
      }

      daysArray.forEach(d => {
        row[`Day ${d}`] = st.days?.[d] || '-'
      })

      row['Total Present'] = st.presentCount || 0
      row['Total Absent'] = st.absentCount || 0
      row['Total Late'] = st.lateCount || 0
      row['Attendance %'] = `${st.percentage || 0}%`

      return row
    })

    const ws = XLSX.utils.json_to_sheet(exportRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Attendance Matrix')
    XLSX.writeFile(wb, `Daily_Attendance_${className}_${monthName}_${selectedYear}.xlsx`)
    toast.success('Matrix exported to Excel')
  }

  // Print Register
  const handlePrint = () => {
    window.print()
  }

  const selectedClassObj = classes.find(c => c._id === selectedClass)

  return (
    <div className="space-y-6">
      {/* Matrix Controls & Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Class, Month & Year Selectors */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Class */}
            <div className="min-w-[180px]">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Class / Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.displayName || `${cls.name} - ${cls.section || 'All'}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons: Excel & Print */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Register</span>
            </button>
          </div>
        </div>

        {/* Monthly Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div className="text-xs text-slate-500 font-medium">Total Enrolled</div>
            <div className="text-xl font-black text-slate-900 mt-1">{studentsList.length} Students</div>
          </div>

          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200/60">
            <div className="text-xs text-blue-700 font-bold">Days Recorded</div>
            <div className="text-xl font-black text-blue-900 mt-1">
              {classStats.totalMarkedDays} / {daysInMonth} Days
            </div>
          </div>

          <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200/60">
            <div className="text-xs text-purple-700 font-bold">Official Working Days</div>
            <div className="text-xl font-black text-purple-900 mt-1">
              {dailyMatrix?.totalWorkingDays || 25} Days
            </div>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200/60">
            <div className="text-xs text-emerald-700 font-bold">Class Average %</div>
            <div className="text-xl font-black text-emerald-900 mt-1">
              {classStats.avgPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Full Monthly Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Search & Legend Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              P = Present
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
              A = Absent
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              L = Late
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
              HD = Half Day
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              SUN / HOL = Off
            </span>
          </div>
        </div>

        {/* Matrix Grid Content */}
        {isDailyLoading ? (
          <div className="p-16 text-center">
            <LoadingSpinner />
            <p className="text-xs text-slate-500 mt-2 font-medium">Generating attendance matrix...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No student records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[650px] relative">
            <table className="w-full text-center border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                {/* Header Row: Days 1 to N */}
                <tr>
                  <th className="sticky left-0 z-30 bg-slate-100 py-3 px-3 text-left w-12 border-r border-slate-200 font-extrabold text-slate-700">
                    Roll
                  </th>
                  <th className="sticky left-12 z-30 bg-slate-100 py-3 px-3 text-left min-w-[180px] border-r border-slate-200 font-extrabold text-slate-700">
                    Student Name
                  </th>

                  {daysArray.map((day) => {
                    const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay()
                    const isSunday = dayOfWeek === 0
                    return (
                      <th
                        key={day}
                        className={`py-2 px-1 min-w-[28px] max-w-[32px] border-r border-slate-200 font-bold ${
                          isSunday ? 'bg-slate-200/70 text-slate-500' : 'text-slate-800'
                        }`}
                      >
                        <div>{day}</div>
                        <div className="text-[9px] font-normal text-slate-400">
                          {DAY_LETTERS[dayOfWeek]}
                        </div>
                      </th>
                    )
                  })}

                  <th className="py-2 px-2 bg-emerald-50 text-emerald-900 border-r border-slate-200 font-extrabold min-w-[45px]">
                    Pres
                  </th>
                  <th className="py-2 px-2 bg-rose-50 text-rose-900 border-r border-slate-200 font-extrabold min-w-[45px]">
                    Abs
                  </th>
                  <th className="py-2 px-2 bg-indigo-50 text-indigo-900 font-extrabold min-w-[55px]">
                    %
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Sticky Roll No */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 py-2.5 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                      {st.rollNumber || '-'}
                    </td>

                    {/* Sticky Student Name */}
                    <td className="sticky left-12 z-10 bg-white group-hover:bg-slate-50 py-2.5 px-3 text-left font-bold text-slate-900 border-r border-slate-200 truncate max-w-[180px]">
                      {st.fullName}
                    </td>

                    {/* Day Cells 1 to N */}
                    {daysArray.map((day) => {
                      const val = st.days?.[day] || '-'
                      const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay()
                      const isSunday = dayOfWeek === 0

                      let cellClass = 'text-slate-300'
                      let cellText = '-'

                      if (val === 'present') {
                        cellClass = 'bg-emerald-100 text-emerald-800 font-bold'
                        cellText = 'P'
                      } else if (val === 'absent') {
                        cellClass = 'bg-rose-600 text-white font-black ring-1 ring-rose-400'
                        cellText = 'A'
                      } else if (val === 'late') {
                        cellClass = 'bg-amber-400 text-slate-950 font-black'
                        cellText = 'L'
                      } else if (val === 'half_day') {
                        cellClass = 'bg-sky-200 text-sky-900 font-bold'
                        cellText = 'HD'
                      } else if (val === 'excused') {
                        cellClass = 'bg-purple-100 text-purple-800 font-bold'
                        cellText = 'E'
                      } else if (val === 'SUN' || isSunday) {
                        cellClass = 'bg-slate-100/70 text-slate-400 text-[10px]'
                        cellText = 'S'
                      } else if (val === 'HOL') {
                        cellClass = 'bg-purple-50 text-purple-700 text-[10px] font-semibold'
                        cellText = 'H'
                      }

                      return (
                        <td
                          key={day}
                          className={`p-1 border-r border-slate-100 ${cellClass}`}
                          title={`Day ${day}: ${val.toUpperCase()}`}
                        >
                          {cellText}
                        </td>
                      )
                    })}

                    {/* Summary Totals */}
                    <td className="py-2.5 px-2 bg-emerald-50/50 font-bold text-emerald-800 border-r border-slate-200">
                      {st.presentCount}
                    </td>
                    <td className="py-2.5 px-2 bg-rose-50/50 font-bold text-rose-800 border-r border-slate-200">
                      {st.absentCount}
                    </td>
                    <td className={`py-2.5 px-2 font-black ${
                      (st.percentage || 0) < 75 ? 'text-rose-600 bg-rose-50' : 'text-slate-900 bg-indigo-50/50'
                    }`}>
                      {st.percentage}%
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
