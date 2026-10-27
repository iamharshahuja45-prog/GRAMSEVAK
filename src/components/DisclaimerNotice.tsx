import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerNotice: React.FC = () => {
  return (
    <div className="w-full bg-slate-100 rounded-2xl p-3.5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">चिकित्सीय अस्वीकरण (Medical Disclaimer): </strong>
          ग्रामसेवक मंच केवल प्रारंभिक स्वास्थ्य जागरूकता, जोखिम चेतावनी और प्राथमिक देखभाल मार्गदर्शन के लिए विकसित किया गया है। यह किसी भी पंजीकृत डॉक्टर के परामर्श, चिकित्सकीय निदान अथवा उपचार का विकल्प नहीं है। गंभीर या आपातकालीन स्थिति में तुरंत 112 / 108 पर संपर्क करें अथवा नजदीकी अस्पताल जाएं।
        </div>
      </div>
    </div>
  );
};
