import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    // Clear the module state by importing fresh
  });

  it('should allow requests within limit', () => {
    const result1 = rateLimit('test-key', 3, 60000);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = rateLimit('test-key', 3, 60000);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = rateLimit('test-key', 3, 60000);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it('should block requests exceeding limit', () => {
    rateLimit('block-key', 2, 60000);
    rateLimit('block-key', 2, 60000);
    const result = rateLimit('block-key', 2, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should use separate keys independently', () => {
    rateLimit('key-a', 1, 60000);
    const aResult = rateLimit('key-a', 1, 60000);
    expect(aResult.allowed).toBe(false);

    const bResult = rateLimit('key-b', 1, 60000);
    expect(bResult.allowed).toBe(true);
  });

  it('should reset after window expires', async () => {
    rateLimit('reset-key', 1, 50);
    rateLimit('reset-key', 1, 50);
    await new Promise(r => setTimeout(r, 60));
    const result = rateLimit('reset-key', 1, 50);
    expect(result.allowed).toBe(true);
  });
});
