import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        reply: "AI is not configured. Set GEMINI_API_KEY in your .env file to enable smart recommendations.",
        source: 'offline'
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `You are VeloraAI, a friendly carbon footprint expert assistant for VeloraGreen. 
Your role is to help users understand and reduce their carbon footprint.

User's carbon context: ${JSON.stringify(context)}

Guidelines:
- Be concise, friendly, and encouraging
- Give specific, actionable advice with estimated CO₂ savings
- Use simple language
- If asked about specific data, reference their carbon breakdown if available
- Never share harmful advice
- Keep responses under 150 words
- Use emojis occasionally for warmth`;

    const result = await model.generateContent([systemPrompt, message]);
    const reply = result.response.text();

    return NextResponse.json({ reply, source: 'gemini-ai' });
  } catch (error) {
    console.error('[Chat Error]', error);
    return NextResponse.json({
      reply: "I'm having trouble connecting to my AI brain right now. Please try again in a moment! 🌱",
      source: 'error'
    });
  }
}
