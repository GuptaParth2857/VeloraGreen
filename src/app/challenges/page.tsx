'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassProgress } from '@/components/ui/GlassProgress';
import { getChallengeState, startChallenge, checkInToday, getWeeklyProgress } from '@/lib/challenges';
import { WEEKLY_CHALLENGES, Challenge } from '@/types/challenges';
import { Target, Flame, Trophy, CheckCircle, Calendar } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function ChallengesPage() {
  const { currentResult, challenge, setChallenge } = useAppStore();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  useSEO('Carbon Challenges', 'Take on weekly challenges to reduce your carbon footprint. Complete eco-friendly goals and earn rewards.');

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
    <main className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="gradient-text">Carbon</span> Challenges
          </motion.h1>
          <motion.p
            className="text-white/60 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Take on weekly challenges to reduce your carbon footprint
          </motion.p>
        </div>

        {challenge.isActive && challenge.activeChallenge ? (
          <GlassCard className="mb-8" glow>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-eco-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{challenge.activeChallenge.title}</h2>
                <p className="text-sm text-white/60">{challenge.activeChallenge.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <GlassProgress
                value={weeklyProgress.daysCompleted}
                max={7}
                label="Progress"
                color="eco"
              />

              <div className="flex gap-2">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      i < weeklyProgress.daysCompleted
                        ? 'bg-eco-500 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {i < weeklyProgress.daysCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      `Day ${i + 1}`
                    )}
                  </motion.div>
                ))}
              </div>

              <GlassButton onClick={handleCheckIn} className="w-full">
                Check In Today
              </GlassButton>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <GlassCard>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{challenge.currentStreak}</p>
                  <p className="text-xs text-white/50">Current Streak</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{challenge.completedChallenges}</p>
                  <p className="text-xs text-white/50">Completed</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-eco-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-eco-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{challenge.longestStreak}</p>
                  <p className="text-xs text-white/50">Longest Streak</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Available Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEEKLY_CHALLENGES.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                hover
                onClick={() => setSelectedChallenge(challenge)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        challenge.difficulty === 'easy'
                          ? 'bg-green-500/20 text-green-400'
                          : challenge.difficulty === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm text-white/50">7 days</span>
                    </div>
                    <h3 className="font-semibold mb-1">{challenge.title}</h3>
                    <p className="text-sm text-white/60">{challenge.description}</p>
                    <p className="text-sm text-eco-400 mt-2">
                      Target: -{challenge.targetReduction}% emissions
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-2">{selectedChallenge.title}</h2>
              <p className="text-white/60 mb-4">{selectedChallenge.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-white/60">Duration</span>
                  <span>7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Target Reduction</span>
                  <span className="text-eco-400">{selectedChallenge.targetReduction}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Difficulty</span>
                  <span className="capitalize">{selectedChallenge.difficulty}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <GlassButton
                  variant="secondary"
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  onClick={() => handleStartChallenge(selectedChallenge)}
                  className="flex-1"
                >
                  Start Challenge
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </main>
  );
}
