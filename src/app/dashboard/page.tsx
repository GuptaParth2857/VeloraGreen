'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ShareButton } from '@/components/share/ShareButton';
import { ShareTemplate } from '@/components/share/ShareTemplate';
import { useSEO } from '@/hooks/useSEO';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const DashboardView = dynamic(() => import('@/components/dashboard/DashboardView').then(m => m.DashboardView), { ssr: false });
const ChartsSection = dynamic(() => import('@/components/dashboard/ChartsSection').then(m => m.ChartsSection), { ssr: false });
const RecommendationsPreview = dynamic(() => import('@/components/recommendations/RecommendationsPreview').then(m => m.RecommendationsPreview), { ssr: false });
const CommunityFeed = dynamic(() => import('@/components/social/CommunityFeed').then(m => m.CommunityFeed), { ssr: false });

export default function DashboardPage() {
  const { loadHistory } = useAppStore();
  useSEO('Dashboard', 'View your carbon footprint dashboard with detailed emissions breakdown, charts, and personalized recommendations.');

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <main className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Your <span className="gradient-text">Dashboard</span>
            </motion.h1>
            <motion.p
              className="text-white/60 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Track your carbon footprint and see your impact
            </motion.p>
          </div>
          <ShareButton />
        </div>

        <div className="space-y-6">
          <ErrorBoundary>
            <DashboardView />
          </ErrorBoundary>
          <ErrorBoundary>
            <ChartsSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <RecommendationsPreview />
          </ErrorBoundary>
          <ErrorBoundary>
            <CommunityFeed />
          </ErrorBoundary>
        </div>

        <div className="fixed -left-[9999px] top-0">
          <ShareTemplate />
        </div>
      </motion.div>
    </main>
  );
}
