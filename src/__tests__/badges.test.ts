import { describe, it, expect, beforeEach } from 'vitest';
import { checkBadges, getEarnedBadges, getAllBadges, getBadgeProgress } from '@/lib/badges';
import { CarbonResult } from '@/types/calculator';
import { ChallengeState } from '@/types/challenges';
import { StorageAdapter } from '@/lib/storage';

const mockResult: CarbonResult = {
  id: 'test-1',
  timestamp: Date.now(),
  country: 'IN',
  breakdown: {
    electricity: 1000, carFuel: 500, publicTransport: 200,
    flights: 300, diet: 2500, waste: 200,
  },
  total: 4700,
  dailyAverage: 12.88,
  treesNeeded: 224,
  worldRank: 'Better than 50% of people worldwide',
  comparedToIndia: -30.56,
  comparedToWorld: 2.08,
  monthlyHistory: [],
};

const challengeState: ChallengeState = {
  isActive: false,
  startDate: null,
  weeklyGoal: 5,
  currentStreak: 0,
  longestStreak: 0,
  completedChallenges: 0,
  dailyCheckins: [],
  activeChallenge: null,
};

beforeEach(() => {
  localStorage.clear();
});

describe('checkBadges', () => {
  it('returns badges when conditions are met', () => {
    const newBadges = checkBadges(mockResult, challengeState, [mockResult]);
    expect(Array.isArray(newBadges)).toBe(true);
  });

  it('awards first-step badge on first calculation', () => {
    const newBadges = checkBadges(mockResult, challengeState, [mockResult]);
    expect(newBadges.some((b) => b.id === 'first-step')).toBe(true);
  });

  it('does not award first-step badge if already earned', () => {
    StorageAdapter.addBadge({ id: 'first-step', earnedAt: Date.now() });
    const newBadges = checkBadges(mockResult, challengeState, [mockResult]);
    expect(newBadges.some((b) => b.id === 'first-step')).toBe(false);
  });

  it('awards eco-starter for total < 3600', () => {
    const lowResult = { ...mockResult, total: 3000 };
    const newBadges = checkBadges(lowResult, challengeState, [lowResult]);
    expect(newBadges.some((b) => b.id === 'eco-starter')).toBe(true);
  });

  it('awards eco-warrior for total < 4800', () => {
    const lowResult = { ...mockResult, total: 4000 };
    const newBadges = checkBadges(lowResult, challengeState, [lowResult]);
    expect(newBadges.some((b) => b.id === 'eco-warrior')).toBe(true);
  });

  it('awards green-champion for 7+ day streak', () => {
    const streakState = { ...challengeState, currentStreak: 7 };
    const newBadges = checkBadges(mockResult, streakState, [mockResult]);
    expect(newBadges.some((b) => b.id === 'green-champion')).toBe(true);
  });

  it('awards challenge-master for 3+ completed challenges', () => {
    const challengeState2 = { ...challengeState, completedChallenges: 3 };
    const newBadges = checkBadges(mockResult, challengeState2, [mockResult]);
    expect(newBadges.some((b) => b.id === 'challenge-master')).toBe(true);
  });

  it('awards carbon-cutter for 10%+ reduction', () => {
    const oldResult = { ...mockResult, total: 6000 };
    const newResult = { ...mockResult, total: 4800 };
    const newBadges = checkBadges(newResult, challengeState, [oldResult, newResult]);
    expect(newBadges.some((b) => b.id === 'carbon-cutter')).toBe(true);
  });

  it('saves newly earned badges to storage', () => {
    const newBadges = checkBadges(mockResult, challengeState, [mockResult]);
    const stored = StorageAdapter.getBadges();
    newBadges.forEach((badge) => {
      expect(stored.some((s) => s.id === badge.id)).toBe(true);
    });
  });
});

describe('getEarnedBadges', () => {
  it('returns empty array when no badges earned', () => {
    const earned = getEarnedBadges();
    expect(earned).toHaveLength(0);
  });

  it('returns earned badges from storage', () => {
    StorageAdapter.addBadge({ id: 'first-step', earnedAt: Date.now() });
    const earned = getEarnedBadges();
    expect(earned).toHaveLength(1);
    expect(earned[0].id).toBe('first-step');
  });
});

describe('getAllBadges', () => {
  it('returns all badge definitions', () => {
    const all = getAllBadges();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0]).toHaveProperty('id');
    expect(all[0]).toHaveProperty('name');
    expect(all[0]).toHaveProperty('condition');
  });
});

describe('getBadgeProgress', () => {
  it('returns 0% progress when no badges earned', () => {
    const progress = getBadgeProgress();
    expect(progress.earned).toBe(0);
    expect(progress.total).toBeGreaterThan(0);
    expect(progress.percentage).toBe(0);
  });

  it('calculates percentage correctly', () => {
    StorageAdapter.addBadge({ id: 'first-step', earnedAt: Date.now() });
    const progress = getBadgeProgress();
    expect(progress.earned).toBe(1);
    expect(progress.percentage).toBe(Math.round((1 / progress.total) * 100));
  });
});
