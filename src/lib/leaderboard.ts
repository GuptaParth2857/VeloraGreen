import { LeaderboardEntry, MOCK_LEADERBOARD } from '@/types/leaderboard';
import { StorageAdapter } from './storage';

export function getLeaderboard(): LeaderboardEntry[] {
  const current = StorageAdapter.getCurrentCalculation();
  const entries = [...MOCK_LEADERBOARD];
  
  if (current) {
    const userEntry: LeaderboardEntry = {
      rank: 0,
      name: 'You',
      avatar: '👤',
      totalKg: Math.round(current.total),
      badges: StorageAdapter.getBadges().length,
      streak: StorageAdapter.getChallengeState().currentStreak,
      country: current.country,
      isUser: true,
    };
    
    entries.push(userEntry);
    entries.sort((a, b) => a.totalKg - b.totalKg);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  }
  
  return entries;
}

export function getUserRank(): number {
  const leaderboard = getLeaderboard();
  const userEntry = leaderboard.find(entry => entry.isUser);
  return userEntry?.rank || leaderboard.length + 1;
}

export function getTopThree(): LeaderboardEntry[] {
  return getLeaderboard().slice(0, 3);
}

export function getPercentile(totalKg: number): number {
  const allEntries = [...MOCK_LEADERBOARD].sort((a, b) => a.totalKg - b.totalKg);
  const rank = allEntries.findIndex(entry => totalKg <= entry.totalKg);
  if (rank === -1) return 100;
  return Math.round((rank / allEntries.length) * 100);
}
