'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiGlobe, FiAward } from 'react-icons/fi';
import { Trophy, Medal } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  totalKg: number;
  badges: number;
  streak: number;
  country: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setEntries(data.leaderboard || []);
    } catch {
      // silently fail
    }
    setLoading(false);
    fetchingRef.current = false;
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(fetchLeaderboard, 0);

    let es: EventSource | null = null;

    if (typeof window !== 'undefined' && window.EventSource) {
      es = new EventSource('/api/leaderboard/stream');
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.leaderboard) {
            setEntries(data.leaderboard);
            setLoading(false);
          }
        } catch { /* ignore bad data */ }
      };
      es.onerror = () => {
        es?.close();
        es = null;
        if (!pollingRef.current) {
          pollingRef.current = setInterval(fetchLeaderboard, 30000);
        }
      };
    }

    return () => {
      clearTimeout(initialTimer);
      es?.close();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [fetchLeaderboard]);

  const topThree = entries.slice(0, 3);
  const medalColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
  const medalBg = ['from-yellow-400/20 to-amber-400/20', 'from-slate-300/20 to-slate-400/20', 'from-amber-600/20 to-orange-600/20'];

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-3">
              <FiGlobe className="text-yellow-400" size={14} />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Global Rankings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                Leaderboard
              </span>
            </h1>
            <p className="text-slate-400 mt-2">Top eco-warriors this month — updated in real time.</p>
          </div>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            aria-label="Refresh leaderboard"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading && entries.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {topThree.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className={`glass-card rounded-2xl p-6 text-center ${
                    index === 0 ? 'ring-2 ring-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : ''
                  }`}>
                    {index === 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="text-2xl">👑</span>
                      </div>
                    )}
                    <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${medalBg[index]} flex items-center justify-center mb-3 shadow-lg`}>
                      <Medal className={`w-7 h-7 ${medalColors[index]}`} />
                    </div>
                    <p className="text-3xl mb-2">{entry.avatar}</p>
                    <p className="font-bold text-white">{entry.name}</p>
                    <p className="text-sm text-slate-400">{formatNumber(entry.totalKg)} kg CO₂</p>
                    <div className="inline-flex items-center gap-1 mt-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-0.5">
                      <FiAward className="text-green-400" size={11} />
                      <span className="text-green-400 text-xs font-bold">{entry.badges} badges</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  All Rankings
                </h2>
              </div>
              <div className="divide-y divide-white/5">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className={`w-8 text-center font-bold text-lg ${
                      entry.rank <= 3 ? medalColors[entry.rank - 1] : 'text-slate-500'
                    }`}>
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{entry.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{entry.badges} badges</span>
                        <span>·</span>
                        <span>{entry.country}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatNumber(entry.totalKg)} <span className="text-xs text-slate-400">kg</span></p>
                      {entry.streak > 0 && (
                        <p className="text-xs text-amber-400">🔥 {entry.streak}d streak</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
