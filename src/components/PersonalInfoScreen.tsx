import React, { useState } from 'react';
import { PersonalInfo, Gender } from '../types/health';
import { User, Calendar, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

interface PersonalInfoScreenProps {
  initialData: PersonalInfo;
  onNext: (data: PersonalInfo) => void;
}

export const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({
  initialData,
  onNext,
}) => {
  const [name, setName] = useState<string>(initialData.name);
  const [ageStr, setAgeStr] = useState<string>(
    initialData.age !== null ? initialData.age.toString() : ''
  );
  const [gender, setGender] = useState<Gender | ''>(initialData.gender);
  const [distanceStr, setDistanceStr] = useState<string>(
    initialData.nearestHealthCenterDistanceKm !== null
      ? initialData.nearestHealthCenterDistanceKm.toString()
      : ''
  );

  const [errors, setErrors] = useState<{
    age?: string;
    gender?: string;
    distance?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: {
      age?: string;
      gender?: string;
      distance?: string;
    } = {};

    // Validate Age
    if (!ageStr.trim()) {
      newErrors.age = 'कृपया अपनी आयु (उम्र) दर्ज करें।';
    } else {
      const parsedAge = parseFloat(ageStr);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
        newErrors.age = 'कृपया 0 से 120 वर्ष के बीच एक मान्य आयु दर्ज करें।';
      }
    }

    // Validate Gender
    if (!gender) {
      newErrors.gender = 'कृपया अपना लिंग चुनें।';
    }

    // Validate Distance (Optional or default to 0 if empty)
    if (distanceStr.trim()) {
      const parsedDist = parseFloat(distanceStr);
      if (isNaN(parsedDist) || parsedDist < 0 || parsedDist > 500) {
        newErrors.distance = 'कृपया 0 से 500 किलोमीटर के बीच की दूरी दर्ज करें।';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAge = parseFloat(ageStr);
    const parsedDist = distanceStr.trim() ? parseFloat(distanceStr) : null;

    onNext({
      name: name.trim(),
      age: parsedAge,
      gender: gender as Gender,
      nearestHealthCenterDistanceKm: parsedDist,
    });
  };

  const genderOptions: { id: Gender; labelHindi: string; subtext: string }[] = [
    { id: 'male', labelHindi: 'पुरुष', subtext: 'Male' },
    { id: 'female', labelHindi: 'महिला', subtext: 'Female' },
    { id: 'transgender', labelHindi: 'ट्रांसजेंडर', subtext: 'Transgender' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-lg shadow-slate-100">
        {/* Screen Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            चरण 1 : व्यक्तिगत विवरण
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            सबसे पहले, अपने बारे में बताइए
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            यह जानकारी आपकी उम्र और स्वास्थ्य आवश्यकताओं के अनुसार सही सलाह देने में मदद करती है।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* A. Name (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-name"
              className="block text-sm font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>आपका नाम</span>
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                (वैकल्पिक / बिना नाम के भी जारी रख सकते हैं)
              </span>
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="उदा. रमेश कुमार / Radha"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 text-slate-900 text-sm transition-all outline-none"
            />
          </div>

          {/* B. Age */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-age"
              className="block text-sm font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>आपकी आयु कितनी है?</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                वर्ष में
              </span>
            </label>
            <input
              id="user-age"
              type="number"
              min="0"
              max="120"
              step="any"
              value={ageStr}
              onChange={(e) => {
                setAgeStr(e.target.value);
                if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
              }}
              placeholder="उदा. 35 (शिशुओं के लिए 0.5 लिखें)"
              className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-slate-900 text-sm transition-all outline-none ${
                errors.age
                  ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                  : 'border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100'
              }`}
            />
            {errors.age && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.age}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              * बच्चों (12 वर्ष से कम) और वरिष्ठ नागरिकों (65+) के लिए विशेष चिकित्सकीय सुरक्षा नियम लागू होते हैं।
            </p>
          </div>

          {/* C. Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              आपका लिंग क्या है?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {genderOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setGender(opt.id);
                    if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    gender === opt.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span className="text-sm sm:text-base">{opt.labelHindi}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{opt.subtext}</span>
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.gender}</span>
              </p>
            )}
          </div>

          {/* D. Distance to Nearest Healthcare Centre */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-distance"
              className="block text-sm font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>नज़दीकी स्वास्थ्य केंद्र की दूरी</span>
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                किलोमीटर (km)
              </span>
            </label>
            <input
              id="user-distance"
              type="number"
              min="0"
              max="500"
              step="any"
              value={distanceStr}
              onChange={(e) => {
                setDistanceStr(e.target.value);
                if (errors.distance) setErrors((prev) => ({ ...prev, distance: undefined }));
              }}
              placeholder="उदा. 4 या 0.5 (दशमलव भी मान्य है)"
              className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-slate-900 text-sm transition-all outline-none ${
                errors.distance
                  ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                  : 'border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100'
              }`}
            />
            {errors.distance && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.distance}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              दूरी का उपयोग केवल अस्पताल पहुँचने की योजना बनाने के लिए किया जाता है; इससे आपातकालीन गंभीरता कम नहीं होती।
            </p>
          </div>

          {/* Navigation Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
            >
              <span>आगे बढ़ें (तबीयत की जानकारी दें)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
