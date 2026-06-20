'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatNumber } from '@/lib/utils';
import { Trophy, Medal, RefreshCw } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

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
  useSEO('Leaderboard', 'See how you rank against other eco-warriors on the carbon footprint leaderboard.');
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
  const medalColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
  const medalBg = ['bg-yellow-400/20', 'bg-gray-300/20', 'bg-amber-600/20'];

  return (
    <main className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="gradient-text">Leaderboard</span>
            </motion.h1>
            <motion.p
              className="text-white/60 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Top eco-warriors this month — updates in real time
            </motion.p>
          </div>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all disabled:opacity-50"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
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
            <div className="grid grid-cols-3 gap-4 mb-8">
              {topThree.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <GlassCard
                    className={`text-center ${index === 0 ? 'ring-2 ring-yellow-400/50' : ''}`}
                    glow={index === 0}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full ${medalBg[index]} flex items-center justify-center mb-3`}>
                      <Medal className={`w-6 h-6 ${medalColors[index]}`} />
                    </div>
                    <p className="text-3xl mb-2">{entry.avatar}</p>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-white/60">{formatNumber(entry.totalKg)} kg</p>
                    <p className="text-xs text-eco-400 mt-1">{entry.badges} badges</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <GlassCard>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-eco-400" />
                All Rankings
              </h2>
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className={`w-8 text-center font-bold ${
                      entry.rank <= 3 ? medalColors[entry.rank - 1] : 'text-white/50'
                    }`}>
                      {entry.rank}
                    </span>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div className="flex-1">
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-xs text-white/50">{entry.badges} badges · {entry.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(entry.totalKg)} kg</p>
                      <p className="text-xs text-white/50">
                        {entry.streak > 0 ? `${entry.streak}d streak` : ''}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </>
        )}
      </motion.div>
    </main>
  );
}
