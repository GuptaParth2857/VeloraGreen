import { NextRequest } from 'next/server';
import { getDb } from '@/lib/server/db';
import { ok, err } from '@/lib/server/api-helpers';

export async function GET(_request: NextRequest) {
  try {
    const db = getDb();
    const entries = await db.list<{
      id: string; name: string; avatar: string; totalKg: number;
      badges: number; streak: number; country: string;
    }>('leaderboard');

    entries.sort((a, b) => a.totalKg - b.totalKg);

    const ranked = entries.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      avatar: entry.avatar,
      totalKg: entry.totalKg,
      badges: entry.badges,
      streak: entry.streak,
      country: entry.country,
    }));

    return ok({ leaderboard: ranked, total: ranked.length });
  } catch {
    return err('Failed to fetch leaderboard', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, totalKg, badges, streak } = body;

    if (!userId || totalKg == null) {
      return err('userId and totalKg are required');
    }

    const db = getDb();
    await db.set('leaderboard', userId, {
      id: userId,
      name: body.name || 'Anonymous',
      avatar: body.avatar || '👤',
      totalKg,
      badges: badges || 0,
      streak: streak || 0,
      country: body.country || 'IN',
    });

    return ok({ message: 'Score updated' }, 201);
  } catch {
    return err('Failed to update leaderboard', 500);
  }
}
