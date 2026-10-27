import { AgeGroup } from '../engine/types';
import { DurationUnit, TemperatureUnit } from '../types/health';

/**
 * Converts temperature to Fahrenheit for internal standardized evaluation
 */
export function toFahrenheit(val: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') return val;
  return (val * 9) / 5 + 32;
}

/**
 * Converts temperature to Celsius
 */
export function toCelsius(val: number, unit: TemperatureUnit): number {
  if (unit === 'celsius') return val;
  return ((val - 32) * 5) / 9;
}

/**
 * Validates whether temperature reading is physiologically plausible
 */
export function isPhysiologicallyPlausibleTemperature(val: number, unit: TemperatureUnit): boolean {
  const f = toFahrenheit(val, unit);
  // Human survival limits roughly 90°F (32.2°C) to 108°F (42.2°C)
  return f >= 90 && f <= 108;
}

/**
 * Converts duration value to hours
 */
export function durationToHours(value: number, unit: DurationUnit): number {
  if (unit === 'hours') return value;
  return value * 24;
}

/**
 * Converts duration value to days
 */
export function durationToDays(value: number, unit: DurationUnit): number {
  if (unit === 'days') return value;
  return value / 24;
}

/**
 * Validates Blood Pressure plausibility
 */
export function validateBloodPressure(systolic: number | null, diastolic: number | null): {
  isValid: boolean;
  errorHindi?: string;
} {
  if (systolic === null && diastolic === null) return { isValid: true };
  if (systolic === null || diastolic === null) {
    return {
      isValid: false,
      errorHindi: 'कृपया ऊपर (Systolic) और नीचे (Diastolic) दोनों दबाव दर्ज करें अथवा "मुझे नहीं पता" चुनें।',
    };
  }

  if (systolic < 60 || systolic > 260) {
    return {
      isValid: false,
      errorHindi: 'ऊपर का दबाव (Systolic) 60 से 260 mmHg के बीच होना चाहिए। कृपया जाँचें।',
    };
  }

  if (diastolic < 40 || diastolic > 160) {
    return {
      isValid: false,
      errorHindi: 'नीचे का दबाव (Diastolic) 40 से 160 mmHg के बीच होना चाहिए। कृपया जाँचें।',
    };
  }

  if (systolic <= diastolic) {
    return {
      isValid: false,
      errorHindi: 'ऊपर का दबाव (Systolic) हमेशा नीचे के दबाव (Diastolic) से अधिक होना चाहिए।',
    };
  }

  if (systolic - diastolic < 15) {
    return {
      isValid: false,
      errorHindi: 'ऊपर और नीचे के दबाव में अंतर बहुत कम है। कृपया बीपी मशीन से दोबारा नापें।',
    };
  }

  return { isValid: true };
}

/**
 * Validates Heart Rate plausibility
 */
export function validateHeartRate(hr: number | null): {
  isValid: boolean;
  errorHindi?: string;
} {
  if (hr === null) return { isValid: true };
  if (hr < 30 || hr > 220) {
    return {
      isValid: false,
      errorHindi: 'हृदय गति 30 से 220 धड़कन प्रति मिनट के बीच होनी चाहिए। कृपया नाड़ी दोबारा गिनें।',
    };
  }
  return { isValid: true };
}

/**
 * Determines age category based on years
 */
export function getAgeGroup(age: number | null): AgeGroup {
  if (age === null) return 'adult';
  if (age < 1) return 'infant';
  if (age < 13) return 'child';
  if (age < 18) return 'adolescent';
  if (age >= 65) return 'elderly';
  return 'adult';
}
