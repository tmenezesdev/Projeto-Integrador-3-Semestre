"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Wrench,
  History,
  AlertTriangle,
  Settings,
  Radio
} from "lucide-react";

export default function SidebarNav({ setConteudo }) {
  const [ativo, setAtivo] = useState("historico");

  const handleClick = (id) => {
    setAtivo(id);
    if (setConteudo) setConteudo(id);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "ferramentas", label: "Ferramentas Fora", icon: Wrench },
    { id: "historico", label: "Histórico", icon: History },
    { id: "alertas", label: "Alertas", icon: AlertTriangle },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    /* Apliquei 'font-["Inter"]' para garantir que use a fonte nova */
    <aside className="w-[260px] h-screen bg-[#121212] border-r border-[#2a2a2a] flex flex-col justify-between select-none font-['Inter',sans-serif]">
      <div>
        {/* CABEÇALHO / LOGO */}
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

        {/* NAVEGAÇÃO */}
        <nav className="px-4">
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = ativo === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 border-none cursor-pointer ${
                      isActive
                        ? "bg-[#7033ff] text-white shadow-md shadow-[#7033ff]/20" 
                        : "bg-transparent text-[#a1a1aa] hover:bg-[#8b5cf6]/10 hover:text-[#8b5cf6]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

    </aside>
  );
}