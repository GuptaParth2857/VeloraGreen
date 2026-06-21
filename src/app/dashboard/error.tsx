'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiRefreshCw, FiHome } from 'react-icons/fi';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📈</div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Error</h1>
        <p className="text-slate-400 mb-8">Something went wrong loading your dashboard.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all">
            <FiRefreshCw size={18} /> Try Again
          </button>
          <Link href="/" className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all">
            <FiHome size={18} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
