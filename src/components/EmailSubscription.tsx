'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Loader2 } from 'lucide-react';

export function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency: 'weekly' }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Weekly Email Reports</h3>
          <p className="text-slate-400 text-sm">Get your carbon footprint summary every week</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 rounded-xl px-4 py-3">
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-sm">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 input-premium text-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shrink-0"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}
    </motion.div>
  );
}
