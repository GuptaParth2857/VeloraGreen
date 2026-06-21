'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiLock, FiStar, FiTrendingUp } from 'react-icons/fi';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/badges')
      .then(r => r.json())
      .then(data => {
        if (data.badges) setBadges(data.badges);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-3">
            <FiStar className="text-purple-400" size={14} />
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Achievements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Badge{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Collection
            </span>
          </h1>
          <p className="text-slate-400 mt-2">Earn badges by completing challenges and reducing your carbon footprint.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/50 to-pink-950/50 border border-purple-500/20 p-6 md:p-8 mb-10"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Your Collection</h2>
              <p className="text-slate-400 text-sm">Complete challenges to unlock badges and track your progress.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
              <FiTrendingUp className="text-purple-400" size={14} />
              <span className="text-purple-400 text-sm font-bold">0/{badges.length} Earned</span>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : badges.length === 0 ? (
          <div className="text-center py-20">
            <FiAward className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Badges Yet</h3>
            <p className="text-slate-400">Complete challenges and take action to earn your first badge.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge, index) => {
              const colorMap: Record<string, string> = {
                green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
                cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
                purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
                amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
                blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
                red: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
              };
              const gradient = colorMap[badge.color] || colorMap.green;

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {badge.icon}
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{badge.name}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{badge.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 bg-white/5 rounded-full px-3 py-1">
                      <FiLock className="w-3 h-3" />
                      <span>{badge.requirement}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
