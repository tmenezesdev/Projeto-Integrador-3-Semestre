'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Wrench, History,
  AlertOctagon, UserPlus, ChevronLeft,
  ChevronRight, LogOut, ShieldCheck,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle/themetoggle';

const navItems = [
  { href: '/Supervisor/VisaoGeral',       label: 'Visão Geral',      icon: LayoutDashboard, exact: true },
  { href: '/Supervisor/Ferramentas-Fora', label: 'Ferramentas Fora', icon: Wrench },
  { href: '/Supervisor/Historico',        label: 'Histórico',        icon: History },
  { href: '/Supervisor/Atrasos',          label: 'Atrasos',          icon: AlertOctagon },
  { href: '/Supervisor/Cadastro',         label: 'Cadastro',         icon: UserPlus },
];

export default function SidebarSupervisor() {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
      setNomeUsuario(u.nome?.split(' ')[0] || '');
    } catch {}
  }, []);

  const isActive = (item) => item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = () => {
    localStorage.removeItem('smartbench_token');
    localStorage.removeItem('smartbench_user');
    router.push('/login');
  };

  const btnBase = `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full border border-transparent ${collapsed ? 'justify-center px-0' : ''}`;

  return (
    <aside className={`relative flex flex-col h-full bg-[#060d1f] border-r border-teal-500/10 transition-all duration-300 ${collapsed ? 'w-[80px]' : 'w-[260px]'}`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-teal-500/10 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
          <ShieldCheck size={20} className="text-teal-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-base tracking-tight">SmartBench</span>
            <span className="text-teal-400 text-[11px] font-semibold uppercase tracking-widest">
              {nomeUsuario ? `${nomeUsuario} · Supervisor` : 'Supervisor'}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon   = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative
                ${active ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
                ${collapsed ? 'justify-center px-0' : ''}`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-teal-400 rounded-r-full" />}
              <Icon size={20} className={`flex-shrink-0 ${active ? 'text-teal-400' : 'text-slate-600 group-hover:text-slate-300'}`} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0f1a35] text-slate-100 text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-teal-500/20">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-3 pb-5 border-t border-teal-500/10 pt-3 flex flex-col gap-1.5 ${collapsed ? 'items-center' : ''}`}>
        <ThemeToggle collapsed={collapsed} trackOn="#2dd4bf" />
        <button
          onClick={handleLogout}
          className={`${btnBase} cursor-pointer text-slate-400 hover:text-red-400 hover:bg-red-500/5`}
        >
          <LogOut size={19} className="flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* Toggle collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[76px] w-7 h-7 bg-[#0f1a35] border border-teal-500/20 rounded-full flex items-center justify-center text-slate-500 hover:text-teal-300 transition-all z-10 cursor-pointer"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
}