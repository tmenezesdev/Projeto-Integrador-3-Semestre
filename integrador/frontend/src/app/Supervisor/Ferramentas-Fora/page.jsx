'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useCallback } from "react";
import {
  Wrench,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Sk } from '@/components/ui/skeleton';
import ModalDevolucao from "@/components/ModalDevolucao/page";

const API = BASE_URL + '/api/supervisor';

function getSupervisorId() {
  try {
    const user = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
    return user.id || null;
  } catch { return null; }
}

export default function FerramentasForaPage() {
  const [ferramentas, setFerramentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [erro, setErro] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);

  const fetchFerramentas = useCallback(async (silent = false) => {
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
      setFerramentas(data);
    } catch {
      setErro(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFerramentas();

    const interval = setInterval(() => {
      fetchFerramentas(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchFerramentas]);

  const abrirModal = (ferramenta) => {
    setFerramentaSelecionada(ferramenta);
    setIsModalOpen(true);
  };

  const handleConfirmarDevolucao = async (ferramentaId, observacao) => {
    const supervisorId = getSupervisorId();
    if (!supervisorId) {
      alert('Sessão inválida. Faça login novamente.');
      return;
    }
    try {
      const token = localStorage.getItem('smartbench_token');
      const res = await fetch(`${API}/ferramentas-fora/devolucao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ferramentaId, supervisorId, observacao }),
      });

      if (!res.ok) throw new Error();

      setFerramentas(prev => prev.filter(f => f.id !== ferramentaId));
      setIsModalOpen(false);
      setFerramentaSelecionada(null);

    } catch {
      alert("Erro ao processar devolução.");
    }
  };

  const ferramentasProcessadas = ferramentas
    .filter((f, index, self) =>
      index === self.findIndex(t => t.id === f.id && t.responsavel === f.responsavel)
    )
    .map((ferramenta, index) => ({
      ...ferramenta,
      _uniqueKey: `${ferramenta.id}-${ferramenta.responsavel}-${index}`,
      // statusAlerta já vem calculado pelo backend com base no tempo_limite_horas configurado
      statusCorrigido: ferramenta.statusAlerta === 'ATRASADA' ? 'ATRASADO' : 'EM USO'
    }));

  const totalFora = ferramentasProcessadas.length;
  const atrasadas = ferramentasProcessadas.filter(f => f.statusCorrigido === 'ATRASADO').length;
  const emUso = totalFora - atrasadas;

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen text-white font-sans overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-10">
          <div>
            <Sk className="h-3 w-32 mb-2" />
            <div className="flex items-center gap-2 md:gap-3">
              <Wrench size={28} className="text-teal-400 opacity-30 flex-shrink-0" strokeWidth={1.5} />
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Ferramentas Fora</h1>
            </div>
            <Sk className="h-3 w-52 md:w-64 mt-2 ml-7 md:ml-10" />
          </div>
          <Sk className="h-9 w-28 rounded-lg flex-shrink-0" />
        </div>

        {/* CARDS - Responsivos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-10">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white/[0.03] border border-slate-700/30 rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col gap-3">
              <Sk className="h-3 w-20 md:w-24" />
              <Sk className="h-8 md:h-10 w-12 md:w-14" />
            </div>
          ))}
        </div>

        {/* FERRAMENTAS - Grid Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#0a1628] rounded-lg md:rounded-xl p-4 md:p-6 border border-slate-700/30">
              <div className="flex justify-between items-start mb-4 md:mb-5">
                <div className="flex flex-col gap-1.5 flex-1 pr-3 md:pr-4">
                  <Sk className="h-4 md:h-5 w-32 md:w-40" />
                  <Sk className="h-3 w-20 md:w-24" />
                </div>
                <Sk className="h-6 w-14 md:w-16 rounded flex-shrink-0" />
              </div>
              <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
                <div className="flex items-center gap-2 md:gap-3">
                  <Sk className="w-4 h-4 rounded flex-shrink-0" />
                  <Sk className="h-4 w-28 md:w-36" />
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Sk className="w-4 h-4 rounded flex-shrink-0" />
                  <Sk className="h-4 w-32 md:w-44" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 md:pt-4 border-t border-slate-700/30">
                <div className="flex flex-col gap-1">
                  <Sk className="h-3 w-16 md:w-20" />
                  <Sk className="h-6 md:h-7 w-16 md:w-20" />
                </div>
                <Sk className="h-9 w-full md:w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#09090A] p-4">
        <div className="text-center">
          <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
          <p className="text-white font-semibold">Erro ao conectar ao servidor</p>
          <button
            onClick={() => fetchFerramentas()}
            className="mt-3 text-xs text-teal-400 border border-teal-500/30 px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen text-white font-sans overflow-y-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-10">
        <div className="flex-1">
          <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-1">
            Monitoramento
          </p>
          <div className="flex items-center gap-2 md:gap-3">
            <Wrench size={28} className="text-teal-400 flex-shrink-0" strokeWidth={1.5} />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Ferramentas Fora
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 ml-7 md:ml-10">
            Maquinário retirado da bancada em tempo real.
          </p>
        </div>

        <button
          onClick={() => fetchFerramentas(true)}
          disabled={isRefreshing}
          className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 hover:text-white border border-slate-700/50 px-3 py-2 rounded-lg hover:border-teal-500/30 transition-all cursor-pointer disabled:cursor-not-allowed w-full md:w-auto flex-shrink-0"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? 'animate-spin' : ''}
          />
          <span className="md:inline">Atualizar</span>
        </button>
      </div>

      {/* STATS CARDS - Responsivos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-10">
        <div className="bg-white/[0.03] border border-slate-700/30 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3">
            Total Fora
          </p>
          <p className="text-3xl md:text-4xl font-bold text-white">{totalFora}</p>
        </div>

        <div className="bg-teal-500/5 border border-teal-500/20 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3">
            Em Uso Regular
          </p>
          <p className="text-3xl md:text-4xl font-bold text-teal-400">{emUso}</p>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-lg md:rounded-xl p-3 md:p-5">
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2 md:mb-3">
            Atrasadas
          </p>
          <p className="text-3xl md:text-4xl font-bold text-red-400">{atrasadas}</p>
        </div>
      </div>

      {/* LISTA VAZIA */}
      {ferramentasProcessadas.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-slate-700/40 rounded-lg md:rounded-2xl p-8 md:p-20 text-center">
          <CheckCircle2 className="w-12 md:w-14 h-12 md:h-14 text-emerald-500 mx-auto mb-4 opacity-40" />
          <p className="text-slate-400 text-base md:text-lg font-semibold">Bancada completa!</p>
          <p className="text-slate-600 text-xs md:text-sm mt-1">
            Nenhuma ferramenta fora da bancada no momento.
          </p>
        </div>
      ) : (
        /* CARDS DE FERRAMENTAS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {ferramentasProcessadas.map((f) => {
            const atrasada = f.statusCorrigido === 'ATRASADO';

            return (
              <div
                key={f._uniqueKey}
                className={`bg-[#0a1628] rounded-lg md:rounded-xl p-4 md:p-6 border transition-all duration-300 hover:shadow-lg ${atrasada
                    ? 'border-red-500/20 hover:border-red-500/40'
                    : 'border-slate-700/30 hover:border-teal-500/30'
                  }`}
              >
                {/* NOME E STATUS */}
                <div className="flex justify-between items-start gap-3 mb-4 md:mb-5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-white leading-snug break-words">
                      {f.nome}
                    </h3>
                    <p className="text-[10px] md:text-[11px] text-slate-500 font-mono tracking-wider mt-1 truncate">
                      {f.tagRfid}
                    </p>
                  </div>

                  <span
                    className={`flex-shrink-0 px-2 md:px-2.5 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase border ${atrasada
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      }`}
                  >
                    {atrasada ? 'Atrasada' : 'Em Uso'}
                  </span>
                </div>

                {/* INFORMAÇÕES */}
                <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
                  <div className="flex items-start md:items-center gap-2 md:gap-3">
                    <User
                      size={14}
                      className={`${atrasada ? 'text-red-400' : 'text-teal-400'} flex-shrink-0 mt-0.5 md:mt-0`}
                    />
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 min-w-0 flex-1">
                      <span className="text-xs md:text-sm font-medium text-slate-200 truncate">
                        {f.responsavel}
                      </span>
                      <span className="text-[8px] md:text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-widest w-fit">
                        {f.cargo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <ShieldAlert
                      size={14}
                      className={`${atrasada ? 'text-red-400/60' : 'text-slate-600'} flex-shrink-0`}
                    />
                    <span className="text-xs md:text-xs text-slate-500 break-words">
                      Retirada em{" "}
                      <span className="text-slate-300 font-medium">
                        {f.horaRetirada}
                      </span>
                    </span>
                  </div>
                </div>

                {/* FOOTER COM BOTÃO */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 md:pt-4 border-t border-slate-700/30">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-1">
                      <Clock size={10} /> Tempo fora
                    </div>
                    <span
                      className={`text-xl md:text-2xl font-bold block ${atrasada ? 'text-red-400' : 'text-teal-400'}`}
                    >
                      {f.tempoForaLabel || f.tempoFora}
                    </span>
                  </div>

                  <button
                    onClick={() => abrirModal(f)}
                    className="flex items-center justify-center gap-1 md:gap-2 w-full md:w-auto px-3 md:px-4 py-2 rounded-lg text-xs md:text-xs font-bold border transition-all duration-200 bg-white/5 text-slate-400 border-slate-700/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 cursor-pointer flex-shrink-0"
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