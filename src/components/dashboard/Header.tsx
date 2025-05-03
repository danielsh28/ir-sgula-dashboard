'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  
  return (
    <header className="bg-background-default shadow h-16 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="relative w-64">
        <input
          type="text"
          placeholder={t('header.search')}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="absolute left-3 top-2.5">🔍</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-background-subtle" aria-label={t('header.notifications')}>
          <span>🔔</span>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-accent rounded-full">
            3
          </span>
        </button>

        {/* Help */}
        <button className="p-2 rounded-full hover:bg-background-subtle" aria-label={t('header.help')}>
          <span>❓</span>
        </button>

        {/* Divider */}
        <span className="h-6 w-px bg-gray-300"></span>

        {/* User Menu */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span>👤</span>
          </div>
          <span className="font-medium hidden md:inline-block text-text-dark">{t('header.admin')}</span>
          <span>▼</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 