"use client"

import React from "react";
import { User, Clock, Wrench, ShieldAlert } from "lucide-react";
import SidebarNav from "@/components/Sidebar/page";

const ferramentas = [
  {
    tag_rfid: "RFID-FER-001",
    nome: "Torquímetro Digital 200Nm",
    status: "ATRASADA",
    responsavel: "Bávaro",
    perfil: "MECANICO",
    retirada: "Hoje, 05:00",
    tempoDecorrido: "5h 15min",
  },
  {
    tag_rfid: "RFID-FER-003",
    nome: "Chave de Impacto Pneumática",
    status: "EM USO",
    responsavel: "Carlos Silva",
    perfil: "MECANICO",
    retirada: "Hoje, 08:00",
    tempoDecorrido: "2h 15min",
  },
  {
    tag_rfid: "RFID-FER-006",
    nome: "Kit Chaves Torx (Jogo 9 peças)",
    status: "EM USO",
    responsavel: "Juliana Oliveira",
    perfil: "SUPERVISOR",
    retirada: "Hoje, 09:45",
    tempoDecorrido: "30min",
  },
  {
    tag_rfid: "RFID-FER-007",
    nome: "Macaco Hidráulico Garrafa 2T",
    status: "ATRASADA",
    responsavel: "Lucas Mendes",
    perfil: "MECANICO",
    retirada: "Ontem, 16:30",
    tempoDecorrido: "17h 45min",
  }
];

export default function FerramentasFora() {
  const totalFora = ferramentas.length;
  const emUso = ferramentas.filter((f) => f.status === "EM USO").length;
  const atrasadas = ferramentas.filter((f) => f.status === "ATRASADA").length;

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SidebarNav />

      <main className="flex-1 p-8 font-sans">

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Wrench size={34} color="#7033ff" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas Fora</h1>
          </div>

          <p className="text-sm text-gray-400">
            Monitoramento em tempo real do maquinário retirado da bancada.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex flex-col gap-2 shadow-lg">
            <span className="text-sm font-medium text-gray-400">Total Fora</span>
            <span className="text-4xl font-bold text-white">
              {totalFora}
            </span>
          </div>

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex flex-col gap-2 shadow-lg">
            <span className="text-sm font-medium text-gray-400">Status: Em Uso Regular</span>
            <span className="text-4xl font-bold text-[#7033ff]">
              {emUso}
            </span>
          </div>

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex flex-col gap-2 shadow-lg">
            <span className="text-sm font-medium text-gray-400">Status: Atrasadas</span>
            <span className="text-4xl font-bold text-red-500">
              {atrasadas}
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

          {ferramentas.map((ferramenta) => {
            const isAtrasada = ferramenta.status === "ATRASADA";

            return (
              <div
                key={ferramenta.tag_rfid}
                className={`bg-[#1e1e1e] border rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl ${isAtrasada ? 'border-red-900/30' : 'border-gray-800'}`}
              >

                <div className="flex justify-between items-start mb-5">
                  <div className="pr-4">
                    <h3 className="text-lg font-bold text-white leading-tight mb-1">
                      {ferramenta.nome}
                    </h3>
                    <span className="text-xs text-gray-500 font-mono tracking-wider">
                      {ferramenta.tag_rfid}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold border whitespace-nowrap ${isAtrasada
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-[#7033ff]/10 text-[#7033ff] border-[#7033ff]/20"
                      }`}
                  >
                    {ferramenta.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex items-center gap-3 text-gray-400">
                    <User size={16} className={isAtrasada ? "text-red-400" : "text-[#7033ff]"} />
                    <span className="flex items-center gap-2">
                      <strong className="text-gray-200">{ferramenta.responsavel}</strong>
                      <span className="text-[10px] uppercase bg-[#121212] px-2 py-0.5 rounded text-gray-500 border border-gray-800">
                        {ferramenta.perfil}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <ShieldAlert size={16} className={isAtrasada ? "text-red-400" : "text-[#7033ff]"} />
                    <span>
                      Retirada registrada às <strong className="text-gray-300">{ferramenta.retirada}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
                      <Clock size={14} className={isAtrasada ? "text-red-500" : "text-[#7033ff]"} />
                      Tempo Fora
                    </div>

                    <span
                      className={`text-xl font-black ${isAtrasada ? "text-red-500" : "text-[#7033ff]"
                        }`}
                    >
                      {ferramenta.tempoDecorrido}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </main>
    </div>
  );
}