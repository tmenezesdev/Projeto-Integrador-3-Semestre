'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useCallback } from "react";
import {
  AlertOctagon,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Timer,
} from "lucide-react";
import { Sk } from '@/components/ui/skeleton';
import ModalDevolucao from "@/components/ModalDevolucao/page";
import { useAuth } from '@/hooks/useAuth';

const API = BASE_URL + '/api/supervisor';

function NivelAtraso({ horas }) {
  if (horas >= 24) return { label: 'Crítico',  cor: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    dot: 'bg-red-400'    };
  if (horas >= 8)  return { label: 'Alto',     cor: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400' };
  return               { label: 'Moderado', cor: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' };
}

export default function AtrasosPage() {
  const { getToken, getUser } = useAuth();
  const [atrasadas,    setAtrasadas]    = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [erro,         setErro]         = useState(false);
  const [erroAcao,     setErroAcao]     = useState('');
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);
  const [filtroNivel,  setFiltroNivel]  = useState('TODOS');

  const fetchAtrasadas = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setErro(false);

    try {
      const res = await fetch(`${API}/ferramentas-fora`, {
        headers: { Authorization: `Bearer ${getToken()}` }
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
    const supervisorId = getUser()?.id || null;
    if (!supervisorId) {
      setErroAcao('Sessão inválida. Faça login novamente.');
      return;
    }
    try {
      setErroAcao('');
      const res = await fetch(`${API}/ferramentas-fora/devolucao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ferramentaId, supervisorId, observacao }),
      });
      if (!res.ok) throw new Error();
      setAtrasadas(prev => prev.filter(f => f.id !== ferramentaId));
      setIsModalOpen(false);
      setFerramentaSelecionada(null);
    } catch {
      setErroAcao('Erro ao processar devolução. Tente novamente.');
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
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen text-white font-sans overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-10">
        <div>
          <Sk className="h-3 w-32 mb-2" />
          <div className="flex items-center gap-2 md:gap-3">
            <AlertOctagon size={28} className="text-red-400 opacity-30 flex-shrink-0" strokeWidth={1.5} />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Atrasos</h1>
          </div>
          <Sk className="h-3 w-48 md:w-64 mt-2 ml-7 md:ml-10" />
        </div>
        <Sk className="h-9 w-28 rounded-lg flex-shrink-0" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-slate-700/30 rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col gap-2 md:gap-3">
            <Sk className="h-3 w-20 md:w-24" />
            <Sk className="h-8 md:h-10 w-12 md:w-14" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-[#0a1628] rounded-lg md:rounded-xl p-4 md:p-6 border border-slate-700/30">
            <div className="flex justify-between items-start gap-3 mb-4 md:mb-5">
              <div className="flex flex-col gap-1.5 flex-1 pr-2 md:pr-4">
                <Sk className="h-4 md:h-5 w-32 md:w-40" />
                <Sk className="h-3 w-20 md:w-24" />
              </div>
              <Sk className="h-6 w-16 md:w-20 rounded flex-shrink-0" />
            </div>
            <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
              <div className="flex items-center gap-2 md:gap-3"><Sk className="w-4 h-4 rounded flex-shrink-0" /><Sk className="h-4 w-28 md:w-36" /></div>
              <div className="flex items-center gap-2 md:gap-3"><Sk className="w-4 h-4 rounded flex-shrink-0" /><Sk className="h-4 w-32 md:w-44" /></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 md:pt-4 border-t border-slate-700/30">
              <div className="flex flex-col gap-1"><Sk className="h-3 w-16 md:w-20" /><Sk className="h-6 md:h-7 w-16 md:w-20" /></div>
              <Sk className="h-9 w-full md:w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  if (erro) return (
    <main className="flex items-center justify-center min-h-screen bg-[#09090A] p-4">
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
    </main>
  );

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen text-white font-sans overflow-y-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-10">
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Alertas</p>
          <div className="flex items-center gap-2 md:gap-3">
            <AlertOctagon size={28} className="text-red-400 flex-shrink-0" strokeWidth={1.5} />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Atrasos</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 ml-7 md:ml-10">
            Ferramentas fora do prazo de devolução.
          </p>
        </div>
        <button
          onClick={() => fetchAtrasadas(true)}
          disabled={isRefreshing}
          className="cursor-pointer disabled:cursor-not-allowed flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 hover:text-white border border-slate-700/50 px-3 py-2 rounded-lg hover:border-red-500/30 transition-all w-full md:w-auto flex-shrink-0"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Banner de erro de ação */}
      {erroAcao && (
        <div className="mb-6 px-3 md:px-4 py-2 md:py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs md:text-sm text-red-400 flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          {erroAcao}
          <button
            onClick={() => setErroAcao('')}
            className="ml-auto text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white/[0.03] border border-slate-700/30 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
            <Wrench size={11} /> Total Atrasadas
          </p>
          <p className="text-2xl md:text-4xl font-bold text-white">{atrasadas.length}</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
            <TrendingUp size={11} /> Crítico
          </p>
          <p className="text-2xl md:text-4xl font-bold text-red-400">{criticas.length}</p>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
            <Timer size={11} /> Alto
          </p>
          <p className="text-2xl md:text-4xl font-bold text-orange-400">{altas.length}</p>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
            <Clock size={11} /> Moderado
          </p>
          <p className="text-2xl md:text-4xl font-bold text-yellow-400">{moderadas.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'TODOS',    label: 'Todos',    count: atrasadas.length },
          { key: 'CRITICO',  label: 'Crítico',  count: criticas.length  },
          { key: 'ALTO',     label: 'Alto',     count: altas.length     },
          { key: 'MODERADO', label: 'Moderado', count: moderadas.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFiltroNivel(key)}
            className={`cursor-pointer flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              filtroNivel === key
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'text-slate-400 border-slate-700/40 hover:text-slate-200 hover:border-slate-600/60 bg-white/[0.02]'
            }`}
          >
            {label}
            <span className={`px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black ${filtroNivel === key ? 'bg-red-500/20' : 'bg-white/5'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {dadosFiltrados.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-slate-700/40 rounded-lg md:rounded-2xl p-8 md:p-20 text-center">
          <CheckCircle2 className="w-12 md:w-14 h-12 md:h-14 text-emerald-500 mx-auto mb-4 opacity-40" />
          <p className="text-slate-400 text-base md:text-lg font-semibold">Nenhum atraso encontrado!</p>
          <p className="text-slate-600 text-xs md:text-sm mt-1">
            {filtroNivel !== 'TODOS' ? 'Nenhuma ferramenta nesse nível de atraso.' : 'Todas as ferramentas estão dentro do prazo.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {dadosFiltrados.filter((f, i, self) =>
              i === self.findIndex(t => t.id === f.id && t.responsavel === f.responsavel)
            ).map((f, idx) => {
            const horas = getHoras(f);
            const nivel = NivelAtraso({ horas });

            return (
              <div
                key={`${f.id}-${f.responsavel}-${idx}`}
                className={`bg-[#0a1628] rounded-lg md:rounded-xl p-4 md:p-6 border transition-all duration-300 hover:shadow-lg ${nivel.border} hover:brightness-110`}
              >
                {/* Topo */}
                <div className="flex justify-between items-start gap-3 mb-4 md:mb-5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-white leading-snug break-words">
                      {f.ferramenta ?? f.nome}
                    </h3>
                    <p className="text-[10px] md:text-[11px] text-slate-500 font-mono tracking-wider mt-1 truncate">
                      {f.tagRfid}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 flex items-center gap-1 px-2 md:px-2.5 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase border ${nivel.bg} ${nivel.cor} ${nivel.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${nivel.dot}`} />
                    <span className="hidden sm:inline">{nivel.label}</span>
                  </span>
                </div>

                {/* Infos */}
                <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
                  <div className="flex items-start md:items-center gap-2 md:gap-3">
                    <User size={14} className={`${nivel.cor} flex-shrink-0 mt-0.5 md:mt-0`} />
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 min-w-0 flex-1">
                      <span className="text-xs md:text-sm font-medium text-slate-200 truncate">{f.responsavel}</span>
                      <span className="text-[8px] md:text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-widest w-fit">
                        {f.cargo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Clock size={14} className="text-slate-600 flex-shrink-0" />
                    <span className="text-xs md:text-xs text-slate-500 break-words">
                      Retirada em <span className="text-slate-300 font-medium">{f.horaRetirada}</span>
                    </span>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 md:pt-4 border-t border-slate-700/30">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-1">
                      <Clock size={10} /> Tempo fora
                    </div>
                    <span className={`text-xl md:text-2xl font-bold block ${nivel.cor}`}>
                      {f.tempoForaLabel || f.tempoFora}
                    </span>
                  </div>
                  <button
                    onClick={() => abrirModal(f)}
                    className="cursor-pointer flex items-center justify-center gap-1 md:gap-2 w-full md:w-auto px-3 md:px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-200 bg-white/5 text-slate-400 border-slate-700/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 flex-shrink-0"
                  >
                    <CheckCircle2 size={14} />
                    <span className="hidden sm:inline">Devolver</span>
                    <span className="sm:hidden">Dev</span>
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
    </main>
  );
}