'use client';

import { useState, useEffect } from 'react';
import { Settings, Loader2, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';

const API = 'http://localhost:3000/api/admin/configuracoes';
const token = () => localStorage.getItem('smartbench_token');

function Field({ label, description, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      {children}
    </div>
  );
}

export default function AdminConfiguracoes() {
  const [config, setConfig] = useState({ tempo_limite_horas: 8, tempo_aviso_minutos: 30, modo_manutencao: false });
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [saving, setSaving] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [saveErro, setSaveErro] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const cfg = data.dados ?? data;
        setConfig({
          tempo_limite_horas: cfg.tempo_limite_horas ?? 8,
          tempo_aviso_minutos: cfg.tempo_aviso_minutos ?? 30,
          modo_manutencao: cfg.modo_manutencao === 1 || cfg.modo_manutencao === true,
        });
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const handleSalvar = async () => {
    setSaving(true); setSaveErro(''); setSalvo(false);
    try {
      const res = await fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) return setSaveErro(data.erro || 'Erro ao salvar.');
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch { setSaveErro('Erro de conexão.'); }
    finally { setSaving(false); }
  };

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={32} className="text-[#7033ff]" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Configurações</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Parâmetros operacionais do sistema SmartBench.</p>
      </header>
      <div className="max-w-xl bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl p-6 flex flex-col gap-6">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Sk className="h-4 w-48" />
            <Sk className="h-3 w-64 mt-0.5" />
            <Sk className="h-10 w-full rounded-lg mt-1" />
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <Sk className="h-4 w-36" />
          <Sk className="h-3 w-56 mt-0.5" />
          <Sk className="h-6 w-12 rounded-full mt-1" />
        </div>
        <div className="border-t border-[#7033ff]/10 pt-4 flex justify-end">
          <Sk className="h-10 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );

  if (erro) return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar configurações</p>
      </div>
    </div>
  );

  const inputCls = "h-10 w-full rounded-lg border border-[#7033ff]/20 bg-[#0a0a12] px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all";

  return (
    <div className="p-8 font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={32} className="text-[#7033ff]" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Configurações</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">Parâmetros operacionais do sistema SmartBench.</p>
      </header>

      <div className="max-w-xl bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl p-6 flex flex-col gap-6">

        <Field label="Tempo Limite de Uso (horas)" description="Ferramentas fora por mais que este tempo geram um alerta.">
          <input
            className={inputCls}
            type="number"
            min={1}
            max={24}
            value={config.tempo_limite_horas}
            onChange={(e) => setConfig(c => ({ ...c, tempo_limite_horas: Number(e.target.value) }))}
          />
        </Field>

        <Field label="Tempo de Aviso (minutos)" description="Minutos antes do limite para enviar aviso antecipado.">
          <input
            className={inputCls}
            type="number"
            min={1}
            max={120}
            value={config.tempo_aviso_minutos}
            onChange={(e) => setConfig(c => ({ ...c, tempo_aviso_minutos: Number(e.target.value) }))}
          />
        </Field>

        <Field label="Modo Manutenção" description="Quando ativado, bloqueia novas retiradas via RFID.">
          <button
            type="button"
            onClick={() => setConfig(c => ({ ...c, modo_manutencao: !c.modo_manutencao }))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${config.modo_manutencao ? 'bg-[#7033ff]' : 'bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${config.modo_manutencao ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className="text-xs text-slate-500 mt-1">{config.modo_manutencao ? 'Ativado' : 'Desativado'}</span>
        </Field>

        <div className="border-t border-[#7033ff]/10 pt-4 flex items-center justify-between gap-4">
          {saveErro && <p className="text-xs text-red-400">{saveErro}</p>}
          {salvo && (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <CheckCircle size={14} /> Configurações salvas!
            </span>
          )}
          {!saveErro && !salvo && <div />}
          <button
            onClick={handleSalvar}
            disabled={saving}
            className="flex items-center gap-2 bg-[#7033ff] hover:bg-[#5a28cc] text-black text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
