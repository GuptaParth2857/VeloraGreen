import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn().mockResolvedValue({ userId: 'test-user', email: 'test@test.com' }),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimitMiddleware: vi.fn(() => ({ allowed: true, remaining: 9, resetAt: Date.now() + 60000, headers: {} })),
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

describe('Recommendations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 without session', async () => {
    const auth = await import('@/lib/auth');
    vi.mocked(auth.getSession).mockResolvedValueOnce(null);

    const { POST } = await import('@/app/api/recommendations/ai/route');
    const request = new Request('http://localhost/api/recommendations/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breakdown: { electricity: 5000 } }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid breakdown', async () => {
    const { POST } = await import('@/app/api/recommendations/ai/route');
    const request = new Request('http://localhost/api/recommendations/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breakdown: 'invalid' }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('should return 400 for empty breakdown object', async () => {
    const { POST } = await import('@/app/api/recommendations/ai/route');
    const request = new Request('http://localhost/api/recommendations/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breakdown: {} }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('should return 400 for negative values in breakdown', async () => {
    const { POST } = await import('@/app/api/recommendations/ai/route');
    const request = new Request('http://localhost/api/recommendations/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breakdown: { electricity: -100 } }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('should return rule-based fallback without Gemini key', async () => {
    const { POST } = await import('@/app/api/recommendations/ai/route');
    const request = new Request('http://localhost/api/recommendations/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breakdown: { electricity: 5000, carFuel: 3000 } }),
    });
    const response = await POST(request as any);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.source).toBe('rule-based');
    expect(Array.isArray(data.recommendations)).toBe(true);
  });

  it('should validate total value range', async () => {
    const { POST } = await import('@/app/api/recommendations/ai/route');
    const request = new Request('http://localhost/api/recommendations/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breakdown: { electricity: 5000 }, total: 999999999 }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });
});
