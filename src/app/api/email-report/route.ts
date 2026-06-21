import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/server/db';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, frequency } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const db = getDb();
    await db.set('email_subscriptions', `sub-${session.userId}`, {
      id: `sub-${session.userId}`,
      userId: session.userId,
      email,
      frequency: frequency || 'weekly',
      subscribedAt: Date.now(),
      lastSent: null,
    } as Record<string, unknown>);

    // If Resend is configured, send a test email
    if (RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);

        await resend.emails.send({
          from: 'VeloraGreen <reports@veloragreen.com>',
          to: email,
          subject: 'Welcome to VeloraGreen Weekly Reports! 🌱',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌍 VeloraGreen</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your Weekly Carbon Report</p>
              </div>
              <div style="background: #0a1612; padding: 30px; border-radius: 0 0 16px 16px;">
                <p style="color: #e2e8f0; line-height: 1.6;">Hi there! 👋</p>
                <p style="color: #94a3b8; line-height: 1.6;">
                  You've successfully subscribed to weekly carbon footprint reports. 
                  You'll receive a detailed analysis of your carbon emissions every week, 
                  along with personalized tips to help you reduce your environmental impact.
                </p>
                <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <p style="color: #22c55e; font-weight: bold; margin: 0 0 8px;">📊 What to Expect:</p>
                  <p style="color: #94a3b8; margin: 4px 0;">• Weekly carbon footprint summary</p>
                  <p style="color: #94a3b8; margin: 4px 0;">• Progress tracking and trends</p>
                  <p style="color: #94a3b8; margin: 4px 0;">• Personalized reduction tips</p>
                  <p style="color: #94a3b8; margin: 4px 0;">• Community comparisons</p>
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                  VeloraGreen — Track. Reduce. Offset.<br>
                  <a href="https://veloragreen.com" style="color: #22c55e;">veloragreen.com</a>
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('[Email Error]', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: RESEND_API_KEY
        ? 'Subscribed! Check your email for confirmation.'
        : 'Subscription saved! Configure RESEND_API_KEY for email delivery.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
