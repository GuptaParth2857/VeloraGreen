'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatCO2 } from '@/lib/calculations';
import { BREAKDOWN_COLORS, BREAKDOWN_LABELS, BREAKDOWN_ICONS } from '@/lib/constants';
import { getCategoryPercentages } from '@/lib/calculations';
import Link from 'next/link';
import { ArrowRight, TreePine, Globe, TrendingDown } from 'lucide-react';
import { DailyMissions } from './DailyMissions';

export function DashboardView() {
  const { currentResult } = useAppStore();

  if (!currentResult) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-white/60 mb-4">No calculation data yet</p>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 text-eco-400 hover:text-eco-300"
        >
          Start Calculator <ArrowRight className="w-4 h-4" />
        </Link>
      </GlassCard>
    );
  }

  const percentages = getCategoryPercentages(currentResult.breakdown);
  const monthlyTotal = currentResult.total / 12;

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow>
          <div className="text-center">
            <p className="text-sm text-white/60 mb-1">Annual Emissions</p>
            <p className="text-3xl font-bold gradient-text">
              <AnimatedCounter target={currentResult.total} suffix=" kg" />
            </p>
            <p className="text-sm text-white/50 mt-1">
              <AnimatedCounter target={monthlyTotal} suffix=" kg/month" />
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <p className="text-sm text-white/60 mb-1">Daily Average</p>
            <p className="text-3xl font-bold text-eco-400">
              <AnimatedCounter target={currentResult.dailyAverage} decimals={1} suffix=" kg" />
            </p>
            <p className="text-sm text-white/50 mt-1">per day</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <p className="text-sm text-white/60 mb-1">Trees Needed</p>
            <p className="text-3xl font-bold text-green-400">
              <AnimatedCounter target={currentResult.treesNeeded} />
            </p>
            <p className="text-sm text-white/50 mt-1">to offset</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <p className="text-sm text-white/60 mb-1">vs World Average</p>
            <p className={`text-3xl font-bold ${currentResult.comparedToWorld > 0 ? 'text-eco-400' : 'text-red-400'}`}>
              {currentResult.comparedToWorld > 0 ? '-' : '+'}
              <AnimatedCounter target={Math.abs(currentResult.comparedToWorld)} suffix="%" />
            </p>
            <p className="text-sm text-white/50 mt-1">
              {currentResult.comparedToWorld > 0 ? 'below average' : 'above average'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Category Breakdown */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Emissions by Category</h3>
        <div className="space-y-4">
          {Object.entries(currentResult.breakdown).map(([category, value]) => {
            const percentage = percentages[category] || 0;
            return (
              <motion.div
                key={category}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{BREAKDOWN_ICONS[category as keyof typeof BREAKDOWN_ICONS]}</span>
                    <span className="text-sm font-medium">{BREAKDOWN_LABELS[category as keyof typeof BREAKDOWN_LABELS]}</span>
                  </div>
                  <span className="text-sm text-white/60">
                    {formatCO2(value)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: BREAKDOWN_COLORS[category as keyof typeof BREAKDOWN_COLORS] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Daily Mission */}
      <DailyMissions />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/recommendations" aria-label="Get personalized recommendations to reduce your footprint">
          <GlassCard hover className="h-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-eco-400" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold">Get Recommendations</p>
                <p className="text-sm text-white/50">Personalized tips to reduce</p>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/challenges" aria-label="Take on eco challenges">
          <GlassCard hover className="h-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold">Take a Challenge</p>
                <p className="text-sm text-white/50">7-day eco challenges</p>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/leaderboard" aria-label="View the leaderboard">
          <GlassCard hover className="h-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold">View Leaderboard</p>
                <p className="text-sm text-white/50">See your ranking</p>
              </div>
            </div>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
