'use client';

import { useState, useEffect } from 'react';
import {
  Loader2, AlertCircle, Wrench, Users, Activity,
  AlertOctagon, Clock, ArrowUpRight, CheckCircle2,
  BarChart3, ShieldCheck, TrendingUp,
} from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const API   = 'http://localhost:3000/api/admin';
const token = () => localStorage.getItem('smartbench_token');

function KpiCard({ label, value, icon: Icon, accent, sub }) {
  return (
    <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-5 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? 'bg-[#7033ff]/10 border border-[#7033ff]/20'}`}>
          <Icon size={17} className="text-[#7033ff]" />
        </div>
      </div>
      <span className="text-4xl font-black text-white">{value ?? '—'}</span>
      {sub && <span className="text-xs text-slate-600">{sub}</span>}
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
      <div className="h-1.5 bg-[#7033ff]/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [kpis,        setKpis]        = useState(null);
  const [historico,   setHistorico]   = useState([]);
  const [alertas,     setAlertas]     = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [isLoading,   setIsLoading]   = useState(true);
  const [erro,        setErro]        = useState(false);
  const [periodo,      setPeriodo]      = useState(15);
  const [fluxo,        setFluxo]        = useState([]);
  const [fluxoLoading, setFluxoLoading] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
      setNomeUsuario(u.nome?.split(' ')[0] || '');
    } catch {}

    const load = async () => {
      try {
        const h = { Authorization: `Bearer ${token()}` };
        const [dashRes, histRes, alertRes] = await Promise.all([
          fetch(`${API}/dashboard`, { headers: h }),
          fetch(`${API}/historico`, { headers: h }),
          fetch(`${API}/alertas`,   { headers: h }),
        ]);
        if (!dashRes.ok) throw new Error();
        const d = await dashRes.json();
        const hist  = await histRes.json();
        const alert = await alertRes.json();
        setKpis(d.dados ?? d);
        setHistorico((hist.dados  ?? hist).slice(0, 8));
        setAlertas((alert.dados ?? alert).filter(a => a.status_alerta === 'ATIVO').slice(0, 6));
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
          headers: { Authorization: `Bearer ${token()}` },
        });
        const json = await r.json();
        setFluxo(json.dados ?? []);
      } catch {}
      finally { setFluxoLoading(false); }
    };
    fetchFluxo();
  }, [periodo]);

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  if (isLoading) return (
    <div className="p-8 font-sans min-h-full">
      <div className="flex items-start justify-between mb-10">
        <div className="flex flex-col gap-2">
          <Sk className="h-3 w-40" />
          <Sk className="h-8 w-64" />
          <Sk className="h-3 w-32" />
        </div>
        <Sk className="h-7 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Sk className="h-3 w-24" />
              <Sk className="w-9 h-9 rounded-xl" />
            </div>
            <Sk className="h-10 w-16" />
            <Sk className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-5 flex items-center gap-4">
            <Sk className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Sk className="h-3 w-32" />
              <Sk className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#7033ff]/10 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <Sk className="h-4 w-40" />
            <Sk className="h-3 w-56" />
          </div>
          <div className="flex gap-2">
            {Array(3).fill(0).map((_, i) => <Sk key={i} className="h-7 w-16 rounded-lg" />)}
          </div>
        </div>
        <Sk className="mx-4 my-4 h-[230px] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#7033ff]/10">
            <Sk className="h-4 w-36" />
          </div>
          <div className="divide-y divide-[#7033ff]/5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sk className="w-2 h-2 rounded-full flex-shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Sk className="h-4 w-32" />
                    <Sk className="h-3 w-44" />
                  </div>
                </div>
                <Sk className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-6">
            <Sk className="h-4 w-44 mb-5" />
            <div className="flex flex-col gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <Sk className="h-3 w-20" />
                    <Sk className="h-3 w-12" />
                  </div>
                  <Sk className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-[#7033ff]/10">
              <Sk className="h-4 w-28" />
            </div>
            <div className="divide-y divide-[#7033ff]/5">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="px-5 py-3.5">
                  <div className="flex items-start gap-2.5">
                    <Sk className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Sk className="h-3 w-28" />
                      <Sk className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (erro) return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar dashboard</p>
      </div>
    </div>
  );

  const totalFerr = kpis?.totalFerramentas ?? 0;
  const emUso     = kpis?.ferramentasEmUso ?? 0;
  const manut     = kpis?.ferramentasManutencao ?? 0;
  const disp      = totalFerr - emUso - manut;

  return (
    <div className="p-8 font-sans min-h-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#7033ff' }}>
            Painel Administrativo
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Olá{nomeUsuario ? `, ${nomeUsuario}` : ''}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 capitalize">{hoje}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#7033ff]/10 border border-[#7033ff]/20 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7033ff] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7033ff]" />
          </span>
          <span className="text-[#a87fff] text-xs font-bold">Sistema Online</span>
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <KpiCard label="Total Ferramentas" value={totalFerr}           icon={Wrench}      sub="no inventário" />
        <KpiCard label="Total Usuários"     value={kpis?.totalUsuarios} icon={Users}       sub="cadastrados" />
        <KpiCard label="Transações Hoje"    value={kpis?.transacoesHoje} icon={Activity}   sub="movimentações" />
        <KpiCard label="Alertas Ativos"     value={kpis?.alertasAtivos}  icon={AlertOctagon}
          accent="bg-red-500/10 border border-red-500/20"
          sub={kpis?.alertasAtivos > 0 ? 'requer atenção' : 'tudo em ordem'}
        />
      </div>

      {/* KPIs secundários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Ferramentas em Uso',   value: emUso,                icon: TrendingUp,  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
          { label: 'Em Manutenção',         value: manut,                icon: Clock,       color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20'     },
          { label: 'Mecânicos Ativos Hoje', value: kpis?.mecanicosAtivos, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{label}</p>
              <p className={`text-3xl font-black ${color}`}>{value ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Fluxo */}
      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#7033ff]/10 flex items-center justify-between">
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
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  periodo === Number(val)
                    ? 'bg-[#7033ff] text-white shadow-lg shadow-[#7033ff]/20'
                    : 'text-slate-500 hover:text-slate-300 bg-[#7033ff]/5 border border-[#7033ff]/10'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2 py-4 h-[230px]">
          {fluxoLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-[#7033ff] w-6 h-6" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminGradRet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7033ff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#7033ff" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="adminGradDev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#475569" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(112,51,255,0.07)" vertical={false} />
                <XAxis
                  dataKey="data"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={Math.max(0, Math.floor(fluxo.length / 6) - 1)}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1030', border: '1px solid rgba(112,51,255,0.3)', borderRadius: '8px', fontSize: 12, padding: '8px 14px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="retiradas"  name="Retiradas"  stroke="#7033ff" strokeWidth={2}   fill="url(#adminGradRet)" dot={false} activeDot={{ r: 4, fill: '#7033ff', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="devolucoes" name="Devoluções" stroke="#475569" strokeWidth={1.5} fill="url(#adminGradDev)" dot={false} activeDot={{ r: 3, fill: '#475569', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Atividade recente */}
        <div className="xl:col-span-2 bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#7033ff]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#7033ff]" />
              <h2 className="text-sm font-semibold text-white">Atividade Recente</h2>
            </div>
            <a href="/Admin/Historico" className="text-xs text-[#7033ff] hover:text-[#a87fff] flex items-center gap-1 transition-colors">
              Ver tudo <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="divide-y divide-[#7033ff]/5">
            {historico.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 size={28} className="text-slate-700 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">Sem atividade registrada.</p>
              </div>
            ) : historico.map((item) => (
              <div key={item.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#7033ff]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.operacao === 'DEVOLUCAO' ? 'bg-green-400' : 'bg-amber-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{item.ferramenta}</p>
                    <p className="text-[11px] text-slate-500">{item.responsavel} · {item.dataHora}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold border ${
                  item.operacao === 'DEVOLUCAO'
                    ? 'bg-green-500/10 text-green-400 border-green-900/50'
                    : 'bg-orange-500/10 text-orange-400 border-orange-900/50'
                }`}>
                  {item.operacao}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-6">

          {/* Distribuição do inventário */}
          <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-5">Distribuição do Inventário</h2>
            <div className="flex flex-col gap-4">
              <StatBar label="Disponíveis" value={disp}  max={totalFerr} color="bg-green-500" />
              <StatBar label="Em Uso"       value={emUso} max={totalFerr} color="bg-amber-500" />
              <StatBar label="Manutenção"   value={manut} max={totalFerr} color="bg-red-500"   />
            </div>
          </div>

          {/* Alertas ativos */}
          <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-[#7033ff]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon size={15} className="text-red-400" />
                <h2 className="text-sm font-semibold text-white">Alertas Ativos</h2>
              </div>
              {alertas.length > 0 && (
                <a href="/Admin/Alertas" className="text-xs text-[#7033ff] hover:text-[#a87fff] flex items-center gap-1 transition-colors">
                  Ver todos <ArrowUpRight size={12} />
                </a>
              )}
            </div>
            <div className="divide-y divide-[#7033ff]/5">
              {alertas.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2 opacity-60" />
                  <p className="text-slate-600 text-xs">Nenhum alerta ativo</p>
                </div>
              ) : alertas.map((a) => (
                <div key={a.id} className="px-5 py-3.5 hover:bg-[#7033ff]/5 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{a.ferramenta}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{a.mensagem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}