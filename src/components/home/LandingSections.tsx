'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, Trophy, Globe, Shield, Target, TrendingDown, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    label: 'F-01',
    title: 'Quick Calculator',
    description: 'Answer 6 simple questions about your lifestyle — transportation, energy, food, and shopping — to get your precise carbon footprint in seconds.',
    accent: '#22c55e',
  },
  {
    icon: BarChart3,
    label: 'F-02',
    title: 'Visual Analytics',
    description: 'Beautiful interactive charts break down your emissions by category. Spot your biggest contributors and track your progress over time.',
    accent: '#06b6d4',
  },
  {
    icon: Target,
    label: 'F-03',
    title: 'Smart Challenges',
    description: 'Take on personalized weekly challenges crafted to help you reduce your footprint — from carpooling to plant-based meals.',
    accent: '#22c55e',
  },
  {
    icon: Trophy,
    label: 'F-04',
    title: 'Earn Badges',
    description: 'Complete challenges and unlock achievement badges. Celebrate every milestone as you work towards a greener lifestyle.',
    accent: '#06b6d4',
  },
  {
    icon: Globe,
    label: 'F-05',
    title: 'Global Comparison',
    description: 'See how your footprint stacks up against India and world averages. Understand exactly where you stand on the global scale.',
    accent: '#22c55e',
  },
  {
    icon: Shield,
    label: 'F-06',
    title: '100% Private',
    description: 'All calculations happen locally in your browser. Your personal data never leaves your device — complete privacy, always.',
    accent: '#06b6d4',
  },
];

const steps = [
  {
    num: '01',
    title: 'Calculate',
    desc: 'Answer simple questions about your daily habits — transport, food, energy, and shopping.',
    icon: Zap,
  },
  {
    num: '02',
    title: 'Understand',
    desc: 'Get a detailed breakdown of your emissions with interactive visuals and comparisons.',
    icon: BarChart3,
  },
  {
    num: '03',
    title: 'Reduce',
    desc: 'Follow personalized recommendations and challenges to cut down your carbon output.',
    icon: TrendingDown,
  },
  {
    num: '04',
    title: 'Celebrate',
    desc: 'Earn badges, climb leaderboards, and share your progress with the community.',
    icon: Users,
  },
];

const tickerItems = [
  'TRACK YOUR FOOTPRINT',
  'REDUCE CARBON EMISSIONS',
  'PERSONALIZED INSIGHTS',
  'JOIN THE GREEN MOVEMENT',
  'EARN ECO BADGES',
  'COMPARE GLOBALLY',
  'FREE & PRIVATE',
  'TAKE CHALLENGES',
];

function SectionTag({ label }: { label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
      style={{
        background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.2)',
        clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <span
        className="text-[10px] tracking-[0.35em] text-cyan-400/80 uppercase"
        style={{ fontFamily: 'Orbitron, monospace' }}
      >
        {label}
      </span>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative h-full"
    >
      <div
        className="relative h-full p-6 transition-all duration-300 overflow-hidden"
        style={{
          background: 'rgba(3,7,18,0.25)',
          border: `1px solid rgba(${feature.accent === '#22c55e' ? '34,197,94' : '6,182,212'},0.12)`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}80, transparent)` }}
        />

        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l transition-all duration-300 group-hover:w-6 group-hover:h-6"
          style={{ borderColor: `${feature.accent}60` }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-all duration-300 group-hover:w-6 group-hover:h-6"
          style={{ borderColor: `${feature.accent}60` }} />

        <div
          className="text-[10px] tracking-[0.4em] mb-4 font-mono"
          style={{ color: `${feature.accent}50`, fontFamily: 'JetBrains Mono, monospace' }}
        >
          {feature.label}
        </div>

        <div
          className="w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
          style={{
            background: `rgba(${feature.accent === '#22c55e' ? '34,197,94' : '6,182,212'},0.1)`,
            border: `1px solid ${feature.accent}30`,
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
          }}
        >
            <feature.icon className="w-5 h-5" style={{ color: feature.accent }} aria-hidden="true" />
        </div>

        <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {feature.title}
        </h3>
        <p className="text-xs text-white/45 leading-relaxed">
          {feature.description}
        </p>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 0% 0%, ${feature.accent}06, transparent 60%)` }}
        />
      </div>
    </motion.div>
  );
}

