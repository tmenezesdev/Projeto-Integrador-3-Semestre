'use client';

import { useState, useEffect, useCallback } from "react";
import {
  AlertOctagon,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Timer,
} from "lucide-react";
import { Sk } from '@/components/ui/skeleton';
import ModalDevolucao from "@/components/ModalDevolucao/page";

const API = 'http://localhost:3000/api/supervisor';

function getSupervisorId() {
  try {
    const user = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
    return user.id || null;
  } catch { return null; }
}

function NivelAtraso({ horas }) {
  if (horas >= 24) return { label: 'Crítico',  cor: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    dot: 'bg-red-400'    };
  if (horas >= 8)  return { label: 'Alto',     cor: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400' };
  return               { label: 'Moderado', cor: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' };
}

export default function AtrasosPage() {
  const [atrasadas,    setAtrasadas]    = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [erro,         setErro]         = useState(false);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);
  const [filtroNivel,  setFiltroNivel]  = useState('TODOS');

  const fetchAtrasadas = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setErro(false);

    try {
      const token = localStorage.getItem('smartbench_token');
      const res = await fetch(`${API}/ferramentas-fora`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.dados ?? [];
      setAtrasadas(lista.filter(f => f.statusAlerta === 'ATRASADA'));
    } catch {
      setErro(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAtrasadas();
    const interval = setInterval(() => fetchAtrasadas(true), 30000);
    return () => clearInterval(interval);
  }, [fetchAtrasadas]);

  const abrirModal = (ferramenta) => {
    setFerramentaSelecionada(ferramenta);
    setIsModalOpen(true);
  };

  const handleConfirmarDevolucao = async (ferramentaId, observacao) => {
    const supervisorId = getSupervisorId();
    if (!supervisorId) { alert('Sessão inválida. Faça login novamente.'); return; }
    try {
      const token = localStorage.getItem('smartbench_token');
      const res = await fetch(`${API}/ferramentas-fora/devolucao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ferramentaId, supervisorId, observacao }),
      });
      if (!res.ok) throw new Error();
      setAtrasadas(prev => prev.filter(f => f.id !== ferramentaId));
      setIsModalOpen(false);
      setFerramentaSelecionada(null);
    } catch {
      alert("Erro ao processar devolução.");
    }
  };

  const getHoras = (f) => {
    if (f.tempoFora) return parseInt(f.tempoFora.split(':')[0]) || 0;
    if (f.tempoForaLabel) return parseInt(f.tempoForaLabel) || 0;
    return 0;
  };

  const criticas  = atrasadas.filter(f => getHoras(f) >= 24);
  const altas     = atrasadas.filter(f => getHoras(f) >= 8 && getHoras(f) < 24);
  const moderadas = atrasadas.filter(f => getHoras(f) < 8);

  const dadosFiltrados = filtroNivel === 'CRITICO'  ? criticas
    : filtroNivel === 'ALTO'     ? altas
    : filtroNivel === 'MODERADO' ? moderadas
    : atrasadas;

  if (isLoading) return (
    <div className="flex-1 p-8 bg-[#09090A] min-h-screen text-white font-sans">
      <div className="flex items-start justify-between mb-10">
        <div>
          <Sk className="h-3 w-32 mb-2" />
          <div className="flex items-center gap-3">
            <AlertOctagon size={28} className="text-red-400 opacity-30" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Atrasos</h1>
          </div>
          <Sk className="h-3 w-64 mt-2 ml-10" />
        </div>
        <Sk className="h-9 w-28 rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-10">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-slate-700/30 rounded-xl p-5 flex flex-col gap-3">
            <Sk className="h-3 w-24" />
            <Sk className="h-10 w-14" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-[#0a1628] rounded-xl p-6 border border-slate-700/30">
            <div className="flex justify-between items-start mb-5">
              <div className="flex flex-col gap-1.5 flex-1 pr-4">
                <Sk className="h-5 w-40" />
                <Sk className="h-3 w-24" />
              </div>
              <Sk className="h-6 w-20 rounded flex-shrink-0" />
            </div>
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-3"><Sk className="w-4 h-4 rounded flex-shrink-0" /><Sk className="h-4 w-36" /></div>
              <div className="flex items-center gap-3"><Sk className="w-4 h-4 rounded flex-shrink-0" /><Sk className="h-4 w-44" /></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
              <div className="flex flex-col gap-1"><Sk className="h-3 w-20" /><Sk className="h-7 w-20" /></div>
              <Sk className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (erro) return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090A]">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao conectar ao servidor</p>
        <button
          onClick={() => fetchAtrasadas()}
          className="cursor-pointer mt-3 text-xs text-teal-400 border border-teal-500/30 px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-8 bg-[#09090A] min-h-screen text-white font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Alertas</p>
          <div className="flex items-center gap-3">
            <AlertOctagon size={28} className="text-red-400" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Atrasos</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-10">
            Ferramentas fora do prazo de devolução.
          </p>
        </div>
        <button
          onClick={() => fetchAtrasadas(true)}
          disabled={isRefreshing}
          className="cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 text-xs text-slate-400 hover:text-white border border-slate-700/50 px-3 py-2 rounded-lg hover:border-red-500/30 transition-all"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-slate-700/30 rounded-xl p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Wrench size={12} /> Total Atrasadas
          </p>
          <p className="text-4xl font-bold text-white">{atrasadas.length}</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp size={12} /> Crítico (+24h)
          </p>
          <p className="text-4xl font-bold text-red-400">{criticas.length}</p>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Timer size={12} /> Alto (8h–24h)
          </p>
          <p className="text-4xl font-bold text-orange-400">{altas.length}</p>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock size={12} /> Moderado (−8h)
          </p>
          <p className="text-4xl font-bold text-yellow-400">{moderadas.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'TODOS',    label: 'Todos',    count: atrasadas.length },
          { key: 'CRITICO',  label: 'Crítico',  count: criticas.length  },
          { key: 'ALTO',     label: 'Alto',     count: altas.length     },
          { key: 'MODERADO', label: 'Moderado', count: moderadas.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFiltroNivel(key)}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              filtroNivel === key
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'text-slate-400 border-slate-700/40 hover:text-slate-200 hover:border-slate-600/60 bg-white/[0.02]'
            }`}
          >
            {label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${filtroNivel === key ? 'bg-red-500/20' : 'bg-white/5'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {dadosFiltrados.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-slate-700/40 rounded-2xl p-20 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4 opacity-40" />
          <p className="text-slate-400 text-lg font-semibold">Nenhum atraso encontrado!</p>
          <p className="text-slate-600 text-sm mt-1">
            {filtroNivel !== 'TODOS' ? 'Nenhuma ferramenta nesse nível de atraso.' : 'Todas as ferramentas estão dentro do prazo.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {dadosFiltrados.map((f) => {
            const horas = getHoras(f);
            const nivel = NivelAtraso({ horas });

            return (
              <div
                key={f.id}
                className={`bg-[#0a1628] rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${nivel.border} hover:brightness-110`}
              >
                {/* Topo */}
                <div className="flex justify-between items-start mb-5">
                  <div className="pr-4">
                    <h3 className="text-base font-semibold text-white leading-snug">
                      {f.ferramenta ?? f.nome}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono tracking-wider mt-1">
                      {f.tagRfid}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${nivel.bg} ${nivel.cor} ${nivel.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${nivel.dot}`} />
                    {nivel.label}
                  </span>
                </div>

                {/* Infos */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-3">
                    <User size={15} className={nivel.cor} />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{f.responsavel}</span>
                      <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-widest">
                        {f.cargo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={15} className="text-slate-600" />
                    <span className="text-xs text-slate-500">
                      Retirada em <span className="text-slate-300 font-medium">{f.horaRetirada}</span>
                    </span>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-1">
                      <Clock size={11} /> Tempo fora
                    </div>
                    <span className={`text-2xl font-bold ${nivel.cor}`}>
                      {f.tempoForaLabel || f.tempoFora}
                    </span>
                  </div>
                  <button
                    onClick={() => abrirModal(f)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-200 bg-white/5 text-slate-400 border-slate-700/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20"
                  >
                    <CheckCircle2 size={15} />
                    Devolver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ModalDevolucao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmarDevolucao}
        ferramenta={ferramentaSelecionada}
      />
    </div>
  );
}