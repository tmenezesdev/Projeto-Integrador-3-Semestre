'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect } from 'react';
import {
  Loader2, AlertCircle, Wrench, Users, Activity,
  AlertOctagon, ArrowUpRight, CheckCircle2,
  BarChart3, TrendingUp, Clock,
} from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import ModalInventario  from '@/components/ModaisVisaoGeral/ModalInventario';
import ModalEmUso       from '@/components/ModaisVisaoGeral/ModalEmUso';
import ModalAtrasadas   from '@/components/ModaisVisaoGeral/ModalAtrasadas';
import ModalAlertas     from '@/components/ModaisVisaoGeral/ModalAlertas';
import ModalTransacoes  from '@/components/ModaisVisaoGeral/ModalTransacoes';
import ModalMecanicos   from '@/components/ModaisVisaoGeral/ModalMecanicos';
import ModalTaxaPrazo   from '@/components/ModaisVisaoGeral/ModalTaxaPrazo';
import { useAuth } from '@/hooks/useAuth';

const API = BASE_URL + '/api/supervisor';

function KpiCard({ label, value, accent, sub, icon: Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0f1a35] border border-teal-500/10 rounded-lg md:rounded-xl p-4 md:p-5 flex flex-col gap-2 md:gap-3 shadow-lg cursor-pointer hover:border-teal-500/30 hover:bg-[#112040] transition-all group"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`w-8 md:w-9 h-8 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center ${accent ?? 'bg-teal-500/10 border border-teal-500/20'}`}>
          <Icon size={16} className="text-teal-400" />
        </div>
      </div>
      <span className="text-2xl md:text-4xl font-black text-white">{value ?? '—'}</span>
      {sub && (
        <span className="text-[10px] md:text-xs text-slate-600 flex items-center gap-1">
          {sub}
          <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
        </span>
      )}
    </div>
  );
}

function StatBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-bold text-white">
          {value} <span className="text-slate-600 font-normal">/ {max}</span>
        </span>
      </div>
      <div className="h-1.5 bg-teal-500/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SupervisorVisaoGeral() {
  const { getToken, getUser } = useAuth();
  const [kpis,         setKpis]         = useState(null);
  const [ferramentas,  setFerramentas]  = useState([]);
  const [alertas,      setAlertas]      = useState([]);
  const [historico,    setHistorico]    = useState([]);
  const [nomeUsuario,  setNomeUsuario]  = useState('');
  const [isLoading,    setIsLoading]    = useState(true);
  const [erro,         setErro]         = useState(false);
  const [periodo,      setPeriodo]      = useState(15);
  const [fluxo,        setFluxo]        = useState([]);
  const [fluxoLoading, setFluxoLoading] = useState(false);

  const [modalAberto,  setModalAberto]  = useState(null);
  const [todasFerr,    setTodasFerr]    = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    setNomeUsuario(getUser().nome?.split(' ')[0] || '');

    const load = async () => {
      try {
        const h = { Authorization: `Bearer ${getToken()}` };
        const [ferrRes, alertRes, dashRes, histRes] = await Promise.all([
          fetch(`${API}/ferramentas-fora`, { headers: h }),
          fetch(`${API}/alertas`,          { headers: h }),
          fetch(`${API}/visaogeral`,       { headers: h }),
          fetch(`${API}/historico`,        { headers: h }),
        ]);
        if (!dashRes.ok) throw new Error();
        const ferr  = await ferrRes.json();
        const alert = await alertRes.json();
        const dash  = await dashRes.json();
        const hist  = await histRes.json();

        setFerramentas(Array.isArray(ferr)  ? ferr  : ferr.dados  ?? []);
        setAlertas(Array.isArray(alert) ? alert : alert.dados ?? []);
        setKpis(dash.dados ?? dash);

        const transacoesHoje = (Array.isArray(hist) ? hist : hist.dados ?? [])
          .filter(t => Number(t.ehHoje) === 1);
        setHistorico(transacoesHoje);
      } catch { setErro(true); }
      finally  { setIsLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const fetchFluxo = async () => {
      setFluxoLoading(true);
      try {
        const r = await fetch(`${API}/fluxo-movimentacoes?periodo=${periodo}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await r.json();
        setFluxo(json.dados ?? []);
      } catch {}
      finally { setFluxoLoading(false); }
    };
    fetchFluxo();
  }, [periodo]);

  const abrirModal = async (tipo) => {
    setModalAberto(tipo);
    if (tipo === 'total' && todasFerr.length === 0) {
      setLoadingModal(true);
      try {
        const r = await fetch(`${API}/ferramentas`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await r.json();
        setTodasFerr(json.dados ?? []);
      } catch {}
      finally { setLoadingModal(false); }
    }
  };

  const fecharModal = () => setModalAberto(null);

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  const emUso         = ferramentas.filter(f => f.statusAlerta === 'EM_USO');
  const atrasadas     = ferramentas.filter(f => f.statusAlerta === 'ATRASADA');
  const alertAtivos   = alertas.filter(a => a.status_alerta === 'ATIVO');
  const totalFerr     = kpis?.totalFerramentas ?? 0;
  const mecanicosAtivos = [...new Set(
    historico.filter(t => t.cargo === 'MECANICO').map(t => t.responsavel)
  )].length;

  if (isLoading) return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen font-sans overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-10">
        <div className="flex flex-col gap-2">
          <Sk className="h-3 w-40" />
          <Sk className="h-7 md:h-8 w-48 md:w-64" />
          <Sk className="h-3 w-28 md:w-32" />
        </div>
        <Sk className="h-7 w-32 rounded-full flex-shrink-0" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-[#0f1a35] border border-teal-500/10 rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col gap-2 md:gap-3">
            <div className="flex items-center justify-between">
              <Sk className="h-3 w-20 md:w-24" />
              <Sk className="w-8 md:w-9 h-8 md:h-9 rounded-lg md:rounded-xl" />
            </div>
            <Sk className="h-8 md:h-10 w-12 md:w-16" />
            <Sk className="h-3 w-16 md:w-20" />
          </div>
        ))}
      </div>
    </main>
  );

  if (erro) return (
    <main className="flex-1 flex items-center justify-center min-h-screen bg-[#09090A]">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar dashboard</p>
      </div>
    </main>
  );

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen font-sans overflow-y-auto">

      {/* Modais */}
      <ModalInventario
        open={modalAberto === 'total'}
        onClose={fecharModal}
        ferramentas={todasFerr}
        loading={loadingModal}
      />
      <ModalEmUso
        open={modalAberto === 'emUso'}
        onClose={fecharModal}
        ferramentas={emUso}
      />
      <ModalAtrasadas
        open={modalAberto === 'atrasadas'}
        onClose={fecharModal}
        ferramentas={atrasadas}
      />
      <ModalAlertas
        open={modalAberto === 'alertas'}
        onClose={fecharModal}
        alertas={alertAtivos}
      />
      <ModalTransacoes
        open={modalAberto === 'transacoes'}
        onClose={fecharModal}
        transacoes={historico}
      />
      <ModalMecanicos
        open={modalAberto === 'mecanicos'}
        onClose={fecharModal}
        transacoes={historico}
      />
      <ModalTaxaPrazo
        open={modalAberto === 'taxaPrazo'}
        onClose={fecharModal}
        total={totalFerr}
        emUso={emUso.length}
        atrasadas={atrasadas.length}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-10">
        <div>
          <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-1">
            Painel do Supervisor
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Olá{nomeUsuario ? `, ${nomeUsuario}` : ''}! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 capitalize">{hoje}</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          <span className="text-teal-400 text-xs font-bold">Bancada Online</span>
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
        <KpiCard label="Total Ferramentas" value={totalFerr}          icon={Wrench}       sub="ver inventário" onClick={() => abrirModal('total')}     />
        <KpiCard label="Em Uso Agora"      value={emUso.length}       icon={TrendingUp}   sub="ver detalhes"   onClick={() => abrirModal('emUso')}     />
        <KpiCard label="Atrasadas"         value={atrasadas.length}   icon={Clock}
          accent="bg-red-500/10 border border-red-500/20"
          sub={atrasadas.length > 0 ? 'ver atrasadas' : 'dentro do prazo'}
          onClick={() => abrirModal('atrasadas')}
        />
        <KpiCard label="Alertas Ativos"    value={alertAtivos.length} icon={AlertOctagon}
          accent="bg-red-500/10 border border-red-500/20"
          sub={alertAtivos.length > 0 ? 'ver alertas' : 'tudo em ordem'}
          onClick={() => abrirModal('alertas')}
        />
      </div>

      {/* KPIs secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
        {[
          { label: 'Transações Hoje',  value: kpis?.transacoesHoje, icon: BarChart3, color: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    modal: 'transacoes' },
          { label: 'Mecânicos Ativos', value: mecanicosAtivos,      icon: Users,     color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', modal: 'mecanicos'  },
          { label: 'Taxa no Prazo',    value: (emUso.length + atrasadas.length) > 0 ? `${Math.round((emUso.length / (emUso.length + atrasadas.length)) * 100)}%` : '100%',
            icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', modal: 'taxaPrazo' },
        ].map(({ label, value, icon: Icon, color, bg, border, modal }) => (
          <div
            key={label}
            onClick={() => abrirModal(modal)}
            className={`${bg} border ${border} rounded-lg md:rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 cursor-pointer hover:brightness-125 transition-all`}
          >
            <div className={`w-10 md:w-11 h-10 md:h-11 rounded-lg md:rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{label}</p>
              <p className={`text-2xl md:text-3xl font-black ${color}`}>{value ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Fluxo */}
      <div className="bg-[#0f1a35] border border-teal-500/10 rounded-lg md:rounded-xl shadow-xl overflow-hidden mb-6">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-teal-500/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Fluxo de Movimentações</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Entradas vs Saídas nos últimos {periodo === 90 ? '3 meses' : `${periodo} dias`}
            </p>
          </div>
          <div className="flex gap-2">
            {[['90', '3 meses'], ['15', '15 dias'], ['7', '7 dias']].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setPeriodo(Number(val))}
                className={`cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  periodo === Number(val)
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-300 hover:text-white bg-teal-500/5 border border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/10'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2 md:px-4 py-4 h-56 md:h-64 lg:h-72">
          {fluxoLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-teal-400 w-6 h-6" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="supGradRet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="supGradDev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#475569" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,0.07)" vertical={false} />
                <XAxis dataKey="data" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(fluxo.length / 6) - 1)} />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0a1628', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '8px', fontSize: 12, padding: '8px 14px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="retiradas"  name="Retiradas"  stroke="#14b8a6" strokeWidth={2}   fill="url(#supGradRet)" dot={false} activeDot={{ r: 4, fill: '#14b8a6', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="devolucoes" name="Devoluções" stroke="#475569" strokeWidth={1.5} fill="url(#supGradDev)" dot={false} activeDot={{ r: 3, fill: '#475569', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Ferramentas fora */}
        <div className="lg:col-span-2 bg-[#0f1a35] border border-teal-500/10 rounded-lg md:rounded-xl shadow-xl overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-teal-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-teal-400" />
              <h2 className="text-sm font-semibold text-white">Ferramentas Fora Agora</h2>
            </div>
            <a href="/Supervisor/Ferramentas-Fora" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
              <span className="hidden sm:inline">Ver todas</span>
              <span className="sm:hidden">Ver</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-teal-500/5">
            {ferramentas.length === 0 ? (
              <div className="px-4 md:px-6 py-8 md:py-10 text-center">
                <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 text-sm">Bancada completa — tudo no lugar!</p>
              </div>
            ) : ferramentas.slice(0, 7).map((f, idx) => {
              const atrasada = f.statusAlerta === 'ATRASADA';
              return (
                <div key={`${f.id}-${f.responsavel}-${idx}`} className="px-4 md:px-6 py-3 md:py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 hover:bg-teal-500/5 transition-colors">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${atrasada ? 'bg-red-400 animate-pulse' : 'bg-teal-400'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{f.ferramenta ?? f.nome}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{f.tagRfid} · {f.responsavel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <span className={`text-sm font-bold ${atrasada ? 'text-red-400' : 'text-teal-400'}`}>{f.tempoForaLabel}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${atrasada ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'}`}>
                      {atrasada ? 'Atrasada' : 'Em Uso'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Distribuição */}
          <div className="bg-[#0f1a35] border border-teal-500/10 rounded-lg md:rounded-xl p-4 md:p-6">
            <h2 className="text-sm font-semibold text-white mb-4 md:mb-5">Distribuição do Inventário</h2>
            <div className="flex flex-col gap-3 md:gap-4">
              <StatBar label="Disponíveis" value={totalFerr - emUso.length - atrasadas.length} max={totalFerr} color="bg-green-500" />
              <StatBar label="Em Uso"      value={emUso.length}                                max={totalFerr} color="bg-teal-500" />
              <StatBar label="Atrasadas"   value={atrasadas.length}                            max={totalFerr} color="bg-red-500"  />
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-[#0f1a35] border border-teal-500/10 rounded-lg md:rounded-xl overflow-hidden flex-1">
            <div className="px-4 md:px-5 py-3 md:py-4 border-b border-teal-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon size={15} className="text-red-400" />
                <h2 className="text-sm font-semibold text-white">Alertas Ativos</h2>
              </div>
              {alertAtivos.length > 0 && (
                <a href="/Supervisor/Atrasos" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
                  <span className="hidden sm:inline">Ver todos</span>
                  <span className="sm:hidden">Ver</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
            <div className="divide-y divide-teal-500/5 max-h-96">
              {alertAtivos.length === 0 ? (
                <div className="px-4 md:px-5 py-6 md:py-8 text-center">
                  <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2 opacity-60" />
                  <p className="text-slate-600 text-xs">Nenhum alerta ativo</p>
                </div>
              ) : alertAtivos.slice(0, 5).map((a) => (
                <div key={a.id} className="px-4 md:px-5 py-3 md:py-3.5 hover:bg-teal-500/5 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{a.ferramenta}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{a.mensagem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}