// src/components/events/EventLeaderboardLive.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, updateLeaderboardFromSocket } from '../../store/slices/eventSlice';
import {
  TrophyIcon,
  SparklesIcon,
  TvIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  FireIcon,
  StarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import useSocketInit from '../../hooks/useSocketInit';

const EventLeaderboardLive = ({ eventId, isFullscreen = false, onToggleFullscreen }) => {
  const dispatch = useDispatch();
  const { leaderboard } = useSelector((state) => state.events);
  const { socket } = useSocketInit();
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentWinnerAlert, setRecentWinnerAlert] = useState(null);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchLeaderboard(eventId));
    }
  }, [eventId, dispatch]);

  // Real-time socket updates
  useEffect(() => {
    if (socket) {
      const handlePointsUpdate = (data) => {
        if (data.eventId === eventId) {
          dispatch(updateLeaderboardFromSocket(data));
          if (data.winners && data.winners.length > 0) {
            const firstPlace = data.winners.find((w) => w.position === 1) || data.winners[0];
            setRecentWinnerAlert({
              itemName: data.itemName,
              winnerName: firstPlace.studentName || firstPlace.groupName,
              groupName: firstPlace.groupName,
              groupColor: firstPlace.groupColor,
              points: firstPlace.pointsAwarded,
            });
            setTimeout(() => setRecentWinnerAlert(null), 8000);
          }
        }
      };

      socket.on('event_points_updated', handlePointsUpdate);

      return () => {
        socket.off('event_points_updated', handlePointsUpdate);
      };
    }
  }, [socket, eventId, dispatch]);

  const groups = leaderboard?.groups || [];
  const topParticipants = leaderboard?.topParticipants || [];
  const categoryBreakdown = leaderboard?.categoryBreakdown || {};
  const categories = Object.keys(categoryBreakdown);

  const maxPoints = groups.length > 0 ? Math.max(...groups.map((g) => g.points || 1), 1) : 1;

  // Podium top 3
  const first = groups[0] || null;
  const second = groups[1] || null;
  const third = groups[2] || null;

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 text-white p-6 sm:p-10 overflow-y-auto'
          : 'bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-xs'
      }`}
    >
      {/* Top Banner / Scoreboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-gray-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <FireIcon className="w-3.5 h-3.5" /> Live Points Scoreboard
            </span>
            <span className="text-xs text-gray-400">· Realtime Socket Sync</span>
          </div>
          <h2 className={`font-black tracking-tight ${isFullscreen ? 'text-3xl sm:text-4xl text-white' : 'text-2xl text-gray-900'}`}>
            {leaderboard?.event?.name || 'Live House Standings'}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => dispatch(fetchLeaderboard(eventId))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" /> Refresh
          </button>
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isFullscreen
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isFullscreen ? (
                <>
                  <ArrowsPointingInIcon className="w-4 h-4" /> Exit Stadium View
                </>
              ) : (
                <>
                  <TvIcon className="w-4 h-4" /> Projector / TV View
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* RECENT WINNER LIVE TOAST / BANNER */}
      {recentWinnerAlert && (
        <div className="animate-bounce bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 p-0.5 rounded-xl shadow-xl">
          <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-[10px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-lg">
                🏆
              </div>
              <div>
                <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Just In: Result Announced for {recentWinnerAlert.itemName}
                </p>
                <p className="text-sm sm:text-base font-extrabold text-white">
                  {recentWinnerAlert.winnerName}{' '}
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-bold ml-1.5 text-white shadow-xs"
                    style={{ backgroundColor: recentWinnerAlert.groupColor || '#3B82F6' }}
                  >
                    {recentWinnerAlert.groupName} (+{recentWinnerAlert.points} pts)
                  </span>
                </p>
              </div>
            </div>
            <SparklesIcon className="w-6 h-6 text-amber-400 animate-spin" />
          </div>
        </div>
      )}

      {/* PODIUM TOP 3 DISPLAY */}
      {groups.length >= 2 && (
        <div className="pt-4 pb-2">
          <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-2xl mx-auto text-center">
            {/* 2nd Place */}
            {second && (
              <div className="flex-1 flex flex-col items-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-slate-300 shadow-md flex items-center justify-center font-black text-lg sm:text-xl text-white mb-2"
                  style={{ backgroundColor: second.color || '#94A3B8' }}
                >
                  2
                </div>
                <span className="font-bold text-xs sm:text-sm truncate max-w-[120px]">{second.name}</span>
                <span className="text-xs font-extrabold text-slate-400 font-mono mt-0.5">{second.points} PTS</span>
                <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-slate-400/30 to-slate-300/10 rounded-t-xl mt-2 flex items-center justify-center font-bold text-slate-400 text-xs border-t-2 border-slate-300">
                  🥈 Silver
                </div>
              </div>
            )}

            {/* 1st Place */}
            {first && (
              <div className="flex-1 flex flex-col items-center z-10 -mt-6">
                <div className="text-2xl animate-pulse">👑</div>
                <div
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-4 border-amber-400 shadow-xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white mb-2 ring-4 ring-amber-400/30"
                  style={{ backgroundColor: first.color || '#F59E0B' }}
                >
                  1
                </div>
                <span className="font-black text-sm sm:text-base truncate max-w-[140px] text-amber-500 dark:text-amber-400">
                  {first.name}
                </span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-300 font-mono mt-0.5">
                  {first.points} PTS
                </span>
                <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-amber-500/30 to-amber-300/10 rounded-t-xl mt-2 flex items-center justify-center font-black text-amber-500 text-sm border-t-4 border-amber-400 shadow-lg">
                  🥇 Champion
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {third && (
              <div className="flex-1 flex flex-col items-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-700/60 shadow-md flex items-center justify-center font-black text-lg sm:text-xl text-white mb-2"
                  style={{ backgroundColor: third.color || '#B45309' }}
                >
                  3
                </div>
                <span className="font-bold text-xs sm:text-sm truncate max-w-[120px]">{third.name}</span>
                <span className="text-xs font-extrabold text-amber-700/80 dark:text-amber-600 font-mono mt-0.5">
                  {third.points} PTS
                </span>
                <div className="w-full h-18 sm:h-20 bg-gradient-to-t from-amber-700/20 to-amber-600/10 rounded-t-xl mt-2 flex items-center justify-center font-bold text-amber-700/80 text-xs border-t-2 border-amber-700/50">
                  🥉 Bronze
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALL HOUSES LIVE PROGRESS BARS */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
          House / Team Standings ({groups.length} Groups)
        </h3>

        {groups.map((grp) => {
          const percentage = Math.round(((grp.points || 0) / maxPoints) * 100);
          return (
            <div
              key={grp._id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                isFullscreen
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-gray-50/70 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-xs`}
                    style={{ backgroundColor: grp.color || '#3B82F6' }}
                  >
                    #{grp.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                      {grp.name}
                      {grp.code && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                          {grp.code}
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                {/* Medals Tally & Points */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
                    <span title="Gold Medals" className="flex items-center gap-0.5 text-amber-500 font-mono">
                      🥇 {grp.goldCount || 0}
                    </span>
                    <span title="Silver Medals" className="flex items-center gap-0.5 text-slate-400 font-mono">
                      🥈 {grp.silverCount || 0}
                    </span>
                    <span title="Bronze Medals" className="flex items-center gap-0.5 text-amber-700 font-mono">
                      🥉 {grp.bronzeCount || 0}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black font-mono text-gray-900 dark:text-white">
                      {grp.points || 0}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">pts</span>
                  </div>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.max(percentage, 2)}%`,
                    backgroundColor: grp.color || '#3B82F6',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* TOP INDIVIDUAL PERFORMERS / CHAMPIONS */}
      {topParticipants.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
              <StarIcon className="w-4 h-4 text-amber-500" /> Individual Champions & Top Scorers
            </h3>
            <span className="text-xs text-gray-400 font-mono">Top {topParticipants.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topParticipants.map((p, idx) => (
              <div
                key={p._id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isFullscreen
                    ? 'bg-slate-900/60 border-slate-800 text-white'
                    : 'bg-white border-gray-200 shadow-2xs'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                  style={{ backgroundColor: p.groupColor || '#3B82F6' }}
                >
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm truncate">{p.student?.fullName || 'Student'}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                    Chest: <span className="font-mono font-semibold text-gray-800 dark:text-slate-200">{p.chestNumber}</span> · {p.groupName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-black font-mono text-sm text-emerald-600 dark:text-emerald-400">
                    {p.totalPoints}
                  </span>
                  <span className="text-[10px] text-gray-400 block">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventLeaderboardLive;
