'use client';

import { motion } from 'framer-motion';
import { GlassButton } from '@/components/ui/GlassButton';
import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="text-6xl mb-4"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring' }}
        >
          ⚠️
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-white/60 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <GlassButton onClick={reset}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </GlassButton>
      </motion.div>
    </main>
  );
}
