import { getDb } from '@/lib/server/db';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  totalKg: number;
  badges: number;
  streak: number;
  country: string;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const broadcast = async () => {
        try {
          const db = await getDb();
          const raw = (await db.list('leaderboard')) as Record<string, unknown>[] | null;
          const leaderboard: LeaderboardEntry[] = (raw || [])
            .map((entry, i) => ({
              rank: i + 1,
              name: (entry.name as string) || 'Anonymous',
              avatar: (entry.avatar as string) || '🌍',
              totalKg: (entry.totalKg as number) || 0,
              badges: (entry.badges as number) || 0,
              streak: (entry.streak as number) || 0,
              country: (entry.country as string) || 'Global',
            }))
            .sort((a, b) => b.totalKg - a.totalKg)
            .map((entry, i) => ({ ...entry, rank: i + 1 }));

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ leaderboard })}\n\n`));
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'failed' })}\n\n`));
        }
      };

      broadcast();
      interval = setInterval(broadcast, 10000);

      controller.enqueue(encoder.encode('retry: 5000\n\n'));
    },
    cancel() {
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
