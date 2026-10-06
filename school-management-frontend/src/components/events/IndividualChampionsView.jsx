// src/components/events/IndividualChampionsView.jsx
import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  SparklesIcon,
  UserIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';

export default function IndividualChampionsView({ eventId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeGenderTab, setActiveGenderTab] = useState('all'); // 'all' | 'boys' | 'girls'

  useEffect(() => {
    if (eventId) {
      loadChampions();
    }
  }, [eventId]);

  const loadChampions = async () => {
    try {
      setLoading(true);
      const res = await eventService.getIndividualChampionships(eventId);
      setData(res);
    } catch (err) {
      console.error('Failed to load individual championships:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-sm">Calculating individual championship points & medal tallies...</p>
      </div>
    );
  }

  if (!data) return null;

  const { titles, maleChampion, femaleChampion, overallChampion, overallLeaderboard, categoryChampions } = data;

  const ChampionCard = ({ title, champion, badgeColor = 'from-amber-500 to-yellow-600', iconColor = 'text-amber-400' }) => {
    if (!champion) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-slate-500">
          <TrophyIcon className="w-10 h-10 text-slate-700 mx-auto mb-2" />
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">{title}</div>
          <p className="text-xs mt-1">Awaiting published results</p>
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl shadow-amber-500/10">
        {/* Glow Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <SparklesIcon className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                {title}
              </span>
              <div className="text-xs text-slate-400">Fest Champion Title</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-amber-300 font-mono">
              {champion.totalPoints || 0} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
              {champion.student?.photo ? (
                <img
                  src={champion.student.photo}
                  alt={champion.student?.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-8 h-8 text-amber-400" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2 py-0.5 bg-slate-800 border border-slate-700 text-white rounded">
                #{champion.chestNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                {champion.category}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              {champion.student?.fullName || 'Champion Student'}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: champion.groupColor }}
              />
              <span>{champion.groupName}</span>
              {champion.student?.currentClass?.name && (
                <span>• {champion.student.currentClass.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Medals & Wins */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2">
            <div className="text-xs font-bold text-amber-400">🥇 Gold (1st)</div>
            <div className="text-base font-black text-white mt-0.5">{champion.goldCount || 0}</div>
          </div>
          <div className="bg-slate-300/10 border border-slate-300/20 rounded-xl p-2">
            <div className="text-xs font-bold text-slate-300">🥈 Silver (2nd)</div>
            <div className="text-base font-black text-white mt-0.5">{champion.silverCount || 0}</div>
          </div>
          <div className="bg-amber-700/10 border border-amber-700/20 rounded-xl p-2">
            <div className="text-xs font-bold text-amber-600">🥉 Bronze (3rd)</div>
            <div className="text-base font-black text-white mt-0.5">{champion.bronzeCount || 0}</div>
          </div>
        </div>

        {/* Winning Items Ticker */}
        {champion.wins && champion.wins.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Victories:</div>
            <div className="flex flex-wrap gap-1.5">
              {champion.wins.map((w, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                >
                  <span className="font-bold text-amber-400">
                    {w.position === 1 ? '1st' : w.position === 2 ? '2nd' : '3rd'}
                  </span>
                  <span>{w.itemName}</span>
                  {w.grade && w.grade !== 'None' && (
                    <span className="text-[10px] px-1 bg-emerald-500/20 text-emerald-300 rounded">
                      {w.grade}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Champions Row (Kalaprathibha & Kalathilakam) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChampionCard
          title={titles?.maleChampionTitle || 'Kalaprathibha (Male Champion)'}
          champion={maleChampion}
          iconColor="text-amber-400"
        />
        <ChampionCard
          title={titles?.femaleChampionTitle || 'Kalathilakam (Female Champion)'}
          champion={femaleChampion}
          iconColor="text-rose-400"
        />
      </div>

      {/* Category Champions Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-purple-400" />
            Category-wise Champions
          </h3>
          <span className="text-xs text-slate-400">
            Sub-Junior, Junior & Senior Section Leaders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(categoryChampions || {}).map((cat) => {
            const catData = categoryChampions[cat];
            const leader = catData?.overall;
            return (
              <div
                key={cat}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {cat}
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    {leader?.totalPoints || 0} pts
                  </span>
                </div>

                {leader ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                        #{leader.chestNumber}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {leader.student?.fullName || 'Student'}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: leader.groupColor }}
                          />
                          <span>{leader.groupName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/40 p-2 rounded-xl">
                      <span>Gold: <strong className="text-amber-300">{leader.goldCount || 0}</strong></span>
                      <span>Silver: <strong className="text-slate-300">{leader.silverCount || 0}</strong></span>
                      <span>Bronze: <strong className="text-amber-600">{leader.bronzeCount || 0}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-slate-500">
                    No points recorded yet for {cat}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 15 Overall Individual Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-amber-400" />
              Overall Individual Performers & Trophies
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by individual points, gold, silver and bronze medal tallies.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Chest No</th>
                <th className="py-3 px-4">Student Participant</th>
                <th className="py-3 px-4">House / Group</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">🥇 Gold</th>
                <th className="py-3 px-4 text-center">🥈 Silver</th>
                <th className="py-3 px-4 text-center">🥉 Bronze</th>
                <th className="py-3 px-4 text-right font-black text-amber-400">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {overallLeaderboard && overallLeaderboard.length > 0 ? (
                overallLeaderboard.map((p, idx) => (
                  <tr
                    key={p._id}
                    className={`hover:bg-slate-800/40 transition ${
                      idx === 0
                        ? 'bg-amber-500/10'
                        : idx === 1
                        ? 'bg-slate-300/5'
                        : idx === 2
                        ? 'bg-amber-700/5'
                        : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/30">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 text-xs font-black">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white text-xs font-black">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs ml-2">{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-white px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs">
                        #{p.chestNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{p.student?.fullName || 'Student'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {p.student?.admissionNo ? `Adm: ${p.student.admissionNo}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.groupColor }}
                        />
                        <span className="font-semibold text-slate-200">{p.groupName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-300">
                      {p.goldCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-300">
                      {p.silverCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-600">
                      {p.bronzeCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-base font-black text-amber-300 font-mono">
                        {p.totalPoints || 0}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No individual points recorded yet. Publish item results to see the champions!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
