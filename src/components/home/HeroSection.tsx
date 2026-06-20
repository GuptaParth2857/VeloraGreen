'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Activity, Leaf, Zap } from 'lucide-react';

const particleStyles: Array<{
  size: string; left: string; top: string; animDuration: string; animDelay: string;
}> = Array.from({ length: 30 }, () => {
  const s = Math.random() * 3 + 1;
  return {
    size: s + 'px',
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animDuration: `${4 + Math.random() * 6}s`,
    animDelay: `${Math.random() * 4}s`,
  };
});

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleStyles.map((ps, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: ps.size,
            height: ps.size,
            left: ps.left,
            top: ps.top,
            background: i % 3 === 0
              ? 'rgba(34, 197, 94, 0.6)'
              : i % 3 === 1
              ? 'rgba(6, 182, 212, 0.6)'
              : 'rgba(255,255,255,0.3)',
            animation: `particle-float ${ps.animDuration} ${ps.animDelay} ease-in-out infinite`,
            boxShadow: i % 3 === 0 ? '0 0 4px rgba(34,197,94,0.8)' : '0 0 4px rgba(6,182,212,0.8)',
          }}
        />
      ))}
    </div>
  );
}

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(34,197,94,0.4), transparent)',
          animation: 'scan 6s linear infinite',
          top: '-10%',
        }}
      />
    </div>
  );
}

function CornerBrackets({ color = 'cyan' }: { color?: string }) {
  const c = color === 'green' ? 'rgba(34,197,94,0.5)' : 'rgba(6,182,212,0.5)';
  return (
    <>
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: c }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: c }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: c }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: c }} />
    </>
  );
}

const stats = [
  { value: '4.7T', label: 'Tons CO₂/Year', icon: Activity },
  { value: '21%', label: 'Reduction Possible', icon: Leaf },
  { value: '100%', label: 'Free & Private', icon: Zap },
];

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function HeroSection() {
  const mounted = useIsClient();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hud-grid pointer-events-none opacity-30 z-10" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-10"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none z-10"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />

      <ScanLine />

      {mounted && <div className="z-10"><Particles /></div>}

      <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: '15%' }}>
        <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent)' }} />
      </div>
      <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: '85%' }}>
        <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.15), transparent)' }} />
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {mounted && (
          <>
            <motion.div
              className="flex items-center justify-center gap-3 mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-cyan-400/50" />
              <div className="eco-badge">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400 tracking-[0.3em]">SYSTEM ONLINE</span>
                <span className="text-[10px] text-cyan-400/60 tracking-wider">v2.0.0</span>
              </div>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-cyan-400/50" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="mb-3">
                <span
                  className="text-[11px] sm:text-xs tracking-[0.5em] uppercase font-medium text-cyan-400/70"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  Carbon Footprint Intelligence Platform
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-[90px] font-black leading-[0.88] mb-6 tracking-tight">
                <span className="text-white">ECO</span>
                <span className="eco-gradient-text">TRACE</span>
                <br />
                <span
                  className="text-white/20 text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.4em]"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  TRACK · REDUCE · OFFSET
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Understand your impact on the planet. Calculate, track, and reduce your carbon
              emissions through simple actions and personalized insights.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link href="/calculator" aria-label="Start calculating your carbon footprint">
                <button className="btn-primary group">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Calculating
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </button>
              </Link>
              <Link href="/dashboard" aria-label="View your carbon dashboard">
                <button className="btn-secondary">
                  <span className="flex items-center gap-2">
                    View Dashboard
                  </span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="relative p-4 text-center"
                  style={{
                    background: 'rgba(3,7,18,0.25)',
                    border: '1px solid rgba(6,182,212,0.15)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <CornerBrackets color={i === 0 ? 'cyan' : 'green'} />
                  <p
                    className="text-2xl sm:text-3xl font-black mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: 'Orbitron, monospace',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-white/40 tracking-widest uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="section-divider" />
      </div>

      {mounted && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-[10px] tracking-[0.4em] text-cyan-400/40 uppercase"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Scroll
            </span>
            <ChevronDown className="w-4 h-4 text-cyan-400/40" />
          </div>
        </motion.div>
      )}
    </section>
  );
}
