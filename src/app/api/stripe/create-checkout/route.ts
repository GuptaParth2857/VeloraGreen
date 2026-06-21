import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { trees, amount } = await request.json();

    if (!stripeSecret) {
      return NextResponse.json({
        url: '/dashboard?offset=mock-success&trees=' + (trees || 1)
      });
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24.acacia' as any });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Plant ${trees || 1} Tree${trees > 1 ? 's' : ''}`,
            description: `Carbon offset: ${((trees || 1) * 21).toFixed(0)} kg CO₂ absorbed`,
            images: [],
          },
          unit_amount: Math.round((amount || 1) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?offset=success&trees=${trees || 1}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?offset=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe Error]', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
