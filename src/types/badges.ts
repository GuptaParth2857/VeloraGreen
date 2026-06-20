export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  condition: (data: BadgeCheckData) => boolean;
}

export interface BadgeCheckData {
  totalEmissions: number;
  calculationCount: number;
  currentStreak: number;
  completedChallenges: number;
  categoriesBelowAverage: number;
  hasRecycled: boolean;
  hasComposted: boolean;
  isVegan: boolean;
  usesPublicTransport: boolean;
  reductionFromFirst: number;
}

export interface EarnedBadge {
  id: string;
  earnedAt: number;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first carbon calculation',
    icon: '🌱',
    color: '#22c55e',
    requirement: 'Complete 1 calculation',
    condition: (data) => data.calculationCount >= 1,
  },
  {
    id: 'eco-starter',
    name: 'Eco Starter',
    description: 'Your footprint is below the India average',
    icon: '🌿',
    color: '#10b981',
    requirement: 'Below 300 kg CO₂/month',
    condition: (data) => data.totalEmissions < 3600,
  },
  {
    id: 'carbon-cutter',
    name: 'Carbon Cutter',
    description: 'Reduced your footprint by 10% from first calculation',
    icon: '✂️',
    color: '#06b6d4',
    requirement: '10% reduction',
    condition: (data) => data.reductionFromFirst >= 10,
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Your footprint is below the global average',
    icon: '⚔️',
    color: '#8b5cf6',
    requirement: 'Below 400 kg CO₂/month',
    condition: (data) => data.totalEmissions < 4800,
  },
  {
    id: 'green-champion',
    name: 'Green Champion',
    description: 'Maintained a 7-day eco streak',
    icon: '🏆',
    color: '#f59e0b',
    requirement: '7-day streak',
    condition: (data) => data.currentStreak >= 7,
  },
  {
    id: 'earth-guardian',
    name: 'Earth Guardian',
    description: 'Your footprint is under 200 kg CO₂/month',
    icon: '🌍',
    color: '#22c55e',
    requirement: 'Below 200 kg CO₂/month',
    condition: (data) => data.totalEmissions < 2400,
  },
  {
    id: 'net-zero-hero',
    name: 'Net Zero Hero',
    description: 'Incredible! Under 100 kg CO₂/month',
    icon: '🦸',
    color: '#06b6d4',
    requirement: 'Below 100 kg CO₂/month',
    condition: (data) => data.totalEmissions < 1200,
  },
  {
    id: 'challenge-master',
    name: 'Challenge Master',
    description: 'Completed 3 weekly challenges',
    icon: '🎯',
    color: '#ec4899',
    requirement: '3 challenges completed',
    condition: (data) => data.completedChallenges >= 3,
  },
  {
    id: 'recycler',
    name: 'Recycling Pro',
    description: 'Recycling rate above 70%',
    icon: '♻️',
    color: '#14b8a6',
    requirement: '70%+ recycling',
    condition: (data) => data.hasRecycled,
  },
  {
    id: 'plant-powered',
    name: 'Plant Powered',
    description: 'Following a plant-based diet',
    icon: '🥬',
    color: '#84cc16',
    requirement: 'Vegan diet',
    condition: (data) => data.isVegan,
  },
  {
    id: 'transit-rider',
    name: 'Transit Rider',
    description: 'Using public transport regularly',
    icon: '🚌',
    color: '#f97316',
    requirement: 'Public transport user',
    condition: (data) => data.usesPublicTransport,
  },
  {
    id: 'composting',
    name: 'Composting Champion',
    description: 'Composting food waste',
    icon: '🪱',
    color: '#78716c',
    requirement: 'Composting enabled',
    condition: (data) => data.hasComposted,
  },
];
