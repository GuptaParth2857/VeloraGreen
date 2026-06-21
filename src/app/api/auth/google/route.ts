import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();
    if (!credential) {
      return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
    }

    const tokenParts = credential.split('.');
    if (tokenParts.length !== 3) {
      return NextResponse.json({ error: 'Invalid credential format' }, { status: 400 });
    }

    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.json({ error: 'Email not provided by Google' }, { status: 400 });
    }

    const db = getDb();
    const users = await db.list<{
      id: string; email: string; name: string; googleId?: string; avatar: string;
    }>('users');

    let user = users.find(u => u.email === email);

    if (!user) {
      const id = `google-${googleId}`;
      await db.set('users', id, {
        id, email, name: name || email.split('@')[0],
        googleId, avatar: picture || '👤',
        createdAt: Date.now(),
      } as Record<string, unknown>);
      user = { id, email, name: name || email.split('@')[0], avatar: picture || '👤' };
    } else if (!user.googleId) {
      await db.set('users', user.id, {
        ...user, googleId,
      } as Record<string, unknown>);
    }

    await createSession({ id: user.id, email: user.email });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: picture || user.avatar },
    });
  } catch (error) {
    console.error('[Google Auth Error]', error);
    return NextResponse.json({ error: 'Google authentication failed' }, { status: 500 });
  }
}
