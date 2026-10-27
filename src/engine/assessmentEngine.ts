import { AssessmentResult, MedicalSourceRef } from './types';
import { UserAssessmentInput, HealthcareTimeframe, UrgencyLevel } from '../types/health';
import { CLINICAL_RULES } from './clinicalRules';
import { toFahrenheit, durationToDays } from '../utils/conversions';

export function runHealthAssessment(input: UserAssessmentInput): AssessmentResult {
  const triggeredRuleIds: string[] = [];
  const reasonsHindi: string[] = [];
  const concerningSymptoms: string[] = [];
  const concerningMeasurements: string[] = [];
  const missingInformation: string[] = [];
  const sourceReferences: MedicalSourceRef[] = [];
  const escalationSignsHindi: string[] = [];

  // Check missing vital signs
  if (input.health.temperatureUnknown || input.health.bodyTemperature === null) {
    missingInformation.push('शरीर का तापमान नहीं नापा गया है');
  }
  if (input.health.bpUnknown || input.health.bpSystolic === null || input.health.bpDiastolic === null) {
    missingInformation.push('रक्तचाप (BP) की जाँच नहीं की गई है');
  }
  if (input.health.heartRateUnknown || input.health.heartRate === null) {
    missingInformation.push('हृदय गति (नाड़ी दर) दर्ज नहीं की गई है');
  }

  // Evaluate all rules
  let overallUrgency: UrgencyLevel = 'GREEN';
  let isEmergency = false;
  let chosenTimeframe: HealthcareTimeframe = 'monitor_and_escalate';

  // Rule evaluation in strict priority order:
  // 1. Emergency RED rules
  const redRules = CLINICAL_RULES.filter((r) => r.urgency === 'RED');
  const yellowRules = CLINICAL_RULES.filter((r) => r.urgency === 'YELLOW');
  const greenRules = CLINICAL_RULES.filter((r) => r.urgency === 'GREEN');

  // Evaluate RED rules
  for (const rule of redRules) {
    if (rule.evaluate(input)) {
      overallUrgency = 'RED';
      isEmergency = true;
      chosenTimeframe = 'emergency_immediate';
      triggeredRuleIds.push(rule.id);
      reasonsHindi.push(rule.explanationHindi);
      sourceReferences.push(rule.sourceReference);
    }
  }

  // If not emergency, check YELLOW rules
  if (overallUrgency !== 'RED') {
    for (const rule of yellowRules) {
      if (rule.evaluate(input)) {
        overallUrgency = 'YELLOW';
        triggeredRuleIds.push(rule.id);
        reasonsHindi.push(rule.explanationHindi);
        sourceReferences.push(rule.sourceReference);

        // Pick most urgent timeframe
        if (rule.timeframe === 'same_day') {
          chosenTimeframe = 'same_day';
        } else if (rule.timeframe === 'within_24_48_hours' && chosenTimeframe !== 'same_day') {
          chosenTimeframe = 'within_24_48_hours';
        } else if (rule.timeframe === 'few_days' && chosenTimeframe === 'monitor_and_escalate') {
          chosenTimeframe = 'few_days';
        }
      }
    }
  }

  // If still GREEN
  if (overallUrgency === 'GREEN') {
    for (const rule of greenRules) {
      if (rule.evaluate(input)) {
        triggeredRuleIds.push(rule.id);
        reasonsHindi.push(rule.explanationHindi);
        sourceReferences.push(rule.sourceReference);
      }
    }
  }

  // Identify concerning symptoms reported
  const primary = input.symptoms.primarySymptoms;
  if (primary.includes('chest_pain')) {
    concerningSymptoms.push('सीने में दर्द या भारीपन');
  }
  if (primary.includes('breathing_difficulty')) {
    concerningSymptoms.push('साँस लेने में परेशानी');
  }
  if (primary.includes('fever')) {
    const days = input.symptoms.durationValue
      ? durationToDays(input.symptoms.durationValue, input.symptoms.durationUnit)
      : 0;
    if (days >= 3) {
      concerningSymptoms.push('3 या अधिक दिनों से लगातार बुखार');
    } else {
      concerningSymptoms.push('बुखार');
    }
  }
  if (primary.includes('diarrhea') && primary.includes('vomiting')) {
    concerningSymptoms.push('दस्त और उल्टी एक साथ होना (निर्जलीकरण का खतरा)');
  }
  if (primary.includes('dizziness')) {
    concerningSymptoms.push('चक्कर आना व संतुलन खोना');
  }

  // Identify concerning measurements
  if (!input.health.temperatureUnknown && input.health.bodyTemperature !== null) {
    const degF = toFahrenheit(input.health.bodyTemperature, input.health.temperatureUnit);
    if (degF >= 104) {
      concerningMeasurements.push(`अति उच्च तापमान: ${input.health.bodyTemperature}° ${input.health.temperatureUnit === 'celsius' ? 'C' : 'F'} (अत्यधिक गंभीर)`);
    } else if (degF >= 100.4) {
      concerningMeasurements.push(`बुखार का तापमान: ${input.health.bodyTemperature}° ${input.health.temperatureUnit === 'celsius' ? 'C' : 'F'}`);
    }
  }

  if (!input.health.bpUnknown && input.health.bpSystolic !== null && input.health.bpDiastolic !== null) {
    const s = input.health.bpSystolic;
    const d = input.health.bpDiastolic;
    if (s >= 180 || d >= 120) {
      concerningMeasurements.push(`अति उच्च रक्तचाप संकट (BP ${s}/${d} mmHg)`);
    } else if (s >= 140 || d >= 90) {
      concerningMeasurements.push(`उच्च रक्तचाप स्टेज 2 (BP ${s}/${d} mmHg)`);
    } else if (s < 85 || d < 50) {
      concerningMeasurements.push(`अति निम्न रक्तचाप (BP ${s}/${d} mmHg)`);
    }
  }

  if (!input.health.heartRateUnknown && input.health.heartRate !== null) {
    const hr = input.health.heartRate;
    if (hr > 120) {
      concerningMeasurements.push(`तेज हृदय गति (${hr} धड़कन प्रति मिनट)`);
    } else if (hr < 50) {
      concerningMeasurements.push(`धीमी हृदय गति (${hr} धड़कन प्रति मिनट)`);
    }
  }

  if (input.health.spo2 !== null && input.health.spo2 > 0) {
    if (input.health.spo2 < 90) {
      concerningMeasurements.push(`गंभीर रूप से कम ऑक्सीजन (SpO2 ${input.health.spo2}%)`);
    } else if (input.health.spo2 <= 93) {
      concerningMeasurements.push(`कम ऑक्सीजन स्तर (SpO2 ${input.health.spo2}%)`);
    }
  }

  // Timeframe text in Hindi
  let timeframeHindi = '';
  switch (chosenTimeframe) {
    case 'emergency_immediate':
      timeframeHindi = 'अभी आपातकालीन सहायता लें (तुरंत 112 या 108 पर संपर्क करें)';
      break;
    case 'same_day':
      timeframeHindi = 'आज ही नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) या डॉक्टर से सलाह लें';
      break;
    case 'within_24_48_hours':
      timeframeHindi = 'अगले 24–48 घंटे में चिकित्सकीय जाँच कराएँ';
      break;
    case 'few_days':
      timeframeHindi = 'कुछ दिनों के भीतर सामान्य ओपीडी में चिकित्सकीय सलाह लें';
      break;
    case 'monitor_and_escalate':
      timeframeHindi = 'घर पर लक्षणों पर नज़र रखें और परेशानी बढ़ने पर तुरंत डॉक्टर को दिखाएं';
      break;
  }

  // Urgency titles & descriptions
  let urgencyTitleHindi = '';
  let urgencyDescriptionHindi = '';
  if (overallUrgency === 'RED') {
    urgencyTitleHindi = 'तत्काल चिकित्सा सहायता आवश्यक (आपातकालीन)';
    urgencyDescriptionHindi = 'गंभीर समस्या की आशंका है। किसी भी घरेलू उपचार में समय न गंवाएं और तुरंत आपातकालीन चिकित्सा सहायता लें।';
  } else if (overallUrgency === 'YELLOW') {
    urgencyTitleHindi = 'सावधानी एवं चिकित्सकीय सलाह आवश्यक';
    urgencyDescriptionHindi = 'कुछ लक्षणों या मापों के कारण चिकित्सकीय सलाह लेना उचित है। घर पर प्राथमिक देखभाल करें और डॉक्टर से मिलें।';
  } else {
    urgencyTitleHindi = 'कम तत्काल चिंता (कोई आपात संकेत नहीं)';
    urgencyDescriptionHindi = 'दी गई जानकारी में कोई स्पष्ट आपातकालीन संकेत नहीं मिला है। सामान्य देखभाल जारी रखें।';
  }

  // Immediate next steps checklist
  const immediateNextStepsHindi: string[] = [];
  if (overallUrgency === 'RED') {
    immediateNextStepsHindi.push('बिना किसी देरी के आपातकालीन एम्बुलेंस (108 / 112) को कॉल करें।');
    immediateNextStepsHindi.push('मरीज को शांत रखें और आराम की सुरक्षित मुद्रा में बिठाएं या लिटाएं।');
    immediateNextStepsHindi.push('मरीज को अकेले न छोड़ें और उनके साथ अस्पताल जाने की तैयारी रखें।');
    immediateNextStepsHindi.push('पूर्व में किए गए इलाज के सभी पुराने पर्चे और पहचान पत्र साथ रख लें।');
  } else if (overallUrgency === 'YELLOW') {
    immediateNextStepsHindi.push('आज या अगले 24-48 घंटों में नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) या अस्पताल जाएं।');
    immediateNextStepsHindi.push('घर पर पर्याप्त आराम करें और शरीर में पानी की कमी न होने दें।');
    immediateNextStepsHindi.push('नीचे दिए गए सुरक्षित घरेलू देखभाल सुझावों का सावधानीपूर्वक पालन करें।');
    immediateNextStepsHindi.push('यदि लक्षण अचानक बढ़ें या साँस फूलने लगे तो तुरंत अस्पताल जाएं।');
  } else {
    immediateNextStepsHindi.push('भरपूर आराम करें और पौष्टिक व सुपाच्य भोजन लें।');
    immediateNextStepsHindi.push('स्वच्छ पानी पिएं और व्यक्तिगत स्वच्छता का ध्यान रखें।');
    immediateNextStepsHindi.push('यदि कोई नया लक्षण दिखाई दे तो दोबारा स्वास्थ्य जाँच करें।');
  }

  // Escalation warning signs
  if (overallUrgency === 'RED') {
    escalationSignsHindi.push('बेहोशी छाना या जगाने में कठिनाई होना');
    escalationSignsHindi.push('साँस का बहुत अधिक फूलना या होंठ नीले पड़ना');
    escalationSignsHindi.push('सीने में असहनीय भारीपन और अत्यधिक ठंडा पसीना');
  } else {
    escalationSignsHindi.push('साँस लेने में अचानक गंभीर कठिनाई होना');
    escalationSignsHindi.push('लगातार तेज बुखार जो 3 दिनों से अधिक रहे');
    escalationSignsHindi.push('अत्यधिक कमजोरी के कारण बिस्तर से न उठ पाना या लगातार उल्टियाँ होना');
    escalationSignsHindi.push('चेहरे या हाथ-पैर में सुन्नपन या बोलने में असमर्थता');
  }

  // Uncertainty explanation if measurements are missing
  let uncertaintyExplanationHindi: string | undefined = undefined;
  if (missingInformation.length > 0 && overallUrgency !== 'RED') {
    uncertaintyExplanationHindi = `ध्यान दें: आपके द्वारा कुछ महत्वपूर्ण स्वास्थ्य माप (${missingInformation.join(', ')}) दर्ज नहीं किए गए हैं। यह परिणाम केवल उपलब्ध जानकारी पर आधारित है और इसे पूर्ण स्वास्थ्य प्रमाण पत्र न समझें।`;
  }

  // Distance consideration
  let distanceKmConsideration: string | undefined = undefined;
  if (input.personal.nearestHealthCenterDistanceKm !== null) {
    const dist = input.personal.nearestHealthCenterDistanceKm;
    if (dist > 15 && overallUrgency === 'RED') {
      distanceKmConsideration = `आपका नजदीकी स्वास्थ्य केंद्र लगभग ${dist} किमी दूर है। समय की बचत के लिए तुरंत 108 एम्बुलेंस अथवा उपलब्ध सुरक्षित वाहन की व्यवस्था करें।`;
    } else if (dist > 0) {
      distanceKmConsideration = `नजदीकी स्वास्थ्य केंद्र की अनुमानित दूरी: ${dist} किमी। यात्रा के समय का ध्यान रखते हुए डॉक्टर के पास पहुँचें।`;
    }
  }

  // Suitable home care IDs matching primary symptoms
  const suitableHomeCareIds = primary.filter(
    (s) => s !== 'no_symptoms' && s !== 'other'
  );
  // Default to general tips if none selected
  if (suitableHomeCareIds.length === 0 && overallUrgency !== 'RED') {
    suitableHomeCareIds.push('fever'); // sample general advice
  }

  // Deduplicate source references
  const uniqueSources = sourceReferences.filter(
    (src, idx, arr) =>
      arr.findIndex(
        (s) => s.documentTitle === src.documentTitle && s.organization === src.organization
      ) === idx
  );

  return {
    urgency: overallUrgency,
    urgencyTitleHindi,
    urgencyDescriptionHindi,
    isEmergency,
    reasonsHindi,
    concerningSymptoms,
    concerningMeasurements,
    missingInformation,
    timeframe: chosenTimeframe,
    timeframeHindi,
    immediateNextStepsHindi,
    suitableHomeCareIds,
    escalationSignsHindi,
    uncertaintyExplanationHindi,
    triggeredRuleIds,
    sourceReferences: uniqueSources,
    distanceKmConsideration,
  };
}
