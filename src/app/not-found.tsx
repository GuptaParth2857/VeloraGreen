'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="text-9xl font-bold gradient-text mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-white/60 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <GlassButton>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </GlassButton>
        </Link>
      </motion.div>
    </main>
  );
}
