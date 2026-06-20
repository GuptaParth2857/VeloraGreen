export interface UserSettings {
  country: string;
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  language: string;
}

export interface AppState {
  isInitialized: boolean;
  hasCompletedOnboarding: boolean;
  lastActiveTab: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  country: 'IN',
  theme: 'dark',
  units: 'metric',
  language: 'en',
};

export const COUNTRIES = [
  { code: 'IN', name: 'India', emoji: '🇮🇳', electricityFactor: 0.71 },
  { code: 'US', name: 'United States', emoji: '🇺🇸', electricityFactor: 0.42 },
  { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧', electricityFactor: 0.23 },
  { code: 'DE', name: 'Germany', emoji: '🇩🇪', electricityFactor: 0.35 },
  { code: 'FR', name: 'France', emoji: '🇫🇷', electricityFactor: 0.06 },
  { code: 'JP', name: 'Japan', emoji: '🇯🇵', electricityFactor: 0.47 },
  { code: 'CN', name: 'China', emoji: '🇨🇳', electricityFactor: 0.56 },
  { code: 'BR', name: 'Brazil', emoji: '🇧🇷', electricityFactor: 0.07 },
  { code: 'AU', name: 'Australia', emoji: '🇦🇺', electricityFactor: 0.53 },
  { code: 'CA', name: 'Canada', emoji: '🇨🇦', electricityFactor: 0.12 },
  { code: 'KR', name: 'South Korea', emoji: '🇰🇷', electricityFactor: 0.42 },
  { code: 'IT', name: 'Italy', emoji: '🇮🇹', electricityFactor: 0.33 },
  { code: 'ES', name: 'Spain', emoji: '🇪🇸', electricityFactor: 0.25 },
  { code: 'MX', name: 'Mexico', emoji: '🇲🇽', electricityFactor: 0.45 },
  { code: 'SE', name: 'Sweden', emoji: '🇸🇪', electricityFactor: 0.01 },
  { code: 'NO', name: 'Norway', emoji: '🇳🇴', electricityFactor: 0.01 },
  { code: 'DK', name: 'Denmark', emoji: '🇩🇰', electricityFactor: 0.12 },
  { code: 'NL', name: 'Netherlands', emoji: '🇳🇱', electricityFactor: 0.33 },
  { code: 'CH', name: 'Switzerland', emoji: '🇨🇭', electricityFactor: 0.01 },
  { code: 'NZ', name: 'New Zealand', emoji: '🇳🇿', electricityFactor: 0.15 },
  { code: 'ZA', name: 'South Africa', emoji: '🇿🇦', electricityFactor: 0.90 },
  { code: 'RU', name: 'Russia', emoji: '🇷🇺', electricityFactor: 0.45 },
  { code: 'ID', name: 'Indonesia', emoji: '🇮🇩', electricityFactor: 0.62 },
  { code: 'TH', name: 'Thailand', emoji: '🇹🇭', electricityFactor: 0.50 },
  { code: 'SG', name: 'Singapore', emoji: '🇸🇬', electricityFactor: 0.40 },
];
