'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlassProgress } from '@/components/ui/GlassProgress';
import { Award, Lock } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export default function BadgesPage() {
  useSEO('Badge Collection', 'Earn eco badges by completing challenges and reducing your carbon footprint.');
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

  const total = badges.length;
  const earned = 0;

  return (
    <main className="min-h-screen py-16 px-4">
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
              Badge <span className="gradient-text">Collection</span>
            </motion.h1>
            <motion.p
              className="text-white/60 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Earn badges by completing challenges
            </motion.p>
          </div>
        </div>

        <GlassCard className="mb-8" glow>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-eco-500 to-eco-600 flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Your Progress</h2>
              <p className="text-sm text-white/60">
                {earned} of {total} badges earned
              </p>
            </div>
          </div>
          <GlassProgress
            value={earned}
            max={total}
            label="Collection Progress"
            color="eco"
            size="lg"
          />
        </GlassCard>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="flex flex-col items-center text-center p-6">
                  <Badge
                    icon={badge.icon}
                    name={badge.name}
                    description={badge.description}
                    color={badge.color}
                    earned={false}
                    size="lg"
                  />
                  <div className="flex items-center gap-1 mt-4 text-xs text-white/40">
                    <Lock className="w-3 h-3" />
                    <span>{badge.requirement}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
