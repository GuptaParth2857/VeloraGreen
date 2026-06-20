export interface ElectricityData {
  kwhPerMonth: number;
  source: 'grid' | 'solar' | 'mixed';
}

export interface CarData {
  kmPerWeek: number;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  carSize: 'small' | 'medium' | 'large';
}

export interface TransportData {
  busKmPerWeek: number;
  trainKmPerWeek: number;
  metroKmPerWeek: number;
}

export interface FlightData {
  shortHaulFlights: number;
  longHaulFlights: number;
}

export interface DietData {
  type: 'vegan' | 'vegetarian' | 'pescatarian' | 'regular' | 'heavy-meat';
  mealsOutPerWeek: number;
  foodWastePercent: number;
}

export interface WasteData {
  bagsPerWeek: number;
  recyclingPercent: number;
  compostsFood: boolean;
}

export interface CalculatorFormData {
  country: string;
  electricity: ElectricityData;
  car: CarData;
  transport: TransportData;
  flights: FlightData;
  diet: DietData;
  waste: WasteData;
}

export type CarbonCategory = 
  | 'electricity' 
  | 'carFuel' 
  | 'publicTransport' 
  | 'flights' 
  | 'diet' 
  | 'waste';

export interface CarbonBreakdown {
  electricity: number;
  carFuel: number;
  publicTransport: number;
  flights: number;
  diet: number;
  waste: number;
}

export interface CarbonResult {
  id: string;
  timestamp: number;
  country: string;
  breakdown: CarbonBreakdown;
  total: number;
  dailyAverage: number;
  treesNeeded: number;
  worldRank: string;
  comparedToIndia: number;
  comparedToWorld: number;
  monthlyHistory: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  total: number;
  breakdown: CarbonBreakdown;
}

export const DEFAULT_CALCULATOR_DATA: CalculatorFormData = {
  country: 'IN',
  electricity: {
    kwhPerMonth: 200,
    source: 'grid',
  },
  car: {
    kmPerWeek: 100,
    fuelType: 'petrol',
    carSize: 'medium',
  },
  transport: {
    busKmPerWeek: 50,
    trainKmPerWeek: 30,
    metroKmPerWeek: 20,
  },
  flights: {
    shortHaulFlights: 2,
    longHaulFlights: 0,
  },
  diet: {
    type: 'regular',
    mealsOutPerWeek: 3,
    foodWastePercent: 20,
  },
  waste: {
    bagsPerWeek: 3,
    recyclingPercent: 30,
    compostsFood: false,
  },
};
