'use client';

import React from 'react';
import SidebarMecanico from '@/components/SidebarMecanico/sidebarmecanico';
import AuthGuard from '@/components/AuthGuard/authguard';
import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function MecanicoLayout({ children }) {
  return (
    <AuthGuard perfisPermitidos={['MECANICO', 'SUPERVISOR', 'ADMIN']}>
      <div className="flex h-screen bg-[#09090A] text-gray-100 overflow-hidden font-sans">
        <SidebarMecanico />
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#09090A]">
          {children}
        </main>
        <ChatWidget />
      </div>
    </AuthGuard>
  );
}
