import React from 'react';
import { ShieldCheck, X, Lock, EyeOff, ServerOff, Database } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              आपकी गोपनीयता एवं डेटा सुरक्षा
            </h3>
            <p className="text-xs text-slate-500">
              ग्रामसेवक मंच पर आपकी निजी जानकारी पूरी तरह सुरक्षित है
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900">कोई अनिवार्य पंजीकरण नहीं:</strong>
              <p className="mt-0.5 text-emerald-800">
                ग्रामसेवक का उपयोग करने के लिए कोई मोबाइल नंबर, आधार या खाता बनाने की आवश्यकता नहीं है। आप नाम भी खाली छोड़ सकते हैं।
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <ServerOff className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">ब्राउज़र में स्थानीय गणना (Client-Side):</strong>
              <p className="mt-0.5 text-slate-600">
                आपके सभी लक्षण और स्वास्थ्य माप केवल आपके अपने फोन या कंप्यूटर के ब्राउज़र में ही जाँचे जाते हैं। इन्हें किसी बाहरी सर्वर पर नहीं भेजा जाता।
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">कोई विज्ञापन या डेटा बिक्री नहीं:</strong>
              <p className="mt-0.5 text-slate-600">
                हम आपके स्वास्थ्य डेटा का उपयोग किसी विज्ञापन कंपनी या तीसरे पक्ष को बेचने के लिए कभी नहीं करते हैं।
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <Database className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">अस्थायी डेटा भंडारण:</strong>
              <p className="mt-0.5 text-slate-600">
                जैसे ही आप ब्राउज़र टैब बंद करते हैं, आपके द्वारा दर्ज की गई जानकारी मिट जाती है। आप जब चाहें "शुरुआत से शुरू करें" बटन दबाकर सारा डेटा तुरंत साफ कर सकते हैं।
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            समझ गया / बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
