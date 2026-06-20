import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'email, password, and name are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const db = getDb();
    const users = await db.list<{ id: string; email: string }>('users');
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const hashedPassword = await hashPassword(password);

    await db.set('users', id, {
      id, email, name,
      password: hashedPassword,
      avatar: '👤',
      createdAt: Date.now(),
    });

    await createSession({ id, email });

    return NextResponse.json({ user: { id, email, name, avatar: '👤' } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
