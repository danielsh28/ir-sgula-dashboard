'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: '📊' },
    { name: t('navigation.users'), href: '/dashboard/users', icon: '👥' },
    { name: t('navigation.events'), href: '/dashboard/events', icon: '📅' },
    { name: t('navigation.activities'), href: '/dashboard/activities', icon: '🏃' },
    { name: t('navigation.settings'), href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-background-default w-64 shadow-lg h-full">
      {/* Organization Logo */}
      <div className="p-6 border-b bg-primary">
        <h1 className="text-xl font-bold text-center text-white">{t('sidebar.organizationName')}</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className="flex items-center p-3 text-text-dark rounded-lg hover:bg-background-subtle"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span>👤</span>
          </div>
          <div>
            <p className="font-medium">{t('userProfile.adminUser')}</p>
            <p className="text-sm text-gray-500">{t('userProfile.adminEmail')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 