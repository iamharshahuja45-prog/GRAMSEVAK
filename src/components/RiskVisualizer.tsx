import React from 'react';
import { UrgencyLevel } from '../types/health';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskVisualizerProps {
  urgency: UrgencyLevel;
  isEmergency: boolean;
}

export const RiskVisualizer: React.FC<RiskVisualizerProps> = ({ urgency, isEmergency }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center justify-between">
          <span>जोखिम एवं तात्कालिकता पैमाना (Risk & Urgency Bar)</span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
              urgency === 'RED'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : urgency === 'YELLOW'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}
          >
            {urgency === 'RED' && <AlertOctagon className="w-3.5 h-3.5" />}
            {urgency === 'YELLOW' && <AlertTriangle className="w-3.5 h-3.5" />}
            {urgency === 'GREEN' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {urgency === 'RED' ? 'तत्काल सहायता' : urgency === 'YELLOW' ? 'सावधानी आवश्यक' : 'कम तत्काल चिंता'}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          यह पैमाना लक्षणों की तात्कालिकता को दर्शाता है, किसी बीमारी की निश्चित संभावना को नहीं।
        </p>
      </div>

      {/* Horizontal Multi-Zone Bar */}
      <div className="relative pt-6 pb-2">
        {/* Pointer Marker */}
        <div
          className="absolute top-0 transition-all duration-500 ease-out flex flex-col items-center -translate-x-1/2 z-10"
          style={{
            left: urgency === 'GREEN' ? '16.6%' : urgency === 'YELLOW' ? '50%' : '83.3%',
          }}
        >
          <div className="bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap mb-1">
            आपकी स्थिति
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-slate-900"></div>
        </div>

        {/* 3 Color Zones */}
        <div className="grid grid-cols-3 h-6 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
          {/* Green Zone */}
          <div
            className={`flex items-center justify-center text-xs font-bold transition-opacity ${
              urgency === 'GREEN'
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-600 ring-inset'
                : 'bg-emerald-200 text-emerald-800 opacity-60'
            }`}
          >
            कम चिंता
          </div>

          {/* Yellow Zone */}
          <div
            className={`flex items-center justify-center text-xs font-bold transition-opacity ${
              urgency === 'YELLOW'
                ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-500 ring-inset'
                : 'bg-amber-100 text-amber-800 opacity-60'
            }`}
          >
            सावधानी
          </div>

          {/* Red Zone */}
          <div
            className={`flex items-center justify-center text-xs font-bold transition-opacity ${
              urgency === 'RED'
                ? 'bg-red-600 text-white ring-2 ring-red-700 ring-inset'
                : 'bg-red-200 text-red-900 opacity-60'
            }`}
          >
            तत्काल सहायता
          </div>
        </div>
      </div>

      {/* Explanatory cards below each zone */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
        <div
          className={`p-2 rounded-xl text-xs transition-all ${
            urgency === 'GREEN'
              ? 'bg-green-50 border border-green-200 font-semibold text-green-900 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <div className="font-bold">हरा (Green)</div>
          <div className="text-[11px] mt-0.5">कोई स्पष्ट आपातकालीन संकेत नहीं</div>
        </div>

        <div
          className={`p-2 rounded-xl text-xs transition-all ${
            urgency === 'YELLOW'
              ? 'bg-amber-50 border border-amber-200 font-semibold text-amber-900 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <div className="font-bold">पीला (Yellow)</div>
          <div className="text-[11px] mt-0.5">चिकित्सकीय परामर्श लेना उचित</div>
        </div>

        <div
          className={`p-2 rounded-xl text-xs transition-all ${
            urgency === 'RED'
              ? 'bg-red-50 border border-red-200 font-semibold text-red-900 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <div className="font-bold">लाल (Red)</div>
          <div className="text-[11px] mt-0.5">तुरंत अस्पताल या 112 सहायता</div>
        </div>
      </div>
    </div>
  );
};
