import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const db = getDb();
    const users = await db.list<{ id: string; email: string; name: string; password: string; avatar: string }>('users');

    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await createSession({ id: user.id, email: user.email });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
