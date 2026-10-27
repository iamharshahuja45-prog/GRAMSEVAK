import React from 'react';
import { User, Activity, AlertCircle, FileText } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number; // 1 to 4
  onStepClick?: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { num: 1, labelHindi: 'व्यक्तिगत जानकारी', icon: User },
    { num: 2, labelHindi: 'स्वास्थ्य व लक्षण', icon: Activity },
    { num: 3, labelHindi: 'आपातकालीन जाँच', icon: AlertCircle },
    { num: 4, labelHindi: 'स्वास्थ्य रिपोर्ट', icon: FileText },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />

        {/* Active Progress Connecting Line */}
        <div
          className="absolute top-1/2 left-4 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${((Math.min(currentStep, 4) - 1) / (steps.length - 1)) * 92}%`,
          }}
        />

        {steps.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          const Icon = s.icon;

          return (
            <div
              key={s.num}
              onClick={() => {
                if (isDone && onStepClick) {
                  onStepClick(s.num);
                }
              }}
              className={`relative z-10 flex flex-col items-center select-none ${
                isDone ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-100 scale-105'
                    : isDone
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold mt-1.5 transition-colors hidden xs:block text-center max-w-[80px] sm:max-w-none ${
                  isCurrent
                    ? 'text-emerald-800 font-bold'
                    : isDone
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {s.labelHindi}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
