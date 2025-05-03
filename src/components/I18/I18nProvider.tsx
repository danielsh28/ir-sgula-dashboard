'use client';

import React, { useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useCookies } from 'next-client-cookies';
import i18n from './i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

// Internal component that handles RTL and language initialization
const InternalProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const cookies = useCookies();

  useEffect(() => {
    // Get language from cookie set by middleware
    const cookieLang = cookies.get('i18next');
    
    if (cookieLang && i18n.language !== cookieLang) {
      i18n.changeLanguage(cookieLang);
    }
  }, [cookies, i18n]);

  useEffect(() => {
    if (!i18n.isInitialized) return;
    
    // Set the dir attribute on the document based on the language
    const isRtl = i18n.language === 'ar' || i18n.language === 'he';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Add RTL/LTR specific classes to the body
    if (isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [i18n.language, i18n.isInitialized]);

  return <>{children}</>;
};

// Main provider component that wraps everything
const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <InternalProvider>
        {children}
      </InternalProvider>
    </I18nextProvider>
  );
};

export default I18nProvider; 