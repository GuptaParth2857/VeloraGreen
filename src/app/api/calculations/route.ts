import { NextRequest } from 'next/server';
import { getDb } from '@/lib/server/db';
import { ok, err } from '@/lib/server/api-helpers';

export async function GET(_request: NextRequest) {
  try {
    const db = getDb();
    const calculations = await db.list('calculations');
    return ok({ calculations, total: calculations.length });
  } catch {
    return err('Failed to fetch calculations', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, result } = body;

    if (!result) {
      return err('Calculation result is required');
    }

    const db = getDb();
    const id = `calc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await db.set('calculations', id, {
      id,
      userId: userId || 'anonymous',
      result,
      timestamp: Date.now(),
    });

    return ok({ message: 'Calculation saved', id }, 201);
  } catch {
    return err('Failed to save calculation', 500);
  }
}
