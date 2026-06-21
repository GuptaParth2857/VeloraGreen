import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/server/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const teams = await db.list('teams');
    return NextResponse.json({ teams });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, goal, targetReduction, duration } = await request.json();
    if (!name || !goal) {
      return NextResponse.json({ error: 'name and goal are required' }, { status: 400 });
    }

    const db = getDb();
    const id = `team-${Date.now()}`;
    await db.set('teams', id, {
      id,
      name,
      goal,
      targetReduction: targetReduction || 10,
      duration: duration || 30,
      createdBy: session.userId,
      members: [session.userId],
      totalReduction: 0,
      createdAt: Date.now(),
      inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    } as Record<string, unknown>);

    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
