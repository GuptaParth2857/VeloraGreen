'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Share2, ChevronRight } from 'lucide-react';

export function TeamChallenge() {
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState('');

  const createTeam = async () => {
    const name = (document.getElementById('team-name') as HTMLInputElement)?.value;
    if (!name) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, goal: 'reduce-carbon',
          targetReduction: 10, duration: 30,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewCode(data.id);
        setShowCreate(false);
      } else {
        setError(data.error || 'Failed to create team');
      }
    } catch {
      setError('Failed to create team');
    }
  };

  const joinTeam = async () => {
    if (!inviteCode) return;
    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowJoin(false);
        setInviteCode('');
      } else {
        setError(data.error || 'Failed to join');
      }
    } catch {
      setError('Failed to join team');
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">Team Challenges</h3>
          <p className="text-slate-400 text-sm">Compete with friends</p>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
        >
          {error}
        </motion.p>
      )}

      {newCode ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center mb-4">
          <p className="text-green-400 font-bold text-sm mb-2">Team Created! 🎉</p>
          <p className="text-slate-300 text-xs mb-3">Share this invite code with friends:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white font-mono text-2xl font-black tracking-widest">{newCode.slice(-6).toUpperCase()}</span>
            <button
              onClick={() => copyCode(newCode.slice(-6).toUpperCase())}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {!showCreate && !showJoin && (
            <>
              <button
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors group"
              >
                <span className="text-white font-medium">Create a Team</span>
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={() => setShowJoin(true)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors group"
              >
                <span className="text-white font-medium">Join with Code</span>
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </button>
            </>
          )}

          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <input
                id="team-name"
                placeholder="Team name..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-green-500/40"
              />
              <div className="flex gap-2">
                <button
                  onClick={createTeam}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {showJoin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter invite code..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm text-center tracking-widest placeholder-white/20 outline-none focus:border-green-500/40 uppercase"
                maxLength={6}
              />
              <div className="flex gap-2">
                <button
                  onClick={joinTeam}
                  disabled={inviteCode.length < 4}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
                >
                  Join
                </button>
                <button
                  onClick={() => setShowJoin(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
