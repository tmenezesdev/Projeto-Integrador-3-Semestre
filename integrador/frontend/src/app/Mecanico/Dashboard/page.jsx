'use client';

import { useState, useEffect } from 'react';
import { PackageOpen, Wrench, Clock, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';

const API = 'http://localhost:3000/api/mecanico/minhas-retiradas';
const token = () => localStorage.getItem('smartbench_token');

export default function MinhasRetiradas() {
  const [retiradas, setRetiradas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRetiradas(data.dados ?? data);
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <PackageOpen size={32} className="text-amber-400" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Minhas Retiradas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Ferramentas que você está usando agora.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-[#1a1000] rounded-xl p-5 border border-amber-500/10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sk className="w-10 h-10 rounded-lg flex-shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Sk className="h-4 w-32" />
                  <Sk className="h-3 w-20" />
                </div>
              </div>
              <Sk className="h-6 w-16 rounded-full flex-shrink-0" />
            </div>
            <div className="flex items-center gap-4">
              <Sk className="h-3 w-28" />
              <Sk className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (erro) return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar retiradas</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <PackageOpen size={32} className="text-amber-400" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Minhas Retiradas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Ferramentas que você está usando agora.</p>
      </header>

      {retiradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Wrench size={48} className="text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">Nenhuma ferramenta em uso</p>
          <p className="text-slate-600 text-sm mt-1">Suas retiradas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {retiradas.map((item) => (
            <div
              key={item.id}
              className={`bg-[#1a1000] rounded-xl p-5 border shadow-lg flex flex-col gap-4 ${
                item.statusAlerta === 'ATRASADA'
                  ? 'border-red-900/50'
                  : 'border-amber-500/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Wrench size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white leading-tight">{item.ferramenta}</p>
                    <p className="text-xs font-mono text-slate-600 mt-0.5">{item.tagRfid}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold border whitespace-nowrap ${
                  item.statusAlerta === 'ATRASADA'
                    ? 'bg-red-500/10 text-red-400 border-red-900/50'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {item.statusAlerta === 'ATRASADA' ? 'Atrasada' : 'Em uso'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-600" />
                  Retirada: {item.horaRetirada}
                </span>
                <span className={`flex items-center gap-1.5 font-semibold ${item.statusAlerta === 'ATRASADA' ? 'text-red-400' : 'text-amber-400'}`}>
                  {item.statusAlerta === 'ATRASADA' && <AlertTriangle size={12} />}
                  {item.tempoForaLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
