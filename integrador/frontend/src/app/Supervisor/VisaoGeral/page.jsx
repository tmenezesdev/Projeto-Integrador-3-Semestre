'use client';

import { useState, useEffect } from "react";
import { AlertTriangle, Activity, ArrowUpRight, CheckCircle2, Loader2, BarChart3, Users, Package, AlertCircle, Clock, Wrench } from "lucide-react";

const API = 'http://localhost:3000/api/supervisor';

function KpiCard({ label, value, color = 'teal', sub }) {
  const colors = {
    teal:   { val: 'text-teal-400',   border: 'border-teal-500/20',   bg: 'bg-teal-500/5'   },
    red:    { val: 'text-red-400',    border: 'border-red-500/20',    bg: 'bg-red-500/5'    },
    amber:  { val: 'text-amber-400',  border: 'border-amber-500/20',  bg: 'bg-amber-500/5'  },
    blue:   { val: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-500/5'   },
    green:  { val: 'text-emerald-400',border: 'border-emerald-500/20',bg: 'bg-emerald-500/5'},
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-4xl font-bold ${c.val}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function SupervisorVisaoGeral() {
  const [ferramentas, setFerramentas] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [totalFerramentas, setTotalFerramentas] = useState(null);
  const [transacoesHoje, setTransacoesHoje] = useState(null);
  const [mecanicosAtivos, setMecanicosAtivos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [ferrRes, alertRes, dashRes] = await Promise.all([
          fetch(`${API}/ferramentas-fora`),
          fetch(`${API}/alertas`),
          fetch(`${API}/visãogeral`),
        ]);
        if (ferrRes.ok) setFerramentas(await ferrRes.json());
        if (alertRes.ok) setAlertas(await alertRes.json());
        if (dashRes.ok) {
          const d = await dashRes.json();
          setTotalFerramentas(d.totalFerramentas);
          setTransacoesHoje(d.transacoesHoje);
          setMecanicosAtivos(d.mecanicosAtivos);
        }
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const emUso = ferramentas.filter(f => f.statusAlerta === 'EM_USO').length;
  const atrasadas = ferramentas.filter(f => f.statusAlerta === 'ATRASADA').length;
  const alertasAtivos = alertas.filter(a => a.status_alerta === 'ATIVO');

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#060d1f]">
      <Loader2 className="animate-spin text-teal-400 w-10 h-10" />
    </div>
  );

  if (erro) return (
    <div className="flex items-center justify-center min-h-screen bg-[#060d1f]">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao conectar ao servidor</p>
        <p className="text-slate-500 text-sm mt-1">Verifique se o backend está rodando</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-8 bg-[#060d1f] min-h-screen text-white font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-1">Painel do Supervisor</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Visão Geral da Bancada</h1>
          <p className="text-sm text-slate-500 mt-1">Acompanhe o status físico das ferramentas em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 text-xs font-bold">Bancada Online</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Ferramentas" value={totalFerramentas} color="teal"  sub="no inventário" />
        <KpiCard label="Em Uso Agora"      value={emUso}            color="amber" sub="retiradas" />
        <KpiCard label="Atrasadas"          value={atrasadas}        color="red"   sub="fora do prazo" />
        <KpiCard label="Alertas Ativos"     value={alertasAtivos.length} color="red" sub="pendentes" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* Ferramentas fora */}
        <div className="xl:col-span-2 bg-[#0a1628] border border-slate-700/30 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-teal-400" />
              <h2 className="text-sm font-semibold text-slate-200">Ferramentas Fora Agora</h2>
            </div>
            <a href="/Supervisor/Ferramentas-Fora" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
              Ver todas <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-slate-700/20">
            {ferramentas.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 text-sm">Bancada completa!</p>
              </div>
            ) : ferramentas.slice(0, 5).map((f) => {
              const atrasada = f.statusAlerta === 'ATRASADA';
              return (
                <div key={f.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${atrasada ? 'bg-red-400' : 'bg-teal-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{f.nome}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{f.tagRfid} · {f.responsavel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${atrasada ? 'text-red-400' : 'text-teal-400'}`}>{f.tempoForaLabel}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${atrasada ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'}`}>
                      {atrasada ? 'Atrasada' : 'Em Uso'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-[#0a1628] border border-slate-700/30 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-sm font-semibold text-slate-200">Alertas do Sistema</h2>
          </div>
          <div className="divide-y divide-slate-700/20">
            {alertasAtivos.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 text-xs">Sem alertas ativos</p>
              </div>
            ) : alertasAtivos.slice(0, 5).map((a) => (
              <div key={a.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{a.ferramenta}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{a.mensagem}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Transações Hoje', value: transacoesHoje, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Mecânicos Ativos', value: mecanicosAtivos, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Taxa de Devolução', value: emUso + atrasadas > 0 ? `${Math.round((emUso / (emUso + atrasadas)) * 100)}%` : '100%', icon: Activity, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-5 flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}