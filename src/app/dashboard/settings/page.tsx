'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-dark">{t('settings.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-background-default p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary">{t('settings.navigation')}</h2>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left p-2 bg-primary text-white rounded-md">
                  {t('settings.organization.profile')}
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 hover:bg-background-subtle rounded-md">
                  {t('settings.preferences')}
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 hover:bg-background-subtle rounded-md">
                  {t('settings.notifications')}
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 hover:bg-background-subtle rounded-md">
                  {t('settings.security')}
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 hover:bg-background-subtle rounded-md">
                  {t('settings.apiKeys')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-background-default p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary">{t('settings.organization.profile')}</h2>
            
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-dark">
                    {t('settings.organization.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue="IR Sguala"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark">
                    {t('settings.organization.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue="info@irsguala.org"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-dark">
                    {t('settings.organization.description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={t('settings.organization.descriptionValue')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-text-dark">
                    {t('settings.organization.website')}
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    defaultValue="https://irsguala.org"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-text-dark">
                    {t('settings.organization.logo')}
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="w-16 h-16 border border-gray-300 rounded-md overflow-hidden bg-secondary flex items-center justify-center text-3xl">
                      IR
                    </div>
                    <button
                      type="button"
                      className="ml-5 bg-background-default border border-gray-300 rounded-md py-2 px-3 text-sm font-medium hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {t('settings.organization.change')}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {t('settings.actions.cancel')}
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {t('settings.actions.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 