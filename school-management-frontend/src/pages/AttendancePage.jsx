// src/pages/AttendancePage.jsx
import React from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import DailyAttendanceRollCall from '../components/attendance/DailyAttendanceRollCall'
import DailyAttendanceMatrix from '../components/attendance/DailyAttendanceMatrix'
import DailyAttendanceDashboard from '../components/attendance/DailyAttendanceDashboard'
import AttendanceList from '../components/attendance/AttendanceList'
import BulkAttendance from '../components/attendance/BulkAttendance'
import AttendanceSummary from '../components/attendance/AttendanceSummary'
import AttendanceTemplates from '../components/attendance/AttendanceTemplates'
import AttendanceAnalyticsView from '../components/reports/AttendanceAnalyticsView'
import {
  CalendarCheck,
  Table,
  Building2,
  FileSpreadsheet,
  FileText,
  Sliders,
  TrendingUp
} from 'lucide-react'

const AttendancePage = () => {
  const navigate = useNavigate()

  const tabs = [
    { path: '/attendance', name: 'Daily Roll Call', icon: CalendarCheck, end: true },
    { path: '/attendance/matrix', name: 'Monthly Matrix', icon: Table },
    { path: '/attendance/dashboard', name: 'Campus Live Cockpit', icon: Building2 },
    { path: '/attendance/list', name: 'Monthly Summary', icon: FileText },
    { path: '/attendance/bulk', name: 'Bulk Monthly Entry', icon: FileSpreadsheet },
    { path: '/attendance/templates', name: 'Templates', icon: Sliders },
    { path: '/attendance/analytics', name: 'Analytics', icon: TrendingUp },
  ]

  const handleSelectClassFromDashboard = (classId) => {
    navigate(`/attendance?classId=${classId}`)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Attendance Management Suite
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          1-click daily roll calls, real-time absentee alerts, monthly matrix registers, and automatic report card synchronization.
        </p>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-none">
        <nav className="flex gap-2 sm:gap-3 min-w-max pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Tab Routes */}
      <Routes>
        <Route index element={<DailyAttendanceRollCall />} />
        <Route path="matrix" element={<DailyAttendanceMatrix />} />
        <Route path="dashboard" element={<DailyAttendanceDashboard onSelectClass={handleSelectClassFromDashboard} />} />
        <Route path="list" element={<AttendanceList />} />
        <Route path="bulk" element={<BulkAttendance />} />
        <Route path="summary" element={<AttendanceSummary />} />
        <Route path="templates" element={<AttendanceTemplates />} />
        <Route path="analytics" element={<AttendanceAnalyticsView />} />
      </Routes>
    </div>
  )
}

export default AttendancePage