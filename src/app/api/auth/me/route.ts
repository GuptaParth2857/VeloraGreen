import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/server/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const db = getDb();
    const users = await db.list<{ id: string; email: string; name: string; avatar: string }>('users');
    const user = users.find(u => u.id === session.userId);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
