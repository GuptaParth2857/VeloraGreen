'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { generateRecommendations, getTotalPotentialSaving } from '@/lib/recommendations';
import { formatCO2 } from '@/lib/calculations';
import { FiArrowRight, FiTrendingDown, FiTarget, FiZap } from 'react-icons/fi';
import { Leaf, Lightbulb } from 'lucide-react';

export default function RecommendationsPage() {
  const { currentResult, loadHistory } = useAppStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (!currentResult) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="glass-card rounded-2xl py-16 px-8">
            <Lightbulb className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">No Data Yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Complete the carbon calculator first to get personalized recommendations tailored to your lifestyle.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              Start Calculator <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = generateRecommendations(currentResult);
  const totalSaving = getTotalPotentialSaving(recommendations);

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-3">
            <FiZap className="text-teal-400" size={14} />
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">AI-Powered Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Personalized{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">
              Recommendations
            </span>
          </h1>
          <p className="text-slate-400 mt-2">Tips based on your highest emission categories.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950/50 to-green-950/50 border border-teal-500/20 p-6 md:p-8 mb-8"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)]">
              <FiTrendingDown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Potential Savings</h2>
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mt-1">
                {formatCO2(totalSaving)} CO₂/year
              </p>
              <p className="text-slate-400 text-sm">By following all recommendations below</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-slate-400">No recommendations available yet. Complete the calculator first.</p>
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card rounded-2xl p-6 hover:border-teal-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 border border-teal-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                    {rec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">{rec.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                        rec.priority === 'high'
                          ? 'bg-red-500/15 text-red-400 border-red-500/20'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                      }`}>
                        {rec.priority} impact
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{rec.description}</p>
                    <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                      <FiTarget className="text-green-400" size={12} />
                      <span className="text-green-400 text-xs font-bold">
                        Save up to {formatCO2(rec.estimatedSaving)} CO₂/year
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <FiTarget size={18} />
            Take on a Challenge to Start Saving
            <FiArrowRight className="ml-1" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
