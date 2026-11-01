import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Virasat Atlas - Cultural Multilingual Localization (FR-17)
 * Regional language support: English (en), Hindi (hi), Gujarati (gu)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

export const TRANSLATIONS = {
  en: {
    brand_title: "VIRASAT ATLAS",
    brand_subtitle: "Digital Cultural Archive",
    nav_explore: "Explore",
    nav_map: "Map",
    nav_collections: "Collections",
    nav_workspace: "My Workspace",
    nav_review: "Review Queue",
    nav_admin: "Admin Governance",
    nav_pitch: "Pitch Deck",
    nav_signin: "Sign In",
    nav_signout: "Sign Out",
    hero_pretitle: "Digital Cultural & Architectural Heritage Archive",
    hero_title: "Explore India's cultural memory, one place at a time.",
    hero_desc: "Preserving architectural observations, historical manuscripts, stepwell hydrology, and living traditions with rigorous provenance and attribution.",
    search_placeholder: "Search by monument, region, keyword, or inscription...",
    search_btn: "Search",
    filter_all_types: "All Heritage Types",
    filter_monuments: "Monuments",
    filter_architecture: "Architecture / Vavs",
    filter_crafts: "Living Crafts",
    filter_documents: "Documents & Epigraphy",
    filter_fieldnotes: "Field Notes",
    sort_latest: "Newest First",
    sort_oldest: "Oldest First",
    sort_title: "Title (A-Z)",
    status_published: "Published",
    status_draft: "Draft",
    status_in_review: "In Review",
    status_correction: "Correction Needed",
    export_manifest: "Export Archival Manifest",
    view_3d_twin: "Interactive 3D Digital Twin",
    bookmark_record: "Bookmark Record",
    bookmarked: "Bookmarked",
    bookmarked_items: "Bookmarked Items",
    my_bookmarks: "Saved Heritage Bookmarks",
    related_records: "Related Heritage Records",
    ocr_assistant_title: "OCR & Paleographic Transcription Assistant",
    raw_ocr_badge: "Raw Machine Extraction (Draft / Unreviewed)",
    reviewed_ocr_badge: "Human-Reviewed Transcript (Verified & Indexed)",
    admin_title: "Archive Governance & Compliance",
    admin_subtitle: "System audit logs, OAIS archival export manifests, and storage metrics.",
  },
  hi: {
    brand_title: "विरासत एटलस",
    brand_subtitle: "डिजिटल सांस्कृतिक अभिलेखागार",
    nav_explore: "अन्वेषण करें",
    nav_map: "मानचित्र",
    nav_collections: "संग्रह",
    nav_workspace: "मेरा कार्यक्षेत्र",
    nav_review: "समीक्षा कतार",
    nav_admin: "प्रशासन",
    nav_pitch: "प्रस्तुति डेक",
    nav_signin: "लॉग इन",
    nav_signout: "लॉग आउट",
    hero_pretitle: "डिजिटल सांस्कृतिक एवं स्थापत्य विरासत अभिलेखागार",
    hero_title: "भारत की सांस्कृतिक स्मृति का अन्वेषण करें, एक स्थान पर।",
    hero_desc: "सख्त स्रोत सत्यापन और श्रेय के साथ स्थापत्य टिप्पणियों, ऐतिहासिक पांडुलिपियों और वाव जल विज्ञान का संरक्षण।",
    search_placeholder: "स्मारक, क्षेत्र, शिलालेख या कीवर्ड द्वारा खोजें...",
    search_btn: "खोजें",
    filter_all_types: "सभी विरासत प्रकार",
    filter_monuments: "ऐतिहासिक स्मारक",
    filter_architecture: "स्थापत्य / वाव",
    filter_crafts: "पारंपरिक शिल्प",
    filter_documents: "दस्तावेज़ और शिलालेख",
    filter_fieldnotes: "शोधकर्ता फील्ड नोट्स",
    sort_latest: "नवीनतम पहले",
    sort_oldest: "पुरातन पहले",
    sort_title: "शीर्षक (अ-ह)",
    status_published: "प्रकाशित",
    status_draft: "प्रारूप",
    status_in_review: "समीक्षाधीन",
    status_correction: "सुधार आवश्यक",
    export_manifest: "अभिलेखागार डेटा निर्यात",
    view_3d_twin: "इंटरैक्टिव 3D डिजिटल ट्विन",
    bookmark_record: "रिकॉर्ड सहेजें",
    bookmarked: "सहेजा गया",
    bookmarked_items: "सहेजे गए रिकॉर्ड",
    my_bookmarks: "सहेजे गए विरासत रिकॉर्ड",
    related_records: "संबंधित विरासत रिकॉर्ड",
    ocr_assistant_title: "ओसीआर एवं पुरालेखीय प्रतिलेखन सहायक",
    raw_ocr_badge: "कच्चा मशीन निष्कर्षण (अप्रमाणित)",
    reviewed_ocr_badge: "मानव-सत्यापित प्रतिलेख (सत्यापित एवं अनुक्रमित)",
    admin_title: "अभिलेखागार प्रशासन एवं अनुपालन",
    admin_subtitle: "सिस्टम ऑडिट लॉग, OAIS अभिलेखागार निर्यात मैनिफेस्ट और स्टोरेज मेट्रिक्स।",
  },
  gu: {
    brand_title: "વારસો એટલાસ",
    brand_subtitle: "ડિજિટલ સાંસ્કૃતિક સંગ્રહાલય",
    nav_explore: "અન્વેષણ કરો",
    nav_map: "નકશો",
    nav_collections: "સંગ્રહ",
    nav_workspace: "મારું કાર્યક્ષેત્ર",
    nav_review: "સમીક્ષા કતાર",
    nav_admin: "સંચાલન",
    nav_pitch: "પ્રેઝન્ટેશન ડેક",
    nav_signin: "સાઇન ઇન",
    nav_signout: "સાઇન આઉટ",
    hero_pretitle: "ડિજિટલ સાંસ્કૃતિક અને સ્થાપત્ય વારસો સંગ્રહાલય",
    hero_title: "ભારતની સાંસ્કૃતિક સ્મૃતિઓ શોધો, એક સ્થાને.",
    hero_desc: "સ્થાપત્ય અવલોકનો, ઐતિહાસિક હસ્તપ્રતો, વાવ જળ વ્યવસ્થાપન અને પરંપરાઓનું પ્રામાણિક દસ્તાવેજીકરણ.",
    search_placeholder: "સ્મારક, પ્રદેશ, શિલાલેખ અથવા કીવર્ડ દ્વારા શોધો...",
    search_btn: "શોધો",
    filter_all_types: "બધા વારસા પ્રકાર",
    filter_monuments: "ઐતિહાસિક સ્મારકો",
    filter_architecture: "સ્થાપત્ય / વાવ",
    filter_crafts: "પરંપરાગત હસ્તકલા",
    filter_documents: "દસ્તાવેજો અને શિલાલેખો",
    filter_fieldnotes: "ફીલ્ડ નોટ્સ",
    sort_latest: "સૌથી નવું પ્રથમ",
    sort_oldest: "સૌથી જૂનું પ્રથમ",
    sort_title: "શીર્ષક (અ-જ્ઞ)",
    status_published: "પ્રકાશિત",
    status_draft: "ડ્રાફ્ટ",
    status_in_review: "સમીક્ષા હેઠળ",
    status_correction: "સુધારણા જરૂરી",
    export_manifest: "સંગ્રહાલય ડેટા નિકાસ",
    view_3d_twin: "ઇન્ટરેક્ટિવ 3D ડિજિટલ ટ્વીન",
    bookmark_record: "રેકોર્ડ સાચવો",
    bookmarked: "સાચવેલ",
    bookmarked_items: "સાચવેલ રેકોર્ડ્સ",
    my_bookmarks: "સાચવેલ વારસો રેકોર્ડ્સ",
    related_records: "સંબંધિત વારસો રેકોર્ડ્સ",
    ocr_assistant_title: "ઓસીઆર અને હસ્તપ્રત લિપ્યંતરણ સહાયક",
    raw_ocr_badge: "કાચો મશીન અર્ક (અચકાસાયેલ)",
    reviewed_ocr_badge: "માનવ-તપાસાયેલ લિપ્યંતરણ (ચકાસાયેલ અને અનુક્રમિત)",
    admin_title: "સંગ્રહાલય સંચાલન અને પાલન",
    admin_subtitle: "સિસ્ટમ ઓડિટ લૉગ્સ, OAIS આર્કાઇવલ એક્સપોર્ટ મેનિફેસ્ટ અને સ્ટોરેજ મેટ્રિક્સ.",
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('virasat_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
      localStorage.setItem('virasat_lang', lang);
    }
  };

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key] !== undefined) {
      return langDict[key];
    }
    if (TRANSLATIONS.en[key] !== undefined) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key, fallback = '') => TRANSLATIONS.en[key] || fallback || key,
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return ctx;
}
