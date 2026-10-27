import React, { useState } from 'react';
import {
  HealthMeasurements,
  SymptomDetails,
  Gender,
  TemperatureUnit,
  DurationUnit,
  PregnancyStatus,
} from '../types/health';
import { SYMPTOM_LIST } from '../data/symptoms';
import {
  isPhysiologicallyPlausibleTemperature,
  validateBloodPressure,
  validateHeartRate,
  toFahrenheit,
} from '../utils/conversions';
import {
  Thermometer,
  Activity,
  Heart,
  Droplet,
  Info,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface HealthInfoScreenProps {
  gender: Gender | '';
  age: number | null;
  initialMeasurements: HealthMeasurements;
  initialSymptoms: SymptomDetails;
  onBack: () => void;
  onNext: (measurements: HealthMeasurements, symptoms: SymptomDetails) => void;
}

export const HealthInfoScreen: React.FC<HealthInfoScreenProps> = ({
  gender,
  age,
  initialMeasurements,
  initialSymptoms,
  onBack,
  onNext,
}) => {
  // Symptoms state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    initialSymptoms.primarySymptoms
  );
  const [hasNoSymptoms, setHasNoSymptoms] = useState<boolean>(
    initialSymptoms.primarySymptoms.includes('no_symptoms')
  );
  const [hasOtherSymptom, setHasOtherSymptom] = useState<boolean>(
    initialSymptoms.primarySymptoms.includes('other')
  );
  const [otherSymptomText, setOtherSymptomText] = useState<string>(
    initialSymptoms.otherSymptomText || ''
  );

  // Duration
  const [durationValueStr, setDurationValueStr] = useState<string>(
    initialSymptoms.durationValue !== null ? initialSymptoms.durationValue.toString() : '2'
  );
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(
    initialSymptoms.durationUnit || 'days'
  );

  // Medical history & Pregnancy
  const [previousConditions, setPreviousConditions] = useState<string>(
    initialSymptoms.previousConditions
  );
  const [hasNoPreviousConditions, setHasNoPreviousConditions] = useState<boolean>(
    initialSymptoms.hasNoPreviousConditions
  );
  const [pregnancyStatus, setPregnancyStatus] = useState<PregnancyStatus>(
    initialSymptoms.pregnancyStatus
  );

  // Health Measurements
  const [tempStr, setTempStr] = useState<string>(
    initialMeasurements.bodyTemperature !== null
      ? initialMeasurements.bodyTemperature.toString()
      : '98.6'
  );
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(
    initialMeasurements.temperatureUnit || 'fahrenheit'
  );
  const [tempUnknown, setTempUnknown] = useState<boolean>(
    initialMeasurements.temperatureUnknown || false
  );

  // Blood Pressure
  const [bpSystolicStr, setBpSystolicStr] = useState<string>(
    initialMeasurements.bpSystolic !== null ? initialMeasurements.bpSystolic.toString() : '120'
  );
  const [bpDiastolicStr, setBpDiastolicStr] = useState<string>(
    initialMeasurements.bpDiastolic !== null ? initialMeasurements.bpDiastolic.toString() : '80'
  );
  const [bpUnknown, setBpUnknown] = useState<boolean>(
    initialMeasurements.bpUnknown || false
  );

  // Heart Rate
  const [heartRateStr, setHeartRateStr] = useState<string>(
    initialMeasurements.heartRate !== null ? initialMeasurements.heartRate.toString() : '72'
  );
  const [heartRateUnknown, setHeartRateUnknown] = useState<boolean>(
    initialMeasurements.heartRateUnknown || false
  );

  // Optional Measurements
  const [spo2Str, setSpo2Str] = useState<string>(
    initialMeasurements.spo2 !== null ? initialMeasurements.spo2.toString() : ''
  );
  const [glucoseStr, setGlucoseStr] = useState<string>(
    initialMeasurements.bloodGlucose !== null ? initialMeasurements.bloodGlucose.toString() : ''
  );

  // Form errors
  const [errors, setErrors] = useState<{
    symptoms?: string;
    duration?: string;
    temperature?: string;
    bp?: string;
    heartRate?: string;
    spo2?: string;
    glucose?: string;
  }>({});

  // Toggle primary symptom
  const toggleSymptom = (id: string) => {
    if (hasNoSymptoms) {
      setHasNoSymptoms(false);
    }
    setSelectedSymptoms((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((s) => s !== id && s !== 'no_symptoms');
      } else {
        return [...prev.filter((s) => s !== 'no_symptoms'), id];
      }
    });
  };

  const handleSelectNoSymptoms = () => {
    setHasNoSymptoms(true);
    setSelectedSymptoms(['no_symptoms']);
    setHasOtherSymptom(false);
  };

  const validate = (): boolean => {
    const newErrors: {
      symptoms?: string;
      duration?: string;
      temperature?: string;
      bp?: string;
      heartRate?: string;
      spo2?: string;
      glucose?: string;
    } = {};

    // Validate symptoms selection
    if (!hasNoSymptoms && selectedSymptoms.length === 0 && !hasOtherSymptom) {
      newErrors.symptoms =
        'कृपया कम से कम एक लक्षण चुनें अथवा "कोई परेशानी नहीं" पर क्लिक करें।';
    }

    // Validate duration if symptoms exist
    if (!hasNoSymptoms && selectedSymptoms.length > 0) {
      if (!durationValueStr.trim()) {
        newErrors.duration = 'कृपया परेशानी की समयावधि (घंटे या दिन) दर्ज करें।';
      } else {
        const d = parseFloat(durationValueStr);
        if (isNaN(d) || d <= 0 || d > 365) {
          newErrors.duration = 'कृपया एक मान्य समय अवधि दर्ज करें।';
        }
      }
    }

    // Validate Temperature
    if (!tempUnknown) {
      if (!tempStr.trim()) {
        newErrors.temperature =
          'कृपया तापमान दर्ज करें अथवा "मुझे नहीं पता" चुनें।';
      } else {
        const t = parseFloat(tempStr);
        if (isNaN(t) || !isPhysiologicallyPlausibleTemperature(t, tempUnit)) {
          newErrors.temperature =
            tempUnit === 'fahrenheit'
              ? 'तापमान 90°F से 108°F के बीच होना चाहिए। कृपया पुनः नापें।'
              : 'तापमान 32°C से 42°C के बीच होना चाहिए। कृपया पुनः नापें।';
        }
      }
    }

    // Validate Blood Pressure
    if (!bpUnknown) {
      const s = bpSystolicStr.trim() ? parseFloat(bpSystolicStr) : null;
      const d = bpDiastolicStr.trim() ? parseFloat(bpDiastolicStr) : null;
      const bpCheck = validateBloodPressure(s, d);
      if (!bpCheck.isValid) {
        newErrors.bp = bpCheck.errorHindi;
      }
    }

    // Validate Heart Rate
    if (!heartRateUnknown) {
      if (heartRateStr.trim()) {
        const hr = parseFloat(heartRateStr);
        const hrCheck = validateHeartRate(hr);
        if (!hrCheck.isValid) {
          newErrors.heartRate = hrCheck.errorHindi;
        }
      }
    }

    // Validate optional SpO2
    if (spo2Str.trim()) {
      const sp = parseFloat(spo2Str);
      if (isNaN(sp) || sp < 50 || sp > 100) {
        newErrors.spo2 = 'SpO2 ऑक्सीजन का स्तर 50% से 100% के बीच होना चाहिए।';
      }
    }

    // Validate optional glucose
    if (glucoseStr.trim()) {
      const gl = parseFloat(glucoseStr);
      if (isNaN(gl) || gl < 20 || gl > 700) {
        newErrors.glucose = 'शुगर का स्तर 20 से 700 mg/dL के बीच होना चाहिए।';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedTemp = !tempUnknown && tempStr.trim() ? parseFloat(tempStr) : null;
    const parsedSystolic = !bpUnknown && bpSystolicStr.trim() ? parseFloat(bpSystolicStr) : null;
    const parsedDiastolic = !bpUnknown && bpDiastolicStr.trim() ? parseFloat(bpDiastolicStr) : null;
    const parsedHeartRate = !heartRateUnknown && heartRateStr.trim() ? parseFloat(heartRateStr) : null;
    const parsedSpo2 = spo2Str.trim() ? parseFloat(spo2Str) : null;
    const parsedGlucose = glucoseStr.trim() ? parseFloat(glucoseStr) : null;
    const parsedDuration = !hasNoSymptoms && durationValueStr.trim() ? parseFloat(durationValueStr) : null;

    let finalSymptoms = [...selectedSymptoms];
    if (hasOtherSymptom && !finalSymptoms.includes('other')) {
      finalSymptoms.push('other');
    }
    if (hasNoSymptoms) {
      finalSymptoms = ['no_symptoms'];
    }

    const measurementsData: HealthMeasurements = {
      bodyTemperature: parsedTemp,
      temperatureUnit: tempUnit,
      temperatureUnknown: tempUnknown,
      bpSystolic: parsedSystolic,
      bpDiastolic: parsedDiastolic,
      bpUnknown: bpUnknown,
      heartRate: parsedHeartRate,
      heartRateUnknown: heartRateUnknown,
      spo2: parsedSpo2,
      bloodGlucose: parsedGlucose,
    };

    const symptomsData: SymptomDetails = {
      primarySymptoms: finalSymptoms,
      otherSymptomText: otherSymptomText.trim(),
      durationValue: parsedDuration,
      durationUnit: durationUnit,
      previousConditions: previousConditions.trim(),
      hasNoPreviousConditions: hasNoPreviousConditions,
      pregnancyStatus: pregnancyStatus,
    };

    onNext(measurementsData, symptomsData);
  };

  // Determine if pregnancy question should be shown
  const showPregnancyQuestion = gender === 'female' || gender === 'transgender';

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-lg shadow-slate-100">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            चरण 2 : स्वास्थ्य स्थिति एवं लक्षण
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            अब अपनी तबीयत के बारे में बताइए
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            अपने लक्षणों और उपलब्ध स्वास्थ्य मापों का चयन करें। यदि कोई माप नहीं पता तो "मुझे नहीं पता" चुन सकते हैं।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card A: Primary Symptoms */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                आपको क्या परेशानी हो रही है? (एक या अधिक चुनें)
              </label>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                मुख्य लक्षण
              </span>
            </div>

            {/* Symptom Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SYMPTOM_LIST.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id) && !hasNoSymptoms;
                return (
                  <button
                    type="button"
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold leading-tight">
                        {sym.hindiName}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isSelected ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {sym.englishName}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Other Symptom & No Symptom Options */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (hasNoSymptoms) setHasNoSymptoms(false);
                  setHasOtherSymptom(!hasOtherSymptom);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  hasOtherSymptom
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                + अन्य परेशानी (लिखकर बताएं)
              </button>

              <button
                type="button"
                onClick={handleSelectNoSymptoms}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  hasNoSymptoms
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ✓ कोई परेशानी नहीं
              </button>
            </div>

            {hasOtherSymptom && !hasNoSymptoms && (
              <div className="pt-2 animate-fade-in">
                <input
                  type="text"
                  value={otherSymptomText}
                  onChange={(e) => setOtherSymptomText(e.target.value)}
                  placeholder="अपनी अन्य परेशानी का विवरण यहाँ लिखें..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>
            )}

            {errors.symptoms && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.symptoms}</span>
              </p>
            )}
          </div>

          {/* Card B: Symptom Duration */}
          {!hasNoSymptoms && (
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                यह परेशानी कितने समय से है?
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={durationValueStr}
                  onChange={(e) => setDurationValueStr(e.target.value)}
                  placeholder="उदा. 2"
                  className="w-32 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
                <div className="flex rounded-xl bg-white border border-slate-300 overflow-hidden p-1">
                  <button
                    type="button"
                    onClick={() => setDurationUnit('days')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      durationUnit === 'days'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    दिन (Days)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationUnit('hours')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      durationUnit === 'hours'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    घंटे (Hours)
                  </button>
                </div>
              </div>
              {errors.duration && (
                <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.duration}</span>
                </p>
              )}
            </div>
          )}

          {/* Card C: Body Temperature */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <span>शरीर का तापमान (Body Temperature)</span>
              </label>
              <button
                type="button"
                onClick={() => setTempUnknown(!tempUnknown)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  tempUnknown
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                मुझे तापमान नहीं पता
              </button>
            </div>

            {!tempUnknown ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={tempStr}
                    onChange={(e) => setTempStr(e.target.value)}
                    placeholder={tempUnit === 'fahrenheit' ? '98.6' : '37.0'}
                    className="w-36 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                  <div className="flex rounded-xl bg-white border border-slate-300 overflow-hidden p-1">
                    <button
                      type="button"
                      onClick={() => setTempUnit('fahrenheit')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        tempUnit === 'fahrenheit'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      °F (फ़ारेनहाइट)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempUnit('celsius')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        tempUnit === 'celsius'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      °C (सेल्सियस)
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  * सामान्य तापमान लगभग 98.6°F (37°C) होता है। 100.4°F (38°C) से अधिक को बुखार माना जाता है।
                </p>
              </div>
            ) : (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                तापमान की अनुपस्थिति में प्रणाली सामान्य तापमान का अनुमान नहीं लगाएगी, बल्कि रिपोर्ट में इसे दर्ज करेगी।
              </p>
            )}

            {errors.temperature && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.temperature}</span>
              </p>
            )}
          </div>

          {/* Card D: Blood Pressure */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>रक्तचाप (Blood Pressure - BP)</span>
              </label>
              <button
                type="button"
                onClick={() => setBpUnknown(!bpUnknown)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  bpUnknown
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                मुझे अपना BP नहीं पता
              </button>
            </div>

            {!bpUnknown ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      ऊपर का दबाव (Systolic)
                    </span>
                    <input
                      type="number"
                      value={bpSystolicStr}
                      onChange={(e) => setBpSystolicStr(e.target.value)}
                      placeholder="120"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-400 mt-4">/</span>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      नीचे का दबाव (Diastolic)
                    </span>
                    <input
                      type="number"
                      value={bpDiastolicStr}
                      onChange={(e) => setBpDiastolicStr(e.target.value)}
                      placeholder="80"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-bold mt-4">mmHg</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  * शांत बैठकर 5 मिनट विश्राम के बाद नापा गया बीपी सबसे सटीक होता है।
                </p>
              </div>
            ) : (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                बीपी की अनुपस्थिति में प्रणाली इसे सामान्य नहीं मानेगी और डॉक्टर से बीपी नपवाने की सलाह जोड़ेगी।
              </p>
            )}

            {errors.bp && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.bp}</span>
              </p>
            )}
          </div>

          {/* Card E: Heart Rate */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>हृदय गति (नाड़ी दर / Heart Rate)</span>
              </label>
              <button
                type="button"
                onClick={() => setHeartRateUnknown(!heartRateUnknown)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  heartRateUnknown
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                मुझे नहीं पता
              </button>
            </div>

            {!heartRateUnknown ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={heartRateStr}
                    onChange={(e) => setHeartRateStr(e.target.value)}
                    placeholder="72"
                    className="w-36 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:border-emerald-600 outline-none"
                  />
                  <span className="text-xs text-slate-600 font-semibold">
                    धड़कन प्रति मिनट (bpm)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  * कलाई पर अंगूठे के नीचे उंगली रखकर 1 मिनट में धड़कनों की संख्या गिनें।
                </p>
              </div>
            ) : (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                हृदय गति दर्ज न होने पर इसे सामान्य नहीं माना जाएगा।
              </p>
            )}

            {errors.heartRate && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.heartRate}</span>
              </p>
            )}
          </div>

          {/* Card F: Optional SpO2 & Glucose */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                अतिरिक्त माप (यदि आपके पास मशीन उपलब्ध हो)
              </label>
              <span className="text-[10px] text-slate-500 font-medium">वैकल्पिक (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  ऑक्सीजन स्तर (SpO2 %)
                </span>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={spo2Str}
                  onChange={(e) => setSpo2Str(e.target.value)}
                  placeholder="उदा. 98"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:border-emerald-600 outline-none"
                />
                {errors.spo2 && <p className="text-[11px] text-red-600 mt-1">{errors.spo2}</p>}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  ब्लड शुगर / ग्लूकोज (mg/dL)
                </span>
                <input
                  type="number"
                  min="20"
                  max="700"
                  value={glucoseStr}
                  onChange={(e) => setGlucoseStr(e.target.value)}
                  placeholder="उदा. 110"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:border-emerald-600 outline-none"
                />
                {errors.glucose && <p className="text-[11px] text-red-600 mt-1">{errors.glucose}</p>}
              </div>
            </div>
          </div>

          {/* Card G: Previous Conditions */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                क्या आपको पहले से कोई पुरानी बीमारी है?
              </label>
              <button
                type="button"
                onClick={() => {
                  setHasNoPreviousConditions(!hasNoPreviousConditions);
                  if (!hasNoPreviousConditions) setPreviousConditions('');
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  hasNoPreviousConditions
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                कोई पुरानी बीमारी नहीं
              </button>
            </div>

            {!hasNoPreviousConditions && (
              <textarea
                rows={2}
                value={previousConditions}
                onChange={(e) => setPreviousConditions(e.target.value)}
                placeholder="जैसे मधुमेह (शुगर), उच्च रक्तचाप (BP), दमा/अस्थमा, हृदय रोग, गुर्दे की बीमारी आदि..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            )}
          </div>

          {/* Card H: Pregnancy Status (Sensitive & Conditional) */}
          {showPregnancyQuestion && (
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                क्या आप गर्भवती हैं या गर्भवती होने की संभावना है?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'yes', label: 'हाँ' },
                  { id: 'no', label: 'नहीं' },
                  { id: 'not_sure', label: 'निश्चित नहीं' },
                  { id: 'not_applicable', label: 'लागू नहीं' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPregnancyStatus(opt.id as PregnancyStatus)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      pregnancyStatus === opt.id
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                * गर्भावस्था के दौरान सुरक्षित दवाओं और विशेष स्वास्थ्य सावधानियों के निर्धारण हेतु यह आवश्यक है।
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="py-3.5 px-5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>पीछे जाएं</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
            >
              <span>आगे बढ़ें (आपातकालीन जाँच)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
