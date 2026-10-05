// src/pages/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, deleteEvent } from '../store/slices/eventSlice';
import { fetchAcademicYears } from '../store/slices/academicYearSlice';
import EventFormModal from '../components/events/EventFormModal';
import EventDetailView from '../components/events/EventDetailView';
import {
  TrophyIcon,
  PlusIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  SparklesIcon,
  TvIcon,
  TrashIcon,
  PencilSquareIcon,
  FireIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const { academicYears } = useSelector((state) => state.academicYears);
  const { user } = useSelector((state) => state.auth);
  const isAdminOrStaff = ['admin', 'staff'].includes(user?.role);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (event, e) => {
    e?.stopPropagation();
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  const handleDeleteEvent = async (id, name, e) => {
    e?.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete event "${name}"? All competition items, scores, and participant registrations will be removed.`)) {
      return;
    }
    await dispatch(deleteEvent(id));
  };

  const filteredEvents = events.filter((ev) => {
    if (typeFilter !== 'all' && ev.eventType !== typeFilter) return false;
    if (statusFilter !== 'all' && ev.status !== statusFilter) return false;
    return true;
  });

  if (selectedEventId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EventDetailView
          eventId={selectedEventId}
          onBack={() => {
            setSelectedEventId(null);
            dispatch(fetchEvents());
          }}
          onEditEvent={() => {
            const ev = events.find((e) => e._id === selectedEventId);
            if (ev) handleOpenEditModal(ev);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <TrophyIcon className="w-3.5 h-3.5" /> Fest & Sports Engine
            </span>
            <span className="text-xs text-gray-500">Live Point Table · Auto Chest Nos · Houses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Events, Sports & Arts Fests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
            Create sports meets, arts kalolsavams, and school fests. Manage houses, auto-generate chest numbers, enter scores, and display live leaderboards.
          </p>
        </div>

        {isAdminOrStaff && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <PlusIcon className="w-4 h-4" /> Create New Event
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'sports', 'arts', 'cultural', 'academic'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                typeFilter === t
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t === 'all' ? 'All Events' : t}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="registration_open">Registration Open</option>
          <option value="ongoing">Ongoing (Live)</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Events Grid */}
      {loading && events.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-xs font-medium">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-3">
          <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No events found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Get started by creating your first school Sports Day, Arts Fest, or Kalolsavam.
          </p>
          {isAdminOrStaff && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs"
            >
              <PlusIcon className="w-4 h-4" /> Create Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const isSports = event.eventType === 'sports';
            const isArts = event.eventType === 'arts';

            return (
              <div
                key={event._id}
                onClick={() => setSelectedEventId(event._id)}
                className="bg-white border border-gray-200 hover:border-emerald-500/50 hover:shadow-lg rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isSports
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : isArts
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {event.eventType}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        event.status === 'ongoing'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : event.status === 'registration_open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {event.status === 'ongoing'
                        ? '🔥 Ongoing Live'
                        : event.status === 'registration_open'
                        ? 'Registration Open'
                        : event.status}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {event.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                        {new Date(event.endDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{event.venue || 'School Campus'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span>{event.groups?.length || 0} Houses / Teams</span>
                    </div>
                  </div>

                  {/* Leading House Badge */}
                  {event.leadingGroup && event.leadingGroup.points > 0 && (
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">👑</span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                            Leading Group
                          </span>
                          <span className="text-xs font-extrabold text-gray-900">{event.leadingGroup.name}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black font-mono text-amber-700">
                        {event.leadingGroup.points} PTS
                      </span>
                    </div>
                  )}

                  {/* House Color Swatches */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {event.groups?.map((g) => (
                      <span
                        key={g._id}
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: g.color || '#3B82F6' }}
                        title={`${g.name}: ${g.points || 0} pts`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 font-mono">
                    <span>{event.itemCount || 0} Items</span>
                    <span>·</span>
                    <span>{event.participantCount || 0} Participants</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isAdminOrStaff && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditModal(event, e)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          title="Edit Event"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteEvent(event._id, event.name, e)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Event"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 ml-2">
                      Enter &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        event={editingEvent}
        academicYears={academicYears || []}
      />
    </div>
  );
};

export default EventsPage;
