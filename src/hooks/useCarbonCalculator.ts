'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { calculateResult } from '@/lib/calculations';
import { checkBadges } from '@/lib/badges';
import { CalculatorFormData, CarbonResult } from '@/types/calculator';

export function useCarbonCalculator() {
  const {
    calculatorData,
    calculationHistory,
    setResult,
    setNewBadge,
    challenge,
  } = useAppStore();

  const computeFootprint = useCallback(
    (data?: CalculatorFormData): CarbonResult => {
      const input = data || calculatorData;
      const result = calculateResult(input, calculationHistory);

      setResult(result);

      const newBadges = checkBadges(result, challenge, [
        ...calculationHistory,
        result,
      ]);

      if (newBadges.length > 0) {
        setNewBadge({
          id: newBadges[0].id,
          earnedAt: Date.now(),
        });
      }

      return result;
    },
    [calculatorData, calculationHistory, setResult, setNewBadge, challenge]
  );

  const getHistory = useCallback(() => {
    return calculationHistory;
  }, [calculationHistory]);

  const getLatestResult = useCallback((): CarbonResult | null => {
    if (calculationHistory.length === 0) return null;
    return calculationHistory[calculationHistory.length - 1];
  }, [calculationHistory]);

  return {
    computeFootprint,
    getHistory,
    getLatestResult,
    hasResults: calculationHistory.length > 0,
  };
}
