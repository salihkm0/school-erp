// src/components/events/EventDetailView.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../../store/slices/eventSlice';
import eventService from '../../services/eventService';
import EventLeaderboardLive from './EventLeaderboardLive';
import EventItemModal from './EventItemModal';
import ParticipantRegisterModal from './ParticipantRegisterModal';
import ResultEntryModal from './ResultEntryModal';
import JudgeTabulationModal from './JudgeTabulationModal';
import StageManagerLive from './StageManagerLive';
import IndividualChampionsView from './IndividualChampionsView';
import PrintableBadgesView from './PrintableBadgesView';
import PrintableCertificateModal from './PrintableCertificateModal';
import AppealsManagerModal from './AppealsManagerModal';
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
  PrinterIcon,
  ScaleIcon,
  IdentificationIcon,
  SpeakerWaveIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EventDetailView = ({ eventId, onBack, onEditEvent }) => {
  const dispatch = useDispatch();
  const { currentEvent: event, loading } = useSelector((state) => state.events);
  const user = useSelector((state) => state.auth?.user);
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';

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

  const [isJudgeTabulationOpen, setIsJudgeTabulationOpen] = useState(false);
  const [tabulationItem, setTabulationItem] = useState(null);

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isAppealsModalOpen, setIsAppealsModalOpen] = useState(false);

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

  const openJudgeTabulation = (item) => {
    setTabulationItem(item);
    setIsJudgeTabulationOpen(true);
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                &larr; All Events
              </button>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                {event.eventType} Fest
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {event.academicYear?.name || 'Academic Year'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                {event.status?.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{event.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/60">
                <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/60">
                <MapPinIcon className="w-4 h-4 text-emerald-400" />
                {event.venue}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/60">
                <UserGroupIcon className="w-4 h-4 text-blue-400" />
                {event.groups?.length || 0} Houses / Groups
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsFullscreenLeaderboard(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all"
            >
              <TvIcon className="w-4 h-4" /> Live Projector View
            </button>
            <button
              type="button"
              onClick={() => setIsCertificateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs transition border border-amber-500/30 shadow-md"
            >
              <PrinterIcon className="w-4 h-4" /> Merit Certificates
            </button>
            <button
              type="button"
              onClick={() => setIsAppealsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-rose-300 font-semibold text-xs transition border border-rose-500/30"
            >
              <ScaleIcon className="w-4 h-4" /> Appeals
            </button>
            {isStaffOrAdmin && (
              <button
                type="button"
                onClick={onEditEvent}
                className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/10"
              >
                <PencilSquareIcon className="w-4 h-4" /> Edit Event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'leaderboard', label: 'Live Points Table', icon: TrophyIcon },
          { id: 'champions', label: 'Champions & Titles', icon: StarIcon },
          { id: 'stages', label: 'Live Stage Manager', icon: SpeakerWaveIcon },
          { id: 'items', label: `Competitions (${items.length})`, icon: SparklesIcon },
          { id: 'participants', label: `Participants (${participants.length})`, icon: HashtagIcon },
          { id: 'badges', label: 'Printable Chest Badges', icon: IdentificationIcon },
          { id: 'results', label: `Results (${results.length})`, icon: CheckBadgeIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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

      {/* TAB 2: INDIVIDUAL CHAMPIONS & TITLES */}
      {activeTab === 'champions' && (
        <IndividualChampionsView eventId={eventId} />
      )}

      {/* TAB 3: LIVE STAGE & VENUE CONTROLLER */}
      {activeTab === 'stages' && (
        <StageManagerLive
          eventId={eventId}
          items={items}
          isStaff={isStaffOrAdmin}
        />
      )}

      {/* TAB 4: PRINTABLE ID BADGES */}
      {activeTab === 'badges' && (
        <PrintableBadgesView
          eventId={eventId}
          groups={event.groups || []}
          categories={event.categories || []}
        />
      )}

      {/* TAB 5: COMPETITION ITEMS */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search item (e.g. 100m, Debate, Mohiniyattam)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl w-full sm:w-64 focus:outline-none focus:border-purple-500"
              />
              <select
                value={itemCategoryFilter}
                onChange={(e) => setItemCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Categories</option>
                {(event.categories || []).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {isStaffOrAdmin && (
              <button
                type="button"
                onClick={() => {
                  setSelectedItem(null);
                  setIsItemModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-600/30 transition-all"
              >
                <PlusIcon className="w-4 h-4" /> Add Competition Item
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isCompleted = item.status === 'completed';
              return (
                <div
                  key={item._id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-purple-400 border border-purple-500/20">
                        {item.code || 'ITM'}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base">{item.name}</h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-300">
                        {item.category}
                      </span>
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded-md capitalize text-slate-300">
                        {item.itemType}
                      </span>
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded-md capitalize text-slate-300">
                        {item.gender}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.stageVenue || 'Main Stage'}</span>
                      {item.scheduledTime && (
                        <span>• {item.scheduledTime}</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openJudgeTabulation(item)}
                        className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <ScaleIcon className="w-3.5 h-3.5" />
                        Judges Scorepad
                      </button>

                      {isStaffOrAdmin && (
                        <button
                          type="button"
                          onClick={() => openResultEntry(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white'
                          }`}
                        >
                          <TrophyIcon className="w-3.5 h-3.5" />
                          {isCompleted ? 'Edit Result' : 'Direct Podium'}
                        </button>
                      )}
                    </div>

                    {isStaffOrAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsItemModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Edit Item"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete Item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
              <SparklesIcon className="w-10 h-10 text-slate-700 mx-auto mb-2" />
              <p className="font-semibold text-sm">No competition items found</p>
              <p className="text-xs mt-1">Create your first sports or arts item using the button above.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PARTICIPANTS & AUTO CHEST GENERATOR */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search participant (name, chest, admission)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl w-full sm:w-64 focus:outline-none focus:border-purple-500"
              />
              <select
                value={participantGroupFilter}
                onChange={(e) => setParticipantGroupFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Houses</option>
                {(event.groups || []).map((grp) => (
                  <option key={grp._id} value={grp._id}>{grp.name}</option>
                ))}
              </select>
            </div>

            {isStaffOrAdmin && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAutoGenerateChestNumbers}
                  disabled={isGeneratingChestNos || participants.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition disabled:opacity-50"
                >
                  <HashtagIcon className="w-4 h-4" />
                  {isGeneratingChestNos ? 'Allocating...' : 'Auto Generate Chest Nos'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-600/30 transition"
                >
                  <PlusIcon className="w-4 h-4" /> Register Student
                </button>
              </div>
            )}
          </div>

          {/* Participants Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Chest No</th>
                    <th className="py-3.5 px-4 font-bold">Student Name</th>
                    <th className="py-3.5 px-4 font-bold">House / Group</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Registered Items</th>
                    <th className="py-3.5 px-4 font-bold text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredParticipants.map((part) => (
                    <tr key={part._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs">
                          #{part.chestNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {part.student?.fullName || 'Student'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {part.student?.admissionNo ? `Adm: ${part.student.admissionNo}` : ''}
                          {part.student?.currentClass?.name ? ` • Class: ${part.student.currentClass.name}` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: part.groupColor }}
                          />
                          <span className="font-semibold text-slate-200">{part.groupName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                          {part.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(part.registeredItems || []).map((it) => (
                            <span
                              key={it._id || it}
                              className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {it.name || 'Item'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-amber-400 font-mono text-base">
                          {part.totalPoints || 0}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredParticipants.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-500">
                        No participants registered matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PUBLISHED RESULTS */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-emerald-400" />
                Officially Published Results
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {results.length} items completed with awarded podium rankings and house points.
              </p>
            </div>
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <PrinterIcon className="w-4 h-4" />
              Batch Print Certificates
            </button>
          </div>

          <div className="space-y-4">
            {results.map((res) => (
              <div
                key={res._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-black text-white text-lg">{res.item?.name}</h4>
                    <span className="text-xs text-slate-400">
                      Category: {res.item?.category} • Published on {new Date(res.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isStaffOrAdmin && (
                    <button
                      onClick={() => openResultEntry(res.item)}
                      className="text-xs font-semibold text-purple-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg transition"
                    >
                      Edit Podium Result
                    </button>
                  )}
                </div>

                {/* Winners Podium Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(res.winners || []).map((w, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${
                        w.position === 1
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : w.position === 2
                          ? 'bg-slate-300/10 border-slate-300/30'
                          : w.position === 3
                          ? 'bg-amber-700/10 border-amber-700/30'
                          : 'bg-slate-800/40 border-slate-700/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                            w.position === 1
                              ? 'bg-amber-400 text-slate-950'
                              : w.position === 2
                              ? 'bg-slate-300 text-slate-950'
                              : w.position === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {w.position === 1 ? '1st Place' : w.position === 2 ? '2nd Place' : w.position === 3 ? '3rd Place' : 'Consolation'}
                        </span>
                        <span className="font-black text-white font-mono text-xs">
                          +{w.pointsAwarded} pts
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="font-black text-white text-base">
                          {w.studentName || 'Student'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Chest #{w.chestNumber} • {w.groupName}
                        </div>
                      </div>

                      {w.scoreOrTime && (
                        <div className="mt-2 text-xs font-mono font-bold text-slate-300 bg-slate-900/60 px-2 py-1 rounded">
                          {w.scoreOrTime}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center text-slate-500">
                <TrophyIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No results published yet</h4>
                <p className="text-xs mt-1">Record results for competition items in the Competitions tab.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALL MODALS */}
      {isItemModalOpen && (
        <EventItemModal
          eventId={eventId}
          item={selectedItem}
          categories={event.categories || []}
          isOpen={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          onSuccess={loadAllEventData}
        />
      )}

      {isRegisterModalOpen && (
        <ParticipantRegisterModal
          eventId={eventId}
          groups={event.groups || []}
          categories={event.categories || []}
          items={items}
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={loadAllEventData}
        />
      )}

      {isResultModalOpen && resultItem && (
        <ResultEntryModal
          eventId={eventId}
          item={resultItem}
          eventPointSystem={event.pointSystem}
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          onSuccess={loadAllEventData}
        />
      )}

      {isJudgeTabulationOpen && tabulationItem && (
        <JudgeTabulationModal
          eventId={eventId}
          item={tabulationItem}
          isOpen={isJudgeTabulationOpen}
          onClose={() => setIsJudgeTabulationOpen(false)}
          onPublished={loadAllEventData}
        />
      )}

      {isCertificateModalOpen && (
        <PrintableCertificateModal
          eventId={eventId}
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}

      {isAppealsModalOpen && (
        <AppealsManagerModal
          eventId={eventId}
          items={items}
          isOpen={isAppealsModalOpen}
          onClose={() => setIsAppealsModalOpen(false)}
          isAdmin={isStaffOrAdmin}
        />
      )}
    </div>
  );
};

export default EventDetailView;
