import { CalculatorFormData, CarbonBreakdown, CarbonResult, MonthlyData } from '@/types/calculator';
import { EMISSION_FACTORS, AVERAGES } from './constants';

export function calculateElectricity(kwhPerMonth: number, country: string, source: string = 'grid'): number {
  const baseFactor = EMISSION_FACTORS.electricity[country as keyof typeof EMISSION_FACTORS.electricity] || 0.5;
  
  // Adjust factor based on energy source
  let factor = baseFactor;
  if (source === 'solar') {
    factor = baseFactor * 0.1; // 90% reduction for solar
  } else if (source === 'mixed') {
    factor = baseFactor * 0.5; // 50% reduction for mixed
  }
  
  return kwhPerMonth * 12 * factor;
}

export function calculateCarFuel(
  kmPerWeek: number,
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric',
  carSize: 'small' | 'medium' | 'large'
): number {
  const factor = EMISSION_FACTORS.car[fuelType][carSize];
  return kmPerWeek * 52 * factor;
}

export function calculatePublicTransport(
  busKmPerWeek: number,
  trainKmPerWeek: number,
  metroKmPerWeek: number
): number {
  const bus = busKmPerWeek * 52 * EMISSION_FACTORS.publicTransport.bus;
  const train = trainKmPerWeek * 52 * EMISSION_FACTORS.publicTransport.train;
  const metro = metroKmPerWeek * 52 * EMISSION_FACTORS.publicTransport.metro;
  return bus + train + metro;
}

export function calculateFlights(shortHaulFlights: number, longHaulFlights: number): number {
  const shortHaulKm = shortHaulFlights * 1000;
  const longHaulKm = longHaulFlights * 6000;
  const rfi = EMISSION_FACTORS.flights.radiativeForcingIndex;
  
  const shortHaul = shortHaulKm * EMISSION_FACTORS.flights.shortHaul * rfi;
  const longHaul = longHaulKm * EMISSION_FACTORS.flights.longHaul * rfi;
  
  return shortHaul + longHaul;
}

export function calculateDiet(
  dietType: 'vegan' | 'vegetarian' | 'pescatarian' | 'regular' | 'heavy-meat',
  mealsOutPerWeek: number
): number {
  const baseEmissions = EMISSION_FACTORS.diet[dietType];
  const restaurantBonus = mealsOutPerWeek * 52 * 2.5;
  return baseEmissions + restaurantBonus;
}

export function calculateWaste(
  bagsPerWeek: number,
  recyclingPercent: number,
  compostsFood: boolean
): number {
  const totalWasteKg = bagsPerWeek * 52 * 10;
  let emissions = totalWasteKg * EMISSION_FACTORS.waste.mixed;
  
  // Recycling credit
  emissions *= (1 - (recyclingPercent / 100) * EMISSION_FACTORS.waste.recyclingCredit);
  
  // Composting credit
  if (compostsFood) {
    emissions *= (1 - EMISSION_FACTORS.waste.compostingCredit);
  }
  
  return Math.max(0, emissions);
}

export function calculateTotal(data: CalculatorFormData): CarbonBreakdown {
  return {
    electricity: calculateElectricity(data.electricity.kwhPerMonth, data.country, data.electricity.source),
    carFuel: calculateCarFuel(data.car.kmPerWeek, data.car.fuelType, data.car.carSize),
    publicTransport: calculatePublicTransport(
      data.transport.busKmPerWeek,
      data.transport.trainKmPerWeek,
      data.transport.metroKmPerWeek
    ),
    flights: calculateFlights(data.flights.shortHaulFlights, data.flights.longHaulFlights),
    diet: calculateDiet(data.diet.type, data.diet.mealsOutPerWeek),
    waste: calculateWaste(data.waste.bagsPerWeek, data.waste.recyclingPercent, data.waste.compostsFood),
  };
}

export function calculateTotalSum(breakdown: CarbonBreakdown): number {
  return Object.values(breakdown).reduce((sum, val) => sum + val, 0);
}

export function calculateResult(data: CalculatorFormData, history: CarbonResult[]): CarbonResult {
  const breakdown = calculateTotal(data);
  const total = calculateTotalSum(breakdown);
  const dailyAverage = total / 365;
  const treesNeeded = Math.ceil(total / EMISSION_FACTORS.treeAbsorption);
  
  const indiaAvg = AVERAGES.india.yearly;
  const worldAvg = AVERAGES.world.yearly;
  const comparedToIndia = ((indiaAvg - total) / indiaAvg) * 100;
  const comparedToWorld = ((worldAvg - total) / worldAvg) * 100;
  
  const worldRank = total < indiaAvg * 0.5 
    ? 'Better than 90% of people worldwide'
    : total < indiaAvg 
    ? 'Better than 70% of people worldwide'
    : total < worldAvg 
    ? 'Better than 50% of people worldwide'
    : total < worldAvg * 1.5 
    ? 'Average compared to global citizens'
    : 'Above average - time to take action!';

  const monthlyHistory = generateMonthlyHistory(breakdown, history);

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    country: data.country,
    breakdown,
    total,
    dailyAverage,
    treesNeeded,
    worldRank,
    comparedToIndia,
    comparedToWorld,
    monthlyHistory,
  };
}

function generateMonthlyHistory(currentBreakdown: CarbonBreakdown, history: CarbonResult[]): MonthlyData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const currentMonth = now.getMonth();
  
  const historyData: MonthlyData[] = history.slice(-6).map((result, index) => ({
    month: months[(currentMonth - 5 + index + 12) % 12],
    total: result.total / 12,
    breakdown: result.breakdown,
  }));

  historyData.push({
    month: months[currentMonth],
    total: calculateTotalSum(currentBreakdown) / 12,
    breakdown: currentBreakdown,
  });

  return historyData;
}

export function getCategoryPercentages(breakdown: CarbonBreakdown): Record<string, number> {
  const total = calculateTotalSum(breakdown);
  if (total === 0) return {};
  
  return {
    electricity: (breakdown.electricity / total) * 100,
    carFuel: (breakdown.carFuel / total) * 100,
    publicTransport: (breakdown.publicTransport / total) * 100,
    flights: (breakdown.flights / total) * 100,
    diet: (breakdown.diet / total) * 100,
    waste: (breakdown.waste / total) * 100,
  };
}

export function getHighestCategory(breakdown: CarbonBreakdown): string {
  const entries = Object.entries(breakdown);
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tons`;
  }
  return `${Math.round(kg)} kg`;
}

export function formatCO2Monthly(kg: number): string {
  const monthly = kg / 12;
  return formatCO2(monthly);
}
