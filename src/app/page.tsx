'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiTarget, FiAward, FiUsers, FiZap, FiTrendingUp, FiGlobe, FiCheckCircle, FiStar, FiCpu, FiCloud, FiDroplet } from 'react-icons/fi';
import { Leaf, Calculator } from 'lucide-react';
import { FaLeaf, FaRecycle, FaTree, FaSolarPanel, FaBicycle } from 'react-icons/fa';
import { useState, useEffect, useMemo, memo } from 'react';
import { AnimatedGradientText, GlowingBorder, FloatingIcon, PulseRing } from '@/components/PremiumAnimations';

const features = [
  { icon: Calculator, title: 'Smart Calculator', description: '6-category carbon footprint calculator with real-time results and personalized insights.', color: 'from-green-500 to-emerald-500' },
  { icon: FiBarChart2, title: 'Visual Dashboard', description: 'Beautiful charts and graphs showing your emissions over time with global comparisons.', color: 'from-blue-500 to-cyan-500' },
  { icon: FiTarget, title: 'Weekly Challenges', description: 'Complete eco-friendly challenges to reduce your carbon footprint and earn rewards.', color: 'from-amber-500 to-orange-500' },
  { icon: FiAward, title: 'Badge System', description: 'Earn badges for your achievements and track your progress towards a greener lifestyle.', color: 'from-purple-500 to-pink-500' },
  { icon: FiUsers, title: 'Leaderboard', description: 'Compete with friends and the community to see who can achieve the lowest emissions.', color: 'from-rose-500 to-red-500' },
  { icon: FiTrendingUp, title: 'AI Recommendations', description: 'Get personalized tips and recommendations based on your highest emission categories.', color: 'from-teal-500 to-green-500' },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: FiUsers, color: 'from-green-500 to-emerald-500' },
  { value: '50K+', label: 'Tons CO₂ Tracked', icon: FiCloud, color: 'from-blue-500 to-cyan-500' },
  { value: '5K+', label: 'Challenges Completed', icon: FiTarget, color: 'from-amber-500 to-orange-500' },
  { value: '100K+', label: 'Trees Planted', icon: FaTree, color: 'from-emerald-500 to-green-500' },
];

function StatCard({ value, label, icon: Icon, color, idx }: { value: string; label: string; icon: any; color: string; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.7 + idx * 0.1 }}
      whileHover={{ y: -8, scale: 1.05 }}
      className="relative group"
    >
      <motion.div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-green-500/40 transition-all duration-500 hover:bg-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={`relative z-10 w-14 h-14 mx-auto bg-gradient-to-br ${color} border border-white/20 rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]`}>
          <Icon size={24} />
        </div>
        <p className="relative z-10 text-3xl font-black text-white mb-1">{value}</p>
        <p className="relative z-10 text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

const MemoizedStatCard = memo(StatCard);

const impactData = [
  { icon: FaBicycle, title: 'Cycle Instead of Drive', desc: 'Saves ~0.5 kg CO₂ per km', value: '1.5 tons/year' },
  { icon: FaSolarPanel, title: 'Switch to Solar', desc: 'Reduce electricity emissions by 80%', value: '4 tons/year' },
  { icon: FaRecycle, title: 'Recycle More', desc: 'Reduce waste emissions by 30%', value: '0.5 tons/year' },
  { icon: FaLeaf, title: 'Plant-Based Diet', desc: 'Lower food-related emissions', value: '1.2 tons/year' },
];

function ImpactCard({ icon: Icon, title, desc, value, idx }: { icon: any; title: string; desc: string; value: string; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="relative group"
    >
      <div className="glass-card rounded-2xl p-6 h-full">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mb-4 text-green-400 group-hover:from-green-500/40 group-hover:to-emerald-500/40 group-hover:text-green-300 transition-all duration-300">
          <Icon size={22} />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        <p className="text-slate-400 text-sm mb-3">{desc}</p>
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
          <FiZap className="text-green-400" size={12} />
          <span className="text-green-400 text-xs font-bold">{value}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 pb-24 z-10" style={{ isolation: 'isolate' }}>
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="flex justify-center mb-10"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative inline-flex items-center gap-2.5 bg-green-500/10 backdrop-blur-xl border border-green-500/30 text-green-400 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block shadow-[0_0_12px_rgba(34,197,94,0.9)]"
                />
                Live Carbon Data • Real-time Tracking
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-8 relative"
          >
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] pointer-events-none" />
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.1), transparent)',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />

            <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6 pt-8 px-4">
              <span className="text-slate-300 font-light">Track Your</span>
              <br />
              <span className="relative inline-block">
                <AnimatedGradientText className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                  Carbon Footprint
                </AnimatedGradientText>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
                  className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full opacity-60"
                />
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-6 pb-8"
            >
              Calculate your carbon emissions, track your impact, and join a community
              working towards a sustainable future. Every action counts.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-14 relative"
          >
            <div className="relative flex flex-wrap items-center justify-center gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-3">
              <Link
                href="/calculator"
                className="group flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 active:scale-95"
              >
                Calculate Now
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiBarChart2 size={18} />
                View Dashboard
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <MemoizedStatCard key={stat.label} {...stat} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
              <FiStar className="text-green-400" size={14} />
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Everything You Need</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Powerful{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Features
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Track, reduce, and offset your carbon footprint with our comprehensive platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <motion.div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative glass-card rounded-2xl p-6 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} border border-white/10 flex items-center justify-center mb-4 text-white shadow-lg`}>
                    <feature.icon size={22} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-28 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-green-600/10 blur-[180px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-1.5 rounded-full mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Make an Impact</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                Small Changes,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">Big Impact</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl">Simple actions that significantly reduce your carbon footprint.</p>
            </div>
            <Link href="/recommendations" className="flex items-center gap-2 text-white hover:text-green-300 font-semibold bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 px-5 py-2.5 rounded-xl transition-all group">
              <span>View All Tips</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {impactData.map((item, i) => (
              <ImpactCard key={item.title} {...item} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-950 via-emerald-950/50 to-slate-950 border border-green-500/20 p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-green-500/10 blur-[140px] rounded-full" />
              <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/8 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25 text-green-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <FiGlobe className="animate-pulse" size={14} />
                Start Your Journey
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                Ready to Make a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Difference</span>?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of people already tracking their carbon footprint and taking action
                for a sustainable future. It&apos;s free, private, and impactful.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/calculator"
                  className="group flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:-translate-y-0.5"
                >
                  Get Started Free
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/challenges"
                  className="flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5"
                >
                  <FiTarget size={18} />
                  View Challenges
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
