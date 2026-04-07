'use client';

import React from 'react';
// Certifique-se de que o caminho do import abaixo está correto para sua pasta
import SidebarSupervisor from '@/components/SidebarSupervisor/sidebarsupervisor';

export default function SupervisorLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#09090A] text-gray-100 overflow-hidden font-sans">
    
      <SidebarSupervisor/>

      <main className="flex-1 overflow-y-auto bg-[#09090A]">
        {children}
      </main>
      
    </div>
  );
}