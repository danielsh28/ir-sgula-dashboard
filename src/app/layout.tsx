import I18nProvider from '@/components/I18/I18nProvider';
import type { Metadata } from 'next';
import { CookiesProvider } from 'next-client-cookies/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { initialize } from './actions';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IR Sguala - Dashboard',
  description: 'Management system for IR Sguala organization',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize server before rendering
  //await initialize();

  return (
    <html lang='he' dir='rtl'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 antialiased`}
      >
        <CookiesProvider>
          <I18nProvider>
            <main className='flex min-h-screen flex-col'>{children}</main>
          </I18nProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
