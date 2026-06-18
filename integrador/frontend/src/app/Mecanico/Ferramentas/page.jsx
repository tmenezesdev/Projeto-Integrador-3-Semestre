'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useCallback } from 'react';
import { Wrench, Search, AlertCircle, X, Clock, User, Hash, Timer, PackageCheck, RotateCcw, CreditCard, Loader2 } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

const BASE = BASE_URL + '/api/mecanico';

const statusColor = (s) => {
  if (s === 'DISPONIVEL') return 'bg-green-500/10 text-green-400 border-green-900/50';
  if (s === 'EM_USO')     return 'bg-orange-500/10 text-orange-400 border-orange-900/50';
  return                         'bg-red-500/10 text-red-400 border-red-900/50';
};

const statusLabel = (s) => {
  if (s === 'DISPONIVEL') return 'Disponível';
  if (s === 'EM_USO')     return 'Em Uso';
  return 'Manutenção';
};

function ModalDetalhe({ ferramenta, onClose }) {
  if (!ferramenta) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1000] border border-amber-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Wrench size={18} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white leading-tight">{ferramenta.nome}</h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{ferramenta.tag_rfid}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="mb-5">
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${statusColor(ferramenta.status)}`}>
            {statusLabel(ferramenta.status)}
          </span>
        </div>
        {ferramenta.status === 'EM_USO' && ferramenta.responsavel ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
              <User size={14} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Responsável</p>
                <p className="text-sm font-semibold text-white">{ferramenta.responsavel}</p>
                <p className="text-xs text-slate-500">{ferramenta.cargo}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={11} className="text-amber-400" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Retirada</p>
                </div>
                <p className="text-xs font-medium text-slate-300">{ferramenta.horaRetirada}</p>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Timer size={11} className="text-amber-400" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tempo fora</p>
                </div>
                <p className="text-xs font-bold text-amber-400">{ferramenta.tempoForaLabel ?? '—'}</p>
              </div>
            </div>
          </div>
        ) : ferramenta.status === 'EM_USO' ? (
          <p className="text-sm text-slate-500 text-center py-4">Informações do responsável não disponíveis.</p>
        ) : (
          <p className="text-sm text-green-400 text-center py-4">Ferramenta disponível para retirada.</p>
        )}
        {ferramenta.peso_referencia && (
          <div className="mt-4 pt-4 border-t border-amber-500/10 flex items-center gap-2 text-xs text-slate-500">
            <Hash size={11} className="text-amber-400" />
            Peso referência: <span className="text-slate-300 font-medium">{ferramenta.peso_referencia}g</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalDevolucao({ item, cracha, setCracha, onClose, onConfirm, loading, erro }) {
  if (!item) return null;
  const podeConfirmar = cracha.trim().length > 0 && !loading;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1000] border border-amber-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <RotateCcw size={18} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white leading-tight">Devolver ferramenta</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.ferramenta}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Ferramenta</p>
          <p className="text-sm font-semibold text-white">{item.ferramenta}</p>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">{item.tagRfid}</p>
        </div>

        <label className="block mb-1.5 text-xs font-semibold text-slate-300">Crachá do mecânico</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            autoFocus
            value={cracha}
            onChange={(e) => setCracha(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && podeConfirmar) onConfirm(); }}
            placeholder="Digite o crachá"
            className="h-10 w-full rounded-lg border border-amber-500/20 bg-[#0f0900] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
          Normalmente lido pelo leitor RFID/IoT — como ainda não está integrado, digite o crachá manualmente.
        </p>

        {erro && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle size={13} className="flex-shrink-0" /> {erro}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-amber-500/20 text-slate-300 text-sm font-semibold hover:bg-amber-500/5 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!podeConfirmar}
            className="flex-1 h-10 rounded-lg bg-amber-500 text-[#1a1000] text-sm font-bold hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={15} />}
            Confirmar devolução
          </button>
        </div>
      </div>
    </div>
  );
}

function CardMinhaFerramenta({ item, onDevolver }) {
  const atrasada = item.statusAlerta === 'ATRASADA';
  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl border ${atrasada ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${atrasada ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
            <Wrench size={14} className={atrasada ? 'text-red-400' : 'text-orange-400'} />
          </div>
          <p className="text-sm font-semibold text-white truncate">{item.ferramenta}</p>
        </div>
        {atrasada && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold flex-shrink-0">
            ATRASADA
          </span>
        )}
      </div>

      {/* Responsável */}
      {item.responsavel && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20">
          <User size={12} className="text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Responsável</p>
            <p className="text-xs font-semibold text-white">{item.responsavel}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Retirada</p>
          <p className="text-xs font-medium text-slate-300">{item.horaRetirada}</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Tempo fora</p>
          <p className={`text-xs font-bold ${atrasada ? 'text-red-400' : 'text-orange-400'}`}>
            {item.tempoForaLabel}
          </p>
        </div>
      </div>
      <p className="text-[11px] font-mono text-slate-600">{item.tagRfid}</p>

      <button
        onClick={() => onDevolver(item)}
        className="mt-1 w-full h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <RotateCcw size={15} /> Devolver
      </button>
    </div>
  );
}

export default function MecanicoFerramentas() {
  const { getToken } = useAuth();
  const [ferramentas, setFerramentas] = useState([]);
  const [minhasRetiradas, setMinhasRetiradas] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [selecionada, setSelecionada] = useState(null);

  const [devolvendo, setDevolvendo] = useState(null);
  const [crachaInput, setCrachaInput] = useState('');
  const [loadingDev, setLoadingDev] = useState(false);
  const [erroDev, setErroDev] = useState('');

  const carregar = useCallback(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    Promise.all([
      fetch(`${BASE}/ferramentas`,      { headers }).then(r => r.json()),
      fetch(`${BASE}/minhas-retiradas`, { headers }).then(r => r.json()),
    ])
      .then(([ferrRes, retRes]) => {
        setFerramentas(ferrRes.dados ?? []);
        setMinhasRetiradas(retRes.dados ?? []);
        setErro(false);
      })
      .catch(() => setErro(true))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  useEffect(() => {
    carregar();
    const intervalo = setInterval(carregar, 15000);
    return () => clearInterval(intervalo);
  }, [carregar]);

  const abrirDevolucao = (item) => { setDevolvendo(item); setCrachaInput(''); setErroDev(''); };
  const fecharDevolucao = () => {
    if (loadingDev) return;
    setDevolvendo(null); setCrachaInput(''); setErroDev('');
  };
  const confirmarDevolucao = async () => {
    if (!devolvendo) return;
    setLoadingDev(true);
    setErroDev('');
    try {
      const r = await fetch(`${BASE}/devolucao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ferramentaId: devolvendo.id, tagCracha: crachaInput }),
      });
      const json = await r.json();
      if (!r.ok || !json.sucesso) {
        setErroDev(json.erro || 'Erro ao registrar devolução.');
        return;
      }
      setDevolvendo(null);
      setCrachaInput('');
      carregar();
    } catch {
      setErroDev('Erro de conexão. Tente novamente.');
    } finally {
      setLoadingDev(false);
    }
  };

  const filtradas = ferramentas.filter(f =>
    f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.tag_rfid?.toLowerCase().includes(busca.toLowerCase())
  );

  const disponiveis = ferramentas.filter(f => f.status === 'DISPONIVEL').length;
  const manutencao  = ferramentas.filter(f => f.status === 'MANUTENCAO').length;

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Wrench size={32} className="text-amber-400" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Inventário completo da bancada.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-3">
            <Sk className="h-3 w-24" /><Sk className="h-10 w-14" />
          </div>
        ))}
      </div>
      <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-amber-500/10"><Sk className="h-10 w-72 rounded-lg" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-amber-500/10">
                {['Nome', 'Tag RFID', 'Peso Ref.', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(10).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-amber-500/5">
                  <td className="px-5 py-3"><Sk className="h-4 w-36" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-24" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-16" /></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-24 rounded-full" /></td>
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
        <p className="text-white font-semibold">Erro ao carregar ferramentas</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-8 font-sans">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Wrench size={32} className="text-amber-400" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas</h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">Inventário completo da bancada.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Disponíveis</span>
            <p className="text-4xl font-black text-green-400 mt-2">{disponiveis}</p>
          </div>
          <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Minhas em uso</span>
            <p className="text-4xl font-black text-orange-400 mt-2">{minhasRetiradas.length}</p>
            <p className="text-[11px] text-slate-600 mt-1">retiradas por você</p>
          </div>
          <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Manutenção</span>
            <p className="text-4xl font-black text-red-400 mt-2">{manutencao}</p>
          </div>
        </div>

        {minhasRetiradas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <PackageCheck size={18} className="text-orange-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Ferramentas que estou usando agora
              </h2>
              <span className="ml-auto text-[11px] text-slate-600">Atualiza a cada 15s</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {minhasRetiradas.map((item) => (
                <CardMinhaFerramenta key={item.id} item={item} onDevolver={abrirDevolucao} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl shadow-xl">
          <div className="p-4 border-b border-amber-500/10 flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou tag RFID..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-10 w-full rounded-lg border border-amber-500/20 bg-[#0f0900] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Clique em <span className="text-orange-400 font-semibold">Em Uso</span> para ver responsável
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-amber-500/10">
                  {['Nome', 'Tag RFID', 'Peso Ref.', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((f) => {
                  const clicavel = f.status === 'EM_USO';
                  return (
                    <tr
                      key={f.id}
                      onClick={() => clicavel && setSelecionada(f)}
                      className={`border-b border-amber-500/5 transition-colors ${clicavel ? 'cursor-pointer hover:bg-orange-500/5' : 'hover:bg-amber-500/5'}`}
                    >
                      <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{f.nome}</td>
                      <td className="px-5 py-3 font-mono text-slate-400 whitespace-nowrap">{f.tag_rfid}</td>
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                        {f.peso_referencia ? `${f.peso_referencia}g` : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold border ${statusColor(f.status)}`}>
                          {statusLabel(f.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtradas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-600">Nenhuma ferramenta encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalDetalhe ferramenta={selecionada} onClose={() => setSelecionada(null)} />

      <ModalDevolucao
        item={devolvendo}
        cracha={crachaInput}
        setCracha={setCrachaInput}
        onClose={fecharDevolucao}
        onConfirm={confirmarDevolucao}
        loading={loadingDev}
        erro={erroDev}
      />
    </>
  );
}