import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import dynamic from "next/dynamic";
import I18nProvider from "@/components/I18/I18nProvider";
// Use dynamic import for client component to avoid SSR issues

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IR Sguala - Dashboard",
  description: "Management system for IR Sguala organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <CookiesProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
