import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './staticTranslations';


// Don't initialize i18next more than once
if (!i18n.isInitialized) {
  i18n
    // detect user language
    .use(LanguageDetector)
    // init i18next
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      
      // Provide static resources instead of backend
      resources: translations,
      
      // default namespace used if not passed to translation function
      defaultNS: 'common',
      ns: ['common'],
      
      // react specific options
      react: {
        useSuspense: false,
      },
      
      // language detection options
      detection: {
        // Order of language detection
        order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
        // Using same cookie name as in middleware
        lookupCookie: 'i18next',
        // Cache language selection
        caches: ['cookie', 'localStorage'],
      },
    });
}

export default i18n; 