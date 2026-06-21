'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getChallengeState, startChallenge, checkInToday, getWeeklyProgress } from '@/lib/challenges';
import { WEEKLY_CHALLENGES, Challenge } from '@/types/challenges';
import { FiTarget, FiCheckCircle, FiCalendar, FiX, FiZap } from 'react-icons/fi';
import { Flame, Trophy } from 'lucide-react';

export default function ChallengesPage() {
  const { currentResult, challenge, setChallenge } = useAppStore();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const state = getChallengeState();
    setChallenge(state);
  }, [setChallenge]);

  const handleStartChallenge = (challenge: Challenge) => {
    const newState = startChallenge(challenge);
    setChallenge(newState);
    setSelectedChallenge(null);
  };

  const handleCheckIn = () => {
    if (!currentResult) return;
    const newState = checkInToday(currentResult.total / 12);
    setChallenge(newState);
  };

  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-3">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Weekly Missions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Carbon{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Challenges
            </span>
          </h1>
          <p className="text-slate-400 mt-2">Take on weekly challenges to reduce your carbon footprint and earn rewards.</p>
        </div>

        {challenge.isActive && challenge.activeChallenge ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/50 to-orange-950/50 border border-amber-500/20 p-6 md:p-8 mb-8"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <FiTarget className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{challenge.activeChallenge.title}</h2>
                  <p className="text-sm text-slate-400">{challenge.activeChallenge.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-amber-400 font-bold">{weeklyProgress.daysCompleted}/7 days</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(weeklyProgress.daysCompleted / 7) * 100}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`flex-1 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                        i < weeklyProgress.daysCompleted
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      {i < weeklyProgress.daysCompleted ? (
                        <FiCheckCircle className="w-4 h-4" />
                      ) : (
                        `Day ${i + 1}`
                      )}
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleCheckIn}
                  disabled={weeklyProgress.daysCompleted >= 7}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiZap size={18} />
                  {weeklyProgress.daysCompleted >= 7 ? 'Challenge Complete!' : 'Check In Today'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Flame, value: challenge.currentStreak, label: 'Current Streak', color: 'from-orange-500 to-red-500' },
              { icon: Trophy, value: challenge.completedChallenges, label: 'Completed', color: 'from-purple-500 to-pink-500' },
              { icon: FiCalendar, value: challenge.longestStreak, label: 'Longest Streak', color: 'from-blue-500 to-cyan-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-bold text-white mb-4">Available Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEEKLY_CHALLENGES.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <button
                onClick={() => setSelectedChallenge(challenge)}
                className="w-full text-left glass-card rounded-2xl p-5 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        challenge.difficulty === 'easy'
                          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                          : challenge.difficulty === 'medium'
                          ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                          : 'bg-red-500/15 text-red-400 border border-red-500/20'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">7 days</span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">{challenge.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{challenge.description}</p>
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mt-3">
                      <FiTarget className="text-amber-400" size={12} />
                      <span className="text-amber-400 text-xs font-bold">-{challenge.targetReduction}% emissions</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Challenge Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <FiX size={16} />
              </button>

              <h2 className="text-xl font-bold text-white mb-2">{selectedChallenge.title}</h2>
              <p className="text-slate-400 text-sm mb-6">{selectedChallenge.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Duration</span>
                  <span className="text-white font-semibold">7 days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Target Reduction</span>
                  <span className="text-amber-400 font-bold">{selectedChallenge.targetReduction}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Difficulty</span>
                  <span className={`capitalize font-semibold ${
                    selectedChallenge.difficulty === 'easy' ? 'text-green-400' :
                    selectedChallenge.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>{selectedChallenge.difficulty}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStartChallenge(selectedChallenge)}
                  className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white transition shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
