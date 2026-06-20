import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassButton } from '@/components/ui/GlassButton';

describe('GlassButton', () => {
  it('renders children text', () => {
    render(<GlassButton>Click Me</GlassButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<GlassButton onClick={onClick}>Click</GlassButton>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<GlassButton disabled onClick={onClick}>Click</GlassButton>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies primary variant class', () => {
    render(<GlassButton variant="primary">Primary</GlassButton>);
    const btn = screen.getByText('Primary').closest('button');
    expect(btn).toHaveClass('btn-primary');
  });

  it('applies secondary variant class', () => {
    render(<GlassButton variant="secondary">Secondary</GlassButton>);
    const btn = screen.getByText('Secondary').closest('button');
    expect(btn).toHaveClass('btn-secondary');
  });
});
