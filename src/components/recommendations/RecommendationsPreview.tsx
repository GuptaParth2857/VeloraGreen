'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { generateRecommendations } from '@/lib/recommendations';
import { formatCO2 } from '@/lib/calculations';

export function RecommendationsPreview() {
  const { currentResult } = useAppStore();

  if (!currentResult) return null;

  const recommendations = generateRecommendations(currentResult).slice(0, 3);

  if (recommendations.length === 0) return null;

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Top Recommendations</h3>
        <Link
          href="/recommendations"
          className="text-sm text-eco-400 hover:text-eco-300 flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-2xl">{rec.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium text-white">{rec.title}</h4>
              <p className="text-sm text-white/60 mt-1">{rec.description}</p>
              <p className="text-sm text-eco-400 mt-2">
                Save up to {formatCO2(rec.estimatedSaving)} CO₂/year
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
