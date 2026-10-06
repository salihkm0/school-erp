// src/components/settings/SchoolCalendarSettings.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import schoolCalendarService from '../../services/schoolCalendarService';
import { 
  CalendarDaysIcon, 
  PlusIcon, 
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingLibraryIcon,
  BellIcon,
  DocumentArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SchoolCalendarSettings = () => {
  const { classes = [] } = useSelector((state) => state.classes || {});
  const { activeAcademicYear } = useSelector((state) => state.academicYears || {});

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Date State for Grid View
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('public_holiday');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [applicableTo, setApplicableTo] = useState('all');
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [notifyCommunity, setNotifyCommunity] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await schoolCalendarService.getCalendarEvents({
        academicYearId: activeAcademicYear?._id,
        type: typeFilter !== 'all' ? typeFilter : undefined
      });
      if (res && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load calendar events:', err);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [typeFilter, activeAcademicYear]);

  const handleOpenAddModal = (defaultDateStr = '') => {
    setEditingEvent(null);
    setTitle('');
    setType('public_holiday');
    setStartDate(defaultDateStr || new Date().toISOString().split('T')[0]);
    setEndDate(defaultDateStr || new Date().toISOString().split('T')[0]);
    setDescription('');
    setApplicableTo('all');
    setSelectedClassIds([]);
    setNotifyCommunity(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setType(evt.type);
    setStartDate(new Date(evt.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(evt.endDate).toISOString().split('T')[0]);
    setDescription(evt.description || '');
    setApplicableTo(evt.applicableTo || 'all');
    setSelectedClassIds((evt.classIds || []).map(c => c._id || c));
    setNotifyCommunity(false);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate) {
      toast.error('Title and Start Date are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        type,
        startDate,
        endDate: endDate || startDate,
        academicYearId: activeAcademicYear?._id,
        description,
        applicableTo,
        classIds: applicableTo === 'specific_classes' ? selectedClassIds : [],
        notifyCommunity: notifyCommunity && !editingEvent
      };

      if (editingEvent) {
        await schoolCalendarService.updateCalendarEvent(editingEvent._id, payload);
        toast.success('Calendar event updated successfully');
      } else {
        await schoolCalendarService.createCalendarEvent(payload);
        toast.success('Holiday / Event added to school calendar');
      }

      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this calendar entry?')) {
      try {
        await schoolCalendarService.deleteCalendarEvent(id);
        toast.success('Event deleted');
        loadEvents();
      } catch (err) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleImportStandardHolidays = async () => {
    const currentYear = currentDate.getFullYear();
    if (!window.confirm(`Pre-populate standard National & State school holidays for year ${currentYear}?`)) return;

    setIsImporting(true);
    try {
      const res = await schoolCalendarService.importStandardHolidays({
        year: currentYear,
        academicYearId: activeAcademicYear?._id
      });
      toast.success(res.message || 'Standard holidays pre-populated!');
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to import holidays');
    } finally {
      setIsImporting(false);
    }
  };

  const getTypeBadgeStyle = (t) => {
    switch (t) {
      case 'public_holiday':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40';
      case 'vacation':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40';
      case 'school_event':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
      case 'examination_period':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40';
      case 'special_working_day':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Calendar Grid helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const setToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day) => {
    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);

    return events.filter(e => {
      const s = new Date(e.startDate);
      s.setHours(0, 0, 0, 0);
      const en = new Date(e.endDate);
      en.setHours(23, 59, 59, 999);
      return targetDate >= s && targetDate <= en;
    });
  };

  const filteredEvents = events.filter(e => {
    if (!searchQuery.trim()) return true;
    return (
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner with 1-Click Import Action */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 mb-2">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>School Calendar & Holidays Configuration</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Academic Calendar & Public Holidays</h2>
          <p className="text-emerald-100 text-xs mt-1">
            Manage gazetted public holidays, seasonal vacations, examination intervals, and cultural school events with real-time parent notifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleImportStandardHolidays}
            disabled={isImporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-sm transition border border-white/20"
          >
            {isImporting ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4 text-amber-300" />}
            Auto-Populate Standard Holidays
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg transition"
          >
            <PlusIcon className="w-4 h-4" />
            Add Holiday / Event
          </button>
        </div>
      </div>

      {/* Control Bar: View Switcher & Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Month Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Agenda / List View ({filteredEvents.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-medium outline-none"
          >
            <option value="all">All Event Types</option>
            <option value="public_holiday">🌴 Public Holidays</option>
            <option value="vacation">🏖️ Multi-Day Vacations</option>
            <option value="school_event">🏆 School Events</option>
            <option value="examination_period">📝 Examination Period</option>
            <option value="special_working_day">💼 Working Saturday</option>
          </select>

          <input
            type="text"
            placeholder="Search holiday name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* VIEW 1: Interactive Month Grid View */}
      {viewMode === 'grid' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={setToday}
                className="px-2.5 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-1">
            <span className="text-rose-500">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-purple-500">Sat</span>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[100px] bg-gray-50/40 dark:bg-gray-800/30 rounded-xl border border-transparent"></div>
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayEvents = getEventsForDay(dayNum);
              const isToday = 
                new Date().getDate() === dayNum && 
                new Date().getMonth() === month && 
                new Date().getFullYear() === year;

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => handleOpenAddModal(dateStr)}
                  className={`min-h-[105px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                      : dayEvents.length > 0
                      ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-400 shadow-xs'
                      : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono' : 'text-gray-700 dark:text-gray-300 font-mono'}`}>
                      {dayNum}
                    </span>
                    <span className="text-[10px] text-gray-300 group-hover:text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition">
                      +
                    </span>
                  </div>

                  {/* Day Events Pills */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(evt);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold truncate ${getTypeBadgeStyle(evt.type)}`}
                        title={`${evt.title} (${evt.type})`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-gray-400 block truncate">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW 2: Agenda / List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date Range</th>
                  <th className="px-5 py-3.5">Holiday / Event Title</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Applicability</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-gray-400">
                      <CalendarDaysIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                      <p className="font-bold text-gray-700 dark:text-gray-300">No Holidays or Events Found</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Auto-Populate Standard Holidays" or add a new event.</p>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => {
                    const startStr = new Date(evt.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                    const endStr = new Date(evt.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                    const isMulti = startStr !== endStr;

                    return (
                      <tr key={evt._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {isMulti ? `${startStr} – ${endStr}` : startStr}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-gray-900 dark:text-white">{evt.title}</p>
                          {evt.isNationalHoliday && (
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">National Gazetted</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getTypeBadgeStyle(evt.type)}`}>
                            {evt.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 capitalize">
                          {evt.applicableTo.replace('_', ' ')}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {evt.description || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(evt)}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                              title="Edit Event"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt._id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                              title="Delete Event"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Holiday / Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {editingEvent ? 'Edit Calendar Event' : 'Add Holiday / School Event'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Holiday / Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Independence Day / Onam Vacation / Annual Sports Meet"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Category Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                >
                  <option value="public_holiday">🌴 Public / Gazetted Holiday (School Closed)</option>
                  <option value="vacation">🏖️ Multi-Day Term Vacation (Summer / Onam / Winter Break)</option>
                  <option value="school_event">🏆 Cultural / Sports / School Event</option>
                  <option value="examination_period">📝 Examination Period / Model Exams</option>
                  <option value="special_working_day">💼 Compensatory Working Day (Saturday)</option>
                  <option value="restricted_holiday">📌 Restricted / Optional Holiday</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (!endDate || endDate < e.target.value) setEndDate(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    End Date (For multi-day)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Applicable To */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Applicable To
                </label>
                <select
                  value={applicableTo}
                  onChange={(e) => setApplicableTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                >
                  <option value="all">Entire School (Students & Staff)</option>
                  <option value="students_only">Students Only (Staff Working / Valuation Day)</option>
                  <option value="staff_only">Staff Only</option>
                  <option value="specific_classes">Specific Classes Only</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description / Circular Notes
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Flag hoisting at 08:30 AM in main campus ground."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none"
                />
              </div>

              {/* Notification Checkbox */}
              {!editingEvent && (
                <label className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCommunity}
                    onChange={(e) => setNotifyCommunity(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Broadcast instant push notification to Parents and Staff</span>
                </label>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {isSubmitting ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                  Save to Calendar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default SchoolCalendarSettings;
