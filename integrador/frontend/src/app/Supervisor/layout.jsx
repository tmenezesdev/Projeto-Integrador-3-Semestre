'use client';

import React from 'react';
import SidebarSupervisor from '@/components/SidebarSupervisor/sidebarsupervisor';
import AuthGuard from '@/components/AuthGuard/authguard';
import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function SupervisorLayout({ children }) {
  return (
    <AuthGuard perfisPermitidos={['SUPERVISOR', 'ADMIN']}>
      <div className="flex h-screen bg-[#09090A] text-gray-100 overflow-hidden font-sans">
        <SidebarSupervisor />
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#09090A]">
          {children}
        </main>
        <ChatWidget />
      </div>
    </AuthGuard>
  );
}