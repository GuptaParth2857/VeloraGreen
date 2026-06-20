'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Earth3DComponent = dynamic(
  () => import('@/components/earth/Earth3D').then(mod => ({ default: mod.Earth3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-md aspect-square mx-auto flex items-center justify-center">
        <div className="w-full h-full bg-white/5 animate-pulse rounded-full" />
      </div>
    ),
  }
);

function SectionTag({ label }: { label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
      style={{
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.2)',
        clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <span
        className="text-[10px] tracking-[0.35em] text-green-400/80 uppercase"
        style={{ fontFamily: 'Orbitron, monospace' }}
      >
        {label}
      </span>
    </div>
  );
}

export function EarthSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionTag label="Global Impact" />
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Visualize Our{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Planet
            </span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Every action you take to reduce your carbon footprint contributes to a healthier planet.
            Rotate the globe and see — we&apos;re all in this together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {[
            { label: 'Global CO₂', value: '36.8B', unit: 'tons/year' },
            { label: 'Avg per Person', value: '4.8', unit: 'tons/year' },
            { label: 'Reduction Goal', value: '−45%', unit: 'by 2030' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="text-center py-4 px-3"
              style={{
                background: 'rgba(3,7,18,0.25)',
                border: '1px solid rgba(34,197,94,0.1)',
              }}
            >
              <div className="text-xs text-white/50 tracking-wider mb-1">{stat.label}</div>
              <div
                className="text-xl font-black"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/30 mt-0.5">{stat.unit}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div
            className="relative p-4"
            style={{
              background: 'rgba(3,7,18,0.25)',
              border: '1px solid rgba(34,197,94,0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400/40" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400/40" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400/40" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400/40" />

            <div
              className="text-[11px] tracking-[0.4em] text-green-400/40 mb-4 text-center"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              INTERACTIVE 3D GLOBE
            </div>

            <Earth3DComponent />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
