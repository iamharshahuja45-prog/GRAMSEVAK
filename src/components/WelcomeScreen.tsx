import React from 'react';
import { HeartPulse, ArrowRight, ShieldCheck, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 text-center select-none animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center">
        {/* Healthcare Emblem */}
        <div className="relative mb-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 animate-pulse">
            <HeartPulse className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-md border border-slate-100 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Main Brand Title: SWASTHYASATHI */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1 uppercase">
          SWASTHYASATHI
        </h1>

        {/* Hindi Brand Name */}
        <div className="text-xl sm:text-2xl font-bold text-emerald-700 mb-3">
          स्वास्थ्यसाथी
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base font-semibold text-slate-700 mb-3 max-w-sm leading-relaxed">
          आपके स्वास्थ्य की देखभाल, आपकी अपनी भाषा में
        </p>

        {/* Short Mission Description */}
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed max-w-md">
          सरल, पारदर्शी स्वास्थ्य मूल्यांकन, आपातकालीन चेतावनी एवं प्रामाणिक प्राथमिक देखभाल का आपका भरोसेमंद मंच।
        </p>

        {/* Feature Highlights */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-800">100% सरल हिंदी</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-800">आपातकालीन 112 सहायता</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-800">उन्नत 3D एनाटॉमी दृश्य</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-800">प्रमाणित प्राथमिक देखभाल</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
        >
          <span>स्वास्थ्य जाँच आरंभ करें</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>

        {/* Helpful Info Footer Note */}
        <div className="mt-4 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>निजी और सुरक्षित • किसी पंजीकरण की आवश्यकता नहीं</span>
        </div>
      </div>
    </div>
  );
};
