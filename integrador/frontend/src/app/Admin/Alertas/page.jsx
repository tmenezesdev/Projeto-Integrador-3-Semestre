'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useCallback } from 'react';
import { AlertOctagon, Search, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';

const API_ALERTAS = BASE_URL + '/api/admin/alertas';
const token = () => localStorage.getItem('smartbench_token');

export default function AdminAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [resolvendo, setResolvendo] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(API_ALERTAS, { headers: { Authorization: `Bearer ${token()}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAlertas(data.dados ?? data);
    } catch { setErro(true); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleResolver = async (id) => {
    setResolvendo(id);
    try {
      const res = await fetch(`${API_ALERTAS}/${id}/resolver`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error();
      load();
    } catch { /* silently fail */ }
    finally { setResolvendo(null); }
  };

  const filtrados = alertas.filter(a =>
    a.ferramenta?.toLowerCase().includes(busca.toLowerCase()) ||
    a.mensagem?.toLowerCase().includes(busca.toLowerCase()) ||
    a.responsavel?.toLowerCase().includes(busca.toLowerCase())
  );

  const ativos = alertas.filter(a => a.status_alerta === 'ATIVO').length;
  const resolvidos = alertas.filter(a => a.status_alerta === 'RESOLVIDO').length;

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <AlertOctagon size={32} className="text-[#7033ff]" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Alertas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Gerencie todos os alertas do sistema.</p>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-5 flex flex-col gap-3">
            <Sk className="h-3 w-16" />
            <Sk className="h-10 w-14" />
          </div>
        ))}
      </div>
      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10">
          <Sk className="h-10 w-72 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['Data', 'Ferramenta', 'Responsável', 'Mensagem', 'Status', 'Ação'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(10).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-[#7033ff]/5">
                  <td className="px-5 py-3"><Sk className="h-4 w-28" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-32" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-28" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-48" /></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-20 rounded-full" /></td>
                  <td className="px-5 py-3"><Sk className="h-7 w-20 rounded-lg" /></td>
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
        <p className="text-white font-semibold">Erro ao carregar alertas</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <AlertOctagon size={32} className="text-[#7033ff]" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Alertas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Gerencie todos os alertas do sistema.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
          <p className="text-4xl font-black text-white mt-2">{alertas.length}</p>
        </div>
        <div className="bg-[#13102a] border border-red-900/30 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Ativos</span>
          <p className="text-4xl font-black text-red-400 mt-2">{ativos}</p>
        </div>
        <div className="bg-[#13102a] border border-green-900/30 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Resolvidos</span>
          <p className="text-4xl font-black text-green-400 mt-2">{resolvidos}</p>
        </div>
      </div>

      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar alertas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#7033ff]/20 bg-[#0a0a12] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['Data', 'Ferramenta', 'Responsável', 'Mensagem', 'Status', 'Ação'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((alerta) => (
                <tr key={alerta.id} className="border-b border-[#7033ff]/5 hover:bg-[#7033ff]/5 transition-colors">
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap text-xs">
                    {new Date(alerta.data_geracao).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-white whitespace-nowrap">{alerta.ferramenta}</div>
                    <div className="text-xs font-mono text-slate-600">{alerta.tagRfid}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{alerta.responsavel || <span className="text-slate-600">Sistema</span>}</td>
                  <td className="px-5 py-3 text-xs text-slate-400 max-w-[200px] truncate">{alerta.mensagem}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold border ${
                      alerta.status_alerta === 'ATIVO'
                        ? 'bg-red-500/10 text-red-400 border-red-900/50'
                        : 'bg-green-500/10 text-green-400 border-green-900/50'
                    }`}>
                      {alerta.status_alerta}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {alerta.status_alerta === 'ATIVO' ? (
                      <button
                        onClick={() => handleResolver(alerta.id)}
                        disabled={resolvendo === alerta.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-900/50 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        {resolvendo === alerta.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        Resolver
                      </button>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-600">Nenhum alerta encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
