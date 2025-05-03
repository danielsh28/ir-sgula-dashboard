import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'he' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('he')}
        dir="rtl"
      >
        עב
      </button>
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('ar')}
        dir="rtl"
      >
        عر
      </button>
    </div>
  );
};

export default LanguageSwitcher; 