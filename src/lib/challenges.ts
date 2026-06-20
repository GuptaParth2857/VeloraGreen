import { ChallengeState, Challenge, WEEKLY_CHALLENGES } from '@/types/challenges';
import { StorageAdapter } from './storage';

export function getChallengeState(): ChallengeState {
  return StorageAdapter.getChallengeState();
}

export function startChallenge(challenge: Challenge): ChallengeState {
  const state: ChallengeState = {
    ...getChallengeState(),
    isActive: true,
    startDate: Date.now(),
    activeChallenge: challenge,
    dailyCheckins: [],
  };
  StorageAdapter.setChallengeState(state);
  return state;
}

export function checkInToday(emissions: number): ChallengeState {
  const state = getChallengeState();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already checked in today
  const existingCheckin = state.dailyCheckins.find(c => c.date === today);
  if (existingCheckin) {
    existingCheckin.completed = true;
    existingCheckin.emissions = emissions;
  } else {
    state.dailyCheckins.push({
      date: today,
      completed: true,
      emissions,
    });
  }
  
  // Update streak
  const completedDays = state.dailyCheckins.filter(c => c.completed).length;
  state.currentStreak = calculateCurrentStreak(state.dailyCheckins);
  state.longestStreak = Math.max(state.longestStreak, state.currentStreak);
  
  // Check if challenge completed (7 days)
  if (completedDays >= 7) {
    state.completedChallenges++;
    state.isActive = false;
    state.activeChallenge = null;
  }
  
  StorageAdapter.setChallengeState(state);
  return state;
}

function calculateCurrentStreak(checkins: { date: string; completed: boolean }[]): number {
  const sortedCheckins = [...checkins]
    .filter(c => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedCheckins.length === 0) return 0;
  
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCheckin = new Date(sortedCheckins[0].date);
  lastCheckin.setHours(0, 0, 0, 0);
  
  // Check if last checkin is today or yesterday
  const diffDays = Math.floor((today.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;
  
  for (let i = 1; i < sortedCheckins.length; i++) {
    const currentDate = new Date(sortedCheckins[i - 1].date);
    const prevDate = new Date(sortedCheckins[i].date);
    
    const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getAvailableChallenges(): Challenge[] {
  return WEEKLY_CHALLENGES;
}

export function getWeeklyProgress(): { daysCompleted: number; totalDays: number } {
  const state = getChallengeState();
  const completedDays = state.dailyCheckins.filter(c => c.completed).length;
  return {
    daysCompleted: Math.min(completedDays, 7),
    totalDays: 7,
  };
}

export function isChallengeActive(): boolean {
  return getChallengeState().isActive;
}

export function getChallengeProgress(): number {
  const state = getChallengeState();
  if (!state.isActive) return 0;
  
  const completedDays = state.dailyCheckins.filter(c => c.completed).length;
  return Math.round((completedDays / 7) * 100);
}

export function setWeeklyGoal(kg: number): ChallengeState {
  const state = getChallengeState();
  state.weeklyGoal = kg;
  StorageAdapter.setChallengeState(state);
  return state;
}
