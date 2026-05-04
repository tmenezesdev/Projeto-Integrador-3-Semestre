'use client';

import { LayoutDashboard, Users, Wrench, History, AlertOctagon, Settings, ShieldCheck } from 'lucide-react';
import SidebarBase from '@/components/SidebarBase/sidebarbase';

const navItems = [
  { href: '/Admin/Dashboard',     label: 'Dashboard',     icon: LayoutDashboard, exact: true },
  { href: '/Admin/Usuarios',      label: 'Usuários',      icon: Users },
  { href: '/Admin/Ferramentas',   label: 'Ferramentas',   icon: Wrench },
  { href: '/Admin/Historico',     label: 'Histórico',     icon: History },
  { href: '/Admin/Alertas',       label: 'Alertas',       icon: AlertOctagon },
  { href: '/Admin/Configuracoes', label: 'Configurações', icon: Settings },
];

const theme = {
  aside:         'bg-[#0a0a12] border-r border-[#7033ff]/10',
  headerBorder:  'border-b border-[#7033ff]/10',
  logoBg:        'bg-[#7033ff]/20 border border-[#7033ff]/30',
  logoIconCls:   'text-[#7033ff]',
  roleColor:     'text-[#7033ff]',
  navActive:     'bg-[#7033ff]/10 text-[#a87fff] border border-[#7033ff]/20',
  navDot:        'bg-[#7033ff]',
  navIconActive: 'text-[#7033ff]',
  tooltip:       'bg-[#13102a] border border-[#7033ff]/20',
  trackOn:       '#7033ff',
  divider:       'border-t border-[#7033ff]/10',
  collapseBtn:   'bg-[#13102a] border border-[#7033ff]/20 hover:text-[#a87fff]',
};

export default function SidebarAdmin() {
  return (
    <SidebarBase
      navItems={navItems}
      theme={theme}
      role="Admin"
      LogoIcon={ShieldCheck}
      profileHref="/Admin/Perfil"
    />
  );
}
