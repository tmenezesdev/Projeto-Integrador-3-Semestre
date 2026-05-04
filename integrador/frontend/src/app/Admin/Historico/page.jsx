'use client';

import { useState, useEffect } from 'react';
import { History, Search, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

const API = 'http://localhost:3000/api/admin/historico';
const PAGE_SIZE = 20;

export default function AdminHistorico() {
  const { getToken } = useAuth();
  const [historico, setHistorico] = useState([]);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setHistorico(data.dados ?? data);
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  useEffect(() => { setPagina(1); }, [busca]);

  const filtrados = historico.filter(item =>
    item.ferramenta?.toLowerCase().includes(busca.toLowerCase()) ||
    item.responsavel?.toLowerCase().includes(busca.toLowerCase()) ||
    item.tagRfid?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginados = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <History size={32} className="text-[#7033ff]" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Histórico</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Auditoria completa — últimas 500 movimentações.</p>
      </header>
      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10 flex items-center justify-between gap-4">
          <Sk className="h-10 w-80 rounded-lg" />
          <Sk className="h-4 w-24" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['#', 'Data/Hora', 'Ferramenta', 'Responsável', 'Operação', 'Observação', 'Método'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(12).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-[#7033ff]/5">
                  <td className="px-5 py-3"><Sk className="h-4 w-10" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-32" /></td>
                  <td className="px-5 py-3"><div className="flex flex-col gap-1"><Sk className="h-4 w-32" /><Sk className="h-3 w-20 mt-0.5" /></div></td>
                  <td className="px-5 py-3"><div className="flex flex-col gap-1"><Sk className="h-4 w-28" /><Sk className="h-3 w-16 mt-0.5" /></div></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-24 rounded-full" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-32" /></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-24 rounded" /></td>
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
        <p className="text-white font-semibold">Erro ao carregar histórico</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <History size={32} className="text-[#7033ff]" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Histórico</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Auditoria completa — últimas 500 movimentações.</p>
      </header>

      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar por ferramenta, TAG ou responsável..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#7033ff]/20 bg-[#0a0a12] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all"
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">{filtrados.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['#', 'Data/Hora', 'Ferramenta', 'Responsável', 'Operação', 'Observação', 'Método'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginados.map((item) => (
                <tr key={item.id} className="border-b border-[#7033ff]/5 hover:bg-[#7033ff]/5 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">#{item.id}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{item.dataHora}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-white whitespace-nowrap">{item.ferramenta}</div>
                    <div className="text-xs font-mono text-slate-600 whitespace-nowrap">{item.tagRfid}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-slate-300 whitespace-nowrap">{item.responsavel}</div>
                    <div className="text-[10px] text-slate-600 font-bold tracking-wider">{item.cargo}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold border ${
                      item.operacao === 'DEVOLUCAO'
                        ? 'bg-green-500/10 text-green-400 border-green-900/50'
                        : 'bg-orange-500/10 text-orange-400 border-orange-900/50'
                    }`}>
                      {item.operacao}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 max-w-[160px] truncate">
                    {item.observacao || <span className="text-slate-700">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-slate-400 bg-[#0a0a12] px-2 py-1 rounded border border-[#7033ff]/10 flex items-center gap-2 w-max whitespace-nowrap">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.metodo === 'RFID_AUTOMATICO' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      {item.metodo === 'RFID_AUTOMATICO' ? 'RFID AUTO' : 'MANUAL'}
                    </span>
                  </td>
                </tr>
              ))}
              {paginados.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-600">Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-5 py-4 border-t border-[#7033ff]/10 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {filtrados.length} registros · página {pagina} de {totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs text-slate-400 border border-[#7033ff]/10 px-3 py-1.5 rounded-lg hover:border-[#7033ff]/30 transition-colors"
            >
              <ChevronLeft size={13} /> Anterior
            </button>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs text-slate-400 border border-[#7033ff]/10 px-3 py-1.5 rounded-lg hover:border-[#7033ff]/30 transition-colors"
            >
              Próximo <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
