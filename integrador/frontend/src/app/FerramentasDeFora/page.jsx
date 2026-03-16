import React from 'react';
import { User, Clock, Hammer, Wrench } from 'lucide-react';
import Sidebar from '../components/Sidebar/page';

const ferramentas = [
  {
    id: 'FT-001',
    nome: 'Torquímetro Digital 200Nm',
    status: 'Atrasada',
    responsavel: 'Carlos Silva',
    bancada: 'Bancada A - Motores',
    retirada: '09:00',
    tempoDecorrido: '5h 23min',
  },
  {
    id: 'FT-007',
    nome: 'Alicate Amperímetro',
    status: 'Em uso',
    responsavel: 'Maria Oliveira',
    bancada: 'Bancada B - Elétrica',
    retirada: '11:30',
    tempoDecorrido: '3h 15min',
  },
  {
    id: 'FT-003',
    nome: 'Chave Inglesa 12"',
    status: 'Em uso',
    responsavel: 'João Silva',
    bancada: 'Bancada A - Motores',
    retirada: '13:00',
    tempoDecorrido: '1h 45min',
  },
  {
    id: 'FT-009',
    nome: 'Multímetro Digital',
    status: 'Atrasada',
    responsavel: 'Pedro Lima',
    bancada: 'Bancada B - Elétrica',
    retirada: '08:30',
    tempoDecorrido: '6h 15min',
  },
  {
    id: 'FT-005',
    nome: 'Jogo de Chaves Allen',
    status: 'Em uso',
    responsavel: 'Lucas Mendes',
    bancada: 'Bancada C - Montagem',
    retirada: '14:00',
    tempoDecorrido: '45min',
  },
];

export default function FerramentasFora() {
  const totalFora = ferramentas.length;
  const emUso = ferramentas.filter((f) => f.status === 'Em uso').length;
  const atrasadas = ferramentas.filter((f) => f.status === 'Atrasada').length;

  return (
    //fundo da tela
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />

      <main className="flex-1 text-black p-10 font-normal">
        {/* Cabeçalho */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            {/* Ícone Pickaxe*/}
            <Wrench size={38} color="#7033ff" strokeWidth={1.25} />            
            <h1 className="text-3xl font-bold text-black tracking-tight font-serif">
              Ferramentas Fora
            </h1>
          </div>
          <p className="text-black text-lg font-serif">Ferramentas atualmente fora das bancadas</p>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="bg-gray-50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center shadow-md">
            <span className="text-lg text-black mb-2 font-semibold">Total Fora</span>
            <span className="text-5xl font-bold text-black font-mono">{totalFora}</span>
          </div>

          <div className="bg-gray-50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center shadow-md">
            <span className="text-lg text-black mb-2 font-serif">Em Uso</span>
            <span className="text-5xl font-bold text-black font-mono">{emUso}</span>
          </div>

          <div className="bg-gray-50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center shadow-md">
            <span className="text-lg text-black mb-2 font-serif">Atrasadas</span>
            <span className="text-5xl font-bold text-red-500 font-mono">{atrasadas}</span>
          </div>
        </div>

        {/* Grid de Ferramentas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {ferramentas.map((ferramenta) => {
            const isAtrasada = ferramenta.status === 'Atrasada';

            return (
              <div
                key={ferramenta.id}
                className={`rounded-2xl p-8 flex flex-col justify-between border shadow-sm transition-all duration-300 hover:shadow-md font-serif ${isAtrasada
                  ? 'bg-red-50 border-red-200'
                  : 'bg-zinc-50 border-zinc-200'
                  }`}
              >
                {/* Header do Card */}
                <div className="flex justify-between items-start mb-6 font-serif">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1 font-serif">
                      {ferramenta.nome}
                    </h3>
                    <span className="text-xs font-bold text-zinc-500 px-2 py-1 bg-white border border-zinc-900 rounded font-mono">
                      {ferramenta.id}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide font-mono ${isAtrasada
                      ? 'bg-red-600 text-white'
                      : 'bg-purple-600 text-white'
                      }`}
                  >
                    {ferramenta.status}
                  </span>
                </div>

                {/* Informações do Card */}
                <div className="space-y-4 text-sm font-serif">
                  <div className="flex items-center gap-3">
                    <User size={20} color="#7033ff" strokeWidth={1.25} />
                    <span className="text-zinc-600 font-medium">Responsável: <span className="text-zinc-900 font-bold">{ferramenta.responsavel}</span></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7033ff" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hammer-icon lucide-hammer"><path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" /><path d="m18 15 4-4" /><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" /></svg>

                    <span className="text-zinc-600 font-medium">Bancada: <span className="text-zinc-900 font-bold">{ferramenta.bancada}</span></span>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2 text-zinc-500">
                     <Clock size={20} color="#7033ff" strokeWidth={1.25} />
                      <span className="text-xs">Retirada: <strong className="text-zinc-700">{ferramenta.retirada}</strong></span>
                    </div>


                    <span
                      className={`text-xl font-black font-serif  ${isAtrasada ? 'text-red-600' : 'text-purple-600'
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