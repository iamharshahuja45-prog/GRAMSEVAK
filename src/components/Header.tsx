import React from 'react';
import { HeartPulse, ShieldCheck, PhoneCall, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenPrivacy: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPrivacy, onReset }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onReset()}
          aria-label="ग्रामसेवक मुख्य पृष्ठ"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                ग्रामसेवक
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                स्वास्थ्य सेवा
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              आपके स्वास्थ्य की देखभाल, आपकी अपनी भाषा में
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Emergency 112 Direct Action */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors active:scale-95"
            title="आपातकालीन 112 कॉल करें"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-white" />
            <span>112 आपातकाल</span>
          </a>

          {/* Privacy Button */}
          <button
            onClick={onOpenPrivacy}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="गोपनीयता नीति"
            aria-label="गोपनीयता नीति"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          {/* Reset App Button */}
          <button
            onClick={onReset}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="शुरुआत से शुरू करें"
            aria-label="शुरुआत से शुरू करें"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
