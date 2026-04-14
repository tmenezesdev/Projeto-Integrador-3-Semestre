'use client';

import { useState, useEffect } from "react";
import { History, Search, Download, Loader2, AlertCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const API_URL = 'http://localhost:3000/api/supervisor/historico';

function formatDate(raw) {
  try {
    return new Date(raw).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return raw; }
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroOp, setFiltroOp] = useState('TODOS');
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        setHistorico(await res.json());
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const dadosFiltrados = historico.filter(item => {
    const matchBusca =
      item.ferramenta?.toLowerCase().includes(busca.toLowerCase()) ||
      item.responsavel?.toLowerCase().includes(busca.toLowerCase()) ||
      item.tagRfid?.toLowerCase().includes(busca.toLowerCase());
    const matchOp = filtroOp === 'TODOS' || item.operacao === filtroOp;
    return matchBusca && matchOp;
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#060d1f]">
      <Loader2 className="animate-spin text-teal-400 w-10 h-10" />
    </div>
  );

  if (erro) return (
    <div className="flex items-center justify-center min-h-screen bg-[#060d1f]">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar histórico</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-8 bg-[#060d1f] min-h-screen text-white font-sans">

      <div className="flex flex-col gap-1 mb-10">
        <p className="text-xs font-bold text-teal-500 uppercase tracking-widest">Auditoria</p>
        <div className="flex items-center gap-3">
          <History className="text-teal-400 h-7 w-7" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Histórico de Movimentações</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1 ml-10">Registro completo de retiradas e devoluções no SmartBench.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por TAG, ferramenta ou responsável..."
              className="w-full bg-[#0a1628] border border-slate-700/40 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none transition-colors"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex gap-1 bg-[#0a1628] border border-slate-700/40 rounded-lg p-1">
            {['TODOS', 'RETIRADA', 'DEVOLUCAO'].map(op => (
              <button
                key={op}
                onClick={() => setFiltroOp(op)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filtroOp === op
                    ? op === 'RETIRADA' ? 'bg-orange-500/20 text-orange-400'
                    : op === 'DEVOLUCAO' ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-teal-500/20 text-teal-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {op === 'TODOS' ? 'Todos' : op === 'RETIRADA' ? 'Retiradas' : 'Devoluções'}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all">
          <Download size={14} /> Exportar
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-[#0a1628] border border-slate-700/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060d1f] text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700/30">
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold">Data e Hora</th>
              <th className="px-6 py-4 font-bold">Ferramenta</th>
              <th className="px-6 py-4 font-bold">Responsável</th>
              <th className="px-6 py-4 font-bold text-center">Operação</th>
              <th className="px-6 py-4 font-bold text-right">Método</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/20">
            {dadosFiltrados.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-[11px] font-mono text-slate-600 group-hover:text-teal-400 transition-colors">{log.id}</td>
                <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">{formatDate(log.dataRaw)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-200 whitespace-nowrap">{log.ferramenta}</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">{log.tagRfid}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-300 whitespace-nowrap">{log.responsavel}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{log.cargo}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase ${log.operacao === 'RETIRADA' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {log.operacao === 'RETIRADA' ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                    {log.operacao}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded border ${log.metodo === 'MANUAL' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' : 'border-teal-500/20 text-teal-400 bg-teal-500/5'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.metodo === 'MANUAL' ? 'bg-amber-500' : 'bg-teal-400'}`} />
                    {log.metodo === 'RFID_AUTOMATICO' ? 'RFID AUTO' : 'MANUAL'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dadosFiltrados.length === 0 && (
          <div className="p-16 text-center text-slate-600 text-sm">Nenhum registro encontrado.</div>
        )}
        <div className="px-6 py-3 border-t border-slate-700/30 flex items-center justify-between">
          <span className="text-xs text-slate-700">{dadosFiltrados.length} registro{dadosFiltrados.length !== 1 ? 's' : ''}</span>
          <span className="text-xs text-slate-700">SmartBench Audit Log</span>
        </div>
      </div>
    </div>
  );
}