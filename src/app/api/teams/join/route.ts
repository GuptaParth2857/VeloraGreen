import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/server/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteCode } = await request.json();
    if (!inviteCode) {
      return NextResponse.json({ error: 'inviteCode is required' }, { status: 400 });
    }

    const db = getDb();
    const teams = await db.list<{ id: string; inviteCode: string; members: string[]; name: string }>('teams');
    const team = teams.find(t => t.inviteCode === inviteCode);

    if (!team) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    if (team.members.includes(session.userId)) {
      return NextResponse.json({ error: 'Already a member' }, { status: 409 });
    }

    team.members.push(session.userId);
    await db.set('teams', team.id, team as Record<string, unknown>);

    return NextResponse.json({ team: { id: team.id, name: team.name } });
  } catch {
    return NextResponse.json({ error: 'Failed to join team' }, { status: 500 });
  }
}
