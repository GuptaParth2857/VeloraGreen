import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';

const AVATARS = ['🌍', '🌱', '♻️', '🌿', '🌳', '🍃', '🌊', '☀️'];

const MESSAGES = [
  'completed the 5% Reduction Challenge',
  'earned the Green Warrior badge',
  'reduced their footprint by 10% this month',
  'started a Plant-Based Week challenge',
  'joined the community',
  'achieved a 7-day streak',
  'completed the Energy Saver challenge',
  'earned the Eco Champion badge',
  'reduced transport emissions by 15%',
  'planted a tree through our offset program',
  'reached the top 10 on the leaderboard',
  'completed their first carbon calculation',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET() {
  try {
    const db = await getDb();
    const users = (await db.list('users')) as Array<{ name: string }> | null;
    let feed;

    if (users && users.length > 0) {
      feed = users.slice(0, 8).map((user, i) => ({
        id: `feed-${i}`,
        type: pick(['challenge', 'badge', 'milestone', 'reduction'] as const),
        user: user.name,
        avatar: AVATARS[i % AVATARS.length],
        message: pick(MESSAGES),
        timestamp: `${Math.floor(Math.random() * 59) + 1}m ago`,
      }));
    } else {
      // Seed sample data if no users exist
      const sampleNames = ['EcoWarrior', 'GreenPioneer', 'CarbonCrusher', 'EarthGuardian', 'NetZeroNinja'];
      feed = sampleNames.map((name, i) => ({
        id: `feed-${i}`,
        type: pick(['challenge', 'badge', 'milestone', 'reduction'] as const),
        user: name,
        avatar: AVATARS[i % AVATARS.length],
        message: pick(MESSAGES),
        timestamp: `${Math.floor(Math.random() * 59) + 1}m ago`,
      }));
    }

    return NextResponse.json({ feed });
  } catch {
    return NextResponse.json({ feed: [] });
  }
}
