'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

function LoginModalInner({ open, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === 'required') {
      onClose();
    }
  }, [searchParams, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    const result = isLogin
      ? await login(email, password)
      : await register(email, password, name);

    setBusy(false);

    if (result.error) {
      setError(result.error);
    } else {
      setEmail('');
      setPassword('');
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8" style={{
        background: 'rgba(3,7,18,0.95)',
        border: '1px solid rgba(6,182,212,0.2)',
      }}>
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-tr" />
        <div className="hud-corner hud-corner-bl" />
        <div className="hud-corner hud-corner-br" />

        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white" aria-label="Close">
          ✕
        </button>

        <h2 className="text-2xl font-bold font-rajdhani uppercase tracking-widest text-eco-400 mb-6">
          {isLogin ? 'SIGN IN' : 'REGISTER'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-mono text-white/60 mb-1">NAME</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-black/60 border border-cyan-900/50 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-mono text-white/60 mb-1">EMAIL</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-cyan-900/50 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-mono text-white/60 mb-1">PASSWORD</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-cyan-900/50 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-mono">&gt; ERROR: {error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 border border-eco-400 text-eco-400 bg-eco-500/10 font-bold uppercase tracking-widest transition-all hover:bg-eco-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
          >
            {busy ? 'AUTHENTICATING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/40">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-cyan-400 hover:underline">
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <Suspense fallback={null}>
      <LoginModalInner open={open} onClose={onClose} />
    </Suspense>
  );
}
