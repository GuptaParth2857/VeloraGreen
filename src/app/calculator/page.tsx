'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useSEO } from '@/hooks/useSEO';

const CalculatorWizard = dynamic(() => import('@/components/calculator/CalculatorWizard').then(m => m.CalculatorWizard), {
  ssr: false,
});

export default function CalculatorPage() {
  useSEO('Carbon Footprint Calculator', 'Calculate your carbon footprint with our interactive 6-category calculator. Free, private, and takes just 2 minutes.');

  return (
    <main className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">Carbon Footprint</span>
            <br />
            Calculator
          </motion.h1>
          <motion.p
            className="text-lg text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Answer a few questions about your lifestyle to calculate your annual carbon emissions.
            All data stays on your device.
          </motion.p>
        </div>

        <CalculatorWizard />
      </motion.div>
    </main>
  );
}
