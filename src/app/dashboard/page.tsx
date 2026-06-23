'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { FiBarChart2, FiArrowRight } from 'react-icons/fi';
const GoogleCarbonMap = dynamic(() => import('@/components/carbon-map/GoogleCarbonMap').then(m => m.GoogleCarbonMap), {
  ssr: false,
  loading: () => <div className="w-full h-[450px] bg-white/5 animate-pulse rounded-2xl flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" /></div>,
});

const DashboardView = dynamic(() => import('@/components/dashboard/DashboardView').then(m => m.DashboardView), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-white/5 animate-pulse rounded-2xl flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" /></div>,
});
const ChartsSection = dynamic(() => import('@/components/dashboard/ChartsSection').then(m => m.ChartsSection), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl" />,
});
const RecommendationsPreview = dynamic(() => import('@/components/recommendations/RecommendationsPreview').then(m => m.RecommendationsPreview), {
  ssr: false,
});
const DailyMissions = dynamic(() => import('@/components/dashboard/DailyMissions').then(m => m.DailyMissions), {
  ssr: false,
});
const EmailSubscription = dynamic(() => import('@/components/EmailSubscription').then(m => m.EmailSubscription), {
  ssr: false,
});

export default function DashboardPage() {
  const { loadHistory, currentResult } = useAppStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-3">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Live Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Dashboard
              </span>
            </h1>
            <p className="text-slate-400 mt-2">Track your carbon footprint and see your impact over time.</p>
          </div>
          <Link
            href="/calculator"
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(34,197,94,0.25)]"
          >
            <FiBarChart2 size={16} />
            New Calculation
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-8">
          <DashboardView />
          <ChartsSection />

          {currentResult && (
            <GoogleCarbonMap
              totalKg={currentResult.total}
              country={currentResult.country}
              breakdown={currentResult.breakdown as unknown as Record<string, number>}
            />
          )}

          <DailyMissions />
          <RecommendationsPreview />
          <EmailSubscription />
        </div>
      </motion.div>
    </div>
  );
}
