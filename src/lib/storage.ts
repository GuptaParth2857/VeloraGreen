import { CarbonResult } from '@/types/calculator';
import { EarnedBadge } from '@/types/badges';
import { ChallengeState, DEFAULT_CHALLENGE_STATE } from '@/types/challenges';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/common';

const STORAGE_KEYS = {
  CALCULATIONS: 'veloragreen-calculations',
  CURRENT: 'veloragreen-current',
  BADGES: 'veloragreen-badges',
  CHALLENGES: 'veloragreen-challenges',
  SETTINGS: 'veloragreen-settings',
  ONBOARDING: 'veloragreen-onboarding',
} as const;

export class StorageAdapter {
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  static getCalculations(): CarbonResult[] {
    return this.get<CarbonResult[]>(STORAGE_KEYS.CALCULATIONS) || [];
  }

  static addCalculation(result: CarbonResult): void {
    const calculations = this.getCalculations();
    calculations.push(result);
    this.set(STORAGE_KEYS.CALCULATIONS, calculations);
    this.set(STORAGE_KEYS.CURRENT, result);
  }

  static getCurrentCalculation(): CarbonResult | null {
    return this.get<CarbonResult>(STORAGE_KEYS.CURRENT);
  }

  static setCurrentCalculation(result: CarbonResult): void {
    this.set(STORAGE_KEYS.CURRENT, result);
  }

  static getBadges(): EarnedBadge[] {
    return this.get<EarnedBadge[]>(STORAGE_KEYS.BADGES) || [];
  }

  static addBadge(badge: EarnedBadge): void {
    const badges = this.getBadges();
    if (!badges.find(b => b.id === badge.id)) {
      badges.push(badge);
      this.set(STORAGE_KEYS.BADGES, badges);
    }
  }

  static getChallengeState(): ChallengeState {
    return this.get<ChallengeState>(STORAGE_KEYS.CHALLENGES) || DEFAULT_CHALLENGE_STATE;
  }

  static setChallengeState(state: ChallengeState): void {
    this.set(STORAGE_KEYS.CHALLENGES, state);
  }

  static getSettings(): UserSettings {
    return this.get<UserSettings>(STORAGE_KEYS.SETTINGS) || DEFAULT_SETTINGS;
  }

  static setSettings(settings: UserSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  static hasCompletedOnboarding(): boolean {
    return this.get<boolean>(STORAGE_KEYS.ONBOARDING) || false;
  }

  static completeOnboarding(): void {
    this.set(STORAGE_KEYS.ONBOARDING, true);
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => this.remove(key));
  }
}
