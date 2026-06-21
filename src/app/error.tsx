'use client';

import { useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 mb-8">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          <FiRefreshCw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
