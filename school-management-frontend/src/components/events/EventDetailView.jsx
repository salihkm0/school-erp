// src/components/events/EventDetailView.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../../store/slices/eventSlice';
import eventService from '../../services/eventService';
import EventLeaderboardLive from './EventLeaderboardLive';
import EventItemModal from './EventItemModal';
import ParticipantRegisterModal from './ParticipantRegisterModal';
import ResultEntryModal from './ResultEntryModal';
import {
  TrophyIcon,
  SparklesIcon,
  PlusIcon,
  HashtagIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  TvIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EventDetailView = ({ eventId, onBack, onEditEvent }) => {
  const dispatch = useDispatch();
  const { currentEvent: event, loading } = useSelector((state) => state.events);

  const [activeTab, setActiveTab] = useState('leaderboard');
  const [items, setItems] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultItem, setResultItem] = useState(null);

  const [isFullscreenLeaderboard, setIsFullscreenLeaderboard] = useState(false);
  const [isGeneratingChestNos, setIsGeneratingChestNos] = useState(false);

  // Filters
  const [itemCategoryFilter, setItemCategoryFilter] = useState('all');
  const [participantGroupFilter, setParticipantGroupFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
      loadAllEventData();
    }
  }, [eventId, dispatch]);

  const loadAllEventData = async () => {
    setLoadingData(true);
    try {
      const [itemsRes, partsRes, resultsRes] = await Promise.all([
        eventService.getEventItems(eventId),
        eventService.getParticipants(eventId),
        eventService.getEventResults(eventId),
      ]);
      setItems(itemsRes || []);
      setParticipants(partsRes || []);
      setResults(resultsRes || []);
    } catch (err) {
      console.error('Error loading event data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAutoGenerateChestNumbers = async () => {
    if (!window.confirm('Are you sure you want to auto-generate and allocate chest numbers for all registered participants?')) {
      return;
    }

    setIsGeneratingChestNos(true);
    try {
      await eventService.generateChestNumbers(eventId, {
        allocationStrategy: event?.chestNumberConfig?.allocationStrategy || 'sequential',
        startNumber: event?.chestNumberConfig?.startNumber || 101,
      });
      toast.success('Chest numbers allocated successfully!');
      loadAllEventData();
    } catch (err) {
      toast.error('Failed to generate chest numbers');
    } finally {
      setIsGeneratingChestNos(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this competition item? Registered student links will be removed.')) return;
    try {
      await eventService.deleteEventItem(eventId, itemId);
      toast.success('Item deleted');
      loadAllEventData();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const openResultEntry = (item) => {
    setResultItem(item);
    setIsResultModalOpen(true);
  };

  const filteredItems = items.filter((it) => {
    if (itemCategoryFilter !== 'all' && it.category !== itemCategoryFilter) return false;
    if (searchQuery && !it.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredParticipants = participants.filter((p) => {
    if (participantGroupFilter !== 'all' && p.group !== participantGroupFilter) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      const matchName = p.student?.fullName?.toLowerCase().includes(s);
      const matchChest = p.chestNumber?.toLowerCase().includes(s);
      const matchAdm = p.student?.admissionNo?.toLowerCase().includes(s);
      if (!matchName && !matchChest && !matchAdm) return false;
    }
    return true;
  });

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                &larr; All Events
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                {event.eventType} Event
              </span>
              <span className="text-xs text-slate-300">
                {event.academicYear?.name || 'Academic Year'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{event.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-emerald-400" />
                {event.venue}
              </span>
              <span className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4 text-blue-400" />
                {event.groups?.length || 0} Houses / Teams
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsFullscreenLeaderboard(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <TvIcon className="w-4 h-4" /> Live Projector View
            </button>
            <button
              type="button"
              onClick={onEditEvent}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/10"
            >
              <PencilSquareIcon className="w-4 h-4" /> Configure Event
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'leaderboard', label: 'Live Points & Standings', icon: TrophyIcon },
          { id: 'items', label: `Competitions & Schedule (${items.length})`, icon: SparklesIcon },
          { id: 'participants', label: `Participants & Chest Nos (${participants.length})`, icon: HashtagIcon },
          { id: 'results', label: `Announced Results (${results.length})`, icon: CheckBadgeIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE POINTS & LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <EventLeaderboardLive
          eventId={eventId}
          isFullscreen={isFullscreenLeaderboard}
          onToggleFullscreen={() => setIsFullscreenLeaderboard(!isFullscreenLeaderboard)}
        />
      )}

      {/* TAB 2: COMPETITION ITEMS */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search item (e.g. 100m, Relay)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg w-full sm:w-56"
              />
              <select
                value={itemCategoryFilter}
                onChange={(e) => setItemCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                {event.categories?.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedItem(null);
                setIsItemModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              <PlusIcon className="w-4 h-4" /> Add Competition Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.length === 0 ? (
              <div className="md:col-span-3 text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400 text-xs">
                No competition items found matching your filters.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {item.code || 'ITEM'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'completed' ? '✓ Completed' : 'Scheduled'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h4>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{item.gender}</span>
                      <span>·</span>
                      <span className="capitalize">{item.itemType}</span>
                    </div>

                    <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                      <span>Venue: {item.stageVenue || 'Main Ground'}</span>
                      <span className="font-mono font-semibold">{item.participantCount || 0} Entries</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openResultEntry(item)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      }`}
                    >
                      {item.status === 'completed' ? 'Edit Results' : '🏆 Enter Results'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsItemModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                      title="Edit Item"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete Item"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PARTICIPANTS & CHEST NUMBERS */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Chest No, Name, or Admission..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg w-full sm:w-64"
              />
              <select
                value={participantGroupFilter}
                onChange={(e) => setParticipantGroupFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
              >
                <option value="all">All Houses / Teams</option>
                {event.groups?.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAutoGenerateChestNumbers}
                disabled={isGeneratingChestNos || participants.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs disabled:opacity-50"
              >
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                {isGeneratingChestNos ? 'Allocating...' : 'Auto-Generate Chest Nos'}
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <PlusIcon className="w-4 h-4" /> Register Student
              </button>
            </div>
          </div>

          {/* Participants Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Chest No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission</th>
                    <th className="py-3 px-4">House / Team</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Events Registered</th>
                    <th className="py-3 px-4 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-400">
                        No participants registered yet. Click "Register Student" to begin.
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-sm text-gray-900">
                          <span className="px-2 py-0.5 rounded bg-gray-100 border text-gray-800">
                            {p.chestNumber || '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">{p.student?.fullName || '—'}</td>
                        <td className="py-3 px-4 font-mono text-gray-500">{p.student?.admissionNo || '—'}</td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: p.groupColor || '#3B82F6' }}
                          >
                            {p.groupName}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-600">{p.category || 'General'}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {p.registeredItems?.map((it, idx) => (
                              <span key={idx} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                                {it.name || it}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-black font-mono text-emerald-600 text-sm">
                          {p.totalPoints || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PUBLISHED RESULTS */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.length === 0 ? (
              <div className="md:col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400 text-xs">
                No competition results have been published yet.
              </div>
            ) : (
              results.map((resDoc) => (
                <div key={resDoc._id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {resDoc.item?.category} · {resDoc.item?.gender}
                      </span>
                      <h4 className="font-black text-sm text-gray-900">{resDoc.item?.name}</h4>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {new Date(resDoc.publishedAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {resDoc.winners?.map((w, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">
                            {w.position === 1 ? '🥇' : w.position === 2 ? '🥈' : w.position === 3 ? '🥉' : `#${w.position}`}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900">
                              {w.chestNumber ? `[${w.chestNumber}] ` : ''}
                              {w.studentName}
                            </p>
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.2 rounded text-white inline-block"
                              style={{ backgroundColor: w.groupColor || '#3B82F6' }}
                            >
                              {w.groupName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black font-mono text-emerald-600 text-xs">+{w.pointsAwarded} pts</span>
                          {w.grade && w.grade !== 'None' && (
                            <span className="text-[10px] font-bold text-amber-600 block">Grade {w.grade}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {resDoc.remarks && (
                    <p className="text-[11px] italic text-gray-500 pt-1">Note: {resDoc.remarks}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      <EventItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        eventId={eventId}
        item={selectedItem}
        categories={event.categories || []}
        onSaved={loadAllEventData}
      />

      <ParticipantRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        event={event}
        onRegistered={loadAllEventData}
      />

      <ResultEntryModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        eventId={eventId}
        item={resultItem}
        event={event}
        onResultRecorded={loadAllEventData}
      />
    </div>
  );
};

export default EventDetailView;
