import { describe, it, expect } from 'vitest';
import { runHealthAssessment } from '../assessmentEngine';
import { UserAssessmentInput } from '../../types/health';
import { toFahrenheit, durationToDays } from '../../utils/conversions';

const createDefaultInput = (): UserAssessmentInput => ({
  personal: {
    name: 'राम कुमार',
    age: 35,
    gender: 'male',
    nearestHealthCenterDistanceKm: 4.5,
  },
  health: {
    bodyTemperature: 98.6,
    temperatureUnit: 'fahrenheit',
    temperatureUnknown: false,
    bpSystolic: 120,
    bpDiastolic: 80,
    bpUnknown: false,
    heartRate: 72,
    heartRateUnknown: false,
    spo2: 98,
    bloodGlucose: null,
  },
  symptoms: {
    primarySymptoms: [],
    otherSymptomText: '',
    durationValue: 2,
    durationUnit: 'days',
    previousConditions: '',
    hasNoPreviousConditions: true,
    pregnancyStatus: 'not_applicable',
  },
  emergency: {
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
  },
});

describe('स्वास्थ्यसाथी (SWASTHYASATHI) Clinical Safety & Assessment Engine', () => {
  // Scenario 1: No symptoms and normal measurements -> GREEN
  it('Scenario 1: No symptoms and normal measurements results in GREEN with routine guidance', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['no_symptoms'];

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('GREEN');
    expect(result.isEmergency).toBe(false);
    expect(result.timeframe).toBe('monitor_and_escalate');
    expect(result.reasonsHindi.length).toBeGreaterThan(0);
  });

  // Scenario 2: Fever with short duration -> YELLOW
  it('Scenario 2: Fever with short duration (1 day) results in YELLOW with appropriate care advice', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['fever'];
    input.symptoms.durationValue = 1;
    input.symptoms.durationUnit = 'days';
    input.health.bodyTemperature = 100.8;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('YELLOW');
    expect(result.isEmergency).toBe(false);
    expect(result.suitableHomeCareIds).toContain('fever');
  });

  // Scenario 3: Persistent fever (> 3 days) -> YELLOW same_day referral
  it('Scenario 3: Persistent fever for 4 days triggers same_day medical consultation rule', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['fever'];
    input.symptoms.durationValue = 4;
    input.symptoms.durationUnit = 'days';
    input.health.bodyTemperature = 101.5;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('YELLOW');
    expect(result.timeframe).toBe('same_day');
    expect(result.triggeredRuleIds).toContain('FEVER_PERSISTENT');
  });

  // Scenario 4: Severe chest pain -> RED emergency
  it('Scenario 4: Severe chest pain triggers RED emergency alert and 112 guidance', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['chest_pain'];
    input.emergency.severeChestPain = true;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.isEmergency).toBe(true);
    expect(result.timeframe).toBe('emergency_immediate');
    expect(result.triggeredRuleIds).toContain('EMERG_CHEST_PAIN');
  });

  // Scenario 5: Severe breathing difficulty -> RED emergency
  it('Scenario 5: Severe breathing difficulty triggers RED immediate emergency', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['breathing_difficulty'];
    input.emergency.severeBreathingDifficulty = true;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.isEmergency).toBe(true);
    expect(result.triggeredRuleIds).toContain('EMERG_BREATHING');
  });

  // Scenario 6: Stroke-like symptoms -> RED emergency
  it('Scenario 6: Sudden weakness or speech difficulty triggers stroke FAST protocol (RED)', () => {
    const input = createDefaultInput();
    input.emergency.suddenWeaknessOrNumbness = true;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.isEmergency).toBe(true);
    expect(result.triggeredRuleIds).toContain('EMERG_STROKE');
  });

  // Scenario 7: Potentially dangerous BP readings (Hypertensive crisis) -> RED
  it('Scenario 7: BP >= 180/120 triggers Hypertensive Crisis emergency (RED)', () => {
    const input = createDefaultInput();
    input.health.bpSystolic = 190;
    input.health.bpDiastolic = 125;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.triggeredRuleIds).toContain('VITAL_HYPERTENSIVE_CRISIS');
    expect(result.concerningMeasurements.some((m) => m.includes('BP 190/125'))).toBe(true);
  });

  // Scenario 8: Concerning heart rate with symptoms -> YELLOW
  it('Scenario 8: Tachycardia (>115 bpm) triggers abnormal heart rate evaluation', () => {
    const input = createDefaultInput();
    input.health.heartRate = 125;
    input.symptoms.primarySymptoms = ['weakness'];

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('YELLOW');
    expect(result.concerningMeasurements.some((m) => m.includes('125 धड़कन'))).toBe(true);
  });

  // Scenario 9: Infant under 1 year with fever -> RED emergency
  it('Scenario 9: Infant with fever is classified as RED emergency due to neonatal sepsis risk', () => {
    const input = createDefaultInput();
    input.personal.age = 0.5; // 6 months old
    input.symptoms.primarySymptoms = ['fever'];
    input.health.bodyTemperature = 100.6;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.triggeredRuleIds).toContain('PEDIATRIC_INFANT_FEVER');
  });

  // Scenario 10: Pregnancy with symptoms -> YELLOW with same-day care
  it('Scenario 10: Pregnant patient with abdominal pain and fever requires same-day clinical assessment', () => {
    const input = createDefaultInput();
    input.personal.gender = 'female';
    input.symptoms.pregnancyStatus = 'yes';
    input.symptoms.primarySymptoms = ['abdominal_pain', 'fever'];

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('YELLOW');
    expect(result.timeframe).toBe('same_day');
    expect(result.triggeredRuleIds).toContain('PREGNANCY_WITH_SYMPTOMS');
  });

  // Scenario 11: Missing vital signs -> transparent missing info
  it('Scenario 11: Missing vital signs are explicitly acknowledged in result', () => {
    const input = createDefaultInput();
    input.health.temperatureUnknown = true;
    input.health.bodyTemperature = null;
    input.symptoms.primarySymptoms = ['headache'];

    const result = runHealthAssessment(input);
    expect(result.missingInformation).toContain('शरीर का तापमान नहीं नापा गया है');
    expect(result.uncertaintyExplanationHindi).toBeDefined();
  });

  // Scenario 12: No symptoms but missing vital signs -> does not claim 100% healthy
  it('Scenario 12: No symptoms reported with missing vitals clarifies uncertainty', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['no_symptoms'];
    input.health.temperatureUnknown = true;
    input.health.bodyTemperature = null;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('GREEN');
    expect(result.uncertaintyExplanationHindi).toBeDefined();
    expect(result.urgencyDescriptionHindi).not.toContain('100%');
  });

  // Scenario 13: Generalized body pain -> home care & within 24-48 hours
  it('Scenario 13: Generalized body pain provides supportive home-care instructions', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['body_pain'];

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('YELLOW');
    expect(result.suitableHomeCareIds).toContain('body_pain');
  });

  // Scenario 14: Contradictory form selections resolved safely
  it('Scenario 14: Contradictory selection: fever symptom reported along with no_symptoms is safely parsed', () => {
    const input = createDefaultInput();
    // Even if both slipped in, symptom logic evaluates fever
    input.symptoms.primarySymptoms = ['fever', 'no_symptoms'];

    const result = runHealthAssessment(input);
    expect(result.suitableHomeCareIds).toContain('fever');
  });

  // Scenario 15: Unit conversions: Celsius to Fahrenheit
  it('Scenario 15: Correctly converts 39°C to ~102.2°F and flags high fever', () => {
    const degF = toFahrenheit(39, 'celsius');
    expect(degF).toBeCloseTo(102.2, 1);

    const input = createDefaultInput();
    input.health.bodyTemperature = 39;
    input.health.temperatureUnit = 'celsius';
    input.symptoms.primarySymptoms = ['fever'];

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('YELLOW');
    expect(result.concerningMeasurements.some((m) => m.includes('39° C'))).toBe(true);
  });

  // Scenario 16: Normal vitals with emergency warning sign -> RED overrides normal vitals
  it('Scenario 16: Normal vital signs but emergency symptom present MUST result in RED', () => {
    const input = createDefaultInput();
    // Everything normal
    input.health.bodyTemperature = 98.4;
    input.health.bpSystolic = 120;
    input.health.bpDiastolic = 80;
    input.health.heartRate = 72;
    // BUT emergency seizure occurred
    input.emergency.seizuresOrConvulsions = true;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.isEmergency).toBe(true);
    expect(result.timeframe).toBe('emergency_immediate');
  });

  // Scenario 17: Severe hypoxemia (SpO2 < 90%) -> RED emergency
  it('Scenario 17: Low SpO2 (<90%) triggers severe hypoxemia RED emergency', () => {
    const input = createDefaultInput();
    input.health.spo2 = 86;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.triggeredRuleIds).toContain('VITAL_LOW_SPO2');
  });

  // Scenario 18: Extreme hyperpyrexia (>= 104°F) -> RED emergency
  it('Scenario 18: Temperature >= 104°F (40°C) triggers hyperpyrexia RED emergency', () => {
    const input = createDefaultInput();
    input.health.bodyTemperature = 104.5;
    input.health.temperatureUnit = 'fahrenheit';

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.triggeredRuleIds).toContain('VITAL_EXTREME_HYPERPYREXIA');
  });

  // Scenario 19: Lower-urgency symptom combined with a higher-urgency warning sign (RED overrides YELLOW)
  it('Scenario 19: Mild cough (lower urgency) combined with severe dyspnea (emergency) triggers RED', () => {
    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['cough'];
    input.emergency.severeBreathingDifficulty = true;

    const result = runHealthAssessment(input);
    expect(result.urgency).toBe('RED');
    expect(result.isEmergency).toBe(true);
  });

  // Scenario 20: Duration conversions (hours vs days)
  it('Scenario 20: Duration converted correctly: 96 hours equals 4 days and triggers persistent fever', () => {
    const days = durationToDays(96, 'hours');
    expect(days).toBe(4);

    const input = createDefaultInput();
    input.symptoms.primarySymptoms = ['fever'];
    input.symptoms.durationValue = 96;
    input.symptoms.durationUnit = 'hours';

    const result = runHealthAssessment(input);
    expect(result.triggeredRuleIds).toContain('FEVER_PERSISTENT');
    expect(result.timeframe).toBe('same_day');
  });
});
