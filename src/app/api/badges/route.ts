import { NextRequest } from 'next/server';
import { ALL_BADGES, BadgeCheckData } from '@/types/badges';
import { ok, err } from '@/lib/server/api-helpers';

export async function GET() {
  return ok({ badges: ALL_BADGES, total: ALL_BADGES.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkData, earnedBadgeIds } = body as {
      checkData: BadgeCheckData;
      earnedBadgeIds: string[];
    };

    if (!checkData) {
      return err('Badge check data is required');
    }

    const newBadges = ALL_BADGES.filter(
      badge => !earnedBadgeIds.includes(badge.id) && badge.condition(checkData)
    );

    return ok({
      newBadges: newBadges.map(b => ({ id: b.id, earnedAt: Date.now() })),
      count: newBadges.length,
    });
  } catch {
    return err('Failed to check badges', 500);
  }
}