function TickerBar() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div
      className="relative overflow-hidden py-3"
      style={{
        background: 'rgba(3,7,18,0.8)',
        borderTop: '1px solid rgba(6,182,212,0.1)',
        borderBottom: '1px solid rgba(6,182,212,0.1)',
      }}
    >
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: 'ticker 30s linear infinite' }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className="text-[11px] tracking-[0.4em] font-semibold text-cyan-400/50 uppercase"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {item}
            </span>
            <span className="text-green-400/30 text-sm">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <>
      <TickerBar />

      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag label="Core Features" />
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              Everything You Need to{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Go Green
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
              Our platform gives you every tool you need to understand, track, and reduce your environmental impact — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionTag label="How It Works" />
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              Your Path to a{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Greener Life
              </span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
              In just four simple steps, transform your understanding of your environmental impact and take meaningful action.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-4"
                style={{
                  background: 'rgba(3,7,18,0.25)',
                  border: '1px solid rgba(6,182,212,0.12)',
                }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center font-black text-lg mx-auto mb-3"
                  style={{
                    background: 'rgba(3,7,18,0.25)',
                    border: '1px solid rgba(6,182,212,0.2)',
                    clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)',
                    fontFamily: 'Orbitron, monospace',
                    color: '#06b6d4',
                  }}
                >
                  {step.num}
                </div>
                <step.icon className="w-5 h-5 text-green-400 mx-auto mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                <p className="text-[11px] text-white/45 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div
              className="relative p-6"
              style={{
                background: 'rgba(3,7,18,0.25)',
                border: '1px solid rgba(6,182,212,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/40" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/40" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400/40" />

              <div className="text-[11px] tracking-[0.4em] text-cyan-400/40 mb-6 text-center" style={{ fontFamily: 'Orbitron, monospace' }}>
                CARBON BREAKDOWN / ANALYSIS
              </div>

              {[
                { label: 'Transport', value: 38, color: '#22c55e' },
                { label: 'Energy', value: 26, color: '#06b6d4' },
                { label: 'Food', value: 22, color: '#22c55e' },
                { label: 'Shopping', value: 14, color: '#06b6d4' },
              ].map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-white/60">{item.label}</span>
                    <span className="text-xs font-mono text-white/40">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${item.color}80, ${item.color})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}

              <div
                className="mt-8 p-4 text-center"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] tracking-widest text-green-400/60 uppercase mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                      Your Annual CO₂
                    </div>
                    <div
                      className="text-3xl font-black"
                      style={{
                        fontFamily: 'Orbitron, monospace',
                        background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      4.7T
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">Global avg: 4.8T</div>
                  </div>
                  <div>
                    <div className="text-[11px] tracking-widest text-cyan-400/60 uppercase mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                      Reduction Potential
                    </div>
                    <div
                      className="text-2xl font-black text-cyan-400"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                      −21%
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">with our tips</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />
    </>
  );
}

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.05) 0%, transparent 70%)' }}
      />

      <motion.div
        className="max-w-4xl mx-auto relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div
          className="relative p-10 sm:p-16 text-center overflow-hidden"
          style={{
            background: 'rgba(3,7,18,0.25)',
            border: '1px solid rgba(34,197,94,0.15)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.6), rgba(6,182,212,0.6), transparent)' }}
          />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-400/40" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/40" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-400/40" />

          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08), transparent)' }} />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent)' }} />

          <div className="relative z-10">
            <SectionTag label="Get Started" />

            <h2 className="text-3xl md:text-6xl font-black mb-4 leading-tight">
              Ready to Make a{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Difference?
              </span>
            </h2>

            <p className="text-white/40 max-w-xl mx-auto mb-10 text-sm leading-relaxed">
              Join thousands of people who are already tracking and reducing their carbon footprint. Calculate yours today — it takes less than 2 minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              {[
                { value: '10K+', label: 'Calculations Done' },
                { value: '2 Min', label: 'To Complete' },
                { value: '0', label: 'Data Stored' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-2xl font-black mb-0.5"
                    style={{
                      fontFamily: 'Orbitron, monospace',
                      background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40 tracking-wider uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/calculator">
                <motion.button
                  className="btn-primary group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Calculate Your Footprint
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </motion.button>
              </Link>
              <Link href="/dashboard" aria-label="View your carbon dashboard">
                <button className="btn-secondary">
                  View Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
