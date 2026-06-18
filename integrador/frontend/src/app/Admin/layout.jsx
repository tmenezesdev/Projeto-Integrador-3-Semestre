'use client';

import React from 'react';
import SidebarAdmin from '@/components/SidebarAdmin/sidebaradmin';
import AuthGuard from '@/components/AuthGuard/authguard';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard perfisPermitidos={['ADMIN']}>
      <div className="flex h-screen bg-[#09090A] text-gray-100 overflow-hidden font-sans">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#09090A]">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
