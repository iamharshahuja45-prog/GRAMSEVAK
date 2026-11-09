import React, { useState, useRef } from 'react';
import { BodyRegion, UrgencyLevel } from '../types/health';
import { BodyMap2D } from './BodyMap2D';
import { ExternalLink, Maximize2, Sparkles, Layers, Activity, AlertCircle } from 'lucide-react';

interface BodyAvatar3DProps {
  symptomRegions: {
    region: BodyRegion;
    urgency: UrgencyLevel;
    symptomNamesHindi: string[];
  }[];
  onSelectRegion?: (region: BodyRegion) => void;
  selectedRegion?: BodyRegion | null;
}

export const BodyAvatar3D: React.FC<BodyAvatar3DProps> = ({
  symptomRegions,
  onSelectRegion,
  selectedRegion,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const sketchfabModelId = '9b0b079953b840bc9a13f524b60041e4';
  const sketchfabEmbedUrl = `https://sketchfab.com/models/${sketchfabModelId}/embed?autostart=1&preload=1&ui_theme=dark&autospin=0.1&ui_hint=2`;
  const sketchfabDirectUrl = `https://sketchfab.com/3d-models/animated-full-human-body-anatomy-${sketchfabModelId}`;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const getRegionHindi = (region: BodyRegion): string => {
    switch (region) {
      case 'head':
        return 'सिर (Head / Brain)';
      case 'neck':
        return 'गला (Neck)';
      case 'chest':
        return 'छाती (Chest / Heart & Lungs)';
      case 'abdomen':
        return 'पेट (Abdomen / Internal Organs)';
      case 'arms':
        return 'बाँहें (Arms)';
      case 'legs':
        return 'पैर एवं जोड़ (Legs & Joints)';
      case 'skin':
        return 'त्वचा (Skin / Generalized)';
      default:
        return region;
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              उन्नत 3D मानव शरीर संरचना (Advanced 3D Anatomy)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            विस्तृत 3D एनाटॉमी मॉडल (कंकाल, मांसपेशियां, हृदय, फेफड़े और आंतरिक अंग) एवं आपके लक्षणों का दृश्य
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3D एनाटॉमी मॉडल
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === '2d'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2D लक्षण मानचित्र
          </button>
        </div>
      </div>

      {/* Main Model View */}
      {viewMode === '3d' ? (
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg"
        >
          {/* Top Bar inside 3D viewer */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white text-[11px] font-semibold pointer-events-auto shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Animated Full Human Body Anatomy</span>
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white border border-slate-700/60 shadow-md transition-all"
                title="फुलस्क्रीन में देखें"
                aria-label="फुलस्क्रीन"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <a
                href={sketchfabDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white border border-slate-700/60 text-xs font-medium shadow-md transition-all"
                title="Sketchfab पर देखें"
              >
                <span>Sketchfab</span>
                <ExternalLink className="w-3 h-3 text-slate-300" />
              </a>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isIframeLoading && (
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin mb-3"></div>
              <p className="text-xs font-medium text-slate-300">
                उन्नत 3D एनाटॉमी मॉडल लोड हो रहा है...
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                (हाई-डेफिनिशन शारीरिक संरचना)
              </p>
            </div>
          )}

          {/* Sketchfab Advanced 3D Anatomy Model Iframe */}
          <iframe
            title="Animated Full Human Body Anatomy"
            src={sketchfabEmbedUrl}
            onLoad={() => setIsIframeLoading(false)}
            className="w-full h-80 sm:h-[480px] md:h-[540px] border-0 relative z-5"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />

          {/* Bottom Interactive Hint */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-200 text-[11px] font-medium pointer-events-auto shadow-md">
              💡 360° घुमाने के लिए खींचें, ज़ूम करें और अंगों की आंतरिक संरचना देखें
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md pointer-events-auto">
              मॉडल: AVRcontent (Sketchfab)
            </span>
          </div>
        </div>
      ) : (
        /* 2D Symptom Map View */
        <BodyMap2D
          symptomRegions={symptomRegions}
          onSelectRegion={onSelectRegion}
          selectedRegion={selectedRegion}
        />
      )}

      {/* Reported Affected Body Regions Badges */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>आपके दर्ज लक्षणों से प्रभावित शारीरिक अंग:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {symptomRegions.length > 0
              ? `${symptomRegions.length} अंग पहचाने गए`
              : 'कोई विशिष्ट अंग प्रभावित नहीं'}
          </span>
        </div>

        {symptomRegions.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {symptomRegions.map((sr, idx) => {
              const isUrgent = sr.urgency === 'RED';
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onSelectRegion?.(sr.region)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 ${
                    isUrgent
                      ? 'bg-red-50 text-red-800 border-red-300 shadow-sm'
                      : 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                  } ${selectedRegion === sr.region ? 'ring-2 ring-slate-800' : ''}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isUrgent ? 'bg-red-600 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span>{getRegionHindi(sr.region)}:</span>
                  <span className="font-normal">{sr.symptomNamesHindi.join(', ')}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isUrgent ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {isUrgent ? 'तत्काल' : 'सावधानी'}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            आपके द्वारा दर्ज किए गए लक्षणों में कोई गंभीर स्थानीय अंग संलिप्तता नहीं पाई गई है।
          </p>
        )}
      </div>

      {/* Clinical Anatomy Disclaimer */}
      <div className="text-center text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        "यह 3D एनाटॉमी मॉडल मानव शरीर विज्ञान और लक्षणों के संबंध को समझाने के लिए है। यह किसी आंतरिक रोग का व्यक्तिगत स्कैन अथवा सीटी/एमआरआई परीक्षण नहीं है।"
      </div>
    </div>
  );
};
