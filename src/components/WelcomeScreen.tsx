import React, { useEffect, useState } from 'react';
import { HeartPulse, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [countdown, setCountdown] = useState<number>(2);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Auto transition immediately or wait briefly
      const timer = setTimeout(() => {
        onStart();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onStart]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center">
        {/* Healthcare Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 animate-pulse">
            <HeartPulse className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-md border border-slate-100">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          ग्रामसेवक
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-emerald-800 mb-4 max-w-xs leading-relaxed">
          आपके स्वास्थ्य की देखभाल, आपकी अपनी भाषा में
        </p>

        {/* Short Mission Description */}
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          ग्रामीण भारत के लिए सरल, पारदर्शी स्वास्थ्य मूल्यांकन, आपातकालीन चेतावनी एवं प्रामाणिक प्राथमिक देखभाल मंच।
        </p>

        {/* Feature Highlights */}
        <div className="w-full grid grid-cols-2 gap-2 mb-6 text-left">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] font-semibold text-slate-700">100% सरल हिंदी</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] font-semibold text-slate-700">आपातकालीन 112 सहायता</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] font-semibold text-slate-700">3D शरीर लक्षण दृश्य</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] font-semibold text-slate-700">प्रमाणित प्राथमिक देखभाल</span>
          </div>
        </div>

        {/* Immediate Entry Button */}
        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
        >
          <span>स्वास्थ्य जाँच आरंभ करें</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Automatic transition countdown hint */}
        <div className="text-[11px] text-slate-600 mt-4 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>{countdown} सेकंड में स्वतः आगे बढ़ रहा है...</span>
        </div>
      </div>
    </div>
  );
};
