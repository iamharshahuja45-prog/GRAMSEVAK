import React from 'react';
import { BodyRegion, UrgencyLevel } from '../types/health';

interface BodyMap2DProps {
  symptomRegions: {
    region: BodyRegion;
    urgency: UrgencyLevel;
    symptomNamesHindi: string[];
  }[];
  onSelectRegion?: (region: BodyRegion) => void;
  selectedRegion?: BodyRegion | null;
}

export const BodyMap2D: React.FC<BodyMap2DProps> = ({
  symptomRegions,
  onSelectRegion,
  selectedRegion,
}) => {
  const getRegionColor = (region: BodyRegion): { fill: string; stroke: string; label: string } => {
    const found = symptomRegions.find((r) => r.region === region);
    if (!found) {
      return { fill: '#e2e8f0', stroke: '#94a3b8', label: 'सामान्य' };
    }
    if (found.urgency === 'RED') {
      return { fill: '#f87171', stroke: '#dc2626', label: 'तत्काल सहायता' };
    }
    return { fill: '#fde047', stroke: '#ca8a04', label: 'सावधानी आवश्यक' };
  };

  const regions: { id: BodyRegion; nameHindi: string }[] = [
    { id: 'head', nameHindi: 'सिर' },
    { id: 'neck', nameHindi: 'गला' },
    { id: 'chest', nameHindi: 'छाती' },
    { id: 'abdomen', nameHindi: 'पेट' },
    { id: 'arms', nameHindi: 'बाँहें' },
    { id: 'legs', nameHindi: 'पैर एवं जोड़' },
    { id: 'skin', nameHindi: 'त्वचा' },
  ];

  return (
    <div className="w-full flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="text-sm font-semibold text-slate-700 mb-3 text-center">
        मानव शरीर लक्षण मानचित्र (2D दृश्य)
      </div>

      <div className="relative w-64 h-80 flex justify-center items-center">
        <svg
          viewBox="0 0 200 320"
          className="w-full h-full max-h-72 drop-shadow-sm select-none"
          role="img"
          aria-label="मानव शरीर लक्षण मानचित्र"
        >
          {/* Head */}
          <circle
            cx="100"
            cy="40"
            r="24"
            fill={getRegionColor('head').fill}
            stroke={selectedRegion === 'head' ? '#0f172a' : getRegionColor('head').stroke}
            strokeWidth={selectedRegion === 'head' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('head')}
          />
          {/* Neck */}
          <rect
            x="93"
            y="64"
            width="14"
            height="14"
            rx="3"
            fill={getRegionColor('neck').fill}
            stroke={selectedRegion === 'neck' ? '#0f172a' : getRegionColor('neck').stroke}
            strokeWidth={selectedRegion === 'neck' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('neck')}
          />
          {/* Chest */}
          <path
            d="M 68 80 L 132 80 L 126 130 L 74 130 Z"
            fill={getRegionColor('chest').fill}
            stroke={selectedRegion === 'chest' ? '#0f172a' : getRegionColor('chest').stroke}
            strokeWidth={selectedRegion === 'chest' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('chest')}
          />
          {/* Abdomen */}
          <path
            d="M 74 133 L 126 133 L 120 175 L 80 175 Z"
            fill={getRegionColor('abdomen').fill}
            stroke={selectedRegion === 'abdomen' ? '#0f172a' : getRegionColor('abdomen').stroke}
            strokeWidth={selectedRegion === 'abdomen' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('abdomen')}
          />
          {/* Left Arm */}
          <path
            d="M 64 85 L 42 145 L 48 147 L 68 95 Z"
            fill={getRegionColor('arms').fill}
            stroke={selectedRegion === 'arms' ? '#0f172a' : getRegionColor('arms').stroke}
            strokeWidth={selectedRegion === 'arms' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('arms')}
          />
          {/* Right Arm */}
          <path
            d="M 136 85 L 158 145 L 152 147 L 132 95 Z"
            fill={getRegionColor('arms').fill}
            stroke={selectedRegion === 'arms' ? '#0f172a' : getRegionColor('arms').stroke}
            strokeWidth={selectedRegion === 'arms' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('arms')}
          />
          {/* Left Leg */}
          <path
            d="M 82 178 L 74 275 L 88 275 L 96 178 Z"
            fill={getRegionColor('legs').fill}
            stroke={selectedRegion === 'legs' ? '#0f172a' : getRegionColor('legs').stroke}
            strokeWidth={selectedRegion === 'legs' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('legs')}
          />
          {/* Right Leg */}
          <path
            d="M 104 178 L 112 275 L 126 275 L 118 178 Z"
            fill={getRegionColor('legs').fill}
            stroke={selectedRegion === 'legs' ? '#0f172a' : getRegionColor('legs').stroke}
            strokeWidth={selectedRegion === 'legs' ? '3' : '2'}
            className="cursor-pointer transition-colors"
            onClick={() => onSelectRegion?.('legs')}
          />
          {/* Feet */}
          <ellipse cx="80" cy="282" rx="10" ry="5" fill="#94a3b8" />
          <ellipse cx="120" cy="282" rx="10" ry="5" fill="#94a3b8" />
        </svg>
      </div>

      {/* Region click helper badges */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-sm">
        {regions.map((r) => {
          const regionInfo = symptomRegions.find((sr) => sr.region === r.id);
          const isRed = regionInfo?.urgency === 'RED';
          const isYellow = regionInfo?.urgency === 'YELLOW';
          return (
            <button
              key={r.id}
              onClick={() => onSelectRegion?.(r.id)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                selectedRegion === r.id
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900'
                  : isRed
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : isYellow
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {r.nameHindi} {isRed ? '⚠️' : isYellow ? '🟡' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};
