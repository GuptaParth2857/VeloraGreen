export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  targetReduction: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChallengeState {
  isActive: boolean;
  startDate: number | null;
  weeklyGoal: number;
  currentStreak: number;
  longestStreak: number;
  completedChallenges: number;
  dailyCheckins: DailyCheckin[];
  activeChallenge: Challenge | null;
}

export interface DailyCheckin {
  date: string;
  completed: boolean;
  emissions?: number;
}

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'reduce-5',
    title: '5% Reduction Challenge',
    description: 'Reduce your carbon footprint by 5% this week',
    category: 'general',
    targetReduction: 5,
    duration: 7,
    difficulty: 'easy',
  },
  {
    id: 'no-car',
    title: 'Car-Free Week',
    description: 'Go without your car for 7 days',
    category: 'transport',
    targetReduction: 15,
    duration: 7,
    difficulty: 'hard',
  },
  {
    id: 'plant-based',
    title: 'Plant-Based Week',
    description: 'Eat only plant-based meals for 7 days',
    category: 'diet',
    targetReduction: 10,
    duration: 7,
    difficulty: 'medium',
  },
  {
    id: 'energy-saver',
    title: 'Energy Saver',
    description: 'Reduce electricity usage by 20% this week',
    category: 'electricity',
    targetReduction: 12,
    duration: 7,
    difficulty: 'medium',
  },
  {
    id: 'zero-waste',
    title: 'Zero Waste Week',
    description: 'Minimize waste to one bag for the whole week',
    category: 'waste',
    targetReduction: 8,
    duration: 7,
    difficulty: 'hard',
  },
];

export const DEFAULT_CHALLENGE_STATE: ChallengeState = {
  isActive: false,
  startDate: null,
  weeklyGoal: 5,
  currentStreak: 0,
  longestStreak: 0,
  completedChallenges: 0,
  dailyCheckins: [],
  activeChallenge: null,
};
