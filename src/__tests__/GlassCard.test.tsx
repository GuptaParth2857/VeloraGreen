import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '@/components/ui/GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Card Content</GlassCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies hover class by default', () => {
    const { container } = render(<GlassCard>Hover Card</GlassCard>);
    expect(container.firstChild).toHaveClass('glass-hover');
  });

  it('does not apply hover class when hover is false', () => {
    const { container } = render(<GlassCard hover={false}>No Hover</GlassCard>);
    expect(container.firstChild).not.toHaveClass('glass-hover');
  });
});
