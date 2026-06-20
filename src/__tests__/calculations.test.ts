import { describe, it, expect } from 'vitest';
import {
  calculateElectricity,
  calculateCarFuel,
  calculatePublicTransport,
  calculateFlights,
  calculateDiet,
  calculateWaste,
  calculateTotal,
  calculateTotalSum,
  calculateResult,
  getCategoryPercentages,
  getHighestCategory,
  formatCO2,
  formatCO2Monthly,
} from '@/lib/calculations';
import { CalculatorFormData, CarbonBreakdown } from '@/types/calculator';

const mockFormData: CalculatorFormData = {
  country: 'IN',
  electricity: { kwhPerMonth: 200, source: 'grid' },
  car: { kmPerWeek: 100, fuelType: 'petrol', carSize: 'medium' },
  transport: { busKmPerWeek: 50, trainKmPerWeek: 30, metroKmPerWeek: 20 },
  flights: { shortHaulFlights: 2, longHaulFlights: 0 },
  diet: { type: 'regular', mealsOutPerWeek: 3, foodWastePercent: 20 },
  waste: { bagsPerWeek: 3, recyclingPercent: 30, compostsFood: false },
};

describe('calculateElectricity', () => {
  it('calculates electricity emissions for grid power', () => {
    const result = calculateElectricity(200, 'IN', 'grid');
    expect(result).toBe(200 * 12 * 0.71);
  });

  it('applies solar discount', () => {
    const result = calculateElectricity(200, 'IN', 'solar');
    expect(result).toBeCloseTo(200 * 12 * 0.71 * 0.1);
  });

  it('applies mixed discount', () => {
    const result = calculateElectricity(200, 'IN', 'mixed');
    expect(result).toBe(200 * 12 * 0.71 * 0.5);
  });

  it('falls back to default factor for unknown country', () => {
    const result = calculateElectricity(100, 'XX', 'grid');
    expect(result).toBe(100 * 12 * 0.5);
  });

  it('returns 0 for 0 kwh', () => {
    const result = calculateElectricity(0, 'IN', 'grid');
    expect(result).toBe(0);
  });
});

describe('calculateCarFuel', () => {
  it('calculates petrol medium car emissions', () => {
    const result = calculateCarFuel(100, 'petrol', 'medium');
    expect(result).toBe(100 * 52 * 0.210);
  });

  it('calculates electric small car emissions', () => {
    const result = calculateCarFuel(50, 'electric', 'small');
    expect(result).toBe(50 * 52 * 0.053);
  });

  it('returns 0 for 0 km per week', () => {
    const result = calculateCarFuel(0, 'petrol', 'small');
    expect(result).toBe(0);
  });

  it('large diesel produces more than small petrol', () => {
    const large = calculateCarFuel(100, 'diesel', 'large');
    const small = calculateCarFuel(100, 'petrol', 'small');
    expect(large).toBeGreaterThan(small);
  });
});

describe('calculatePublicTransport', () => {
  it('calculates total public transport emissions', () => {
    const result = calculatePublicTransport(50, 30, 20);
    const expected = 50 * 52 * 0.089 + 30 * 52 * 0.041 + 20 * 52 * 0.035;
    expect(result).toBe(expected);
  });

  it('returns 0 when all values are 0', () => {
    const result = calculatePublicTransport(0, 0, 0);
    expect(result).toBe(0);
  });
});

describe('calculateFlights', () => {
  it('calculates flight emissions with RFI', () => {
    const result = calculateFlights(2, 0);
    const rfi = 1.9;
    const shortHaulKm = 2 * 1000;
    const expected = shortHaulKm * 0.156 * rfi;
    expect(result).toBe(expected);
  });

  it('includes long haul flights', () => {
    const result = calculateFlights(0, 1);
    const rfi = 1.9;
    const longHaulKm = 1 * 6000;
    const expected = longHaulKm * 0.195 * rfi;
    expect(result).toBe(expected);
  });
});

describe('calculateDiet', () => {
  it('calculates regular diet emissions', () => {
    const result = calculateDiet('regular', 3);
    expect(result).toBe(2500 + 3 * 52 * 2.5);
  });

  it('vegan diet is lower than heavy-meat', () => {
    const vegan = calculateDiet('vegan', 0);
    const heavy = calculateDiet('heavy-meat', 0);
    expect(vegan).toBeLessThan(heavy);
  });
});

