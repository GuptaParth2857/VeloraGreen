'use client';

import { cn } from '@/lib/utils';

interface GlassInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function GlassInput({
  label,
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 1,
  unit,
  placeholder,
  className,
  id,
}: GlassInputProps) {
  const inputId = id || `glass-input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => {
            const raw = Number(e.target.value);
            if (Number.isNaN(raw)) return;
            const clamped = Math.min(max, Math.max(min, raw));
            onChange(clamped);
          }}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-label={label || placeholder || 'Number input'}
          className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-eco-500"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
