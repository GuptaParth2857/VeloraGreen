export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  totalKg: number;
  badges: number;
  streak: number;
  country: string;
  isUser?: boolean;
}

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  userRank: number;
  lastUpdated: number;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'EcoEmma',
    avatar: '🌿',
    totalKg: 1200,
    badges: 9,
    streak: 21,
    country: 'DE',
  },
  {
    rank: 2,
    name: 'GreenGuru',
    avatar: '🍃',
    totalKg: 1450,
    badges: 8,
    streak: 18,
    country: 'IN',
  },
  {
    rank: 3,
    name: 'CarbonKing',
    avatar: '👑',
    totalKg: 1800,
    badges: 7,
    streak: 14,
    country: 'GB',
  },
  {
    rank: 4,
    name: 'PlantPower',
    avatar: '🌱',
    totalKg: 1950,
    badges: 7,
    streak: 12,
    country: 'US',
  },
  {
    rank: 5,
    name: 'SolarSister',
    avatar: '☀️',
    totalKg: 2100,
    badges: 6,
    streak: 10,
    country: 'AU',
  },
  {
    rank: 6,
    name: 'WindWalker',
    avatar: '💨',
    totalKg: 2300,
    badges: 6,
    streak: 9,
    country: 'DK',
  },
  {
    rank: 7,
    name: 'BikeBoss',
    avatar: '🚲',
    totalKg: 2450,
    badges: 5,
    streak: 8,
    country: 'NL',
  },
  {
    rank: 8,
    name: 'RecycleQueen',
    avatar: '♻️',
    totalKg: 2600,
    badges: 5,
    streak: 7,
    country: 'SE',
  },
  {
    rank: 9,
    name: 'ZeroHero',
    avatar: '🦸',
    totalKg: 2800,
    badges: 5,
    streak: 6,
    country: 'JP',
  },
  {
    rank: 10,
    name: 'NatureLover',
    avatar: '🌳',
    totalKg: 2950,
    badges: 4,
    streak: 5,
    country: 'CA',
  },
  {
    rank: 11,
    name: 'EcoNewbie',
    avatar: '🌱',
    totalKg: 3200,
    badges: 4,
    streak: 4,
    country: 'FR',
  },
  {
    rank: 12,
    name: 'GreenTeen',
    avatar: '🎓',
    totalKg: 3400,
    badges: 3,
    streak: 3,
    country: 'KR',
  },
  {
    rank: 13,
    name: 'TreeHugger',
    avatar: '🤗',
    totalKg: 3600,
    badges: 3,
    streak: 3,
    country: 'BR',
  },
  {
    rank: 14,
    name: 'OceanGuard',
    avatar: '🌊',
    totalKg: 3800,
    badges: 3,
    streak: 2,
    country: 'NZ',
  },
  {
    rank: 15,
    name: 'SunnyDays',
    avatar: '🌞',
    totalKg: 4000,
    badges: 2,
    streak: 2,
    country: 'ES',
  },
  {
    rank: 16,
    name: 'FreshAir',
    avatar: '🌬️',
    totalKg: 4200,
    badges: 2,
    streak: 1,
    country: 'CH',
  },
  {
    rank: 17,
    name: 'CleanWater',
    avatar: '💧',
    totalKg: 4500,
    badges: 2,
    streak: 1,
    country: 'IT',
  },
  {
    rank: 18,
    name: 'WildlifeFan',
    avatar: '🦋',
    totalKg: 4800,
    badges: 1,
    streak: 0,
    country: 'MX',
  },
  {
    rank: 19,
    name: 'GreenThumb',
    avatar: '🪴',
    totalKg: 5000,
    badges: 1,
    streak: 0,
    country: 'RU',
  },
  {
    rank: 20,
    name: 'EarthLover',
    avatar: '🌎',
    totalKg: 5200,
    badges: 1,
    streak: 0,
    country: 'ZA',
  },
];
