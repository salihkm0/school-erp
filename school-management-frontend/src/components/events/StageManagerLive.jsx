// src/components/events/StageManagerLive.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  BellAlertIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  SpeakerWaveIcon,
  SparklesIcon,
  ChevronRightIcon,
  TvIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import { getSocket } from '../../services/socketService';
import toast from 'react-hot-toast';

export default function StageManagerLive({ eventId, items = [], isStaff = false }) {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  
  // Stage Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (eventId) {
      loadStageStatus();
    }
  }, [eventId]);

  // Real-time socket listener for stage updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleStageUpdate = (data) => {
      if (data.eventId === eventId) {
        toast((t) => (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold text-xs text-white">
              {data.stageVenue}: {data.itemName} #{data.currentPerformingChest || 'Stage Status Updated'}
            </span>
          </div>
        ), { icon: '🎭', position: 'top-right' });
        loadStageStatus();
      }
    };

    socket.on('stage_status_updated', handleStageUpdate);
    return () => {
      socket.off('stage_status_updated', handleStageUpdate);
    };
  }, [eventId]);

  // Stage timer interval
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const loadStageStatus = async () => {
    try {
      setLoading(true);
      const res = await eventService.getStageLiveStatus(eventId);
      setStages(res || []);
      if (res?.length > 0 && !selectedVenue) {
        setSelectedVenue(res[0].venueName);
        setActiveItem(res[0].activeItem || res[0].upcomingItems[0] || null);
      }
    } catch (err) {
      console.error('Failed to load stage status:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentStage = stages.find((s) => s.venueName === selectedVenue);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeLimitSec = (activeItem?.timeLimitMinutes || 5) * 60;
  const warningBellSec = (activeItem?.warningBellMinutes || 4) * 60;
  const isOvertime = timerSeconds >= timeLimitSec;
  const isWarning = timerSeconds >= warningBellSec && !isOvertime;

  const handleStartPerformance = async (chestNumber) => {
    if (!activeItem) return;
    try {
      const newQueue = (activeItem.callQueue || []).filter((c) => c !== chestNumber);
      await eventService.updateStageLiveStatus(eventId, activeItem._id, {
        stageStatus: 'in_progress',
        currentPerformingChest: chestNumber,
        callQueue: newQueue,
        stageStartTime: new Date(),
      });

      setTimerSeconds(0);
      setIsTimerRunning(true);
      toast.success(`Chest #${chestNumber} is now performing on stage`);
      await loadStageStatus();
    } catch (err) {
      toast.error('Failed to update stage status');
    }
  };

  const handleGenerateLots = async () => {
    if (!activeItem) return;
    try {
      await eventService.generateLotOrder(eventId, activeItem._id);
      toast.success('Random performance lot numbers generated!');
      await loadStageStatus();
    } catch (err) {
      toast.error('Failed to generate lot numbers');
    }
  };

  const handleCallNext = async () => {
    if (!activeItem || !activeItem.lotOrder || activeItem.lotOrder.length === 0) {
      toast.error('No lot order available. Generate lot numbers first.');
      return;
    }

    const uncalled = activeItem.lotOrder.find((l) => !l.called && !l.absent);
    if (!uncalled) {
      toast.info('All participants have been called for this item.');
      return;
    }

    const updatedLot = activeItem.lotOrder.map((l) =>
      l.chestNumber === uncalled.chestNumber ? { ...l, called: true } : l
    );

    const nextUncalled = updatedLot.filter((l) => !l.called && !l.absent).slice(0, 3).map((l) => l.chestNumber);

    try {
      await eventService.updateStageLiveStatus(eventId, activeItem._id, {
        stageStatus: 'in_progress',
        currentPerformingChest: uncalled.chestNumber,
        callQueue: nextUncalled,
        lotOrder: updatedLot,
        stageStartTime: new Date(),
      });

      setTimerSeconds(0);
      setIsTimerRunning(true);
      toast.success(`Called Chest #${uncalled.chestNumber} to stage!`);
      await loadStageStatus();
    } catch (err) {
      toast.error('Failed to call next participant');
    }
  };

  const handleMarkAbsent = async (chestNumber) => {
    if (!activeItem || !activeItem.lotOrder) return;
    const updatedLot = activeItem.lotOrder.map((l) =>
      l.chestNumber === chestNumber ? { ...l, absent: true } : l
    );

    try {
      await eventService.updateStageLiveStatus(eventId, activeItem._id, {
        lotOrder: updatedLot,
      });
      toast.info(`Marked Chest #${chestNumber} as Absent`);
      await loadStageStatus();
    } catch (err) {
      toast.error('Failed to mark absent');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Stage Venue Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
              <SpeakerWaveIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Live Stage & Venue Controller
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  REAL-TIME BROADCAST
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage stage timetables, lot order call sheets, live performance timers & warning bells.
              </p>
            </div>
          </div>
        </div>

        {/* Venue Buttons */}
        <div className="flex flex-wrap gap-2">
          {stages.map((stg) => (
            <button
              key={stg.venueName}
              onClick={() => {
                setSelectedVenue(stg.venueName);
                setActiveItem(stg.activeItem || stg.upcomingItems[0] || null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                selectedVenue === stg.venueName
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              <TvIcon className="w-4 h-4" />
              {stg.venueName}
              {stg.activeItem && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-rose-400 mb-3" />
          <p className="text-sm">Connecting to stage monitor feeds...</p>
        </div>
      ) : activeItem ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Stage Display (Left 2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Now Performing Screen */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    Now Performing
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    {selectedVenue}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Item Limit: {activeItem.timeLimitMinutes || 5} min (Warning @ {activeItem.warningBellMinutes || 4} min)
                </div>
              </div>

              {/* Central Chest & Item Hero Banner */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                    {activeItem.category} • {activeItem.gender}
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    {activeItem.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="px-6 py-3 bg-rose-600/20 border-2 border-rose-500/40 rounded-2xl">
                      <div className="text-xs text-rose-300 font-bold uppercase tracking-wider">Chest Number</div>
                      <div className="text-4xl font-black text-white font-mono mt-0.5">
                        #{activeItem.currentPerformingChest || '---'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage Stopwatch & Timer */}
                <div className="flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-w-[240px] shadow-inner">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <BellAlertIcon className={`w-4 h-4 ${isWarning ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                    Stage Clock
                  </div>
                  <div
                    className={`text-5xl font-mono font-black tracking-wider transition ${
                      isOvertime
                        ? 'text-rose-500 animate-pulse'
                        : isWarning
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {formatTimer(timerSeconds)}
                  </div>

                  {isWarning && (
                    <div className="text-xs font-bold text-amber-400 mt-1 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                      🔔 WARNING BELL RING
                    </div>
                  )}
                  {isOvertime && (
                    <div className="text-xs font-bold text-rose-400 mt-1 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
                      ⚠️ TIME LIMIT EXCEEDED
                    </div>
                  )}

                  {/* Stopwatch Controls */}
                  {isStaff && (
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                          isTimerRunning
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isTimerRunning ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                        {isTimerRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(0);
                        }}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition"
                        title="Reset Timer"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Call Next Action Bar */}
              {isStaff && (
                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCallNext}
                      className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 text-sm transition"
                    >
                      <SpeakerWaveIcon className="w-5 h-5" />
                      Call Next Participant
                    </button>
                    <button
                      onClick={handleGenerateLots}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl border border-slate-700 text-xs transition flex items-center gap-1.5"
                    >
                      <SparklesIcon className="w-4 h-4 text-amber-400" />
                      Randomize Lot Numbers
                    </button>
                  </div>

                  <div className="text-xs text-slate-400">
                    Live updates sync instantly across all judge scorepads & auditorium TVs.
                  </div>
                </div>
              )}
            </div>

            {/* Performance Lot Order Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-rose-400" />
                  Performance Lot Order & Call Sheet
                </h4>
                <span className="text-xs text-slate-400">
                  {activeItem.lotOrder?.length || 0} Participants Scheduled
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Lot #</th>
                      <th className="py-3 px-4">Chest No</th>
                      <th className="py-3 px-4">Status</th>
                      {isStaff && <th className="py-3 px-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {activeItem.lotOrder && activeItem.lotOrder.length > 0 ? (
                      activeItem.lotOrder.map((lot) => {
                        const isCurrent = activeItem.currentPerformingChest === lot.chestNumber;
                        return (
                          <tr
                            key={lot.chestNumber}
                            className={`hover:bg-slate-800/40 transition ${
                              isCurrent ? 'bg-rose-500/10 font-bold' : ''
                            }`}
                          >
                            <td className="py-3 px-4 text-slate-300 font-bold">
                              #{lot.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-white px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs">
                                #{lot.chestNumber}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {isCurrent ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  Performing Now
                                </span>
                              ) : lot.absent ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-500">
                                  Absent
                                </span>
                              ) : lot.called ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Completed / Called
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400">
                                  Waiting
                                </span>
                              )}
                            </td>
                            {isStaff && (
                              <td className="py-3 px-4 text-right space-x-2">
                                {!lot.called && !lot.absent && (
                                  <>
                                    <button
                                      onClick={() => handleStartPerformance(lot.chestNumber)}
                                      className="text-xs font-semibold text-rose-400 hover:text-white px-2.5 py-1 bg-rose-500/10 hover:bg-rose-600 rounded-lg transition"
                                    >
                                      Call to Stage
                                    </button>
                                    <button
                                      onClick={() => handleMarkAbsent(lot.chestNumber)}
                                      className="text-xs font-semibold text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg transition"
                                    >
                                      Absent
                                    </button>
                                  </>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">
                          Lot order not yet generated. Click "Randomize Lot Numbers" to assign call order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: On Deck Queue & Scheduled Items */}
          <div className="space-y-6">
            
            {/* On Deck Queue */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BellAlertIcon className="w-5 h-5 text-amber-400" />
                On Deck / Next in Call Queue
              </h4>
              <p className="text-xs text-slate-400">
                Next participants waiting backstage for their cue.
              </p>

              <div className="space-y-3">
                {activeItem.callQueue && activeItem.callQueue.length > 0 ? (
                  activeItem.callQueue.map((chest, idx) => (
                    <div
                      key={chest}
                      className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-400/30">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-mono font-bold text-white text-sm">
                            Chest #{chest}
                          </div>
                          <div className="text-xs text-slate-400">Stage Call Queue</div>
                        </div>
                      </div>

                      {isStaff && (
                        <button
                          onClick={() => handleStartPerformance(chest)}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          Perform
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    Call queue is empty.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Items for this Stage */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <TvIcon className="w-5 h-5 text-purple-400" />
                Stage Schedule Timetable
              </h4>

              <div className="space-y-3">
                {currentStage?.upcomingItems?.map((itm) => (
                  <div
                    key={itm._id}
                    onClick={() => setActiveItem(itm)}
                    className="p-3.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 rounded-2xl cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{itm.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {itm.category} • {itm.scheduledTime || 'Scheduled'}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-800 text-slate-400">
                      Switch
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center text-slate-400">
          <TvIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No active items on {selectedVenue}</h3>
          <p className="text-sm mt-1">Schedule items for this stage in the Items & Competitions tab.</p>
        </div>
      )}
    </div>
  );
}
