import { create } from 'zustand';
import { CalculatorFormData, DEFAULT_CALCULATOR_DATA, CarbonResult } from '@/types/calculator';
import { ChallengeState } from '@/types/challenges';
import { EarnedBadge } from '@/types/badges';
import { UserSettings } from '@/types/common';
import { StorageAdapter } from '@/lib/storage';

interface AppState {
  // Calculator
  calculatorData: CalculatorFormData;
  currentStep: number;
  updateCalculatorData: (data: Partial<CalculatorFormData>) => void;
  setStep: (step: number) => void;
  resetCalculator: () => void;

  // Results
  currentResult: CarbonResult | null;
  calculationHistory: CarbonResult[];
  setResult: (result: CarbonResult) => void;
  loadHistory: () => void;

  // Badges
  earnedBadges: EarnedBadge[];
  newBadge: EarnedBadge | null;
  setNewBadge: (badge: EarnedBadge | null) => void;

  // Challenge
  challenge: ChallengeState;
  setChallenge: (state: ChallengeState) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // UI
  isLoaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Calculator
  calculatorData: DEFAULT_CALCULATOR_DATA,
  currentStep: 0,
  updateCalculatorData: (data) =>
    set((state) => ({
      calculatorData: { ...state.calculatorData, ...data },
    })),
  setStep: (step) => set({ currentStep: step }),
  resetCalculator: () =>
    set({
      calculatorData: DEFAULT_CALCULATOR_DATA,
      currentStep: 0,
    }),

  // Results
  currentResult: null,
  calculationHistory: [],
  setResult: (result) => {
    StorageAdapter.addCalculation(result);
    set((state) => ({
      currentResult: result,
      calculationHistory: [...state.calculationHistory, result],
    }));
  },
  loadHistory: () => {
    const history = StorageAdapter.getCalculations();
    const current = StorageAdapter.getCurrentCalculation();
    set({
      calculationHistory: history,
      currentResult: current,
    });
  },

  // Badges
  earnedBadges: StorageAdapter.getBadges(),
  newBadge: null,
  setNewBadge: (badge) => set({ newBadge: badge }),

  // Challenge
  challenge: StorageAdapter.getChallengeState(),
  setChallenge: (state) => {
    StorageAdapter.setChallengeState(state);
    set({ challenge: state });
  },

  // Settings
  settings: StorageAdapter.getSettings(),
  updateSettings: (newSettings) => {
    const settings = { ...get().settings, ...newSettings };
    StorageAdapter.setSettings(settings);
    set({ settings });
  },

  // UI
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));
