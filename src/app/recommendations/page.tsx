'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { generateRecommendations, getTotalPotentialSaving } from '@/lib/recommendations';
import { formatCO2 } from '@/lib/calculations';
import { ArrowRight, TrendingDown, Leaf } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function RecommendationsPage() {
  const { currentResult, loadHistory } = useAppStore();
  useSEO('Personalized Recommendations', 'Get AI-style personalized tips to reduce your carbon footprint based on your highest emission categories.');

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (!currentResult) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <GlassCard className="py-12">
            <Leaf className="w-16 h-16 text-eco-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
            <p className="text-white/60 mb-6">
              Complete the calculator first to get personalized recommendations.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 text-eco-400 hover:text-eco-300"
            >
              Start Calculator <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </div>
      </main>
    );
  }

  const recommendations = generateRecommendations(currentResult);
  const totalSaving = getTotalPotentialSaving(recommendations);

  return (
    <main className="min-h-screen py-12 px-4">
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
            <span className="gradient-text">Recommendations</span>
          </motion.h1>
          <motion.p
            className="text-white/60 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Personalized tips to reduce your carbon footprint
          </motion.p>
        </div>

        <GlassCard className="mb-8" glow>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-eco-500 to-eco-600 flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Potential Savings</h2>
              <p className="text-3xl font-bold gradient-text">
                {formatCO2(totalSaving)} CO₂/year
              </p>
              <p className="text-sm text-white/60">
                By following all recommendations below
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{rec.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{rec.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rec.priority === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {rec.priority} impact
                      </span>
                    </div>
                    <p className="text-white/60 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-eco-400 font-medium">
                        Save up to {formatCO2(rec.estimatedSaving)} CO₂/year
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-eco-400 hover:text-eco-300"
          >
            Take on a challenge to start saving <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
