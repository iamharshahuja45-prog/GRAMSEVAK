import React, { useState } from 'react';
import { AssessmentResult } from '../engine/types';
import { PersonalInfo, SymptomDetails, HealthMeasurements, BodyRegion, UrgencyLevel } from '../types/health';
import { SYMPTOM_LIST } from '../data/symptoms';
import { RiskVisualizer } from './RiskVisualizer';
import { BodyAvatar3D } from './BodyAvatar3D';
import { HomeCareSection } from './HomeCareSection';
import { HealthCentreFinder } from './HealthCentreFinder';
import { DisclaimerNotice } from './DisclaimerNotice';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  ListChecks,
  PhoneCall,
  RotateCcw,
  User,
  HeartPulse,
} from 'lucide-react';

interface ReportScreenProps {
  result: AssessmentResult;
  personal: PersonalInfo;
  health: HealthMeasurements;
  symptoms: SymptomDetails;
  onReset: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  result,
  personal,
  health,
  symptoms,
  onReset,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);

  // Map reported symptoms to Body Regions for 3D/2D Avatar
  const symptomRegions: {
    region: BodyRegion;
    urgency: UrgencyLevel;
    symptomNamesHindi: string[];
  }[] = [];

  const regionMap = new Map<BodyRegion, { urgency: UrgencyLevel; names: string[] }>();

  symptoms.primarySymptoms.forEach((symId) => {
    const found = SYMPTOM_LIST.find((s) => s.id === symId);
    if (!found) return;

    const existing = regionMap.get(found.bodyRegion) || {
      urgency: 'RED',
      names: [],
    };

    // Any harmed body part turns into RED zone
    existing.urgency = 'RED';

    existing.names.push(found.hindiName);
    regionMap.set(found.bodyRegion, existing);
  });

  regionMap.forEach((val, reg) => {
    symptomRegions.push({
      region: reg,
      urgency: val.urgency,
      symptomNamesHindi: val.names,
    });
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
            चरण 4 : आपका स्वास्थ्य विश्लेषण
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            आपकी स्वास्थ्य रिपोर्ट
          </h2>
          <p className="text-xs text-slate-500">
            {personal.name ? `${personal.name} जी की रिपोर्ट` : 'अनाम उपयोगकर्ता की रिपोर्ट'} •{' '}
            आयु: {personal.age !== null ? `${personal.age} वर्ष` : 'दर्ज नहीं'}
          </p>
        </div>

        <button
          onClick={onReset}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>नई स्वास्थ्य जाँच करें</span>
        </button>
      </div>

      {/* EMERGENCY BANNER (If RED) */}
      {result.urgency === 'RED' && (
        <div className="p-5 sm:p-6 bg-red-600 text-white rounded-3xl shadow-xl shadow-red-200 border-2 border-red-700 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">
                तत्काल चिकित्सा सहायता लें (Red Alert)
              </h3>
              <p className="text-xs sm:text-sm text-red-100 mt-1 leading-relaxed font-medium">
                गंभीर समस्या की आशंका है। किसी भी घरेलू उपचार में समय न गंवाएं और तुरंत आपातकालीन चिकित्सा सहायता लें।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-red-500">
            <a
              href="tel:112"
              className="py-3 px-6 rounded-2xl bg-white text-red-700 hover:bg-red-50 active:scale-95 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4 fill-red-700" />
              <span>तुरंत 112 डायल करें</span>
            </a>
            <a
              href="tel:108"
              className="py-3 px-6 rounded-2xl bg-red-800 hover:bg-red-900 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 border border-red-400 shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>108 एम्बुलेंस सेवा</span>
            </a>
          </div>
        </div>
      )}

      {/* Horizontal Multi-Zone Risk Visualizer */}
      <RiskVisualizer urgency={result.urgency} isEmergency={result.isEmergency} />

      {/* 2-Column Grid: Assessment Explanations & Doctor Timeframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: यह सलाह क्यों दी गई है? */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              यह सलाह क्यों दी गई है?
            </h3>
          </div>

          {/* Triggered Reasons List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              पहचाने गए मुख्य कारण:
            </h4>
            <ul className="space-y-2">
              {result.reasonsHindi.map((reason, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerning Measurements or Symptoms */}
          {result.concerningMeasurements.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-900 block mb-1.5">
                ध्यान देने योग्य माप:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.concerningMeasurements.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold border border-amber-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing info & Uncertainty Warning */}
          {result.uncertaintyExplanationHindi && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              {result.uncertaintyExplanationHindi}
            </div>
          )}
        </div>

        {/* Card 2: डॉक्टर को कब दिखाना चाहिए? & तुरंत क्या करें? */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Healthcare Timeframe */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  result.urgency === 'RED'
                    ? 'bg-red-100 text-red-700'
                    : result.urgency === 'YELLOW'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                डॉक्टर को कब दिखाना चाहिए?
              </h3>
            </div>
            <div
              className={`p-3.5 rounded-2xl border font-bold text-sm sm:text-base leading-snug ${
                result.urgency === 'RED'
                  ? 'bg-red-50 text-red-900 border-red-300'
                  : result.urgency === 'YELLOW'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              {result.timeframeHindi}
            </div>
          </div>

          {/* Distance consideration note */}
          {result.distanceKmConsideration && (
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {result.distanceKmConsideration}
            </p>
          )}

          {/* Immediate Next Steps */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <ListChecks className="w-4 h-4 text-emerald-600" />
              <span>तुरंत क्या करें? (Next Steps)</span>
            </h4>
            <ul className="space-y-1.5">
              {result.immediateNextStepsHindi.map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-2 rounded-xl flex items-center gap-2 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3D Human Body Avatar & Symptom Mapping */}
      <BodyAvatar3D
        symptomRegions={symptomRegions}
        onSelectRegion={(reg) => setSelectedRegion(reg)}
        selectedRegion={selectedRegion}
      />

      {/* Detailed Evidence-Based Home-Care Guidance */}
      <HomeCareSection suitableHomeCareIds={result.suitableHomeCareIds} />

      {/* Nearby Healthcare Facility Discovery */}
      <HealthCentreFinder
        userDistanceKm={personal.nearestHealthCenterDistanceKm}
        urgency={result.urgency}
      />

      {/* Medical Sources Attribution */}
      {result.sourceReferences.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <span className="font-bold text-slate-700 block">
            संदर्भित नैदानिक दिशानिर्देश (Clinical Source References):
          </span>
          <div className="flex flex-wrap gap-2">
            {result.sourceReferences.map((ref, idx) => (
              <span
                key={idx}
                className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-600"
              >
                {ref.organization} — {ref.documentTitle} ({ref.guidelineYear})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medical Safety Disclaimer Notice */}
      <DisclaimerNotice />

      {/* Bottom Restart Button */}
      <div className="flex justify-center pt-4 pb-8">
        <button
          onClick={onReset}
          className="py-4 px-8 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>नई स्वास्थ्य जाँच शुरू करें</span>
        </button>
      </div>
    </div>
  );
};
