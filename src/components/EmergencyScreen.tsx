import React, { useState } from 'react';
import { EmergencyScreeningAnswers, PregnancyStatus } from '../types/health';
import { EMERGENCY_QUESTIONS } from '../data/emergencyQuestions';
import { AlertOctagon, PhoneCall, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EmergencyScreenProps {
  pregnancyStatus: PregnancyStatus;
  initialAnswers: EmergencyScreeningAnswers;
  onBack: () => void;
  onSubmit: (answers: EmergencyScreeningAnswers) => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  pregnancyStatus,
  initialAnswers,
  onBack,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<EmergencyScreeningAnswers>(initialAnswers);

  const isPregnancyRelevant = pregnancyStatus === 'yes' || pregnancyStatus === 'not_sure';

  // Filter applicable questions
  const questions = EMERGENCY_QUESTIONS.filter(
    (q) => !q.isPregnancySpecific || isPregnancyRelevant
  );

  // Check if any emergency flag is currently TRUE
  const hasEmergencyTriggered = Object.values(answers).some((val) => val === true);

  const handleToggle = (id: keyof EmergencyScreeningAnswers, value: boolean) => {
    const updated = { ...answers, [id]: value };
    setAnswers(updated);
  };

  const handleSelectAllNo = () => {
    const allNo: EmergencyScreeningAnswers = {
      severeBreathingDifficulty: false,
      severeChestPain: false,
      unconsciousOrAlteredState: false,
      suddenWeaknessOrNumbness: false,
      speechDifficulty: false,
      heavyBleeding: false,
      throatSwellingWithStridor: false,
      seizuresOrConvulsions: false,
      suddenSevereHeadache: false,
      severePregnancyDistress: false,
    };
    setAnswers(allNo);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-lg shadow-slate-100">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold mb-2">
            चरण 3 : जीवनरक्षक आपातकालीन जाँच (Emergency Screening)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            महत्वपूर्ण आपातकालीन संकेत
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            कृपया नीचे दिए गए गंभीर चेतावनी संकेतों को ध्यान से पढ़ें। किसी भी आपातकालीन स्थिति में तुरंत अस्पताल जाना अनिवार्य है।
          </p>
        </div>

        {/* IMMEDIATE EMERGENCY BANNER (If any YES is selected) */}
        {hasEmergencyTriggered && (
          <div className="mb-6 p-4 sm:p-5 bg-red-600 text-white rounded-3xl shadow-xl shadow-red-200 border-2 border-red-700 animate-bounce-short">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertOctagon className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight">
                  आपातकालीन चेतावनी! तुरंत चिकित्सा सहायता लें
                </h3>
                <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
                  आपके द्वारा बताए गए लक्षण अत्यंत गंभीर हो सकते हैं। कृपया किसी भी रिपोर्ट या घरेलू नुस्खे की प्रतीक्षा न करें। तुरंत आपातकालीन एम्बुलेंस बुलाएं अथवा नजदीकी अस्पताल जाएं।
                </p>
              </div>
            </div>

            {/* Direct Calling Action inside Banner */}
            <div className="mt-4 pt-3 border-t border-red-500/80 flex flex-wrap gap-2.5 items-center">
              <a
                href="tel:112"
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-white text-red-700 hover:bg-red-50 active:scale-95 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4 fill-red-700" />
                <span>तुरंत 112 पर कॉल करें</span>
              </a>
              <a
                href="tel:108"
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-red-800 hover:bg-red-900 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 border border-red-400 shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>108 एम्बुलेंस बुलाएं</span>
              </a>
            </div>

            <p className="text-[10px] text-red-200 mt-2 text-center">
              * स्वास्थ्यसाथी (SWASTHYASATHI) मंच किसी सरकारी वाहन के पहुँचने के समय की गारंटी नहीं लेता है। यदि सरकारी वाहन में समय लगे तो तुरंत निजी साधन से अस्पताल पहुँचें।
            </p>
          </div>
        )}

        {/* Quick Fill All No Button */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={handleSelectAllNo}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>इनमें से कोई भी लक्षण नहीं है (सभी 'नहीं' चुनें)</span>
          </button>
        </div>

        {/* Emergency Questions List */}
        <div className="space-y-3">
          {questions.map((q) => {
            const isYes = answers[q.id] === true;
            return (
              <div
                key={q.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isYes
                    ? 'bg-red-50 border-red-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {q.questionHindi}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {q.contextHindi}
                    </p>
                  </div>

                  {/* Yes / No Toggle Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(q.id, true)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isYes
                          ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      हाँ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(q.id, false)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        !isYes
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      नहीं
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation & Submission */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="py-3.5 px-5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>पीछे जाएं</span>
          </button>

          <button
            type="button"
            onClick={() => onSubmit(answers)}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 group ${
              hasEmergencyTriggered
                ? 'bg-red-700 hover:bg-red-800 text-white shadow-red-200'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-200'
            }`}
          >
            <span>
              {hasEmergencyTriggered
                ? 'आपातकालीन स्वास्थ्य रिपोर्ट देखें'
                : 'स्वास्थ्य रिपोर्ट तैयार करें'}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
