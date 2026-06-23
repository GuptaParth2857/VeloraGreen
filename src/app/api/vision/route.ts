import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSession } from '@/lib/auth';
import { rateLimitMiddleware, getClientIp } from '@/lib/rate-limit';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = rateLimitMiddleware(`vision:${ip}`, 5, 60000);
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

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini AI is not configured' },
        { status: 500, headers: rateLimitResult.headers }
      );
    }

    const { image, type } = await request.json();
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    let prompt: string;
    if (type === 'food') {
      prompt = `Analyze this food image and estimate its carbon footprint. 
Respond in JSON format ONLY (no markdown):
{
  "foodName": "name of the food item",
  "category": "vegan|vegetarian|meat|dairy|processed",
  "estimatedCO2Kg": <number in kg CO2e>,
  "explanation": "brief 1-line explanation of the estimate",
  "greenerAlternative": "a lower-carbon alternative suggestion"
}`;
    } else if (type === 'receipt') {
      prompt = `Analyze this receipt image. Identify items that have a significant carbon footprint.
Respond in JSON format ONLY (no markdown):
{
  "items": [
    {"name": "item name", "category": "food|electronics|clothing|other", "estimatedCO2Kg": <number>}
  ],
  "totalEstimatedCO2": <number>,
  "tip": "one tip to reduce carbon footprint from these purchases"
}`;
    } else {
      prompt = `Analyze this image and estimate its carbon footprint or environmental impact.
Respond in JSON format ONLY (no markdown):
{
  "description": "brief description of what's in the image",
  "estimatedImpact": "low|medium|high",
  "explanation": "brief explanation",
  "tip": "relevant environmental tip"
}`;
    }

    const result = await model.generateContent([
      { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
      prompt,
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const analysis = JSON.parse(cleaned);

    return NextResponse.json(
      { analysis, source: 'gemini-vision' },
      { headers: rateLimitResult.headers }
    );
  } catch (error) {
    console.error('[Vision API Error]', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
