import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassInput } from '@/components/ui/GlassInput';

describe('GlassInput', () => {
  it('renders label when provided', () => {
    render(<GlassInput label="Test Label" value={0} onChange={() => {}} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders unit when provided', () => {
    render(<GlassInput label="Energy" value={100} onChange={() => {}} unit="kWh" />);
    expect(screen.getByText('kWh')).toBeInTheDocument();
  });

  it('calls onChange with new value', () => {
    const onChange = vi.fn();
    render(<GlassInput label="Input" value={0} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42);
  });
});
