'use client';

import { cn } from '@/lib/utils';

interface GlassSliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
  className?: string;
}

export function GlassSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  showValue = true,
  className,
}: GlassSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderId = label ? `glass-slider-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={sliderId} className="text-sm font-medium text-white/80">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-mono text-eco-400" aria-live="polite">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          id={sliderId}
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          aria-label={label || 'Slider'}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-eco-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-eco-500/50
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-eco-500 to-eco-400 rounded-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
