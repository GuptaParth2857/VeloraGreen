'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  icon: string;
  name: string;
  description: string;
  color: string;
  earned?: boolean;
  earnedAt?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  icon,
  name,
  description,
  color,
  earned = false,
  size = 'md',
}: BadgeProps) {
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center gap-3',
        !earned && 'opacity-40 grayscale'
      )}
      whileHover={earned ? { scale: 1.1 } : undefined}
      role="img"
      aria-label={`${name}: ${description}${earned ? ' (Earned)' : ' (Locked)'}`}
    >
      <motion.div
        className={cn(
          'flex items-center justify-center relative',
          sizes[size],
          earned ? 'glass-hover' : 'bg-white/5'
        )}
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: earned
            ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
            : undefined,
          borderColor: earned ? `${color}50` : undefined,
          borderWidth: earned ? '2px' : '1px',
        }}
        animate={earned ? { 
          boxShadow: [
            `0 0 20px ${color}40`,
            `0 0 40px ${color}60`,
            `0 0 20px ${color}40`,
          ],
        } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className={cn('relative z-10', !earned && 'grayscale')}>{icon}</span>
        
        {/* Hexagon border effect */}
        <div 
          className="absolute inset-[2px] pointer-events-none"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: `1px solid ${earned ? color : 'rgba(255,255,255,0.2)'}`,
          }}
        />
      </motion.div>
      <div className="text-center font-rajdhani">
        <p className={cn('font-semibold text-sm', earned ? 'text-white' : 'text-white/50')}>
          {name}
        </p>
        <p className="text-xs text-white/40 mt-1 max-w-[120px]">{description}</p>
      </div>
    </motion.div>
  );
}
