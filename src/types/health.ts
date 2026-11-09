// Type definitions for SWASTHYASATHI (स्वास्थ्यसाथी)

export type Gender = 'male' | 'female' | 'transgender';

export type PregnancyStatus = 'yes' | 'no' | 'not_applicable' | 'not_sure';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type DurationUnit = 'hours' | 'days';

export type UrgencyLevel = 'GREEN' | 'YELLOW' | 'RED';

export type HealthcareTimeframe =
  | 'emergency_immediate'     // अभी आपातकालीन सहायता लें (112)
  | 'same_day'                // आज ही चिकित्सकीय सलाह लें
  | 'within_24_48_hours'      // अगले 24–48 घंटे में चिकित्सकीय जाँच कराएँ
  | 'few_days'                // कुछ दिनों के भीतर चिकित्सकीय सलाह लें
  | 'monitor_and_escalate';   // लक्षणों पर नज़र रखें और बिगड़ने पर सहायता लें

export type BodyRegion =
  | 'head'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'back'
  | 'arms'
  | 'legs'
  | 'skin'
  | 'general';

export interface SymptomItem {
  id: string;
  hindiName: string;
  englishName: string;
  bodyRegion: BodyRegion;
  descriptionHindi?: string;
  isEmergencyPotential?: boolean;
}

export interface PersonalInfo {
  name: string; // Optional for privacy
  age: number | null;
  gender: Gender | '';
  nearestHealthCenterDistanceKm: number | null;
}

export interface HealthMeasurements {
  bodyTemperature: number | null;
  temperatureUnit: TemperatureUnit;
  temperatureUnknown?: boolean;

  bpSystolic: number | null;
  bpDiastolic: number | null;
  bpUnknown: boolean;

  heartRate: number | null;
  heartRateUnknown: boolean;

  spo2: number | null; // Optional pulse oximeter %
  bloodGlucose: number | null; // Optional mg/dL
}

export interface SymptomDetails {
  primarySymptoms: string[]; // IDs of selected symptoms
  otherSymptomText?: string;
  durationValue: number | null;
  durationUnit: DurationUnit;
  previousConditions: string;
  hasNoPreviousConditions: boolean;
  pregnancyStatus: PregnancyStatus;
}

export interface EmergencyScreeningAnswers {
  severeBreathingDifficulty: boolean;    // बहुत अधिक साँस लेने में परेशानी
  severeChestPain: boolean;              // सीने में तेज़ या लगातार दर्द
  unconsciousOrAlteredState: boolean;    // बेहोशी या जगाना मुश्किल
  suddenWeaknessOrNumbness: boolean;     // चेहरे, हाथ या पैर में अचानक कमजोरी (स्ट्रोक)
  speechDifficulty: boolean;             // बोलने में अचानक परेशानी
  heavyBleeding: boolean;                // बहुत अधिक खून बहना
  throatSwellingWithStridor: boolean;    // जीभ या गले में सूजन व साँस रुकना (तीव्र एलर्जी)
  seizuresOrConvulsions: boolean;        // दौरा पड़ना
  suddenSevereHeadache: boolean;         // अचानक बहुत तेज़ सिरदर्द
  severePregnancyDistress: boolean;      // गर्भावस्था में गंभीर पेट दर्द/रक्तस्राव/ऐंठन
}

export interface UserAssessmentInput {
  personal: PersonalInfo;
  health: HealthMeasurements;
  symptoms: SymptomDetails;
  emergency: EmergencyScreeningAnswers;
}
