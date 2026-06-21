'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 100, x: '-50%' }}
          className="fixed bottom-20 left-1/2 z-50 w-[90%] max-w-sm glass rounded-2xl border border-white/10 p-4 shadow-2xl"
        >
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Install VeloraGreen</p>
              <p className="text-slate-400 text-[11px]">Add to your home screen for quick access</p>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-green-500 hover:to-emerald-500 transition-all"
          >
            Install App
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
