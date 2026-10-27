import React, { useState } from 'react';
import { FACILITY_TIERS, EMERGENCY_HELPLINES } from '../data/healthcareFacilities';
import { Building2, PhoneCall, Navigation, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { UrgencyLevel } from '../types/health';

interface HealthCentreFinderProps {
  userDistanceKm: number | null;
  urgency: UrgencyLevel;
}

export const HealthCentreFinder: React.FC<HealthCentreFinderProps> = ({
  userDistanceKm,
  urgency,
}) => {
  const [geoState, setGeoState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    coords?: { lat: number; lng: number };
    messageHindi?: string;
  }>({ status: 'idle' });

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({
        status: 'error',
        messageHindi: 'आपके डिवाइस में स्थान (GPS) सुविधा उपलब्ध नहीं है।',
      });
      return;
    }

    setGeoState({ status: 'loading', messageHindi: 'अनुमति ली जा रही है...' });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState({
          status: 'success',
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          messageHindi: 'स्थान प्राप्त हुआ। आप निकटतम सरकारी अस्पताल खोज सकते हैं।',
        });
      },
      (err) => {
        let msg = 'स्थान की अनुमति अस्वीकृत की गई।';
        if (err.code === err.TIMEOUT) msg = 'स्थान प्राप्त करने में समय समाप्त हो गया।';
        setGeoState({ status: 'error', messageHindi: msg });
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            नज़दीकी स्वास्थ्य केंद्र खोजें
          </h3>
          <p className="text-xs text-slate-500">
            सरकारी स्वास्थ्य केंद्रों एवं आपातकालीन एम्बुलेंस सेवाओं की जानकारी
          </p>
        </div>
      </div>

      {/* Emergency Hotline Quick Access */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>24x7 निःशुल्क सरकारी आपातकालीन नंबर</span>
          </h4>
          <span className="text-[11px] bg-red-200 text-red-900 px-2 py-0.5 rounded-full font-bold">
            टोल-फ्री
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EMERGENCY_HELPLINES.map((hl) => (
            <a
              key={hl.number}
              href={`tel:${hl.number}`}
              className="p-3 bg-white hover:bg-red-100/60 border border-red-200 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-sm active:scale-95"
            >
              <span className="text-lg font-black text-red-600 tracking-wider">
                {hl.number}
              </span>
              <span className="text-[11px] font-bold text-slate-800 mt-0.5 line-clamp-1">
                {hl.nameHindi.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                मुफ्त कॉल करें
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Distance Guidance */}
      {userDistanceKm !== null && (
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs text-slate-700">
            आपने अपने निकटतम स्वास्थ्य केंद्र की दूरी <strong>{userDistanceKm} किलोमीटर</strong> दर्ज की है।{' '}
            {urgency === 'RED'
              ? 'आपातकालीन स्थिति में तुरंत वाहन या 108 एम्बुलेंस की व्यवस्था करें।'
              : 'दूरी को ध्यान में रखते हुए समय से डॉक्टर की ओपीडी में पहुँचें।'}
          </div>
        </div>
      )}

      {/* Search Nearby on Verified Maps */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-slate-600" />
          <span>नक्शे पर नजदीकी सरकारी अस्पताल देखें</span>
        </h4>
        <p className="text-xs text-slate-600">
          आप अपने फोन के जीपीएस की सहायता से सीधे आधिकारिक मैप्स पर नजदीकी सरकारी अस्पताल (PHC / CHC) खोज सकते हैं:
        </p>

        <div className="flex flex-wrap gap-2">
          {geoState.status !== 'success' ? (
            <button
              onClick={handleRequestLocation}
              disabled={geoState.status === 'loading'}
              className="text-xs px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {geoState.status === 'loading' ? 'स्थान खोजा जा रहा है...' : 'स्थान अनुमति दें और खोजें'}
              </span>
            </button>
          ) : (
            <a
              href={`https://www.google.com/maps/search/Government+Hospital+PHC+CHC/@${geoState.coords?.lat},${geoState.coords?.lng},13z`}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-all flex items-center gap-1.5 shadow"
            >
              <span>गूगल मैप्स पर अस्पताल खोलें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href="https://www.google.com/maps/search/Primary+Health+Centre+Government+Hospital"
            target="_blank"
            rel="noreferrer"
            className="text-xs px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <span>सामान्य खोज (बिना GPS)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {geoState.messageHindi && (
          <div className="text-[11px] text-slate-500 italic">
            {geoState.messageHindi}
          </div>
        )}
      </div>

      {/* Rural Health Facility Hierarchy Guide */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          कहाँ जाना चाहिए? (ग्रामीण स्वास्थ्य केंद्र स्तर)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FACILITY_TIERS.map((tier) => (
            <div
              key={tier.type}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                  {tier.titleHindi}
                </h5>
              </div>
              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                {tier.descriptionHindi}
              </p>
              <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl mb-2">
                <strong>कब जाएं: </strong>
                <span>{tier.recommendedForHindi}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                <strong>स्टाफ: </strong>
                <span>{tier.staffingHindi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
