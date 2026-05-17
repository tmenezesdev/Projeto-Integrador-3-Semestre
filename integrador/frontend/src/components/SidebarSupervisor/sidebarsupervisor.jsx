'use client';

import { LayoutDashboard, Wrench, History, AlertOctagon, UserPlus, ShieldCheck } from 'lucide-react';
import SidebarBase from '@/components/SidebarBase/sidebarbase';

const navItems = [
  { href: '/Supervisor/VisaoGeral',       label: 'Visão Geral',      icon: LayoutDashboard, exact: true },
  { href: '/Supervisor/Ferramentas-Fora', label: 'Ferramentas Fora', icon: Wrench },
  { href: '/Supervisor/Historico',        label: 'Histórico',        icon: History },
  { href: '/Supervisor/Atrasos',          label: 'Atrasos',          icon: AlertOctagon },
  { href: '/Supervisor/Cadastro',         label: 'Cadastro',         icon: UserPlus },
];

const theme = {
  aside:         'bg-[#060d1f] border-r border-teal-500/10',
  headerBorder:  'border-b border-teal-500/10',
  logoBg:        'bg-teal-500/20 border border-teal-500/30',
  logoIconCls:   'text-teal-400',
  roleColor:     'text-teal-400',
  navActive:     'bg-teal-500/10 text-teal-300 border border-teal-500/20',
  navDot:        'bg-teal-400',
  navIconActive: 'text-teal-400',
  tooltip:       'bg-[#0f1a35] border border-teal-500/20',
  trackOn:       '#2dd4bf',
  divider:       'border-t border-teal-500/10',
  collapseBtn:   'bg-[#0f1a35] border border-teal-500/20 hover:text-teal-300',
};

export default function SidebarSupervisor() {
  return (
    <SidebarBase
      navItems={navItems}
      theme={theme}
      role="Supervisor"
      LogoIcon={ShieldCheck}
      profileHref="/Supervisor/Perfil"
    />
  );
}
