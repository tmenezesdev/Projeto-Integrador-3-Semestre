"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Wrench,
  History,
  AlertTriangle,
  Settings,
  Radio,
  LogOut
} from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { id: "ferramentas", label: "Ferramentas Fora", href: "/FerramentasDeFora", icon: Wrench },
    { id: "historico", label: "Histórico", href: "/historico", icon: History },
    { id: "alertas", label: "Alertas", href: "/alertas", icon: AlertTriangle },
    { id: "configuracoes", label: "Configurações", href: "/configuracoes", icon: Settings },
  ];

  return (
    <aside className="w-[260px] h-screen bg-[#121212] border-r border-[#2a2a2a] flex flex-col justify-between select-none font-['Inter',sans-serif] sticky top-0">

      <div>
        <div className="flex items-center gap-3 px-6 pt-8 pb-10">
          <div className="bg-[#7033ff] p-2 rounded-xl flex items-center justify-center shadow-lg shadow-[#7033ff]/20">
            <Radio className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold tracking-tight leading-none m-0">
              SmartBench
            </h1>
            <p className="text-[#888888] text-[11px] font-medium uppercase tracking-wider mt-1.5 m-0">
              Sistema RFID
            </p>
          </div>
        </div>

        <nav className="px-4">
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 border-none cursor-pointer no-underline ${isActive
                      ? "bg-[#7033ff] text-white shadow-md shadow-[#7033ff]/20"
                      : "bg-transparent text-[#a1a1aa] hover:bg-[#8b5cf6]/10 hover:text-[#8b5cf6]"
                      }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e1e1e] transition-colors cursor-default">

          <div className="h-10 w-10 min-w-[40px] rounded-full bg-[#7033ff]/10 border border-[#7033ff]/30 flex items-center justify-center text-[#7033ff] font-bold text-sm">
            TM
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">
              Thiago Menezes
            </span>
            <span className="text-[11px] text-gray-400 truncate">
              Administrador
            </span>
          </div>

          <button
            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-all"
            title="Sair do sistema"
          >
            <LogOut size={18} />
          </button>

        </div>
      </div>

    </aside>
  );
}