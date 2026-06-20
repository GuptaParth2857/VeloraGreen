'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'eco' | 'blue' | 'purple' | 'amber' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlassProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'eco',
  size = 'md',
  className,
}: GlassProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    eco: 'from-eco-500 to-eco-400',
    blue: 'from-blue-500 to-blue-400',
    purple: 'from-purple-500 to-purple-400',
    amber: 'from-amber-500 to-amber-400',
    red: 'from-red-500 to-red-400',
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-white/80">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-mono text-white/60">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
        <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', heights[size])} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label || 'Progress'}>
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
