import { BadgeDefinition, BadgeCheckData, ALL_BADGES } from '@/types/badges';
import { CarbonResult } from '@/types/calculator';
import { ChallengeState } from '@/types/challenges';
import { StorageAdapter } from './storage';

export function checkBadges(
  result: CarbonResult,
  challengeState: ChallengeState,
  history: CarbonResult[]
): BadgeDefinition[] {
  const earnedBadges = StorageAdapter.getBadges();
  const earnedIds = earnedBadges.map(b => b.id);
  
  const checkData: BadgeCheckData = {
    totalEmissions: result.total,
    calculationCount: history.length,
    currentStreak: challengeState.currentStreak,
    completedChallenges: challengeState.completedChallenges,
    categoriesBelowAverage: getCategoriesBelowAverage(result),
    hasRecycled: result.breakdown.waste < 400,
    hasComposted: result.breakdown.waste < 300,
    isVegan: result.breakdown.diet < 1600,
    usesPublicTransport: result.breakdown.publicTransport > result.breakdown.carFuel,
    reductionFromFirst: getReductionPercent(history),
  };

  const newlyEarned = ALL_BADGES.filter(
    badge => !earnedIds.includes(badge.id) && badge.condition(checkData)
  );

  // Save newly earned badges
  newlyEarned.forEach(badge => {
    StorageAdapter.addBadge({
      id: badge.id,
      earnedAt: Date.now(),
    });
  });

  return newlyEarned;
}

function getCategoriesBelowAverage(result: CarbonResult): number {
  const averageMonthly = 400;
  const breakdown = result.breakdown;
  let count = 0;
  
  Object.values(breakdown).forEach(value => {
    if (value / 12 < averageMonthly / 6) count++;
  });
  
  return count;
}

function getReductionPercent(history: CarbonResult[]): number {
  if (history.length < 2) return 0;
  
  const first = history[0].total;
  const latest = history[history.length - 1].total;
  
  if (first === 0) return 0;
  return Math.max(0, ((first - latest) / first) * 100);
}

export function getEarnedBadges(): BadgeDefinition[] {
  const earned = StorageAdapter.getBadges();
  const earnedIds = earned.map(b => b.id);
  return ALL_BADGES.filter(badge => earnedIds.includes(badge.id));
}

export function getAllBadges(): BadgeDefinition[] {
  return ALL_BADGES;
}

export function getBadgeProgress(): { earned: number; total: number; percentage: number } {
  const earned = getEarnedBadges().length;
  const total = ALL_BADGES.length;
  return {
    earned,
    total,
    percentage: Math.round((earned / total) * 100),
  };
}
