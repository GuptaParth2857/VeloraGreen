import { NextRequest } from 'next/server';
import { getDb } from '@/lib/server/db';
import { ok, err } from '@/lib/server/api-helpers';
import { WEEKLY_CHALLENGES } from '@/types/challenges';

export async function GET() {
  try {
    return ok({ challenges: WEEKLY_CHALLENGES });
  } catch {
    return err('Failed to fetch challenges', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, challengeId, action } = body;

    if (!userId || !challengeId || !action) {
      return err('userId, challengeId, and action are required');
    }

    const challenge = WEEKLY_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) {
      return err('Challenge not found', 404);
    }

    const db = getDb();
    const key = `progress-${userId}-${challengeId}`;
    const existing = await db.get<{
      userId: string; challengeId: string; progress: number;
      startedAt: number; completed: boolean;
    }>('challengeProgress', key);

    const challengeData = existing as {
      userId: string; challengeId: string; progress: number;
      startedAt: number; completed: boolean;
    } | null;

    if (action === 'start') {
      if (challengeData) {
        return err('Challenge already started', 409);
      }
      await db.set('challengeProgress', key, {
        userId,
        challengeId,
        progress: 0,
        startedAt: Date.now(),
        completed: false,
      });
      return ok({ message: 'Challenge started' }, 201);
    }

    if (action === 'checkin') {
      if (!challengeData) {
        return err('Challenge not started', 404);
      }
      challengeData.progress = Math.min(challengeData.progress + 1, 7);
      if (challengeData.progress >= 7) {
        challengeData.completed = true;
      }
      await db.set('challengeProgress', key, challengeData);
      return ok({ message: 'Check-in recorded', progress: challengeData.progress, completed: challengeData.completed });
    }

    return err('Invalid action', 400);
  } catch {
    return err('Failed to process challenge', 500);
  }
}
