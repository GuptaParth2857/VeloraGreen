'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const CalculatorWizard = dynamic(() => import('@/components/calculator/CalculatorWizard').then(m => m.CalculatorWizard), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-white/5 animate-pulse rounded-2xl flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  ),
});

const features = [
  '100% Private — All calculations stay on your device',
  '6 Categories — Electricity, Transport, Diet, Waste & more',
  'Real-time Results — See your impact instantly',
  'Personalized — Get recommendations based on your lifestyle',
];

export default function CalculatorPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Interactive Tool</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Carbon Footprint{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Calculator
                </span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                Answer a few simple questions about your lifestyle to calculate your annual carbon emissions. It takes just 2 minutes.
              </p>

              <div className="space-y-3 mb-8">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FiCheckCircle className="text-green-400 flex-shrink-0" size={16} />
                    <span className="text-slate-300 text-sm font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
                <p className="text-xs text-slate-400">
                  <span className="text-green-400 font-bold">Data Sources:</span> Based on EPA, IPCC AR6, and DEFRA 2023 emission factors for accurate calculations.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Calculator */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <CalculatorWizard />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
