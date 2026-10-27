import React, { useState } from 'react';
import {
  PersonalInfo,
  HealthMeasurements,
  SymptomDetails,
  EmergencyScreeningAnswers,
  UserAssessmentInput,
} from './types/health';
import { AssessmentResult } from './engine/types';
import { runHealthAssessment } from './engine/assessmentEngine';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PersonalInfoScreen } from './components/PersonalInfoScreen';
import { HealthInfoScreen } from './components/HealthInfoScreen';
import { EmergencyScreen } from './components/EmergencyScreen';
import { ReportScreen } from './components/ReportScreen';
import { PrivacyModal } from './components/PrivacyModal';

type AppStep = 'welcome' | 'personal' | 'health' | 'emergency' | 'report';

export function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Form State
  const [personal, setPersonal] = useState<PersonalInfo>({
    name: '',
    age: 35,
    gender: 'male',
    nearestHealthCenterDistanceKm: 3.5,
  });

  const [health, setHealth] = useState<HealthMeasurements>({
    bodyTemperature: 98.6,
    temperatureUnit: 'fahrenheit',
    temperatureUnknown: false,
    bpSystolic: 120,
    bpDiastolic: 80,
    bpUnknown: false,
    heartRate: 72,
    heartRateUnknown: false,
    spo2: null,
    bloodGlucose: null,
  });

  const [symptoms, setSymptoms] = useState<SymptomDetails>({
    primarySymptoms: [],
    otherSymptomText: '',
    durationValue: 2,
    durationUnit: 'days',
    previousConditions: '',
    hasNoPreviousConditions: true,
    pregnancyStatus: 'not_applicable',
  });

  const [emergency, setEmergency] = useState<EmergencyScreeningAnswers>({
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
  });

  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // Reset all data and restart
  const handleReset = () => {
    setPersonal({
      name: '',
      age: null,
      gender: '',
      nearestHealthCenterDistanceKm: null,
    });
    setHealth({
      bodyTemperature: null,
      temperatureUnit: 'fahrenheit',
      temperatureUnknown: false,
      bpSystolic: null,
      bpDiastolic: null,
      bpUnknown: false,
      heartRate: null,
      heartRateUnknown: false,
      spo2: null,
      bloodGlucose: null,
    });
    setSymptoms({
      primarySymptoms: [],
      otherSymptomText: '',
      durationValue: null,
      durationUnit: 'days',
      previousConditions: '',
      hasNoPreviousConditions: false,
      pregnancyStatus: 'not_applicable',
    });
    setEmergency({
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
    });
    setAssessmentResult(null);
    setCurrentStep('personal');
  };

  // Step 1: Personal Info -> Health Info
  const handlePersonalInfoNext = (data: PersonalInfo) => {
    setPersonal(data);
    setCurrentStep('health');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Health Info -> Emergency Screening
  const handleHealthInfoNext = (
    measurementsData: HealthMeasurements,
    symptomsData: SymptomDetails
  ) => {
    setHealth(measurementsData);
    setSymptoms(symptomsData);
    setCurrentStep('emergency');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3: Emergency Screening -> Health Report
  const handleEmergencySubmit = (emergencyAnswers: EmergencyScreeningAnswers) => {
    setEmergency(emergencyAnswers);

    const fullInput: UserAssessmentInput = {
      personal,
      health,
      symptoms,
      emergency: emergencyAnswers,
    };

    const res = runHealthAssessment(fullInput);
    setAssessmentResult(res);
    setCurrentStep('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map step name to numeric step for progress bar
  const getStepNumber = (): number => {
    switch (currentStep) {
      case 'personal':
        return 1;
      case 'health':
        return 2;
      case 'emergency':
        return 3;
      case 'report':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onReset={handleReset}
      />

      {/* Progress Bar (Visible on steps 1-4) */}
      {currentStep !== 'welcome' && (
        <div className="bg-white border-b border-slate-200">
          <ProgressBar
            currentStep={getStepNumber()}
            onStepClick={(stepNum) => {
              if (stepNum === 1) setCurrentStep('personal');
              if (stepNum === 2) setCurrentStep('health');
              if (stepNum === 3) setCurrentStep('emergency');
            }}
          />
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col justify-center">
        {currentStep === 'welcome' && (
          <WelcomeScreen onStart={() => setCurrentStep('personal')} />
        )}

        {currentStep === 'personal' && (
          <PersonalInfoScreen
            initialData={personal}
            onNext={handlePersonalInfoNext}
          />
        )}

        {currentStep === 'health' && (
          <HealthInfoScreen
            gender={personal.gender}
            age={personal.age}
            initialMeasurements={health}
            initialSymptoms={symptoms}
            onBack={() => setCurrentStep('personal')}
            onNext={handleHealthInfoNext}
          />
        )}

        {currentStep === 'emergency' && (
          <EmergencyScreen
            pregnancyStatus={symptoms.pregnancyStatus}
            initialAnswers={emergency}
            onBack={() => setCurrentStep('health')}
            onSubmit={handleEmergencySubmit}
          />
        )}

        {currentStep === 'report' && assessmentResult && (
          <ReportScreen
            result={assessmentResult}
            personal={personal}
            health={health}
            symptoms={symptoms}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 px-4 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-700">ग्रामसेवक (GRAMSEVAK)</span> — ग्रामीण स्वास्थ्य सहायता एवं प्राथमिक जोखिम मूल्यांकन मंच
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-emerald-700 hover:underline font-medium"
            >
              गोपनीयता नीति
            </button>
            <span>•</span>
            <span className="text-slate-400">आपातकाल में डायल करें 112 / 108</span>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
