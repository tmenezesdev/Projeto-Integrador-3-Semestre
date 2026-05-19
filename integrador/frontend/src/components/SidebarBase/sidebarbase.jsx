'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, LogOut, UserCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle/themetoggle';

export default function SidebarBase({ 
  navItems, 
  theme, 
  role, 
  LogoIcon, 
  profileHref,
  isCollapsed = false,
  setIsCollapsed = () => {},
  onNavClick,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
      setNomeUsuario(u.nome?.split(' ')[0] || '');
    } catch {}
  }, []);

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const perfilAtivo = profileHref ? pathname.startsWith(profileHref) : false;

  const handleLogout = () => {
    localStorage.removeItem('smartbench_token');
    localStorage.removeItem('smartbench_user');
    router.push('/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const btnBase = `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full border border-transparent ${isCollapsed ? 'justify-center px-0' : ''}`;

  const navLinkCls = (active) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative
    ${active ? theme.navActive : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
    ${isCollapsed ? 'justify-center px-0' : ''}`;

  const tooltip = (label) => isCollapsed && (
    <div className={`absolute left-full ml-3 px-2.5 py-1.5 text-slate-100 text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 ${theme.tooltip}`}>
      {label}
    </div>
  );

  return (
    <aside className={`relative flex flex-col h-full transition-all duration-300 ${theme.aside} ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 ${theme.headerBorder} ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${theme.logoBg}`}>
          <LogoIcon size={20} className={theme.logoIconCls} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-base tracking-tight">SmartBench</span>
            <span className={`text-[11px] font-semibold uppercase tracking-widest ${theme.roleColor}`}>
              {nomeUsuario ? `${nomeUsuario} · ${role}` : role}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              title={isCollapsed ? item.label : undefined}
              className={navLinkCls(active)}
            >
              {active && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full ${theme.navDot}`} />
              )}
              <Icon
                size={20}
                className={`flex-shrink-0 ${active ? theme.navIconActive : 'text-slate-600 group-hover:text-slate-300'}`}
              />
              {!isCollapsed && <span>{item.label}</span>}
              {tooltip(item.label)}
            </Link>
          );
        })}

        <div className="flex-1" />

        <div className="flex flex-col gap-1.5">
          <ThemeToggle collapsed={isCollapsed} trackOn={theme.trackOn} />
          <div className={`my-1 ${theme.divider}`} />

          {profileHref && (
            <Link
              href={profileHref}
              onClick={onNavClick}
              title={isCollapsed ? 'Perfil' : undefined}
              className={navLinkCls(perfilAtivo)}
            >
              {perfilAtivo && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full ${theme.navDot}`} />
              )}
              <UserCircle
                size={20}
                className={`flex-shrink-0 ${perfilAtivo ? theme.navIconActive : 'text-slate-600 group-hover:text-slate-300'}`}
              />
              {!isCollapsed && <span>Perfil</span>}
              {tooltip('Perfil')}
            </Link>
          )}

          <button
            onClick={handleLogout}
            className={`${btnBase} cursor-pointer text-slate-400 hover:text-red-400 hover:bg-red-500/5`}
          >
            <LogOut size={19} className="flex-shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </nav>

      {/* Toggle collapse */}
      <button
        onClick={toggleCollapse}
        className={`absolute -right-3.5 top-[76px] w-7 h-7 rounded-full flex items-center justify-center text-slate-500 transition-all z-10 cursor-pointer ${theme.collapseBtn}`}
      >
        {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
}