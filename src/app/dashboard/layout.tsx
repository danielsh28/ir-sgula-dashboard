'use client';

import React, { useState } from 'react';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='bg-background-subtle flex h-screen'>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className='bg-opacity-50 fixed inset-0 z-20 bg-black lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Content Area */}
        <main className='flex-1 overflow-y-auto p-2 sm:p-4 md:p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
