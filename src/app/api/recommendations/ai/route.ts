import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

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

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { breakdown, total, lifestyle } = await request.json();

    if (!breakdown || typeof breakdown !== 'object') {
      return NextResponse.json({ error: 'Carbon breakdown data is required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      const fallback = getFallbackRecommendations(breakdown);
      return NextResponse.json({ recommendations: fallback, source: 'rule-based' });
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `You are a carbon footprint expert. Given this user's carbon data, provide 3 personalized recommendations.

Carbon Breakdown (kg/year):
${Object.entries(breakdown).map(([k, v]) => `- ${k}: ${v} kg`).join('\n')}
Total: ${total} kg/year
${lifestyle ? `Lifestyle: ${JSON.stringify(lifestyle)}` : ''}

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
      const recommendations = JSON.parse(cleaned);

      return NextResponse.json({ recommendations, source: 'gemini-ai' });
    } catch (aiError) {
      console.error('[Gemini API Error]', aiError);
      const fallback = getFallbackRecommendations(breakdown);
      return NextResponse.json({ recommendations: fallback, source: 'rule-based' });
    }
  } catch (error) {
    console.error('[AI Recommendations Error]', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
