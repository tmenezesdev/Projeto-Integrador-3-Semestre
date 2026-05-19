'use client';

import { PackageOpen, Wrench, History, AlertOctagon, HardHat, Home } from 'lucide-react';
import SidebarBase from '@/components/SidebarBase/sidebarbase';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/Mecanico/Epis', label: "Segurança (EPI's)", icon: Home, exact: true },
  { href: '/Mecanico/Dashboard', label: 'Minhas Retiradas', icon: PackageOpen },
  { href: '/Mecanico/Ferramentas', label: 'Ferramentas', icon: Wrench },
  { href: '/Mecanico/Historico', label: 'Histórico', icon: History },
  { href: '/Mecanico/Alertas', label: 'Alertas', icon: AlertOctagon },
];

const theme = {
  aside: 'bg-[#0f0900] border-r border-amber-500/10',
  headerBorder: 'border-b border-amber-500/10',
  logoBg: 'bg-amber-500/20 border border-amber-500/30',
  logoIconCls: 'text-amber-400',
  roleColor: 'text-amber-400',
  navActive: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  navDot: 'bg-amber-400',
  navIconActive: 'text-amber-400',
  tooltip: 'bg-[#1a1000] border border-amber-500/20',
  trackOn: '#f59e0b',
  divider: 'border-t border-amber-500/10',
  collapseBtn: 'bg-[#1a1000] border border-amber-500/20 hover:text-amber-300',
};

export default function SidebarMecanico() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1024;
      setIsMobile(isSmall);
      setIsCollapsed(isSmall);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <SidebarBase
      navItems={navItems}
      theme={theme}
      role="Mecânico"
      LogoIcon={HardHat}
      profileHref="/Mecanico/Perfil"
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
    />
  );
}