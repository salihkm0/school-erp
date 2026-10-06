// src/components/dashboard/QuickActions.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const actionsByRole = {
  admin: [
    { label: 'Students', icon: '👦', badge: 'Active', bg: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20', path: '/students' },
    { label: 'Staff & Teachers', icon: '👩‍🏫', badge: 'Faculty', bg: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-500/20', path: '/staff' },
    { label: 'Attendance', icon: '📋', badge: 'Live', bg: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', path: '/attendance' },
    { label: 'Kerala SSLC', icon: '🏆', badge: '10 A+', bg: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/20', path: '/sslc' },
    { label: 'Fees & Billing', icon: '💰', badge: 'Online', bg: 'from-purple-400 to-indigo-500', shadow: 'shadow-purple-500/20', path: '/fees' },
    { label: 'Time Table', icon: '🕒', badge: 'Schedules', bg: 'from-sky-400 to-blue-500', shadow: 'shadow-sky-500/20', path: '/timetable' },
    { label: 'Calendar & Holidays', icon: '🏖️', badge: 'Holidays', bg: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/20', path: '/calendar' },
    { label: 'Events & Fests', icon: '🎪', badge: 'Fest 2026', bg: 'from-rose-400 to-red-500', shadow: 'shadow-rose-500/20', path: '/events' },
    { label: 'Exams & Schedule', icon: '📝', badge: 'Exams', bg: 'from-red-400 to-rose-600', shadow: 'shadow-red-500/20', path: '/exams' },
    { label: 'Marks Entry', icon: '✍️', badge: 'Grading', bg: 'from-teal-400 to-emerald-600', shadow: 'shadow-teal-500/20', path: '/admin/marks-entry' },
    { label: 'Classes', icon: '🏫', badge: 'Rooms', bg: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/20', path: '/classes' },
    { label: 'Subjects', icon: '📚', badge: 'Curriculum', bg: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-500/20', path: '/subjects' },
    { label: 'Staff Duties', icon: '👔', badge: 'Rosters', bg: 'from-slate-500 to-slate-700', shadow: 'shadow-slate-500/20', path: '/duties' },
    { label: 'Reports & Stats', icon: '📊', badge: 'Analytics', bg: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20', path: '/reports' },
    { label: 'Notifications', icon: '📬', badge: 'Alerts', bg: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20', path: '/notifications' },
    { label: 'Configure', icon: '⚙️', badge: 'Settings', bg: 'from-slate-600 to-gray-800', shadow: 'shadow-gray-500/20', path: '/settings' },
  ],
  staff: [
    { label: 'Attendance List', icon: '📋', badge: 'Daily', bg: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', path: '/staff/attendance' },
    { label: 'Add Attendance', icon: '✅', badge: 'Mark', bg: 'from-teal-400 to-emerald-600', shadow: 'shadow-teal-500/20', path: '/staff/attendance' },
    { label: 'Students List', icon: '👦', badge: 'Class', bg: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20', path: '/staff/my-classes' },
    { label: 'Time Table', icon: '🕒', badge: 'Today', bg: 'from-sky-400 to-blue-500', shadow: 'shadow-sky-500/20', path: '/timetable' },
    { label: 'Calendar & Holidays', icon: '🏖️', badge: 'Holidays', bg: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/20', path: '/calendar' },
    { label: 'Exams', icon: '📝', badge: 'Schedule', bg: 'from-red-400 to-rose-600', shadow: 'shadow-red-500/20', path: '/staff/exams' },
    { label: 'Marks Entry', icon: '✍️', badge: 'Grading', bg: 'from-purple-400 to-indigo-500', shadow: 'shadow-purple-500/20', path: '/staff/marks-entry' },
    { label: 'Class Marks', icon: '📑', badge: 'Overview', bg: 'from-indigo-400 to-blue-500', shadow: 'shadow-indigo-500/20', path: '/staff/class-marks' },
    { label: 'Kerala SSLC', icon: '🏆', badge: '10 A+', bg: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/20', path: '/sslc' },
    { label: 'Staff Duties', icon: '👔', badge: 'Rosters', bg: 'from-slate-500 to-slate-700', shadow: 'shadow-slate-500/20', path: '/staff/my-duties' },
    { label: 'Analytics Reports', icon: '📊', badge: 'Stats', bg: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20', path: '/reports' },
    { label: 'Events & Fests', icon: '🎪', badge: 'Fest', bg: 'from-rose-400 to-red-500', shadow: 'shadow-rose-500/20', path: '/events' },
  ],
  parent: [
    { label: 'Attendance', icon: '📋', badge: 'Tracker', bg: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', path: '/my-child-attendance' },
    { label: 'Exam Results', icon: '📊', badge: 'Report Card', bg: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/20', path: '/my-child-results' },
    { label: 'Fee Details', icon: '💰', badge: 'Payments', bg: 'from-purple-400 to-indigo-500', shadow: 'shadow-purple-500/20', path: '/my-child-fees' },
    { label: 'Kerala SSLC', icon: '🏆', badge: '10 A+', bg: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/20', path: '/sslc' },
    { label: 'Time Table', icon: '🕒', badge: 'Schedule', bg: 'from-sky-400 to-blue-500', shadow: 'shadow-sky-500/20', path: '/timetable' },
    { label: 'Calendar & Holidays', icon: '🏖️', badge: 'Holidays', bg: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/20', path: '/calendar' },
    { label: 'Events & Fests', icon: '🎪', badge: 'Fest 2026', bg: 'from-rose-400 to-red-500', shadow: 'shadow-rose-500/20', path: '/events' },
    { label: 'My Children', icon: '👨‍👩‍👧', badge: 'Profiles', bg: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20', path: '/my-children' },
    { label: 'Notifications', icon: '📬', badge: 'Alerts', bg: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20', path: '/notifications' },
  ],
}

const QuickActions = ({ userRole = 'admin' }) => {
  const navigate = useNavigate()
  const actions = actionsByRole[userRole] || actionsByRole.parent

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="text-xl">🎒</span> Academics & Operations Hub
          </h2>
          <p className="text-xs text-slate-500">
            Interactive modules and essential daily actions
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full border border-emerald-200 self-start sm:self-auto">
          BATCH 2025-2026
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="group relative flex flex-col items-center justify-center p-3.5 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            {action.badge && (
              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-md uppercase tracking-wider group-hover:bg-emerald-600 transition-colors">
                {action.badge}
              </span>
            )}

            <div
              className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${action.bg} flex items-center justify-center text-2xl shadow-md ${action.shadow} mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200`}
            >
              {action.icon}
            </div>

            <span className="text-xs font-extrabold text-slate-800 text-center line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions