export interface FacilityTypeInfo {
  type: 'sub_centre' | 'phc' | 'chc' | 'district_hospital';
  titleHindi: string;
  descriptionHindi: string;
  servicesHindi: string[];
  staffingHindi: string;
  recommendedForHindi: string;
}

export const FACILITY_TIERS: FacilityTypeInfo[] = [
  {
    type: 'sub_centre',
    titleHindi: 'आयुष्मान आरोग्य मंदिर (उप-स्वास्थ्य केंद्र / Sub-Centre)',
    descriptionHindi: 'ग्रामीण क्षेत्र की पहली स्वास्थ्य इकाई, जो 3,000 से 5,000 की आबादी पर स्थित होती है।',
    servicesHindi: [
      'प्राथमिक प्राथमिक उपचार एवं ओआरएस/दवाइयां',
      'गर्भवती महिलाओं की नियमित जाँच (ANC) व टीकाकरण',
      'रक्तचाप एवं मधुमेह की प्राथमिक स्क्रीनिंग',
    ],
    staffingHindi: 'सामुदायिक स्वास्थ्य अधिकारी (CHO), एएनएम (ANM) एवं आशा दीदी',
    recommendedForHindi: 'साधारण सर्दी, खाँसी, बुखार, टीकाकरण एवं प्राथमिक स्वास्थ्य सलाह हेतु।',
  },
  {
    type: 'phc',
    titleHindi: 'प्राथमिक स्वास्थ्य केंद्र (PHC - Primary Health Centre)',
    descriptionHindi: '20,000 से 30,000 आबादी पर स्थित बुनियादी अस्पताल जहाँ एमबीबीएस डॉक्टर उपलब्ध होते हैं।',
    servicesHindi: [
      'एमबीबीएस डॉक्टर द्वारा सामान्य ओपीडी परामर्श',
      'बुनियादी खून-पेशाब, मलेरिया एवं हीमोग्लोबिन जाँच लैब',
      'सुरक्षित सामान्य प्रसव एवं 24 घंटे बुनियादी आपातकालीन देखभाल',
      'निःशुल्क आवश्यक दवाइयों का वितरण',
    ],
    staffingHindi: 'चिकित्सा अधिकारी (MBBS Doctor), स्टाफ नर्स, फार्मासिस्ट एवं लैब तकनीशियन',
    recommendedForHindi: 'लगातार बना रहने वाला बुखार, गंभीर दस्त, पेट दर्द, जोड़ों का दर्द एवं डॉक्टर की सलाह हेतु।',
  },
  {
    type: 'chc',
    titleHindi: 'सामुदायिक स्वास्थ्य केंद्र (CHC - Community Health Centre)',
    descriptionHindi: '80,000 से 1,20,000 की आबादी पर 30 बिस्तरों वाला ब्लॉक स्तरीय अस्पताल।',
    servicesHindi: [
      'विशेषज्ञ डॉक्टर (स्त्री रोग, बाल रोग, शल्य चिकित्सा, सामान्य मेडिसिन)',
      'एक्स-रे (X-Ray), ईसीजी (ECG) एवं उन्नत पैथोलॉजी लैब',
      'आपातकालीन ओटी (ऑपरेशन थियेटर) एवं प्रसूति सुविधा',
      'भर्ती वार्ड (30 बेड) एवं 24x7 आपातकालीन सेवा',
    ],
    staffingHindi: 'विशेषज्ञ चिकित्सक, सर्जन, एनेस्थेटिस्ट, पैरामेडिकल स्टाफ',
    recommendedForHindi: 'जटिल संक्रमण, अनियंत्रित बीपी, गर्भावस्था की जटिलताएं, फ्रैक्चर या विशेषज्ञ परामर्श हेतु।',
  },
  {
    type: 'district_hospital',
    titleHindi: 'उप-जिला / जिला अस्पताल (District Hospital)',
    descriptionHindi: 'जिले का मुख्य सरकारी अस्पताल जहाँ गहन चिकित्सा (ICU) और सभी विशेषज्ञ सेवाएं उपलब्ध होती हैं।',
    servicesHindi: [
      '24 घंटे आईसीयू (ICU) एवं ट्रॉमा सेंटर आपातकालीन सेवाएं',
      'उन्नत हृदय, मस्तिष्क, नवजात शिशु गहन चिकित्सा (SNCU)',
      'ब्लड बैंक एवं उन्नत रेडियोलॉजी (अल्ट्रासाउंड, सीटी स्कैन)',
      'जीवन रक्षक विशेषज्ञ आपातकालीन उपचार',
    ],
    staffingHindi: 'वरिष्ठ विशेषज्ञ डॉक्टर, गहन चिकित्सा विशेषज्ञ, सर्जन व नर्सिंग टीम',
    recommendedForHindi: 'सीने में तेज़ दर्द, बेहोशी, लकवा (स्ट्रोक), भारी रक्तस्राव, गंभीर आघात एवं जीवनघातक स्थितियां।',
  },
];

export interface EmergencyHelpline {
  number: string;
  nameHindi: string;
  descriptionHindi: string;
  chargesHindi: string;
}

export const EMERGENCY_HELPLINES: EmergencyHelpline[] = [
  {
    number: '112',
    nameHindi: 'राष्ट्रीय आपातकालीन नंबर (All-in-One Emergency)',
    descriptionHindi: 'पुलिस, एम्बुलेंस और अग्निशमन के लिए पूरे भारत में 24 घंटे एकीकृत आपातकालीन हेल्पलाइन।',
    chargesHindi: 'पूर्णतः निःशुल्क (बिना बैलेंस के भी कॉल संभव)',
  },
  {
    number: '108',
    nameHindi: 'राष्ट्रीय एम्बुलेंस सेवा (National Ambulance Service)',
    descriptionHindi: 'गंभीर मरीज, सड़क दुर्घटना एवं जीवन रक्षक चिकित्सा के लिए आपातकालीन सरकारी एम्बुलेंस।',
    chargesHindi: 'पूर्णतः निःशुल्क',
  },
  {
    number: '102',
    nameHindi: 'जननी शिशु सुरक्षा एम्बुलेंस (Janani Shishu Suraksha)',
    descriptionHindi: 'गर्भवती महिलाओं को प्रसव हेतु अस्पताल ले जाने एवं नवजात शिशुओं के लिए विशेष निःशुल्क वाहन।',
    chargesHindi: 'पूर्णतः निःशुल्क',
  },
  {
    number: '104',
    nameHindi: 'राष्ट्रीय स्वास्थ्य हेल्पलाइन (Health Advice Helpline)',
    descriptionHindi: 'घर बैठे सरकारी डॉक्टरों और परामर्शदाताओं से स्वास्थ्य सलाह व निकटतम अस्पताल की जानकारी लें।',
    chargesHindi: 'पूर्णतः निःशुल्क',
  },
];
