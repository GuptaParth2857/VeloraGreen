'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassSlider } from '@/components/ui/GlassSlider';
import { GlassSelect } from '@/components/ui/GlassSelect';
import { useAppStore } from '@/store/useAppStore';
import { COUNTRIES } from '@/types/common';
import { calculateResult } from '@/lib/calculations';
import { checkBadges } from '@/lib/badges';

const steps = [
  { id: 'country', label: 'Country', icon: '🌍' },
  { id: 'electricity', label: 'Electricity', icon: '⚡' },
  { id: 'car', label: 'Car Fuel', icon: '🚗' },
  { id: 'transport', label: 'Transport', icon: '🚌' },
  { id: 'flights', label: 'Flights', icon: '✈️' },
  { id: 'diet', label: 'Diet', icon: '🍽️' },
  { id: 'waste', label: 'Waste', icon: '🗑️' },
];

export function CalculatorWizard() {
  const router = useRouter();
  const { calculatorData, updateCalculatorData, currentStep, setStep, setResult, calculationHistory, setNewBadge } = useAppStore();
  const [direction, setDirection] = useState(1);

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setStep(currentStep - 1);
    }
  };

  const handleCalculate = () => {
    const result = calculateResult(calculatorData, calculationHistory);
    setResult(result);
    
    // Check for new badges
    const challengeState = useAppStore.getState().challenge;
    const newBadges = checkBadges(result, challengeState, calculationHistory);
    if (newBadges.length > 0) {
      setNewBadge({
        id: newBadges[0].id,
        earnedAt: Date.now(),
      });
    }
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
      };
    },
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-eco-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-eco-500 to-eco-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            onClick={() => {
              setDirection(index > currentStep ? 1 : -1);
              setStep(index);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              index === currentStep
                ? 'bg-eco-500 scale-110'
                : index < currentStep
                ? 'bg-eco-500/30'
                : 'bg-white/10'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Step ${index + 1}: ${step.label}`}
            aria-current={index === currentStep ? 'step' : undefined}
          >
            {step.icon}
          </motion.button>
        ))}
      </div>

      {/* Step content */}
      <div className="layout-panel min-h-[400px] p-6 sm:p-8 rounded-none">
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-tr" />
        <div className="hud-corner hud-corner-bl" />
        <div className="hud-corner hud-corner-br" />
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{steps[currentStep].icon}</span>
              {steps[currentStep].label}
            </h2>

            {/* Country Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <GlassSelect
                  label="Select your country"
                  value={calculatorData.country}
                  onChange={(value) => updateCalculatorData({ country: value })}
                  options={COUNTRIES.map(c => ({
                    value: c.code,
                    label: c.name,
                    icon: c.emoji,
                  }))}
                  placeholder="Choose a country"
                />
                <p className="text-sm text-white/50">
                  This affects the electricity emission factors based on your country's energy mix.
                </p>
              </div>
            )}

            {/* Electricity */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <GlassInput
                  label="Monthly Electricity Usage"
                  value={calculatorData.electricity.kwhPerMonth}
                  onChange={(value) =>
                    updateCalculatorData({
                      electricity: { ...calculatorData.electricity, kwhPerMonth: value },
                    })
                  }
                  min={0}
                  max={2000}
                  step={10}
                  unit="kWh/month"
                />
                <GlassSelect
                  label="Primary Energy Source"
                  value={calculatorData.electricity.source}
                  onChange={(value) =>
                    updateCalculatorData({
                      electricity: { ...calculatorData.electricity, source: value as 'grid' | 'solar' | 'mixed' },
                    })
                  }
                  options={[
                    { value: 'grid', label: 'Grid Power' },
                    { value: 'solar', label: 'Solar Panels' },
                    { value: 'mixed', label: 'Mixed (Grid + Solar)' },
                  ]}
                />
                <p className="text-sm text-white/50">
                  Check your electricity bill for monthly usage in kWh.
                </p>
              </div>
            )}

            {/* Car Fuel */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <GlassSlider
                  label="Weekly Driving Distance"
                  value={calculatorData.car.kmPerWeek}
                  onChange={(value) =>
                    updateCalculatorData({
                      car: { ...calculatorData.car, kmPerWeek: value },
                    })
                  }
                  min={0}
                  max={1000}
                  step={10}
                  unit=" km/week"
                />
                <GlassSelect
                  label="Fuel Type"
                  value={calculatorData.car.fuelType}
                  onChange={(value) =>
                    updateCalculatorData({
                      car: { ...calculatorData.car, fuelType: value as 'petrol' | 'diesel' | 'hybrid' | 'electric' },
                    })
                  }
                  options={[
                    { value: 'petrol', label: 'Petrol' },
                    { value: 'diesel', label: 'Diesel' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'electric', label: 'Electric' },
                  ]}
                />
                <GlassSelect
                  label="Car Size"
                  value={calculatorData.car.carSize}
                  onChange={(value) =>
                    updateCalculatorData({
                      car: { ...calculatorData.car, carSize: value as 'small' | 'medium' | 'large' },
                    })
                  }
                  options={[
                    { value: 'small', label: 'Small (Hatchback)' },
                    { value: 'medium', label: 'Medium (Sedan)' },
                    { value: 'large', label: 'Large (SUV)' },
                  ]}
                />
              </div>
            )}

            {/* Public Transport */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <GlassSlider
                  label="Bus Travel"
                  value={calculatorData.transport.busKmPerWeek}
                  onChange={(value) =>
                    updateCalculatorData({
                      transport: { ...calculatorData.transport, busKmPerWeek: value },
                    })
                  }
                  min={0}
                  max={500}
                  step={5}
                  unit=" km/week"
                />
                <GlassSlider
                  label="Train Travel"
                  value={calculatorData.transport.trainKmPerWeek}
                  onChange={(value) =>
                    updateCalculatorData({
                      transport: { ...calculatorData.transport, trainKmPerWeek: value },
                    })
                  }
                  min={0}
                  max={500}
                  step={5}
                  unit=" km/week"
                />
                <GlassSlider
                  label="Metro/Subway"
                  value={calculatorData.transport.metroKmPerWeek}
                  onChange={(value) =>
                    updateCalculatorData({
                      transport: { ...calculatorData.transport, metroKmPerWeek: value },
                    })
                  }
                  min={0}
                  max={500}
                  step={5}
                  unit=" km/week"
                />
              </div>
            )}

            {/* Flights */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <GlassInput
                  label="Short-Haul Flights per Year"
                  value={calculatorData.flights.shortHaulFlights}
                  onChange={(value) =>
                    updateCalculatorData({
                      flights: { ...calculatorData.flights, shortHaulFlights: value },
                    })
                  }
                  min={0}
                  max={100}
                  unit="flights"
                />
                <GlassInput
                  label="Long-Haul Flights per Year"
                  value={calculatorData.flights.longHaulFlights}
                  onChange={(value) =>
                    updateCalculatorData({
                      flights: { ...calculatorData.flights, longHaulFlights: value },
                    })
                  }
                  min={0}
                  max={50}
                  unit="flights"
                />
                <p className="text-sm text-white/50">
                  Short-haul: under 3 hours. Long-haul: over 3 hours.
                </p>
              </div>
            )}

            {/* Diet */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <GlassSelect
                  label="Diet Type"
                  value={calculatorData.diet.type}
                  onChange={(value) =>
                    updateCalculatorData({
                      diet: { ...calculatorData.diet, type: value as 'vegan' | 'vegetarian' | 'pescatarian' | 'regular' | 'heavy-meat' },
                    })
                  }
                  options={[
                    { value: 'vegan', label: 'Vegan (No animal products)' },
                    { value: 'vegetarian', label: 'Vegetarian (No meat)' },
                    { value: 'pescatarian', label: 'Pescatarian (Fish, no meat)' },
                    { value: 'regular', label: 'Regular (Balanced diet)' },
                    { value: 'heavy-meat', label: 'Heavy Meat Eater' },
                  ]}
                />
                <GlassSlider
                  label="Meals Out per Week"
                  value={calculatorData.diet.mealsOutPerWeek}
                  onChange={(value) =>
                    updateCalculatorData({
                      diet: { ...calculatorData.diet, mealsOutPerWeek: value },
                    })
                  }
                  min={0}
                  max={21}
                  step={1}
                  unit=" meals"
                />
              </div>
            )}

            {/* Waste */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <GlassSlider
                  label="Waste Bags per Week"
                  value={calculatorData.waste.bagsPerWeek}
                  onChange={(value) =>
                    updateCalculatorData({
                      waste: { ...calculatorData.waste, bagsPerWeek: value },
                    })
                  }
                  min={0}
                  max={10}
                  step={0.5}
                  unit=" bags"
                />
                <GlassSlider
                  label="Recycling Rate"
                  value={calculatorData.waste.recyclingPercent}
                  onChange={(value) =>
                    updateCalculatorData({
                      waste: { ...calculatorData.waste, recyclingPercent: value },
                    })
                  }
                  min={0}
                  max={100}
                  step={5}
                  unit="%"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="compost"
                    checked={calculatorData.waste.compostsFood}
                    onChange={(e) =>
                      updateCalculatorData({
                        waste: { ...calculatorData.waste, compostsFood: e.target.checked },
                      })
                    }
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-eco-500 focus:ring-eco-500"
                    aria-label="I compost food waste"
                  />
                  <label htmlFor="compost" className="text-sm text-white/80">
                    I compost food waste
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <GlassButton
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </GlassButton>

        {currentStep === totalSteps - 1 ? (
          <GlassButton onClick={handleCalculate}>
            Calculate My Footprint
            🎯
          </GlassButton>
        ) : (
          <GlassButton onClick={nextStep}>
            Next
            <ChevronRight className="w-4 h-4" />
          </GlassButton>
        )}
      </div>
    </div>
  );
}
