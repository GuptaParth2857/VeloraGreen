import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

vi.mock('@/lib/sanitize', () => ({
  sanitizeInput: vi.fn((s: string) => s),
  sanitizeContextValue: vi.fn((v: unknown) => v),
  filterAIOutput: vi.fn((s: string) => ({ safe: true, sanitized: s })),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimitMiddleware: vi.fn(() => ({ allowed: true, remaining: 19, resetAt: Date.now() + 60000, headers: {} })),
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

describe('Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Great question! Here are some tips to reduce your carbon footprint...' },
    });
  });

  it('should reject empty messages', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    });
    const response = await POST(request as any);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Message is required');
  });

  it('should reject non-string messages', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 123 }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('should return valid response for valid message', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How can I reduce my footprint?' }),
    });
    const response = await POST(request as any);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.reply).toBeDefined();
    expect(typeof data.reply).toBe('string');
  });

  it('should pass context when provided', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How am I doing?',
        context: { total: 5000, breakdown: { electricity: 2000, carFuel: 3000 }, country: 'US' },
      }),
    });
    const response = await POST(request as any);
    expect(response.status).toBe(200);
  });
});
