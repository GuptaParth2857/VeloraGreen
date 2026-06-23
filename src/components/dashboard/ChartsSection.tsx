'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AVERAGES } from '@/lib/constants';
import { formatCO2 } from '@/lib/calculations';

const CHART_COLORS = {
  electricity: '#fbbf24',
  carFuel: '#ef4444',
  publicTransport: '#3b82f6',
  flights: '#8b5cf6',
  diet: '#22c55e',
  waste: '#6b7280',
};

const PIE_COLORS = ['#fbbf24', '#ef4444', '#3b82f6', '#8b5cf6', '#22c55e', '#6b7280'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-white/10 shadow-2xl">
      <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? formatCO2(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

export function ChartsSection() {
  const { currentResult, calculationHistory } = useAppStore();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('bar');

  if (!currentResult) return null;

  const breakdownData = Object.entries(currentResult.breakdown).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    key,
    value: Math.round(value),
    percentage: ((value / currentResult.total) * 100).toFixed(1),
  }));

  const comparisonData = [
    {
      name: 'Your Footprint',
      value: currentResult.total,
      fill: '#22c55e',
    },
    {
      name: 'India Avg',
      value: AVERAGES.india.yearly,
      fill: '#f59e0b',
    },
    {
      name: 'World Avg',
      value: AVERAGES.world.yearly,
      fill: '#3b82f6',
    },
    {
      name: 'US Avg',
      value: AVERAGES.us.yearly,
      fill: '#ef4444',
    },
  ];

  const historyData = calculationHistory.slice(-8).map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    total: Math.round(r.total),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Category Breakdown</h3>
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${chartType === 'bar' ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${chartType === 'pie' ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              Pie
            </button>
          </div>
        </div>

        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={breakdownData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {breakdownData.map((entry, i) => (
                  <Cell key={entry.key} fill={CHART_COLORS[entry.key as keyof typeof CHART_COLORS] || PIE_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={false}
              >
                {breakdownData.map((entry, i) => (
                  <Cell key={entry.key} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      {/* Comparison Chart */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {comparisonData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* History Chart */}
      {historyData.length > 1 && (
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Your History</h3>
          <p className="text-sm text-white/50 mb-6">Your carbon footprint over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historyData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <defs>
                <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#historyGradient)"
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6, fill: '#22c55e' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  );
}
