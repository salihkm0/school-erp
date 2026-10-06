// src/components/events/DetailedPointTableView.jsx
import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  CalculatorIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  ArrowPathIcon,
  TableCellsIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import eventService from '../../services/eventService';
import PointTableManagerModal from './PointTableManagerModal';
import toast from 'react-hot-toast';

export default function DetailedPointTableView({ eventId, isStaff = false }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeMatrixTab, setActiveMatrixTab] = useState('standings'); // 'standings' | 'category' | 'item_type' | 'item_breakdown'
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    if (eventId) {
      loadPointTable();
    }
  }, [eventId]);

  const loadPointTable = async () => {
    try {
      setLoading(true);
      const res = await eventService.getDetailedPointTable(eventId);
      setData(res);
    } catch (err) {
      toast.error('Failed to load detailed point table');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-sm">Calculating comprehensive point table matrices...</p>
      </div>
    );
  }

  if (!data) return null;

  const { event, groups = [], categoryMatrix = {}, itemTypeMatrix = {}, itemBreakdown = [] } = data;
  const maxPoints = Math.max(...groups.map((g) => g.points || 0), 1);

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Rank', 'House Name', 'Total Points', 'Gold (1st)', 'Silver (2nd)', 'Bronze (3rd)'];
    const rows = groups.map((g, idx) => [
      idx + 1,
      g.name,
      g.points || 0,
      g.goldCount || 0,
      g.silverCount || 0,
      g.bronzeCount || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event?.name || 'Event'}_Point_Table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = itemBreakdown.filter((itm) =>
    itm.itemName?.toLowerCase().includes(searchItem.toLowerCase()) ||
    itm.category?.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Scheme Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <TableCellsIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Detailed Point Table Matrix
                {event.selectedPointTemplate && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    {event.selectedPointTemplate.name}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cross-tabulated house scoring breakdown across categories, individual items & relays.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isStaff && (
            <button
              onClick={() => setIsPointModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
            >
              <CalculatorIcon className="w-4 h-4" />
              Customize Point Rules
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <ArrowDownTrayIcon className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <PrinterIcon className="w-4 h-4 text-slate-300" />
            Print Matrix
          </button>
        </div>
      </div>

      {/* Matrix Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'standings', label: 'Overall Standings & Medals', icon: TrophyIcon },
          { id: 'category', label: 'House × Category Matrix', icon: TableCellsIcon },
          { id: 'item_type', label: 'Individual vs. Group Points', icon: ChartBarIcon },
          { id: 'item_breakdown', label: `Item-by-Item Breakdown (${itemBreakdown.length})`, icon: SparklesIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMatrixTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMatrixTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERALL STANDINGS & MEDALS */}
      {activeMatrixTab === 'standings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">House / Group Name</th>
                  <th className="py-3.5 px-4 text-center">🥇 Gold</th>
                  <th className="py-3.5 px-4 text-center">🥈 Silver</th>
                  <th className="py-3.5 px-4 text-center">🥉 Bronze</th>
                  <th className="py-3.5 px-4">Points Progress</th>
                  <th className="py-3.5 px-4 text-right font-black text-amber-400">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {groups.map((g, idx) => {
                  const pct = Math.round(((g.points || 0) / maxPoints) * 100);
                  return (
                    <tr
                      key={g._id}
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
                      <td className="py-4 px-4 font-black">
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
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                            style={{ backgroundColor: g.color }}
                          />
                          <div>
                            <div className="font-bold text-white text-base">{g.name}</div>
                            {g.code && <div className="text-xs text-slate-400 font-mono">Code: {g.code}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-amber-300">
                        {g.goldCount || 0}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-300">
                        {g.silverCount || 0}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-amber-600">
                        {g.bronzeCount || 0}
                      </td>
                      <td className="py-4 px-4 min-w-[160px]">
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: g.color || '#f59e0b',
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-xl font-black text-amber-300 font-mono">
                          {g.points || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HOUSE × CATEGORY MATRIX */}
      {activeMatrixTab === 'category' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">House / Group</th>
                  {(event.categories || []).map((cat) => (
                    <th key={cat} className="py-3.5 px-4 text-center font-bold">
                      {cat}
                    </th>
                  ))}
                  <th className="py-3.5 px-4 text-right font-black text-amber-400">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {groups.map((g) => {
                  const gId = g._id.toString();
                  return (
                    <tr key={g._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        {g.name}
                      </td>
                      {(event.categories || []).map((cat) => {
                        const cell = categoryMatrix[cat]?.[gId] || { points: 0, gold: 0 };
                        return (
                          <td key={cat} className="py-4 px-4 text-center">
                            <div className="font-mono font-bold text-slate-200">
                              {cell.points} <span className="text-xs text-slate-500">pts</span>
                            </div>
                            {cell.gold > 0 && (
                              <div className="text-[10px] text-amber-400 font-semibold">
                                🥇 {cell.gold} Gold
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-4 px-4 text-right font-black text-amber-300 font-mono text-base">
                        {g.points || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INDIVIDUAL VS GROUP POINTS MATRIX */}
      {activeMatrixTab === 'item_type' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">House / Group</th>
                  <th className="py-3.5 px-4 text-center font-bold">Individual Items Points</th>
                  <th className="py-3.5 px-4 text-center font-bold">Group / Relay Items Points</th>
                  <th className="py-3.5 px-4 text-center">Ratio</th>
                  <th className="py-3.5 px-4 text-right font-black text-amber-400">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {groups.map((g) => {
                  const gId = g._id.toString();
                  const indPts = itemTypeMatrix.individual?.[gId] || 0;
                  const grpPts = itemTypeMatrix.group?.[gId] || 0;
                  const total = indPts + grpPts;

                  return (
                    <tr key={g._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        {g.name}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400 text-base">
                        {indPts} pts
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-purple-400 text-base">
                        {grpPts} pts
                      </td>
                      <td className="py-4 px-4 text-center text-xs text-slate-400">
                        {total > 0 ? `${Math.round((indPts / total) * 100)}% Ind / ${Math.round((grpPts / total) * 100)}% Grp` : '-'}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-amber-300 font-mono text-base">
                        {g.points || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ITEM-BY-ITEM BREAKDOWN */}
      {activeMatrixTab === 'item_breakdown' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <input
              type="text"
              placeholder="Filter competition items..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-xs w-full sm:w-72 focus:outline-none focus:border-amber-500"
            />
            <span className="text-xs text-slate-400">
              Showing {filteredItems.length} of {itemBreakdown.length} completed items
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">Item Code</th>
                    <th className="py-3.5 px-4">Competition Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">🥇 1st Place House</th>
                    <th className="py-3.5 px-4">🥈 2nd Place House</th>
                    <th className="py-3.5 px-4">🥉 3rd Place House</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredItems.map((itm) => {
                    const firstWinner = itm.winners?.find((w) => w.position === 1);
                    const secondWinner = itm.winners?.find((w) => w.position === 2);
                    const thirdWinner = itm.winners?.find((w) => w.position === 3);

                    return (
                      <tr key={itm.itemId} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-purple-400">
                          {itm.itemCode || 'ITM'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {itm.itemName}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {itm.category} • {itm.itemType}
                        </td>
                        <td className="py-3.5 px-4">
                          {firstWinner ? (
                            <span className="text-xs font-bold text-amber-300">
                              {firstWinner.groupName} (+{firstWinner.pointsAwarded} pts)
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {secondWinner ? (
                            <span className="text-xs font-bold text-slate-300">
                              {secondWinner.groupName} (+{secondWinner.pointsAwarded} pts)
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {thirdWinner ? (
                            <span className="text-xs font-bold text-amber-600">
                              {thirdWinner.groupName} (+{thirdWinner.pointsAwarded} pts)
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-500">
                        No item result breakdown found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Point Scheme Manager Modal */}
      {isPointModalOpen && (
        <PointTableManagerModal
          eventId={eventId}
          currentTemplateId={event.selectedPointTemplate?._id}
          isOpen={isPointModalOpen}
          onClose={() => setIsPointModalOpen(false)}
          onSchemeApplied={loadPointTable}
        />
      )}
    </div>
  );
}
