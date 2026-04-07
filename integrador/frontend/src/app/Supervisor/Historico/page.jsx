'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Download, Filter, Calendar, Loader2 } from 'lucide-react';

export default function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:3000/api/supervisor/historico';

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) {
          const data = await res.json();
          setHistorico(data);
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setIsLoading(false);
      }
    };
    carregarHistorico();
  }, []);

  // Lógica de Filtro em Tempo Real
  const dadosFiltrados = historico.filter(item => 
    item.ferramenta.toLowerCase().includes(busca.toLowerCase()) ||
    item.responsavel.toLowerCase().includes(busca.toLowerCase()) ||
    item.tagRfid.toLowerCase().includes(busca.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090A] text-purple-500">
        <Loader2 className="animate-spin w-10 h-10 mb-2" />
        <p className="text-gray-500">Carregando logs de auditoria...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#09090A] min-h-screen text-gray-100">
      
      {/* Cabeçalho */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <History className="text-purple-500 w-8 h-8" />
          <h1 className="text-3xl font-bold">Histórico de Movimentações</h1>
        </div>
        <p className="text-gray-400">Auditoria completa de todas as retiradas e devoluções registradas no SmartBench.</p>
      </header>

      {/* Barra de Ferramentas (Filtros) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por TAG, ferramenta ou mecânico"
              className="w-full bg-[#121214] border border-[#29292E] rounded-lg py-2.5 pl-10 pr-4 focus:border-purple-500 outline-none transition-all text-sm"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-[#121214] border border-[#29292E] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1c1c20] transition-colors">
            <Calendar size={16} /> Últimos 7 dias
          </button>
          <button className="flex items-center gap-2 bg-[#121214] border border-[#29292E] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1c1c20] transition-colors text-gray-400">
            <Filter size={16} /> Filtrar
          </button>
        </div>

        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-purple-500/10">
          <Download size={18} /> Exportar Relatório
        </button>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-[#121214] border border-[#29292E] rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#09090A] text-gray-500 text-[11px] uppercase tracking-wider border-b border-[#29292E]">
              <th className="px-6 py-4 font-bold">ID Transação</th>
              <th className="px-6 py-4 font-bold">Data e Hora</th>
              <th className="px-6 py-4 font-bold">Ferramenta</th>
              <th className="px-6 py-4 font-bold">Responsável</th>
              <th className="px-6 py-4 font-bold text-center">Operação</th>
              <th className="px-6 py-4 font-bold text-right">Método de Captura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#29292E]">
            {dadosFiltrados.map((log) => (
              <tr key={log.id} className="hover:bg-[#16161a] transition-colors group">
                <td className="px-6 py-4 text-xs font-mono text-gray-500 group-hover:text-purple-400">{log.id}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(log.dataRaw).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-100">{log.ferramenta}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{log.tagRfid}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-300">{log.responsavel}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{log.cargo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                    log.operacao === 'RETIRADA' 
                    ? 'bg-orange-500/10 text-orange-500' 
                    : 'bg-green-500/10 text-green-500'
                  }`}>
                    {log.operacao}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded border ${
                    log.metodo === 'MANUAL'
                    ? 'border-orange-500/20 text-orange-400 bg-orange-500/5'
                    : 'border-green-500/20 text-green-400 bg-green-500/5'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${log.metodo === 'MANUAL' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    {log.metodo === 'RFID AUTOMATICO' ? 'RFID AUTOMÁTICO' : 'MANUAL'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {dadosFiltrados.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            Nenhum registro encontrado para essa busca.
          </div>
        )}
      </div>
    </div>
  );
}