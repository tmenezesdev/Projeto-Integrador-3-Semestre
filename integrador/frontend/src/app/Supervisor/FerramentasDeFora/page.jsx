'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Clock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function FerramentasForaPage() {
  const [ferramentas, setFerramentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL base do seu backend conforme o print do terminal (Porta 3001)
  const API_BASE_URL = 'http://localhost:3000/api';
  
  // ID da Juliana Oliveira (Supervisor) para registrar a devolução manual
  const SUPERVISOR_ID = 2;

  // Função para buscar os dados do backend
  const fetchFerramentas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/ferramentas-fora`);
      if (response.ok) {
        const data = await response.json();
        setFerramentas(data);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFerramentas();
    // Atualiza os dados a cada 30 segundos automaticamente
    const interval = setInterval(fetchFerramentas, 30000);
    return () => clearInterval(interval);
  }, []);

  // Função para a Devolução Manual (Botão de Check)
  const handleDevolucao = async (ferramentaId) => {
    if (confirm('Deseja confirmar a devolução manual desta ferramenta?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/supervisor/ferramentas-fora/devolucao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ferramentaId: ferramentaId,
            supervisorId: SUPERVISOR_ID
          })
        });

        if (response.ok) {
          // Remove da lista localmente para feedback instantâneo
          setFerramentas(prev => prev.filter(f => f.id !== ferramentaId));
        } else {
          alert('Erro ao processar devolução.');
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    }
  };

  // Cálculos para os cards do topo
  const totalFora = ferramentas.length;
  const emUso = ferramentas.filter(f => f.statusAlerta === 'EM_USO').length;
  const atrasadas = ferramentas.filter(f => f.statusAlerta === 'ATRASADA').length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090A] text-purple-500">
        <Loader2 className="animate-spin w-12 h-12 mb-4" />
        <p className="text-gray-400">Sincronizando com a bancada SmartBench...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#09090A] min-h-screen text-gray-100 font-sans">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Wrench className="text-purple-500 w-8 h-8" />
          <h1 className="text-3xl font-bold">Ferramentas Fora</h1>
        </div>
        <p className="text-gray-400">Monitoramento em tempo real do maquinário retirado da bancada.</p>
      </header>

      {/* Cards de Status (Topo) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#121214] p-6 rounded-xl border border-[#29292E] shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-2">Total Fora</p>
          <span className="text-5xl font-bold">{totalFora}</span>
        </div>
        
        <div className="bg-[#121214] p-6 rounded-xl border border-[#29292E] shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-2">Status: Em Uso Regular</p>
          <span className="text-5xl font-bold text-purple-500">{emUso}</span>
        </div>

        <div className="bg-[#121214] p-6 rounded-xl border border-[#29292E] shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-2">Status: Atrasadas</p>
          <span className="text-5xl font-bold text-red-500">{atrasadas}</span>
        </div>
      </section>

      {/* Grid de Ferramentas (Cards Individuais) */}
      {ferramentas.length === 0 ? (
        <div className="bg-[#121214] border border-dashed border-[#29292E] rounded-xl p-20 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-xl font-medium">Bancada completa. Nenhuma ferramenta fora!</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {ferramentas.map((f) => (
            <div 
              key={f.id} 
              className={`bg-[#121214] rounded-xl p-6 border transition-all ${
                f.statusAlerta === 'ATRASADA' ? 'border-red-900/30 hover:border-red-500/50' : 'border-[#29292E] hover:border-purple-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{f.nome}</h3>
                  <p className="text-xs text-gray-500 font-mono tracking-widest">{f.tagRfid}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                  f.statusAlerta === 'ATRASADA' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                }`}>
                  {f.statusAlerta === 'ATRASADA' ? 'ATRASADA' : 'EM USO'}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <User size={18} className="text-purple-500" />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{f.responsavel}</span>
                    <span className="text-[10px] bg-[#202024] px-2 py-0.5 rounded text-gray-500 font-bold uppercase">{f.cargo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                  <AlertCircle size={18} className={f.statusAlerta === 'ATRASADA' ? 'text-red-500' : 'text-gray-500'} />
                  <span className="text-sm">Retirada em <strong>{f.horaRetirada}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-[#29292E]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    <Clock size={12} /> Tempo Fora
                  </div>
                  <span className={`text-2xl font-black ${f.statusAlerta === 'ATRASADA' ? 'text-red-500' : 'text-purple-500'}`}>
                    {f.tempoForaLabel}
                  </span>
                </div>

                <button 
                  onClick={() => handleDevolucao(f.id)}
                  className="bg-[#202024] hover:bg-green-500/20 hover:text-green-500 text-gray-400 p-3 rounded-lg border border-[#29292E] transition-all group"
                  title="Confirmar Devolução"
                >
                  <CheckCircle2 size={24} className="group-active:scale-90 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}