'use client';

import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface GlassSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function GlassSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className,
}: GlassSelectProps) {
  const selectId = label ? `glass-select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined;
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label || placeholder}
        className="glass-input w-full px-4 py-3 rounded-xl text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-eco-500 appearance-none cursor-pointer"
      >
        <option value="" className="bg-gray-900 text-white">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-gray-900 text-white"
          >
            {option.icon && `${option.icon} `}
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
