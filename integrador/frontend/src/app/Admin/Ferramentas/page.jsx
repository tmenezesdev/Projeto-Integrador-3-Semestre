'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useCallback } from 'react';
import { Wrench, Search, Plus, Pencil, Trash2, Loader2, AlertCircle, X } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';

const API = BASE_URL + '/api/admin/ferramentas';
const token = () => localStorage.getItem('smartbench_token');
const STATUS_OPTS = ['DISPONIVEL', 'EM_USO', 'MANUTENCAO'];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#13102a] border border-[#7033ff]/20 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#7033ff]/10">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="cursor-pointer text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "h-10 w-full rounded-lg border border-[#7033ff]/20 bg-[#0a0a12] px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all placeholder:text-slate-600";

const statusColor = (s) => {
  if (s === 'DISPONIVEL') return 'bg-green-500/10 text-green-400 border-green-900/50';
  if (s === 'EM_USO') return 'bg-[#7033ff]/10 text-[#7033ff] border-[#7033ff]/20';
  return 'bg-red-500/10 text-red-400 border-red-900/50';
};

export default function AdminFerramentas() {
  const [ferramentas, setFerramentas] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalDeletar, setModalDeletar] = useState(null);
  const [form, setForm] = useState({ nome: '', tag_rfid: '', peso_referencia: '', status: 'DISPONIVEL' });
  const [saving, setSaving] = useState(false);
  const [formErro, setFormErro] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFerramentas(data.dados ?? data);
    } catch { setErro(true); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtradas = ferramentas.filter(f =>
    f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.tag_rfid?.toLowerCase().includes(busca.toLowerCase())
  );

  const resetForm = () => { setForm({ nome: '', tag_rfid: '', peso_referencia: '', status: 'DISPONIVEL' }); setFormErro(''); };

  const handleCriar = async () => {
    if (!form.nome || !form.tag_rfid) return setFormErro('Nome e tag RFID são obrigatórios.');
    setSaving(true); setFormErro('');
    const payload = { nome: form.nome, tag_rfid: form.tag_rfid, status: form.status };
    if (form.peso_referencia) payload.peso_referencia = parseFloat(form.peso_referencia);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return setFormErro(data.erro || 'Erro ao criar.');
      setModalCriar(false); resetForm(); load();
    } catch { setFormErro('Erro de conexão.'); }
    finally { setSaving(false); }
  };

  const handleEditar = async () => {
    if (!form.nome || !form.tag_rfid) return setFormErro('Nome e tag RFID são obrigatórios.');
    setSaving(true); setFormErro('');
    const payload = { nome: form.nome, tag_rfid: form.tag_rfid, status: form.status };
    if (form.peso_referencia !== '') payload.peso_referencia = parseFloat(form.peso_referencia);
    try {
      const res = await fetch(`${API}/${modalEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return setFormErro(data.erro || 'Erro ao atualizar.');
      setModalEditar(null); resetForm(); load();
    } catch { setFormErro('Erro de conexão.'); }
    finally { setSaving(false); }
  };

  const handleDeletar = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${modalDeletar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (!res.ok) return setFormErro(data.erro || 'Erro ao excluir.');
      setModalDeletar(null); load();
    } catch { setFormErro('Erro de conexão.'); }
    finally { setSaving(false); }
  };

  const openEditar = (f) => {
    setForm({ nome: f.nome, tag_rfid: f.tag_rfid, peso_referencia: f.peso_referencia ?? '', status: f.status });
    setFormErro('');
    setModalEditar(f);
  };

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Wrench size={32} className="text-[#7033ff]" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas</h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">Gerencie o inventário de ferramentas.</p>
        </div>
        <Sk className="h-10 w-36 rounded-lg" />
      </header>
      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10">
          <Sk className="h-10 w-72 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['Nome', 'Tag RFID', 'Peso Ref.', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(10).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-[#7033ff]/5">
                  <td className="px-5 py-3"><Sk className="h-4 w-36" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-24" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-16" /></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-24 rounded-full" /></td>
                  <td className="px-5 py-3"><Sk className="h-7 w-16 rounded-lg" /></td>
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
    <div className="p-8 font-sans">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Wrench size={32} className="text-[#7033ff]" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold tracking-tight text-white">Ferramentas</h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">Gerencie o inventário de ferramentas.</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalCriar(true); }}
          className="cursor-pointer flex items-center gap-2 bg-[#7033ff] hover:bg-[#5a28cc] text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Nova Ferramenta
        </button>
      </header>

      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou tag RFID..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#7033ff]/20 bg-[#0a0a12] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['Nome', 'Tag RFID', 'Peso Ref.', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.id} className="border-b border-[#7033ff]/5 hover:bg-[#7033ff]/5 transition-colors">
                  <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{f.nome}</td>
                  <td className="px-5 py-3 font-mono text-slate-400 whitespace-nowrap">{f.tag_rfid}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{f.peso_referencia ? `${f.peso_referencia}g` : '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold border ${statusColor(f.status)}`}>{f.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEditar(f)} className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-[#7033ff] hover:bg-[#7033ff]/10 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => { setFormErro(''); setModalDeletar(f); }} className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-600">Nenhuma ferramenta encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar */}
      {modalCriar && (
        <Modal title="Nova Ferramenta" onClose={() => { setModalCriar(false); resetForm(); }}>
          <div className="flex flex-col gap-4">
            <Field label="Nome"><input className={inputCls} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Chave de Fenda" /></Field>
            <Field label="Tag RFID"><input className={inputCls} value={form.tag_rfid} onChange={e => setForm(f => ({ ...f, tag_rfid: e.target.value.toUpperCase() }))} placeholder="RFID001" /></Field>
            <Field label="Peso Referência (g)"><input className={inputCls} type="number" value={form.peso_referencia} onChange={e => setForm(f => ({ ...f, peso_referencia: e.target.value }))} placeholder="Opcional" /></Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            {formErro && <p className="text-xs text-red-400">{formErro}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setModalCriar(false); resetForm(); }} className="cursor-pointer flex-1 h-10 rounded-lg border border-[#7033ff]/20 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleCriar} disabled={saving} className="cursor-pointer flex-1 h-10 rounded-lg bg-[#7033ff] hover:bg-[#5a28cc] text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Criar'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Editar */}
      {modalEditar && (
        <Modal title={`Editar — ${modalEditar.nome}`} onClose={() => { setModalEditar(null); resetForm(); }}>
          <div className="flex flex-col gap-4">
            <Field label="Nome"><input className={inputCls} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></Field>
            <Field label="Tag RFID"><input className={inputCls} value={form.tag_rfid} onChange={e => setForm(f => ({ ...f, tag_rfid: e.target.value.toUpperCase() }))} /></Field>
            <Field label="Peso Referência (g)"><input className={inputCls} type="number" value={form.peso_referencia} onChange={e => setForm(f => ({ ...f, peso_referencia: e.target.value }))} placeholder="Opcional" /></Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            {formErro && <p className="text-xs text-red-400">{formErro}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setModalEditar(null); resetForm(); }} className="cursor-pointer flex-1 h-10 rounded-lg border border-[#7033ff]/20 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleEditar} disabled={saving} className="cursor-pointer flex-1 h-10 rounded-lg bg-[#7033ff] hover:bg-[#5a28cc] text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Salvar'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Deletar */}
      {modalDeletar && (
        <Modal title="Confirmar Exclusão" onClose={() => setModalDeletar(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-300">
              Deseja excluir <strong className="text-white">{modalDeletar.nome}</strong>? Ferramentas com histórico de transações não podem ser excluídas.
            </p>
            {formErro && <p className="text-xs text-red-400">{formErro}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => setModalDeletar(null)} className="cursor-pointer flex-1 h-10 rounded-lg border border-[#7033ff]/20 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleDeletar} disabled={saving} className="cursor-pointer flex-1 h-10 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Excluir'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}