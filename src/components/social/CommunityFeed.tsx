'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, Award, Trophy, Target, TrendingDown, Activity } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'challenge' | 'badge' | 'milestone' | 'reduction';
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  icon?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  challenge: Target,
  badge: Award,
  milestone: Trophy,
  reduction: TrendingDown,
};

const BG_MAP: Record<string, string> = {
  challenge: 'bg-orange-500/20',
  badge: 'bg-purple-500/20',
  milestone: 'bg-yellow-500/20',
  reduction: 'bg-eco-500/20',
};

const ICON_COLOR_MAP: Record<string, string> = {
  challenge: 'text-orange-400',
  badge: 'text-purple-400',
  milestone: 'text-yellow-400',
  reduction: 'text-eco-400',
};

export function CommunityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/community/feed');
        const data = await res.json();
        if (data.feed) setFeed(data.feed);
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold">Community Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      </GlassCard>
    );
  }

  if (feed.length === 0) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold">Community Activity</h3>
        </div>
        <p className="text-xs text-white/40 text-center py-4">
          No recent activity. Start reducing your footprint to appear here!
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold">Community Activity</h3>
      </div>
      <div className="space-y-2">
        {feed.map((item, i) => {
          const Icon = ICON_MAP[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${BG_MAP[item.type]} flex items-center justify-center shrink-0`}>
                {Icon && <Icon className={`w-4 h-4 ${ICON_COLOR_MAP[item.type]}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 leading-relaxed">
                  <span className="font-semibold">{item.user}</span>{' '}
                  {item.message}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">{item.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
