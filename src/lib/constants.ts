// Carbon Footprint Constants
// Based on EPA, IPCC, and DEFRA emission factors

export const EMISSION_FACTORS = {
  // Electricity (kg CO2 per kWh by country)
  electricity: {
    IN: 0.71,
    US: 0.42,
    GB: 0.23,
    DE: 0.35,
    FR: 0.06,
    JP: 0.47,
    CN: 0.56,
    BR: 0.07,
    AU: 0.53,
    CA: 0.12,
    KR: 0.42,
    IT: 0.33,
    ES: 0.25,
    MX: 0.45,
    SE: 0.01,
    NO: 0.01,
    DK: 0.12,
    NL: 0.33,
    CH: 0.01,
    NZ: 0.15,
    ZA: 0.90,
    RU: 0.45,
    ID: 0.62,
    TH: 0.50,
    SG: 0.40,
  },

  // Car fuel (kg CO2 per km based on fuel type and size)
  car: {
    petrol: { small: 0.170, medium: 0.210, large: 0.280 },
    diesel: { small: 0.140, medium: 0.180, large: 0.240 },
    hybrid: { small: 0.090, medium: 0.120, large: 0.160 },
    electric: { small: 0.053, medium: 0.070, large: 0.095 },
  },

  // Public transport (kg CO2 per km)
  publicTransport: {
    bus: 0.089,
    train: 0.041,
    metro: 0.035,
    tram: 0.030,
  },

  // Flights (kg CO2 per km)
  flights: {
    shortHaul: 0.156,
    longHaul: 0.195,
    radiativeForcingIndex: 1.9, // accounts for high-altitude effects
  },

  // Diet (kg CO2 per year)
  diet: {
    vegan: 1500,
    vegetarian: 1700,
    pescatarian: 1900,
    regular: 2500,
    'heavy-meat': 3300,
  },

  // Waste (kg CO2 per kg of waste)
  waste: {
    mixed: 0.5,
    recyclingCredit: 0.7,
    compostingCredit: 0.15,
  },

  // Trees absorption (kg CO2 per tree per year)
  treeAbsorption: 21,
};

export const AVERAGES = {
  india: {
    monthly: 300, // kg CO2
    yearly: 3600,
  },
  world: {
    monthly: 400, // kg CO2
    yearly: 4800,
  },
  us: {
    monthly: 1290, // kg CO2
    yearly: 15500,
  },
};

export const APP_CONFIG = {
  name: 'VeloraGreen',
  tagline: 'Track Your Carbon Footprint',
  description: 'Understand, reduce, and offset your carbon emissions with our interactive platform',
  url: 'https://veloragreen.com',
  version: '1.0.0',
};

export const BREAKDOWN_COLORS = {
  electricity: '#fbbf24',
  carFuel: '#ef4444',
  publicTransport: '#3b82f6',
  flights: '#8b5cf6',
  diet: '#22c55e',
  waste: '#6b7280',
};

export const BREAKDOWN_LABELS = {
  electricity: 'Electricity',
  carFuel: 'Car Fuel',
  publicTransport: 'Public Transport',
  flights: 'Flights',
  diet: 'Diet',
  waste: 'Waste',
};

export const BREAKDOWN_ICONS = {
  electricity: '⚡',
  carFuel: '🚗',
  publicTransport: '🚌',
  flights: '✈️',
  diet: '🍽️',
  waste: '🗑️',
};
