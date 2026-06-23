'use client';

import { useMemo, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Circle } from '@react-google-maps/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatCO2 } from '@/lib/calculations';

const COUNTRY_DATA: Record<string, { lat: number; lng: number; yearly: number; name: string }> = {
  IN: { lat: 20.5937, lng: 78.9629, yearly: 3600, name: 'India' },
  US: { lat: 37.0902, lng: -95.7129, yearly: 15500, name: 'United States' },
  GB: { lat: 55.3781, lng: -3.436, yearly: 5700, name: 'United Kingdom' },
  DE: { lat: 51.1657, lng: 10.4515, yearly: 8200, name: 'Germany' },
  FR: { lat: 46.6034, lng: 1.8883, yearly: 4700, name: 'France' },
  JP: { lat: 36.2048, lng: 138.2529, yearly: 8500, name: 'Japan' },
  CN: { lat: 35.8617, lng: 104.1954, yearly: 7700, name: 'China' },
  BR: { lat: -14.235, lng: -51.9253, yearly: 2200, name: 'Brazil' },
  AU: { lat: -25.2744, lng: 133.7751, yearly: 15300, name: 'Australia' },
  CA: { lat: 56.1304, lng: -106.3468, yearly: 15400, name: 'Canada' },
  KR: { lat: 35.9078, lng: 127.7669, yearly: 12100, name: 'South Korea' },
  IT: { lat: 41.8719, lng: 12.5674, yearly: 5500, name: 'Italy' },
  ES: { lat: 40.4637, lng: -3.7492, yearly: 5100, name: 'Spain' },
  MX: { lat: 23.6345, lng: -102.5528, yearly: 3600, name: 'Mexico' },
  SE: { lat: 60.1282, lng: 18.6435, yearly: 3700, name: 'Sweden' },
  NO: { lat: 60.472, lng: 8.4689, yearly: 6700, name: 'Norway' },
};

const containerStyle = { width: '100%', height: '450px', borderRadius: '12px' };
const defaultCenter = { lat: 25, lng: 0 };

function emissionToColor(ratio: number): string {
  const hue = Math.round(120 - ratio * 120);
  return `hsl(${hue}, 75%, 45%)`;
}

interface GoogleCarbonMapProps {
  totalKg: number;
  country: string;
  breakdown: Record<string, number>;
}

export function GoogleCarbonMap({ totalKg, country }: GoogleCarbonMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const sortedCountries = useMemo(() => {
    return Object.entries(COUNTRY_DATA)
      .map(([code, data]) => ({ code, ...data }))
      .sort((a, b) => a.yearly - b.yearly);
  }, []);

  const maxYearly = useMemo(
    () => Math.max(...Object.values(COUNTRY_DATA).map(d => d.yearly)),
    []
  );

  const onLoad = useCallback(() => {}, []);
  const onUnmount = useCallback(() => {}, []);

  const userCountryData = COUNTRY_DATA[country];
  const barMax = Math.max(...sortedCountries.map(c => c.yearly), totalKg);

  if (loadError) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <p className="text-red-400">Failed to load Google Maps</p>
          <p className="text-white/40 text-sm mt-2">
            Ensure <code className="text-green-400">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> is set in your .env file.
          </p>
        </div>
      </GlassCard>
    );
  }

  if (!isLoaded) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm mt-3">Loading map...</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-semibold mb-4">Global Carbon Comparison</h3>
      <p className="text-sm text-white/50 mb-4">
        Circle size = annual CO₂ per capita | Color = relative intensity
      </p>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={2}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
            { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }, { lightness: 30 }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0f1d35' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
            { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#1a3a5c' }, { weight: 0.5 }] },
          ],
        }}
      >
        {Object.entries(COUNTRY_DATA).map(([code, d]) => {
          const ratio = d.yearly / maxYearly;
          const radius = 150000 + ratio * 500000;
          const color = emissionToColor(ratio);
          const isSelected = selectedCountry === code;

          return (
            <Circle
              key={code}
              center={{ lat: d.lat, lng: d.lng }}
              radius={radius}
              options={{
                fillColor: code === country ? '#22c55e' : color,
                fillOpacity: code === country ? 0.4 : 0.25,
                strokeColor: code === country ? '#22c55e' : color,
                strokeOpacity: 0.8,
                strokeWeight: code === country ? 3 : 2,
                clickable: true,
                zIndex: code === country ? 100 : 1,
              }}
              onClick={() => setSelectedCountry(isSelected ? null : code)}
            />
          );
        })}

        {selectedCountry && COUNTRY_DATA[selectedCountry] && (
          <InfoWindow
            position={{
              lat: COUNTRY_DATA[selectedCountry].lat + 8,
              lng: COUNTRY_DATA[selectedCountry].lng,
            }}
            onCloseClick={() => setSelectedCountry(null)}
          >
            <div className="p-2 min-w-[180px]">
              <div className="font-bold text-base text-gray-900">
                {COUNTRY_DATA[selectedCountry].name} ({selectedCountry})
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Avg per capita:{' '}
                <span className="font-semibold text-gray-900">
                  {formatCO2(COUNTRY_DATA[selectedCountry].yearly)}/year
                </span>
              </div>
              {selectedCountry === country && (
                <div className="text-sm mt-1">
                  <span className="text-gray-600">Your footprint: </span>
                  <span className="font-semibold text-green-600">{formatCO2(totalKg)}</span>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="flex items-center justify-center gap-3 mt-4 mb-6">
        <span className="text-[10px] text-white/30">Low</span>
        <div className="w-32 h-2 rounded-full" style={{
          background: 'linear-gradient(to right, hsl(120, 75%, 45%), hsl(60, 75%, 45%), hsl(0, 75%, 45%))',
        }} />
        <span className="text-[10px] text-white/30">High</span>
      </div>

      <div className="space-y-1.5">
        {sortedCountries.map((c) => {
          const width = (c.yearly / barMax) * 100;
          const isUser = c.code === country;

          return (
            <div key={c.code} className="flex items-center gap-3 group">
              <span className={`w-8 text-xs font-medium shrink-0 ${isUser ? 'text-green-400' : 'text-white/40'}`}>
                {c.code}
              </span>
              <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isUser
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className={`w-20 text-xs text-right shrink-0 ${isUser ? 'text-green-400 font-medium' : 'text-white/30'}`}>
                {formatCO2(c.yearly)}
              </span>
            </div>
          );
        })}
      </div>

      {userCountryData && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-sm text-white/80">
            Your footprint: <span className="text-green-400 font-semibold">{formatCO2(totalKg)}</span>
            {' — '}
            {totalKg < userCountryData.yearly
              ? `${Math.round((1 - totalKg / userCountryData.yearly) * 100)}% below ${country} average`
              : `${Math.round((totalKg / userCountryData.yearly - 1) * 100)}% above ${country} average`
            }
          </p>
        </div>
      )}

      <p className="text-[10px] text-white/20 text-center mt-4">
        Data sourced from EPA, IPCC, and national environmental agencies
      </p>
    </GlassCard>
  );
}
