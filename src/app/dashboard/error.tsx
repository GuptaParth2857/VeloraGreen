'use client';

import { useEffect } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold mb-2">Dashboard Error</h2>
        <p className="text-white/60 mb-6">
          We couldn't load your dashboard data. Try refreshing the page.
        </p>
        <GlassButton onClick={reset}>
          <RefreshCw className="w-4 h-4" />
          Reload Dashboard
        </GlassButton>
      </div>
    </div>
  );
}
