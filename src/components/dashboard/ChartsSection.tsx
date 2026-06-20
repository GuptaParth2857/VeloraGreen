'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AVERAGES } from '@/lib/constants';
import { formatCO2 } from '@/lib/calculations';

export function ChartsSection() {
  const { currentResult, calculationHistory } = useAppStore();

  if (!currentResult) return null;

  const categories = Object.entries(currentResult.breakdown);
  const maxValue = Math.max(...categories.map(([, v]) => v));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown Chart */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">Category Breakdown</h3>
        <div className="space-y-4">
          {categories.map(([category, value], index) => {
            const percentage = (value / currentResult.total) * 100;
            const width = (value / maxValue) * 100;

            return (
              <motion.div
                key={category}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-white/80">{category.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white/60">{formatCO2(value)} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-eco-500 to-eco-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Comparison Chart */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">Comparison</h3>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Your Footprint</span>
                <span className="text-eco-400 font-medium">{formatCO2(currentResult.total)}</span>
              </div>
              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-eco-500 to-eco-400 flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentResult.total / AVERAGES.us.yearly) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                >
                  <span className="text-xs text-white font-medium">You</span>
                </motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">India Average</span>
                <span className="text-amber-400 font-medium">{formatCO2(AVERAGES.india.yearly)}</span>
              </div>
              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${(AVERAGES.india.yearly / AVERAGES.us.yearly) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <span className="text-xs text-white font-medium">India</span>
                </motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">World Average</span>
                <span className="text-blue-400 font-medium">{formatCO2(AVERAGES.world.yearly)}</span>
              </div>
              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${(AVERAGES.world.yearly / AVERAGES.us.yearly) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <span className="text-xs text-white font-medium">World</span>
                </motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">US Average</span>
                <span className="text-red-400 font-medium">{formatCO2(AVERAGES.us.yearly)}</span>
              </div>
              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <span className="text-xs text-white font-medium">US</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Real Historical Data - Only show if we have actual history */}
      {calculationHistory.length > 1 && (
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Your History</h3>
          <p className="text-sm text-white/50 mb-6">Your carbon footprint over time based on actual calculations</p>
          <div className="h-48 flex items-end justify-between gap-2">
            {calculationHistory.slice(-8).map((result, index) => {
              const date = new Date(result.timestamp);
              const monthName = date.toLocaleString('default', { month: 'short' });
              const height = (result.total / Math.max(...calculationHistory.map(r => r.total))) * 100;
              const isLatest = index === Math.min(calculationHistory.length - 1, 7);
              
              return (
                <motion.div
                  key={result.id}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-1 flex items-end w-full">
                    <motion.div
                      className={`w-full rounded-t-lg ${isLatest ? 'bg-gradient-to-t from-eco-600 to-eco-400' : 'bg-white/20'}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      role="img"
                      aria-label={`${monthName}: ${formatCO2(result.total)}`}
                    />
                  </div>
                  <span className="text-xs text-white/50">{monthName}</span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
