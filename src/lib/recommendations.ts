import { CarbonResult } from '@/types/calculator';

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  estimatedSaving: number;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export function generateRecommendations(result: CarbonResult): Recommendation[] {
  const recs: Recommendation[] = [];
  const { breakdown } = result;

  // Electricity recommendations
  if (breakdown.electricity > 1500) {
    recs.push({
      id: 'switch-led',
      category: 'electricity',
      title: 'Switch to LED Bulbs',
      description: 'LED bulbs use 75% less energy than incandescent bulbs. Replace all your home lighting to save up to 50 kg CO₂ per month.',
      estimatedSaving: 600,
      priority: 'high',
      icon: '💡',
    });
  }

  if (breakdown.electricity > 2000) {
    recs.push({
      id: 'solar-panels',
      category: 'electricity',
      title: 'Consider Solar Panels',
      description: 'Solar panels can reduce your electricity emissions by up to 80%. With government subsidies, the ROI is typically 3-5 years.',
      estimatedSaving: breakdown.electricity * 0.6,
      priority: 'high',
      icon: '☀️',
    });
  }

  // Car fuel recommendations
  if (breakdown.carFuel > 2000) {
    recs.push({
      id: 'ev-switch',
      category: 'carFuel',
      title: 'Consider an Electric Vehicle',
      description: 'EVs produce 60-70% fewer emissions over their lifetime. Even a hybrid can cut your car emissions by 40%.',
      estimatedSaving: breakdown.carFuel * 0.5,
      priority: 'high',
      icon: '🚗',
    });
  }

  if (breakdown.carFuel > 1000) {
    recs.push({
      id: 'carpool',
      category: 'carFuel',
      title: 'Start Carpooling',
      description: 'Sharing rides with colleagues can reduce your commute emissions by 50%. Plus, you save on fuel costs!',
      estimatedSaving: breakdown.carFuel * 0.3,
      priority: 'medium',
      icon: '🤝',
    });
  }

  // Public transport recommendations
  if (breakdown.carFuel > breakdown.publicTransport * 2) {
    recs.push({
      id: 'use-transit',
      category: 'publicTransport',
      title: 'Use Public Transport More',
      description: 'Buses produce 80% less CO₂ per passenger than cars. Try using public transport for your daily commute.',
      estimatedSaving: breakdown.carFuel * 0.4,
      priority: 'medium',
      icon: '🚌',
    });
  }

  // Flight recommendations
  if (breakdown.flights > 1000) {
    recs.push({
      id: 'fewer-flights',
      category: 'flights',
      title: 'Reduce Air Travel',
      description: 'Consider video conferencing instead of business trips, or choose trains for shorter journeys. One less long-haul flight saves 1.5 tons CO₂.',
      estimatedSaving: breakdown.flights * 0.3,
      priority: 'high',
      icon: '✈️',
    });
  }

  if (breakdown.flights > 500) {
    recs.push({
      id: 'carbon-offset',
      category: 'flights',
      title: 'Offset Your Flights',
      description: 'Purchase verified carbon offsets for your flights. Many airlines offer this option at checkout.',
      estimatedSaving: breakdown.flights * 0.5,
      priority: 'low',
      icon: '🌳',
    });
  }

  // Diet recommendations
  if (breakdown.diet > 2500) {
    recs.push({
      id: 'plant-based',
      category: 'diet',
      title: 'Try Plant-Based Meals',
      description: 'Reducing meat consumption can cut your food emissions by 50%. Try "Meatless Monday" to start!',
      estimatedSaving: 800,
      priority: 'medium',
      icon: '🥗',
    });
  }

  if (breakdown.diet > 2000) {
    recs.push({
      id: 'reduce-food-waste',
      category: 'diet',
      title: 'Reduce Food Waste',
      description: 'Plan your meals, use leftovers, and compost food scraps. This can reduce your diet emissions by 15%.',
      estimatedSaving: breakdown.diet * 0.15,
      priority: 'medium',
      icon: '🍽️',
    });
  }

  // Waste recommendations
  if (breakdown.waste > 500) {
    recs.push({
      id: 'recycle-more',
      category: 'waste',
      title: 'Increase Recycling',
      description: 'Recycling reduces the need for raw materials and energy. Aim for 70%+ recycling rate.',
      estimatedSaving: breakdown.waste * 0.4,
      priority: 'medium',
      icon: '♻️',
    });
  }

  if (breakdown.waste > 300) {
    recs.push({
      id: 'compost',
      category: 'waste',
      title: 'Start Composting',
      description: 'Composting food waste reduces methane emissions from landfills. It also creates nutrient-rich soil for your garden.',
      estimatedSaving: 200,
      priority: 'low',
      icon: '🪱',
    });
  }

  // General recommendations
  recs.push({
    id: 'tree-planting',
    category: 'general',
    title: 'Plant Trees',
    description: `You need ${result.treesNeeded} trees to offset your annual emissions. Consider planting trees in your community or supporting reforestation projects.`,
    estimatedSaving: result.treesNeeded * 21,
    priority: 'low',
    icon: '🌳',
  });

  // Sort by estimated saving (highest first)
  return recs.sort((a, b) => b.estimatedSaving - a.estimatedSaving);
}

export function getTopRecommendations(result: CarbonResult, count: number = 3): Recommendation[] {
  return generateRecommendations(result).slice(0, count);
}

export function getTotalPotentialSaving(recommendations: Recommendation[]): number {
  return recommendations.reduce((sum, rec) => sum + rec.estimatedSaving, 0);
}
