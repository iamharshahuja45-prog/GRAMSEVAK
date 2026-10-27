import { EmergencyScreeningAnswers } from '../types/health';

export interface EmergencyQuestionItem {
  id: keyof EmergencyScreeningAnswers;
  questionHindi: string;
  contextHindi: string;
  isPregnancySpecific?: boolean;
}

export const EMERGENCY_QUESTIONS: EmergencyQuestionItem[] = [
  {
    id: 'severeBreathingDifficulty',
    questionHindi: 'क्या आपको बहुत अधिक साँस लेने में परेशानी हो रही है?',
    contextHindi: 'साँस फूलना, होंठ नीले पड़ना या बोलने में साँस का अटकना',
  },
  {
    id: 'severeChestPain',
    questionHindi: 'क्या सीने में तेज़ या लगातार दर्द अथवा भारीपन हो रहा है?',
    contextHindi: 'दर्द जो बाएं हाथ, जबड़े या पीठ तक फैल रहा हो या पसीना आ रहा हो',
  },
  {
    id: 'unconsciousOrAlteredState',
    questionHindi: 'क्या व्यक्ति बेहोश है या उसे जगाना मुश्किल हो रहा है?',
    contextHindi: 'अचेत अवस्था, अत्यधिक सुस्ती या बात न समझ पाना',
  },
  {
    id: 'suddenWeaknessOrNumbness',
    questionHindi: 'क्या चेहरे, हाथ या पैर में अचानक कमजोरी या सुन्नपन आया है?',
    contextHindi: 'शरीर के एक तरफ का हिस्सा काम न करना (लकवा/स्ट्रोक के लक्षण)',
  },
  {
    id: 'speechDifficulty',
    questionHindi: 'क्या बोलने में अचानक परेशानी या जुबान लड़खड़ा रही है?',
    contextHindi: 'साफ न बोल पाना या सामने वाले की बात न समझ पाना',
  },
  {
    id: 'heavyBleeding',
    questionHindi: 'क्या शरीर से बहुत अधिक या अनियंत्रित खून बह रहा है?',
    contextHindi: 'चोट, उल्टी, खाँसी या मल के रास्ते लगातार रक्तस्राव होना',
  },
  {
    id: 'throatSwellingWithStridor',
    questionHindi: 'क्या जीभ या गले में अचानक सूजन के साथ साँस लेने में सीटी जैसी आवाज आ रही है?',
    contextHindi: 'तीव्र एलर्जी या श्वासनली में गंभीर रुकावट की स्थिति',
  },
  {
    id: 'seizuresOrConvulsions',
    questionHindi: 'क्या दौरा पड़ा है या शरीर में झटके/ऐंठन आई है?',
    contextHindi: 'आँखें उलट जाना, दाँत भिंचना या हाथ-पैर का फड़कना',
  },
  {
    id: 'suddenSevereHeadache',
    questionHindi: 'क्या अचानक बिजली की कौंध जैसा बहुत तेज़ सिरदर्द हुआ है?',
    contextHindi: 'जिंदगी का सबसे भयानक या अचानक शुरू हुआ असहनीय सिरदर्द',
  },
  {
    id: 'severePregnancyDistress',
    questionHindi: 'क्या गर्भावस्था के दौरान गंभीर पेट दर्द, रक्तस्राव या तेज सिरदर्द है?',
    contextHindi: 'गर्भवती महिला में तेज पेट दर्द, योनि से रक्तस्राव या धुंधला दिखाई देना',
    isPregnancySpecific: true,
  },
];
