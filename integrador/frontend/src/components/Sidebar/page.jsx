"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShelvingUnit,
  LayoutGrid,
  Wrench,
  History,
  AlertTriangle,
  Settings,
  Radio,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  
  // === CORREÇÃO AQUI ===
  // Se a rota começar com "/Supervisor", a barra normal "desaparece" para dar espaço à nova.
  if (pathname.startsWith("/Supervisor")) return null;
  // =====================

  const [isOpen, setIsOpen] = useState(false);
  
  // Estados para guardar os dados do usuário
  const [userName, setUserName] = useState("Carregando...");
  const [userRole, setUserRole] = useState("");
  const [userInitials, setUserInitials] = useState("--");

  // useEffect roda apenas no navegador, buscando os dados salvos no login
  useEffect(() => {
    const userStorage = localStorage.getItem("smartbench_user");
    
    if (userStorage) {
      try {
        const usuario = JSON.parse(userStorage);
        const nome = usuario.nome || "Usuário Desconhecido";
        // Pega o cargo e deixa só a primeira letra maiúscula para ficar bonito na UI
        const cargoBruto = usuario.tipo_perfil || usuario.cargo || "Membro";
        const cargoFormatado = cargoBruto.charAt(0).toUpperCase() + cargoBruto.slice(1).toLowerCase();
        
        setUserName(nome);
        setUserRole(cargoFormatado);

        // Lógica para pegar as iniciais (Ex: "Thiago Menezes" -> "TM")
        const partesNome = nome.trim().split(" ");
        if (partesNome.length >= 2) {
          setUserInitials((partesNome[0][0] + partesNome[partesNome.length - 1][0]).toUpperCase());
        } else {
          setUserInitials(nome.substring(0, 2).toUpperCase());
        }
      } catch (error) {
        console.error("Erro ao ler dados do usuário:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Limpa os dados de acesso do navegador
    localStorage.removeItem("smartbench_token");
    localStorage.removeItem("smartbench_user");
    // Redireciona para o login
    router.push("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { id: "ferramentas", label: "Ferramentas Fora", href: "/FerramentasDeFora", icon: Wrench },
    { id: "historico", label: "Histórico", href: "/historico", icon: History },
    { id: "estoque", label: "Estoque", href: "/estoque", icon: ShelvingUnit },
    { id: "alertas", label: "Alertas", href: "/alertas", icon: AlertTriangle },
    { id: "configuracoes", label: "Configurações", href: "/configuracoes", icon: Settings },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-[#7033ff] text-white p-3 rounded-full shadow-lg shadow-[#7033ff]/30 hover:bg-[#5a28cc] transition-transform active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed md:static top-0 left-0 z-50
          w-[260px] h-screen bg-[#121212] border-r border-[#2a2a2a] 
          flex flex-col justify-between select-none font-['Inter',sans-serif]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          <div className="flex items-center justify-between px-6 pt-8 pb-10">
            <div className="flex items-center gap-3">
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

            <button 
              className="md:hidden text-gray-500 hover:text-white p-1"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
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
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 border-none cursor-pointer no-underline ${
                        isActive
                          ? "bg-[#7033ff] text-white shadow-md shadow-segundaria/20"
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
              {userInitials}
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">
                {userName}
              </span>
              <span className="text-[11px] text-gray-400 truncate">
                {userRole}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-all"
              title="Sair do sistema"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}