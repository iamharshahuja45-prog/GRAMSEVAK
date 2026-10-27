import React, { useState } from 'react';
import { HOME_CARE_LIBRARY, HomeCareAdvice } from '../data/homeCareLibrary';
import {
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  XCircle,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HomeCareSectionProps {
  suitableHomeCareIds: string[];
}

export const HomeCareSection: React.FC<HomeCareSectionProps> = ({ suitableHomeCareIds }) => {
  // Get home care records for reported symptoms
  const advices: HomeCareAdvice[] = [];
  const addedIds = new Set<string>();

  for (const id of suitableHomeCareIds) {
    if (HOME_CARE_LIBRARY[id] && !addedIds.has(id)) {
      advices.push(HOME_CARE_LIBRARY[id]);
      addedIds.add(id);
    }
  }

  // If none matched, provide fever/general guidance
  if (advices.length === 0 && HOME_CARE_LIBRARY['fever']) {
    advices.push(HOME_CARE_LIBRARY['fever']);
  }

  const [expandedId, setExpandedId] = useState<string>(advices[0]?.symptomId || 'fever');

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            घर पर अपनी देखभाल कैसे करें?
          </h3>
          <p className="text-xs text-slate-500">
            सरकारी एवं विश्व स्वास्थ्य संगठन के मानकों पर आधारित प्राथमिक सहायता
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
        <strong>महत्वपूर्ण सुरक्षा सूचना:</strong> यह प्राथमिक घरेलू देखभाल केवल लक्षणों को शांत करने और राहत देने के लिए है, किसी बीमारी का स्थायी इलाज नहीं। बिना डॉक्टर के पर्चे के कोई भी एंटीबायोटिक या अज्ञात दवा कभी न लें।
      </div>

      {/* Symptom Cards */}
      <div className="space-y-4">
        {advices.map((advice) => {
          const isExpanded = expandedId === advice.symptomId;
          return (
            <div
              key={advice.symptomId}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? '' : advice.symptomId)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {advice.symptomNameHindi}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{isExpanded ? 'कम देखें' : 'विस्तार से देखें'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Content (6 Pillars) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-4 bg-white border-t border-slate-200">
                  {/* 1. क्या करना चाहिए? */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>1. क्या करना चाहिए?</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
                      {advice.whatToDo.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. इसे कैसे करना चाहिए? */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>2. इसे कैसे करना चाहिए? (प्रमाणित विधि)</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
                      {advice.howToDoIt.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. इससे क्या लाभ हो सकता है? */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>3. इससे क्या लाभ हो सकता है?</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
                      {advice.benefits.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 4. किन बातों से बचना चाहिए? */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-red-800 uppercase tracking-wide flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>4. किन बातों से बचना चाहिए? (हानिकारक आदतें)</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
                      {advice.whatToAvoid.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 5. कब चिकित्सकीय सहायता लेनी चाहिए? */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-amber-600" />
                      <span>5. कब डॉक्टर से मिलना चाहिए?</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
                      {advice.whenToConsultDoctor.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 6. आपातकालीन चेतावनी संकेत */}
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1.5">
                    <h5 className="text-xs font-bold text-red-900 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>6. तुरंत आपातकालीन सहायता (Red Flags)</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-red-950 space-y-1 pl-1 font-medium">
                      {advice.emergencyRedFlags.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Source Attribution Metadata */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <div>
                      <span>स्रोत: </span>
                      <strong className="text-slate-700">{advice.source.organization}</strong>
                      <span> — {advice.source.documentTitle} ({advice.source.guidelineYear})</span>
                    </div>
                    {advice.source.sourceUrl && (
                      <a
                        href={advice.source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>आधिकारिक दिशानिर्देश</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
