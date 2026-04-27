'use client';

import { useState, useEffect } from 'react';
import { Wrench, Search, Loader2, AlertCircle } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';

const API = 'http://localhost:3000/api/mecanico/ferramentas';
const token = () => localStorage.getItem('smartbench_token');

const statusColor = (s) => {
  if (s === 'DISPONIVEL') return 'bg-green-500/10 text-green-400 border-green-900/50';
  if (s === 'EM_USO') return 'bg-orange-500/10 text-orange-400 border-orange-900/50';
  return 'bg-red-500/10 text-red-400 border-red-900/50';
};

export default function MecanicoFerramentas() {
  const [ferramentas, setFerramentas] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFerramentas(data.dados ?? data);
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const filtradas = ferramentas.filter(f =>
    f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.tag_rfid?.toLowerCase().includes(busca.toLowerCase())
  );

  const disponiveis = ferramentas.filter(f => f.status === 'DISPONIVEL').length;
  const emUso = ferramentas.filter(f => f.status === 'EM_USO').length;
  const manutencao = ferramentas.filter(f => f.status === 'MANUTENCAO').length;

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Wrench size={32} className="text-amber-400" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Inventário completo da bancada.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-3">
            <Sk className="h-3 w-24" />
            <Sk className="h-10 w-14" />
          </div>
        ))}
      </div>
      <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-amber-500/10">
          <Sk className="h-10 w-72 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-amber-500/10">
                {['Nome', 'Tag RFID', 'Peso Ref.', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(10).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-amber-500/5">
                  <td className="px-5 py-3"><Sk className="h-4 w-36" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-24" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-16" /></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-24 rounded-full" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (erro) return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar ferramentas</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Wrench size={32} className="text-amber-400" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Inventário completo da bancada.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Disponíveis</span>
          <p className="text-4xl font-black text-green-400 mt-2">{disponiveis}</p>
        </div>
        <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Em Uso</span>
          <p className="text-4xl font-black text-orange-400 mt-2">{emUso}</p>
        </div>
        <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Manutenção</span>
          <p className="text-4xl font-black text-red-400 mt-2">{manutencao}</p>
        </div>
      </div>

      <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-amber-500/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou tag RFID..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full rounded-lg border border-amber-500/20 bg-[#0f0900] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-amber-500/10">
                {['Nome', 'Tag RFID', 'Peso Ref.', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.id} className="border-b border-amber-500/5 hover:bg-amber-500/5 transition-colors">
                  <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{f.nome}</td>
                  <td className="px-5 py-3 font-mono text-slate-400 whitespace-nowrap">{f.tag_rfid}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{f.peso_referencia ? `${f.peso_referencia}g` : '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold border ${statusColor(f.status)}`}>{f.status}</span>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-600">Nenhuma ferramenta encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
