'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Terminal, Zap } from 'lucide-react';

const MISSIONS = [
  "Use cold water for laundry today.",
  "Unplug all devices not in use.",
  "Have a meatless lunch.",
  "Turn off lights when leaving the room.",
  "Avoid single-use plastics today.",
  "Walk or bike instead of driving.",
  "Take a 5-minute shorter shower."
];

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export function DailyMissions() {
  const [missionIndex] = useState(() => getDayOfYear() % MISSIONS.length);
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('daily-mission-date');
    return stored === new Date().toDateString();
  });

  const handleComplete = () => {
    setCompleted(true);
    localStorage.setItem('daily-mission-date', new Date().toDateString());
    // In a real app, we would add XP or points to the store here
  };

  return (
    <div className="layout-panel p-6 mt-6">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />

      <div className="flex items-center gap-3 mb-4">
        <Terminal className="w-6 h-6 text-eco-400" />
        <h2 className="text-xl font-bold font-rajdhani uppercase tracking-widest text-eco-400">
          Daily Directive
        </h2>
      </div>

      <div className="p-4 bg-black/40 border border-eco-500/30 rounded flex justify-between items-center relative overflow-hidden">
        {completed && (
          <motion.div 
            className="absolute inset-0 bg-eco-500/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        
        <div className="flex-1">
          <p className="text-sm font-mono text-white/80 mb-1">&gt; MISSION_TARGET_AQUIRED:</p>
          <p className={`text-lg font-rajdhani ${completed ? 'text-white/50 line-through' : 'text-white'}`}>
            {MISSIONS[missionIndex]}
          </p>
        </div>

        <button
          onClick={handleComplete}
          disabled={completed}
          className={`flex items-center gap-2 px-6 py-3 border font-bold uppercase tracking-widest transition-all ${
            completed 
              ? 'border-eco-500/50 text-eco-500/50 bg-transparent cursor-not-allowed'
              : 'border-eco-400 text-eco-400 bg-eco-500/10 hover:bg-eco-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          }`}
          style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
          aria-label={completed ? 'Mission completed' : 'Complete daily mission'}
        >
          {completed ? (
            <>
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              Completed
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" aria-hidden="true" />
              Execute
            </>
          )}
        </button>
      </div>
    </div>
  );
}
