'use client';

import { useState } from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';

interface GoogleSignInButtonProps {
  onSuccess?: (user: { id: string; email: string; name: string; avatar: string }) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function GoogleSignInButton({ onSuccess, onError, className = '' }: GoogleSignInButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSuccess = async (response: CredentialResponse) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');
      setStatus('success');
      onSuccess?.(data.user);
    } catch (err) {
      setStatus('error');
      onError?.(err instanceof Error ? err.message : 'Google sign-in failed');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-xs text-center mb-2"
          >
            Sign-in failed. Please try again.
          </motion.p>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${status === 'loading' ? 'opacity-50 pointer-events-none' : ''}`}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
          }}
          theme="filled_black"
          size="large"
          shape="pill"
          text="signin_with"
          width={300}
        />
      </div>
    </div>
  );
}
