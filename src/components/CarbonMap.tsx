'use client';

import { useEffect, useRef, useState } from 'react';

import { CarbonBreakdown } from '@/types/calculator';

interface CarbonMapProps {
  totalKg: number;
  country?: string;
  breakdown?: CarbonBreakdown;
}

interface CountryData {
  code: string;
  name: string;
  avgKg: number;
  color: string;
}

const COUNTRY_DATA: Record<string, CountryData> = {
  US: { code: 'US', name: 'United States', avgKg: 14700, color: '#ef4444' },
  CN: { code: 'CN', name: 'China', avgKg: 7800, color: '#f97316' },
  IN: { code: 'IN', name: 'India', avgKg: 2100, color: '#22c55e' },
  GB: { code: 'GB', name: 'United Kingdom', avgKg: 5600, color: '#eab308' },
  DE: { code: 'DE', name: 'Germany', avgKg: 8200, color: '#f97316' },
  FR: { code: 'FR', name: 'France', avgKg: 4700, color: '#84cc16' },
  JP: { code: 'JP', name: 'Japan', avgKg: 8400, color: '#f97316' },
  AU: { code: 'AU', name: 'Australia', avgKg: 15100, color: '#ef4444' },
  CA: { code: 'CA', name: 'Canada', avgKg: 15400, color: '#ef4444' },
  BR: { code: 'BR', name: 'Brazil', avgKg: 2400, color: '#22c55e' },
  KR: { code: 'KR', name: 'South Korea', avgKg: 11600, color: '#eab308' },
  NL: { code: 'NL', name: 'Netherlands', avgKg: 8900, color: '#f97316' },
  SE: { code: 'SE', name: 'Sweden', avgKg: 4200, color: '#84cc16' },
  DK: { code: 'DK', name: 'Denmark', avgKg: 5400, color: '#84cc16' },
  NZ: { code: 'NZ', name: 'New Zealand', avgKg: 7300, color: '#eab308' },
  ES: { code: 'ES', name: 'Spain', avgKg: 5100, color: '#84cc16' },
};

function getComparisonColor(yourKg: number, avgKg: number): string {
  const ratio = yourKg / avgKg;
  if (ratio < 0.5) return '#22c55e';
  if (ratio < 0.8) return '#84cc16';
  if (ratio < 1.2) return '#eab308';
  if (ratio < 1.5) return '#f97316';
  return '#ef4444';
}

export function CarbonMap({ totalKg, country = 'IN', breakdown }: CarbonMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const countryInfo = COUNTRY_DATA[country] || COUNTRY_DATA.US;
  const comparisonColor = getComparisonColor(totalKg, countryInfo.avgKg);
  const worldAvg = 4700;
  const worldColor = getComparisonColor(totalKg, worldAvg);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(34,197,94,0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 6; i++) {
      const y = (h / 6) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const maxVal = 16000;
    const bars = Object.entries(COUNTRY_DATA).slice(0, 8);

    const barWidth = (w - 40) / bars.length;
    const chartH = h - 60;

    bars.forEach(([, data], i) => {
      const x = 20 + i * barWidth + barWidth * 0.15;
      const barW = barWidth * 0.7;
      const barH = (data.avgKg / maxVal) * chartH;

      const gradient = ctx.createLinearGradient(x, chartH - barH + 20, x, chartH + 20);
      gradient.addColorStop(0, data.color + 'cc');
      gradient.addColorStop(1, data.color + '40');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, chartH - barH + 20, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      if (data.code === country) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.code, x + barW / 2, chartH + 35);
    });

    const yourH = (totalKg / maxVal) * chartH;
    const yourX = 20 + bars.findIndex(([c]) => c === country) * barWidth + barWidth / 2;

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(15, chartH - yourH + 20);
    ctx.lineTo(w - 5, chartH - yourH + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`You: ${(totalKg / 1000).toFixed(1)}t`, w - 100, chartH - yourH + 16);
  }, [totalKg, country]);

  if (!countryInfo) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-slate-400">Country data not available</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-4">Global Carbon Comparison</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Your Footprint</p>
          <p className="text-2xl font-black text-white">{(totalKg / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">tons</span></p>
          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (totalKg / 16000) * 100)}%`, background: comparisonColor }}
            />
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">{countryInfo.name} Average</p>
          <p className="text-2xl font-black text-white">{(countryInfo.avgKg / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">tons</span></p>
          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(100, (countryInfo.avgKg / 16000) * 100)}%`, background: '#4ade80' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: comparisonColor }} />
          <span className="text-slate-400">
            {totalKg < countryInfo.avgKg
              ? `${Math.round((1 - totalKg / countryInfo.avgKg) * 100)}% below ${countryInfo.name} avg`
              : `${Math.round((totalKg / countryInfo.avgKg - 1) * 100)}% above ${countryInfo.name} avg`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: worldColor }} />
          <span className="text-slate-400">
            {totalKg < worldAvg
              ? `${Math.round((1 - totalKg / worldAvg) * 100)}% below world avg`
              : `${Math.round((totalKg / worldAvg - 1) * 100)}% above world avg`}
          </span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-xl bg-white/[0.02]"
      />

      <p className="text-[10px] text-slate-500 mt-3 text-center">
        Carbon emissions comparison across major economies (kg CO₂/year per capita)
      </p>
    </div>
  );
}
