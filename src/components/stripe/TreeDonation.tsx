'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Loader2, Check, ExternalLink } from 'lucide-react';

const TREE_PRICE = 1;
const CO2_PER_TREE = 21;

export function TreeDonation({ treesNeeded = 0 }: { treesNeeded?: number }) {
  const [trees, setTrees] = useState(Math.max(1, Math.min(10, Math.ceil(treesNeeded / 10))));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trees, amount: trees * TREE_PRICE }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setSuccess(true);
      }
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <p className="text-white font-bold text-lg">Thank You! 🌳</p>
        <p className="text-slate-400 text-sm">Your trees are being planted. You're making a difference!</p>
      </div>
    );
  }

  const totalCO2 = trees * CO2_PER_TREE;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <TreePine className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">Offset Your Carbon</h3>
          <p className="text-slate-400 text-sm">Plant trees to absorb CO₂</p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">Trees to plant</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrees(Math.max(1, trees - 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              -
            </button>
            <span className="text-white font-bold text-xl w-8 text-center">{trees}</span>
            <button
              onClick={() => setTrees(Math.min(100, trees + 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">CO₂ absorption</span>
            <span className="text-green-400 font-semibold">{(totalCO2 / 1000).toFixed(1)} tons/year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Cost</span>
            <span className="text-white font-semibold">${(trees * TREE_PRICE).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <TreePine className="w-5 h-5" />
            Plant {trees} Tree{trees > 1 ? 's' : ''} — ${(trees * TREE_PRICE).toFixed(2)}
          </>
        )}
      </button>

      <p className="text-[10px] text-slate-500 text-center mt-3">
        🔒 Secure payment via Stripe • Google Pay accepted
      </p>
    </div>
  );
}
