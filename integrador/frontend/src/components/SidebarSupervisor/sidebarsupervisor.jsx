'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Wrench, History,
  AlertOctagon, Settings, ChevronLeft,
  ChevronRight, LogOut, ShieldCheck,
} from 'lucide-react';

const navItems = [
  { href: '/Supervisor/Dashboard',        label: 'Dashboard',        icon: LayoutDashboard, exact: true },
  { href: '/Supervisor/Ferramentas-Fora', label: 'Ferramentas Fora', icon: Wrench },
  { href: '/Supervisor/Historico',        label: 'Histórico',        icon: History },
  { href: '/Supervisor/Atrasos',          label: 'Atrasos',          icon: AlertOctagon },
  { href: '/Supervisor/configuracoes',    label: 'Configurações',    icon: Settings },
];

export default function SidebarSupervisor() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className={`relative flex flex-col h-full bg-[#060d1f] border-r border-teal-500/10 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[220px]'}`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-teal-500/10 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
          <ShieldCheck size={16} className="text-teal-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-sm tracking-tight">SmartBench</span>
            <span className="text-teal-400 text-[10px] font-semibold uppercase tracking-widest">Supervisor</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative
                ${active ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
                ${collapsed ? 'justify-center px-0' : ''}`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-400 rounded-r-full" />}
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-teal-400' : 'text-slate-600 group-hover:text-slate-300'}`} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-[#0f1a35] text-slate-100 text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-teal-500/20">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-2 pb-4 border-t border-teal-500/10 pt-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <button className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all w-full ${collapsed ? 'justify-center px-0' : ''}`}>
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-[#0f1a35] border border-teal-500/20 rounded-full flex items-center justify-center text-slate-500 hover:text-teal-300 transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}