import React from "react";
import { User, Clock, Wrench } from "lucide-react";
import SidebarNav from "@/components/Sidebar/page.jsx";

const ferramentas = [
  {
    id: "FT-001",
    nome: "Torquímetro Digital 200Nm",
    status: "Atrasada",
    responsavel: "Carlos Silva",
    bancada: "Bancada A - Motores",
    retirada: "09:00",
    tempoDecorrido: "5h 23min",
  },
  {
    id: "FT-007",
    nome: "Alicate Amperímetro",
    status: "Em uso",
    responsavel: "Maria Oliveira",
    bancada: "Bancada B - Elétrica",
    retirada: "11:30",
    tempoDecorrido: "3h 15min",
  },
  {
    id: "FT-003",
    nome: 'Chave Inglesa 12"',
    status: "Em uso",
    responsavel: "João Silva",
    bancada: "Bancada A - Motores",
    retirada: "13:00",
    tempoDecorrido: "1h 45min",
  },
  {
    id: "FT-009",
    nome: "Multímetro Digital",
    status: "Atrasada",
    responsavel: "Pedro Lima",
    bancada: "Bancada B - Elétrica",
    retirada: "08:30",
    tempoDecorrido: "6h 15min",
  },
  {
    id: "FT-005",
    nome: "Jogo de Chaves Allen",
    status: "Em uso",
    responsavel: "Lucas Mendes",
    bancada: "Bancada C - Montagem",
    retirada: "14:00",
    tempoDecorrido: "45min",
  },
];

export default function FerramentasFora() {
  const totalFora = ferramentas.length;
  const emUso = ferramentas.filter((f) => f.status === "Em uso").length;
  const atrasadas = ferramentas.filter((f) => f.status === "Atrasada").length;

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SidebarNav />

      <main className="flex-1 p-8">

        {/* Cabeçalho */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Wrench size={34} color="#7033ff" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold">Ferramentas Fora</h1>
          </div>

          <p className="text-sm text-gray-400">
            Ferramentas atualmente fora das bancadas
          </p>
        </header>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex flex-col gap-2">
            <span className="text-sm text-gray-400">Total Fora</span>
            <span className="text-4xl font-bold text-[#7033ff]">
              {totalFora}
            </span>
          </div>

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex flex-col gap-2">
            <span className="text-sm text-gray-400">Em Uso</span>
            <span className="text-4xl font-bold text-[#7033ff]">
              {emUso}
            </span>
          </div>

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex flex-col gap-2">
            <span className="text-sm text-gray-400">Atrasadas</span>
            <span className="text-4xl font-bold text-red-500">
              {atrasadas}
            </span>
          </div>

        </div>

        {/* Grid das ferramentas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {ferramentas.map((ferramenta) => {

            const isAtrasada = ferramenta.status === "Atrasada";

            return (
              <div
                key={ferramenta.id}
                className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow transition hover:shadow-lg"
              >

                {/* Header */}
                <div className="flex justify-between items-start mb-5">

                  <div>
                    <h3 className="text-lg font-bold">
                      {ferramenta.nome}
                    </h3>

                    <span className="text-xs text-gray-400 font-mono">
                      {ferramenta.id}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium border ${
                      isAtrasada
                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                        : "bg-[#7033ff]/20 text-[#7033ff] border-[#7033ff]/40"
                    }`}
                  >
                    {ferramenta.status}
                  </span>

                </div>

                {/* Informações */}
                <div className="space-y-3 text-sm">

                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={18} color="#7033ff" />
                    <span>
                      Responsável:{" "}
                      <strong className="text-white">
                        {ferramenta.responsavel}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Wrench size={18} color="#7033ff" />
                    <span>
                      Bancada:{" "}
                      <strong className="text-white">
                        {ferramenta.bancada}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock size={16} color="#7033ff" />
                      Retirada:{" "}
                      <strong className="text-white">
                        {ferramenta.retirada}
                      </strong>
                    </div>

                    <span
                      className={`text-lg font-bold ${
                        isAtrasada
                          ? "text-red-500"
                          : "text-[#7033ff]"
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