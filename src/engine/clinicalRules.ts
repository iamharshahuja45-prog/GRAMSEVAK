import { ClinicalRule } from './types';
import { toFahrenheit, durationToDays, durationToHours, getAgeGroup } from '../utils/conversions';

export const CLINICAL_RULES: ClinicalRule[] = [
  // -------------------------------------------------------------------------
  // LEVEL 1: IMMEDIATE EMERGENCY SCREENING RULES (HIGHEST PRIORITY - RED)
  // -------------------------------------------------------------------------
  {
    id: 'EMERG_BREATHING',
    titleHindi: 'अत्यधिक श्वसन संकट (Severe Dyspnea)',
    ageGroup: 'all',
    requiredInputs: ['severeBreathingDifficulty'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'आपने अत्यधिक साँस लेने में परेशानी होने की जानकारी दी है। यह श्वासनली में गंभीर रुकावट, फेफड़ों में संक्रमण अथवा हृदय संबंधी आपातकाल का संकेत हो सकता है।',
    sourceReference: {
      organization: 'विश्व स्वास्थ्य संगठन (WHO) / MoHFW',
      documentTitle: 'एक्यूट रेस्पिरेटरी डिस्ट्रेस इमरजेंसी प्रोटोकॉल',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.severeBreathingDifficulty === true,
  },
  {
    id: 'EMERG_CHEST_PAIN',
    titleHindi: 'गंभीर सीने में दर्द (Suspected Acute Coronary Syndrome)',
    ageGroup: 'all',
    requiredInputs: ['severeChestPain'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'सीने में तेज़ या लगातार दर्द हृदय आघात (हार्ट अटैक) का मुख्य चेतावनी संकेत हो सकता है। इसमें तुरंत चिकित्सीय हस्तक्षेप की आवश्यकता होती है।',
    sourceReference: {
      organization: 'कार्डियोलॉजिकल सोसाइटी ऑफ इंडिया (CSI)',
      documentTitle: 'एक्यूट मायोकार्डियल इन्फ्रक्शन प्राथमिक प्रबंधन',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.severeChestPain === true,
  },
  {
    id: 'EMERG_UNCONSCIOUS',
    titleHindi: 'बेहोशी अथवा चेतना में बदलाव (Altered Mental State)',
    ageGroup: 'all',
    requiredInputs: ['unconsciousOrAlteredState'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'मरीज का अचेत होना, बेहोश होना या जगाने में असमर्थता मस्तिष्क या महत्वपूर्ण अंगों में गंभीर समस्या दर्शाता है। तुरंत एम्बुलेंस बुलाएं।',
    sourceReference: {
      organization: 'AIIMS इमरजेंसी मेडिसिन',
      documentTitle: 'अचेत अवस्था एवं कोमा प्रोटोकॉल',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.unconsciousOrAlteredState === true,
  },
  {
    id: 'EMERG_STROKE',
    titleHindi: 'अचानक कमजोरी अथवा स्ट्रोक के लक्षण (FAST Protocol)',
    ageGroup: 'all',
    requiredInputs: ['suddenWeaknessOrNumbness', 'speechDifficulty'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'चेहरे, हाथ या पैर में अचानक कमजोरी या बोली लड़खड़ाना मस्तिष्क पक्षाघात (ब्रेन स्ट्रोक) का अत्यंत गंभीर संकेत है। पहले 3-4 घंटों में इलाज जीवनरक्षक होता है।',
    sourceReference: {
      organization: 'इंडियन स्ट्रोक एसोसिएशन (ISA)',
      documentTitle: 'तीव्र इस्केमिक स्ट्रोक रेफरल दिशानिर्देश',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) =>
      input.emergency.suddenWeaknessOrNumbness === true || input.emergency.speechDifficulty === true,
  },
  {
    id: 'EMERG_BLEEDING',
    titleHindi: 'अनियंत्रित तीव्र रक्तस्राव (Severe Hemorrhage)',
    ageGroup: 'all',
    requiredInputs: ['heavyBleeding'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'शरीर से अत्यधिक या अनियंत्रित खून बहना तुरंत रक्तचाप गिराकर आघात (शॉक) का कारण बन सकता है। तुरंत अस्पताल पहुँचें।',
    sourceReference: {
      organization: 'MoHFW राष्ट्रीय ट्रॉमा दिशानिर्देश',
      documentTitle: 'रक्तस्राव नियंत्रण एवं प्राथमिक आपात चिकित्सा',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.heavyBleeding === true,
  },
  {
    id: 'EMERG_ANAPHYLAXIS',
    titleHindi: 'तीव्र एलर्जी अथवा श्वासनली में सूजन (Anaphylaxis)',
    ageGroup: 'all',
    requiredInputs: ['throatSwellingWithStridor'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'जीभ व गले में सूजन के साथ साँस में रुकावट एक तीव्र जानलेवा एलर्जी (एनाफिलेक्सिस) हो सकती है, जिसमें बिना देरी किए एड्रेनालाईन/इमरजेंसी दवा की आवश्यकता होती है।',
    sourceReference: {
      organization: 'विश्व एलर्जी संगठन (WAO)',
      documentTitle: 'एनाफिलेक्सिस आपातकालीन दिशानिर्देश',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.throatSwellingWithStridor === true,
  },
  {
    id: 'EMERG_SEIZURE',
    titleHindi: 'दौरा पड़ना अथवा आक्षेप (Seizures / Status Epilepticus)',
    ageGroup: 'all',
    requiredInputs: ['seizuresOrConvulsions'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'दौरा पड़ना या शरीर में तेज झटके आना तंत्रिका तंत्र में तीव्र गड़बड़ी का संकेत है। मरीज को तुरंत नजदीकी अस्पताल ले जाएं।',
    sourceReference: {
      organization: 'भारतीय मिर्गी संघ (IEA)',
      documentTitle: 'तीव्र आक्षेप प्राथमिक प्रबंधन',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.seizuresOrConvulsions === true,
  },
  {
    id: 'EMERG_THUNDERCLAP_HEADACHE',
    titleHindi: 'अचानक असहनीय तीव्र सिरदर्द (Sudden Thunderclap Headache)',
    ageGroup: 'all',
    requiredInputs: ['suddenSevereHeadache'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'अचानक शुरू हुआ बिजली की कौंध जैसा भयानक सिरदर्द मस्तिष्क के भीतर रक्तस्राव (सबएरेकनॉइड हेमरेज) का लक्षण हो सकता है। तुरंत सीटी स्कैन व आपातकालीन जाँच आवश्यक है।',
    sourceReference: {
      organization: 'न्यूरोलॉजिकल सोसाइटी ऑफ इंडिया',
      documentTitle: 'थंडरक्लैप सिरदर्द एवं संवहनी आपात स्थिति',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.suddenSevereHeadache === true,
  },
  {
    id: 'EMERG_PREGNANCY_DISTRESS',
    titleHindi: 'गर्भावस्था में गंभीर आपात संकेत (Obstetric Emergency)',
    ageGroup: 'all',
    requiredInputs: ['severePregnancyDistress', 'pregnancyStatus'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'गर्भावस्था के दौरान अत्यधिक पेट दर्द, योनि से रक्तस्राव या गंभीर लक्षण माँ और गर्भस्थ शिशु दोनों के लिए तत्काल खतरा पैदा कर सकते हैं। तुरंत नजदीकी मातृ-शिशु अस्पताल जाएं।',
    sourceReference: {
      organization: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW)',
      documentTitle: 'राष्ट्रीय मातृ स्वास्थ्य एवं आपातकालीन प्रसूति देखभाल (EmOC)',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => input.emergency.severePregnancyDistress === true,
  },

  // -------------------------------------------------------------------------
  // LEVEL 2: DANGEROUS VITAL SIGNS (RED)
  // -------------------------------------------------------------------------
  {
    id: 'VITAL_HYPERTENSIVE_CRISIS',
    titleHindi: 'अति उच्च रक्तचाप संकट (Hypertensive Crisis)',
    ageGroup: 'adult',
    requiredInputs: ['bpSystolic', 'bpDiastolic'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'आपका बताया गया रक्तचाप (ऊपर 180 mmHg या नीचे 120 mmHg से अधिक) खतरनाक रूप से अधिक है। इससे हृदय, गुर्दे या मस्तिष्क पर अचानक आघात का जोखिम होता है।',
    sourceReference: {
      organization: 'इंडियन काउंसिल ऑफ मेडिकल रिसर्च (ICMR)',
      documentTitle: 'उच्च रक्तचाप प्रबंधन मानक परिचालन प्रक्रिया',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (input.health.bpUnknown) return false;
      const s = input.health.bpSystolic;
      const d = input.health.bpDiastolic;
      return (s !== null && s >= 180) || (d !== null && d >= 120);
    },
  },
  {
    id: 'VITAL_SEVERE_HYPOTENSION',
    titleHindi: 'अति निम्न रक्तचाप (Severe Hypotension / Shock)',
    ageGroup: 'adult',
    requiredInputs: ['bpSystolic', 'bpDiastolic'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'रक्तचाप का स्तर 90/60 mmHg से काफी कम होना महत्वपूर्ण अंगों में रक्त प्रवाह बाधित होने (शॉक) का संकेत हो सकता है।',
    sourceReference: {
      organization: 'WHO दिशानिर्देश',
      documentTitle: 'वयस्कों में आघात और सेप्सिस की पहचान',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (input.health.bpUnknown) return false;
      const s = input.health.bpSystolic;
      const d = input.health.bpDiastolic;
      return (s !== null && s < 85) || (d !== null && d < 50);
    },
  },
  {
    id: 'VITAL_LOW_SPO2',
    titleHindi: 'रक्त में अत्यंत कम ऑक्सीजन (Severe Hypoxemia)',
    ageGroup: 'all',
    requiredInputs: ['spo2'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'रक्त में ऑक्सीजन का स्तर 90% से नीचे होना गंभीर हाइपोक्सिया दर्शाता है। तुरंत ऑक्सीजन और आपात चिकित्सा की आवश्यकता है।',
    sourceReference: {
      organization: 'MoHFW राष्ट्रीय ऑक्सीजन प्रबंधन प्रोटोकॉल',
      documentTitle: 'पल्स ऑक्सीमेट्री क्लीनिकल मानक',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const sp = input.health.spo2;
      return sp !== null && sp > 0 && sp < 90;
    },
  },
  {
    id: 'VITAL_EXTREME_HYPERPYREXIA',
    titleHindi: 'अति उच्च तापमान (Hyperpyrexia >= 104°F)',
    ageGroup: 'all',
    requiredInputs: ['bodyTemperature', 'temperatureUnit'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: 'शरीर का तापमान 104°F (40°C) या उससे अधिक होना अत्यधिक चिंताजनक है और इससे मस्तिष्क पर दुष्प्रभाव या दौरे का खतरा बढ़ जाता है।',
    sourceReference: {
      organization: 'भारतीय बाल रोग अकादमी एवं AIIMS',
      documentTitle: 'हाइपरपाइरेक्सिया आपातकालीन प्राथमिक उपचार',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (input.health.temperatureUnknown || input.health.bodyTemperature === null) return false;
      const degF = toFahrenheit(input.health.bodyTemperature, input.health.temperatureUnit);
      return degF >= 104.0;
    },
  },
  {
    id: 'PEDIATRIC_INFANT_FEVER',
    titleHindi: 'शिशु में बुखार (Fever in Infant < 1 Year)',
    ageGroup: 'infant',
    requiredInputs: ['bodyTemperature', 'age'],
    urgency: 'RED',
    timeframe: 'emergency_immediate',
    explanationHindi: '1 वर्ष से कम उम्र के शिशु में बुखार किसी गंभीर नवजात संक्रमण (सेप्सिस) का संकेत हो सकता है। बाल रोग विशेषज्ञ से तुरंत आपातकालीन जाँच आवश्यक है।',
    sourceReference: {
      organization: 'WHO / भारतीय बाल रोग अकादमी (IAP)',
      documentTitle: 'नवजात शिशु एवं बाल रोग एकीकृत प्रबंधन (IMNCI)',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const age = input.personal.age;
      if (age === null || age >= 1) return false;
      const hasFeverSymptom = input.symptoms.primarySymptoms.includes('fever');
      let highTemp = false;
      if (!input.health.temperatureUnknown && input.health.bodyTemperature !== null) {
        const degF = toFahrenheit(input.health.bodyTemperature, input.health.temperatureUnit);
        highTemp = degF >= 100.4;
      }
      return hasFeverSymptom || highTemp;
    },
  },

  // -------------------------------------------------------------------------
  // LEVEL 3: MODERATE TO HIGH RISK (YELLOW - SAME DAY OR 24-48 HOURS)
  // -------------------------------------------------------------------------
  {
    id: 'HIGH_BP_STAGE_2',
    titleHindi: 'उच्च रक्तचाप (Stage 2 Hypertension)',
    ageGroup: 'adult',
    requiredInputs: ['bpSystolic', 'bpDiastolic'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'आपका बताया गया रक्तचाप (ऊपर 140+ या नीचे 90+ mmHg) उच्च श्रेणी में है। आज ही किसी योग्य डॉक्टर से बीपी की औपचारिक जाँच कराएं।',
    sourceReference: {
      organization: 'ICMR / भारतीय उच्च रक्तचाप नियंत्रण पहल (IHCI)',
      documentTitle: 'हाइपरटेंशन स्क्रीनिंग एवं उपचार दिशानिर्देश',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (input.health.bpUnknown) return false;
      const s = input.health.bpSystolic;
      const d = input.health.bpDiastolic;
      if (s === null || d === null) return false;
      // Below crisis (180/120) but Stage 2
      const isStage2 = (s >= 140 && s < 180) || (d >= 90 && d < 120);
      return isStage2;
    },
  },
  {
    id: 'CONCERNING_SPO2_MILD',
    titleHindi: 'ऑक्सीजन स्तर में गिरावट (SpO2 90-93%)',
    ageGroup: 'all',
    requiredInputs: ['spo2'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'रक्त में ऑक्सीजन का स्तर 90% से 93% के बीच पाया गया है। फेफड़ों की कार्यप्रणाली की चिकित्सकीय जाँच आज ही आवश्यक है।',
    sourceReference: {
      organization: 'MoHFW राष्ट्रीय ऑक्सीजन दिशानिर्देश',
      documentTitle: 'ऑक्सीजन संतृप्ति की व्याख्या',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const sp = input.health.spo2;
      return sp !== null && sp >= 90 && sp <= 93;
    },
  },
  {
    id: 'FEVER_PERSISTENT',
    titleHindi: 'लगातार 3 दिन से अधिक बुखार (Persistent Fever > 72h)',
    ageGroup: 'all',
    requiredInputs: ['primarySymptoms', 'durationValue', 'durationUnit'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'बुखार 3 दिन (72 घंटे) से अधिक समय से बना हुआ है। मलेरिया, डेंगू, टाइफाइड या अन्य संक्रमण की पुष्टि के लिए रक्त जाँच आवश्यक है।',
    sourceReference: {
      organization: 'राष्ट्रीय वेक्टर जनित रोग नियंत्रण कार्यक्रम (NVBDCP)',
      documentTitle: 'दीर्घकालिक बुखार नैदानिक प्रोटोकॉल',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (!input.symptoms.primarySymptoms.includes('fever')) return false;
      if (input.symptoms.durationValue === null) return false;
      const days = durationToDays(input.symptoms.durationValue, input.symptoms.durationUnit);
      return days >= 3;
    },
  },
  {
    id: 'CHEST_BREATHING_NON_EMERG',
    titleHindi: 'सीने में परेशानी अथवा खाँसी-साँस के लक्षण',
    ageGroup: 'all',
    requiredInputs: ['primarySymptoms'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'आपने सीने में दर्द या साँस से संबंधित परेशानी की जानकारी दी है। भले ही आपातकालीन संकेत न दिखें, परंतु हृदय व फेफड़ों की सुरक्षा हेतु आज ही जाँच कराना बुद्धिमानी है।',
    sourceReference: {
      organization: 'MoHFW प्राथमिक स्वास्थ्य मानक',
      documentTitle: 'श्वसन व हृदय संबंधी प्राथमिक रेफरल',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const sym = input.symptoms.primarySymptoms;
      return sym.includes('chest_pain') || sym.includes('breathing_difficulty');
    },
  },
  {
    id: 'DIARRHEA_VOMITING_DEHYDRATION_RISK',
    titleHindi: 'दस्त और उल्टी से निर्जलीकरण की आशंका',
    ageGroup: 'all',
    requiredInputs: ['primarySymptoms'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'दस्त और उल्टी एक साथ होने से शरीर में पानी और जीवनरक्षक लवण की कमी तेजी से हो सकती है। ओआरएस तुरंत शुरू करें और आज ही स्वास्थ्य केंद्र दिखाएं।',
    sourceReference: {
      organization: 'WHO / यूनिसेफ (UNICEF)',
      documentTitle: 'दस्त रोग एवं डिहाइड्रेशन प्रबंधन',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const sym = input.symptoms.primarySymptoms;
      return sym.includes('diarrhea') && sym.includes('vomiting');
    },
  },
  {
    id: 'PREGNANCY_WITH_SYMPTOMS',
    titleHindi: 'गर्भावस्था के दौरान स्वास्थ्य लक्षण',
    ageGroup: 'adult',
    requiredInputs: ['pregnancyStatus', 'primarySymptoms'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'गर्भावस्था के दौरान किसी भी प्रकार के लक्षण (जैसे बुखार, उल्टी, पेट दर्द) में अतिरिक्त सतर्कता बरतनी चाहिए ताकि माँ और बच्चे दोनों सुरक्षित रहें।',
    sourceReference: {
      organization: 'MoHFW प्रधानमंत्री सुरक्षित मातृत्व अभियान (PMSMA)',
      documentTitle: 'गर्भावस्था जोखिम पहचान एवं सुरक्षित मातृत्व दिशानिर्देश',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (input.symptoms.pregnancyStatus !== 'yes') return false;
      const validSymptoms = input.symptoms.primarySymptoms.filter(
        (s) => s !== 'no_symptoms'
      );
      return validSymptoms.length > 0;
    },
  },
  {
    id: 'PEDIATRIC_CHILD_FEVER',
    titleHindi: '1 से 12 वर्ष के बच्चे में बुखार',
    ageGroup: 'child',
    requiredInputs: ['age', 'primarySymptoms'],
    urgency: 'YELLOW',
    timeframe: 'same_day',
    explanationHindi: 'बच्चे की आयु 12 वर्ष से कम है और बुखार बताया गया है। बच्चों में संक्रमण तेजी से बढ़ सकता है, इसलिए आज ही डॉक्टर को दिखाएं।',
    sourceReference: {
      organization: 'भारतीय बाल रोग अकादमी (IAP)',
      documentTitle: 'बच्चों में बाल्यकालीन संक्रमण एवं बुखार प्रबंधन',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const age = input.personal.age;
      if (age === null || age < 1 || age > 12) return false;
      return input.symptoms.primarySymptoms.includes('fever');
    },
  },
  {
    id: 'ELDERLY_RISK_SYMPTOMS',
    titleHindi: 'वरिष्ठ नागरिक (65+ वर्ष) में लक्षण',
    ageGroup: 'elderly',
    requiredInputs: ['age', 'primarySymptoms'],
    urgency: 'YELLOW',
    timeframe: 'within_24_48_hours',
    explanationHindi: 'आपकी आयु 65 वर्ष या उससे अधिक है। उम्र के इस पड़ाव पर शारीरिक प्रतिरोधक क्षमता कम होने से साधारण लक्षण भी निगरानी की माँग करते हैं।',
    sourceReference: {
      organization: 'राष्ट्रीय वृद्धजन स्वास्थ्य देखभाल कार्यक्रम (NPHCE)',
      documentTitle: 'वरिष्ठ नागरिकों के लिए प्राथमिक स्वास्थ्य देखभाल',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      const age = input.personal.age;
      if (age === null || age < 65) return false;
      const validSymptoms = input.symptoms.primarySymptoms.filter(
        (s) => s !== 'no_symptoms'
      );
      return validSymptoms.length > 0;
    },
  },
  {
    id: 'TACHYCARDIA_OR_BRADYCARDIA',
    titleHindi: 'असामान्य हृदय गति (Abnormal Pulse Rate)',
    ageGroup: 'adult',
    requiredInputs: ['heartRate'],
    urgency: 'YELLOW',
    timeframe: 'within_24_48_hours',
    explanationHindi: 'हृदय गति सामान्य सीमा (60-100 धड़कन प्रति मिनट) से बाहर है। यदि यह लगातार बनी रहे तो ईसीजी (ECG) जाँच कराना उचित होगा।',
    sourceReference: {
      organization: 'कार्डियोलॉजिकल सोसाइटी ऑफ इंडिया',
      documentTitle: 'कार्डियक एरिद्मिया प्राथमिक मूल्यांकन',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: true,
    evaluate: (input) => {
      if (input.health.heartRateUnknown || input.health.heartRate === null) return false;
      const hr = input.health.heartRate;
      return hr < 50 || hr > 115;
    },
  },
  {
    id: 'GENERAL_MILD_SYMPTOMS',
    titleHindi: 'साधारण लक्षण (खाँसी, सिरदर्द, बदन दर्द, आदि)',
    ageGroup: 'all',
    requiredInputs: ['primarySymptoms'],
    urgency: 'YELLOW',
    timeframe: 'within_24_48_hours',
    explanationHindi: 'आपके बताए गए लक्षणों के लिए घर पर प्राथमिक देखभाल करें और अगले 24 से 48 घंटे में नजदीकी स्वास्थ्य केंद्र जाकर डॉक्टर की राय लें।',
    sourceReference: {
      organization: 'राष्ट्रीय स्वास्थ्य मिशन (NHM)',
      documentTitle: 'आयुष्मान आरोग्य मंदिर - प्राथमिक लक्षण दिशानिर्देश',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: false,
    evaluate: (input) => {
      const sym = input.symptoms.primarySymptoms.filter(
        (s) => s !== 'no_symptoms'
      );
      return sym.length > 0;
    },
  },

  // -------------------------------------------------------------------------
  // LEVEL 4: ROUTINE / NO APPARENT EMERGENCY (GREEN)
  // -------------------------------------------------------------------------
  {
    id: 'ROUTINE_NO_SYMPTOMS',
    titleHindi: 'कोई स्पष्ट आपातकालीन संकेत नहीं',
    ageGroup: 'all',
    requiredInputs: ['primarySymptoms'],
    urgency: 'GREEN',
    timeframe: 'monitor_and_escalate',
    explanationHindi: 'दी गई जानकारी में कोई स्पष्ट आपातकालीन संकेत नहीं मिला है। अपनी सामान्य दिनचर्या जारी रखें और स्वास्थ्य पर नज़र रखें।',
    sourceReference: {
      organization: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW)',
      documentTitle: 'निवारक स्वास्थ्य एवं जीवनशैली परामर्श',
      guidelineYear: 2024,
    },
    lastReviewedDate: '2025-01-15',
    clinicianReviewRequired: false,
    evaluate: (input) => {
      const hasNoSymptoms =
        input.symptoms.primarySymptoms.length === 0 ||
        input.symptoms.primarySymptoms.includes('no_symptoms');
      return hasNoSymptoms;
    },
  },
];
