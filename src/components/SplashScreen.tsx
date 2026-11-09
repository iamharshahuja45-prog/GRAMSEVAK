import React, { useEffect, useState } from 'react';
import { Sparkles, HeartPulse, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // stages: 'visible' -> 'fading' -> 'done'
  const [stage, setStage] = useState<'visible' | 'fading' | 'done'>('visible');

  useEffect(() => {
    // 1. Show the name prominently for 1.8 seconds
    const showTimer = setTimeout(() => {
      setStage('fading');
    }, 1800);

    // 2. Allow 1.2 seconds for the slow fade-out transition, then complete
    const fadeTimer = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  if (stage === 'done') {
    return null;
  }

  const handleSkip = () => {
    setStage('done');
    onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden transition-all duration-1000 ease-in-out ${
        stage === 'fading' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #064e3b 0%, #022c22 45%, #020617 100%)',
      }}
      aria-label="SWASTHYASATHI परिचयात्मक पर्दा"
      role="banner"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl -top-20 -left-20 animate-pulse pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-teal-500/15 blur-3xl -bottom-20 -right-20 animate-pulse pointer-events-none" />

      {/* Center Brand Identity */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl mx-auto transform transition-all duration-700 ease-out">
        {/* Healthcare Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/40">
            <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
              <HeartPulse className="w-14 h-14 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-2xl shadow-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Primary Name Display: SWASTHYASATHI */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 drop-shadow-xl animate-fade-in">
          SWASTHYASATHI
        </h1>

        {/* Hindi Name */}
        <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-wide font-sans">
          स्वास्थ्यसाथी
        </div>

        {/* Tagline */}
        <p className="mt-3 text-sm sm:text-base text-emerald-100/80 font-medium tracking-wider max-w-sm">
          आपका डिजिटल स्वास्थ्य साथी
        </p>

        {/* Subtle animated indicator */}
        <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-emerald-200/70">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>वेबसाइट लोड हो रही है...</span>
        </div>

        {/* Skip hint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="mt-6 text-[11px] text-slate-400 hover:text-white transition-colors underline underline-offset-4"
        >
          आगे बढ़ें (छोड़ें)
        </button>
      </div>
    </div>
  );
};
