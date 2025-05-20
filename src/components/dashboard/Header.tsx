'use client';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className='bg-background-default flex h-16 items-center justify-between px-6 shadow'>
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className='p-2 lg:hidden'
        aria-label='Toggle menu'
      >
        <svg
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>

      {/* Search Bar */}
      <div className='relative w-64'>
        <input
          type='text'
          placeholder={t('header.search')}
          className='focus:ring-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none'
        />
        <span className='absolute top-2.5 left-3'>🔍</span>
      </div>

      {/* Right Section */}
      <div className='flex items-center space-x-4'>
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <button
          className='hover:bg-background-subtle relative rounded-full p-2'
          aria-label={t('header.notifications')}
        >
          <span>🔔</span>
          <span className='bg-accent absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white'>
            3
          </span>
        </button>

        {/* Help */}
        <button
          className='hover:bg-background-subtle rounded-full p-2'
          aria-label={t('header.help')}
        >
          <span>❓</span>
        </button>

        {/* Divider */}
        <span className='h-6 w-px bg-gray-300'></span>

        {/* User Menu */}
        <div className='flex cursor-pointer items-center space-x-2'>
          <div className='bg-secondary flex h-8 w-8 items-center justify-center rounded-full'>
            <span>👤</span>
          </div>
          <span className='text-text-dark hidden font-medium md:inline-block'>
            {t('header.admin')}
          </span>
          <span>▼</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