describe('calculateWaste', () => {
  it('calculates waste emissions without recycling', () => {
    const result = calculateWaste(3, 0, false);
    const totalWaste = 3 * 52 * 10;
    expect(result).toBe(totalWaste * 0.5);
  });

  it('reduces emissions with recycling', () => {
    const noRecycle = calculateWaste(3, 0, false);
    const withRecycle = calculateWaste(3, 100, false);
    expect(withRecycle).toBeLessThan(noRecycle);
  });

  it('further reduces with composting', () => {
    const noCompost = calculateWaste(3, 50, false);
    const withCompost = calculateWaste(3, 50, true);
    expect(withCompost).toBeLessThan(noCompost);
  });

  it('returns 0 for no waste', () => {
    const result = calculateWaste(0, 0, false);
    expect(result).toBe(0);
  });
});

describe('calculateTotal', () => {
  it('returns a CarbonBreakdown with all categories', () => {
    const result = calculateTotal(mockFormData);
    expect(result).toHaveProperty('electricity');
    expect(result).toHaveProperty('carFuel');
    expect(result).toHaveProperty('publicTransport');
    expect(result).toHaveProperty('flights');
    expect(result).toHaveProperty('diet');
    expect(result).toHaveProperty('waste');
  });

  it('all values are non-negative', () => {
    const result = calculateTotal(mockFormData);
    Object.values(result).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('calculateTotalSum', () => {
  it('sums all breakdown values', () => {
    const breakdown: CarbonBreakdown = {
      electricity: 100, carFuel: 200, publicTransport: 50,
      flights: 300, diet: 150, waste: 75,
    };
    expect(calculateTotalSum(breakdown)).toBe(875);
  });
});

describe('calculateResult', () => {
  it('returns a valid CarbonResult', () => {
    const result = calculateResult(mockFormData, []);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('dailyAverage');
    expect(result).toHaveProperty('treesNeeded');
    expect(result).toHaveProperty('worldRank');
    expect(result).toHaveProperty('comparedToIndia');
    expect(result).toHaveProperty('comparedToWorld');
    expect(result).toHaveProperty('monthlyHistory');
  });

  it('total is consistent with breakdown sum', () => {
    const result = calculateResult(mockFormData, []);
    const breakdownSum = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
    expect(result.total).toBeCloseTo(breakdownSum);
  });

  it('daily average is total / 365', () => {
    const result = calculateResult(mockFormData, []);
    expect(result.dailyAverage).toBeCloseTo(result.total / 365);
  });

  it('trees needed is at least 1 if total > 0', () => {
    const result = calculateResult(mockFormData, []);
    if (result.total > 0) {
      expect(result.treesNeeded).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('getCategoryPercentages', () => {
  it('returns percentages that sum to ~100', () => {
    const breakdown = calculateTotal(mockFormData);
    const percentages = getCategoryPercentages(breakdown);
    const sum = Object.values(percentages).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(100, 0);
  });

  it('returns empty object for zero total', () => {
    const breakdown: CarbonBreakdown = {
      electricity: 0, carFuel: 0, publicTransport: 0,
      flights: 0, diet: 0, waste: 0,
    };
    expect(getCategoryPercentages(breakdown)).toEqual({});
  });
});

describe('getHighestCategory', () => {
  it('returns the category with the highest value', () => {
    const breakdown: CarbonBreakdown = {
      electricity: 100, carFuel: 500, publicTransport: 50,
      flights: 300, diet: 150, waste: 75,
    };
    expect(getHighestCategory(breakdown)).toBe('carFuel');
  });
});

describe('formatCO2', () => {
  it('formats kg values', () => {
    expect(formatCO2(500)).toBe('500 kg');
  });

  it('converts to tons for values >= 1000', () => {
    expect(formatCO2(1500)).toBe('1.5 tons');
  });

  it('handles 0', () => {
    expect(formatCO2(0)).toBe('0 kg');
  });
});

describe('formatCO2Monthly', () => {
  it('divides by 12 and formats', () => {
    const result = formatCO2Monthly(12000);
    expect(result).toBe('1.0 tons');
  });
});
