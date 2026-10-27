import { HealthcareTimeframe, UrgencyLevel, UserAssessmentInput } from '../types/health';

export type AgeGroup = 'infant' | 'child' | 'adolescent' | 'adult' | 'elderly' | 'all';

export interface MedicalSourceRef {
  organization: string;
  documentTitle: string;
  sourceUrl?: string;
  guidelineYear?: number;
}

export interface ClinicalRule {
  id: string;
  titleHindi: string;
  ageGroup: AgeGroup;
  requiredInputs: (
    | keyof UserAssessmentInput['personal']
    | keyof UserAssessmentInput['health']
    | keyof UserAssessmentInput['symptoms']
    | keyof UserAssessmentInput['emergency']
  )[];
  urgency: UrgencyLevel;
  timeframe: HealthcareTimeframe;
  explanationHindi: string;
  sourceReference: MedicalSourceRef;
  lastReviewedDate: string; // ISO format e.g. '2025-01-15'
  clinicianReviewRequired: boolean;
  evaluate: (input: UserAssessmentInput) => boolean;
}

export interface AssessmentResult {
  urgency: UrgencyLevel;
  urgencyTitleHindi: string;
  urgencyDescriptionHindi: string;
  isEmergency: boolean;
  reasonsHindi: string[];
  concerningSymptoms: string[];
  concerningMeasurements: string[];
  missingInformation: string[];
  timeframe: HealthcareTimeframe;
  timeframeHindi: string;
  immediateNextStepsHindi: string[];
  suitableHomeCareIds: string[];
  escalationSignsHindi: string[];
  uncertaintyExplanationHindi?: string;
  triggeredRuleIds: string[];
  sourceReferences: MedicalSourceRef[];
  distanceKmConsideration?: string;
}
