import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizeContextValue } from '@/lib/sanitize';
import { rateLimitMiddleware, getClientIp } from '@/lib/rate-limit';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const AI_RATE_LIMIT = 10;
const AI_RATE_WINDOW_MS = 60000;

const ALLOWED_CATEGORIES = new Set([
  'electricity', 'carFuel', 'flights', 'diet', 'waste', 'publicTransport', 'general'
]);

const VALID_PRIORITIES = new Set(['high', 'medium', 'low']);

function getFallbackRecommendations(breakdown: Record<string, number>) {
  const recs: Array<{
    title: string; description: string; category: string; saving: string; priority: string;
  }> = [];

  const categories: Record<string, { label: string; tips: string[] }> = {
    electricity: {
      label: 'Electricity',
      tips: [
        'Switch to LED bulbs — 75% less energy than incandescent',
        'Unplug electronics when not in use to avoid phantom load',
        'Use smart power strips to cut standby power by 10%',
      ],
    },
    carFuel: {
      label: 'Car Fuel',
      tips: [
        'Maintain proper tire pressure — improves fuel efficiency by 3%',
        'Avoid aggressive acceleration and braking',
        'Consider carpooling to reduce emissions by 50% per trip',
      ],
    },
    flights: {
      label: 'Flights',
      tips: [
        'Choose direct flights — takeoffs consume most fuel',
        'Opt for train travel on short-haul routes',
        'Purchase carbon offsets for unavoidable flights',
      ],
    },
    diet: {
      label: 'Diet',
      tips: [
        'Try Meatless Monday — one day without meat saves 0.5 kg CO₂',
        'Buy local and seasonal produce',
        'Reduce food waste by meal planning',
      ],
    },
  };

  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  for (const [cat, val] of sorted.slice(0, 3)) {
    const info = categories[cat];
    if (!info || val < 100) continue;
    recs.push({
      title: `Reduce Your ${info.label}`,
      description: info.tips.join('. '),
      category: cat,
      saving: `${(val * 0.2).toFixed(0)} kg/year`,
      priority: val > 2000 ? 'high' : 'medium',
    });
  }

  return recs;
}

function validateBreakdown(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return false;
  for (const [k, v] of entries) {
    if (typeof k !== 'string' || k.length > 50) return false;
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1000000) return false;
  }
  return true;
}

function validateRecommendationShape(rec: unknown): boolean {
  if (!rec || typeof rec !== 'object') return false;
  const r = rec as Record<string, unknown>;
  return (
    typeof r.title === 'string' && r.title.length <= 200 &&
    typeof r.description === 'string' && r.description.length <= 1000 &&
    typeof r.category === 'string' && ALLOWED_CATEGORIES.has(r.category) &&
    typeof r.saving === 'number' && Number.isFinite(r.saving) && r.saving >= 0 &&
    typeof r.priority === 'string' && VALID_PRIORITIES.has(r.priority)
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = rateLimitMiddleware(`recommendations:${ip}`, AI_RATE_LIMIT, AI_RATE_WINDOW_MS);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: rateLimitResult.headers });
    }

    const { breakdown, total, lifestyle } = await request.json();

    if (!validateBreakdown(breakdown)) {
      return NextResponse.json(
        { error: 'Invalid carbon breakdown data' },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    if (total !== undefined && total !== null && (typeof total !== 'number' || !Number.isFinite(total) || total < 0 || total > 1000000)) {
      return NextResponse.json(
        { error: 'Invalid total value' },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    const safeBreakdown = sanitizeContextValue(breakdown) as Record<string, number>;
    const safeLifestyle = lifestyle ? sanitizeContextValue(lifestyle) : null;

    if (!GEMINI_API_KEY) {
      const fallback = getFallbackRecommendations(safeBreakdown);
      return NextResponse.json(
        { recommendations: fallback, source: 'rule-based' },
        { headers: rateLimitResult.headers }
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `You are a carbon footprint expert. Your ONLY role is to provide carbon reduction recommendations.

Carbon Breakdown (kg/year):
${Object.entries(safeBreakdown).map(([k, v]) => `- ${k}: ${v} kg`).join('\n')}
Total: ${total ?? 'N/A'} kg/year
${safeLifestyle ? `Lifestyle: ${JSON.stringify(safeLifestyle)}` : ''}

For each recommendation, provide:
1. title - Short action-oriented title
2. description - Specific, actionable tip with estimated CO₂ savings
3. category - One of: electricity, carFuel, flights, diet, waste, publicTransport, general
4. saving - Estimated annual saving in kg CO₂ (as a number)
5. priority - "high", "medium", or "low" based on impact

Return ONLY valid JSON array format, no markdown:
[{"title":"...","description":"...","category":"...","saving":123,"priority":"high"},...]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const recommendations = Array.isArray(parsed) ? parsed.filter(validateRecommendationShape) : [];

      return NextResponse.json(
        { recommendations, source: 'gemini-ai' },
        { headers: rateLimitResult.headers }
      );
    } catch (aiError) {
      console.error('[Gemini API Error]', aiError);
      const fallback = getFallbackRecommendations(safeBreakdown);
      return NextResponse.json(
        { recommendations: fallback, source: 'rule-based' },
        { headers: rateLimitResult.headers }
      );
    }
  } catch (error) {
    console.error('[AI Recommendations Error]', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
