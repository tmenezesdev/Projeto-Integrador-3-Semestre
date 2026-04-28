'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Plus, Pencil, Trash2, Loader2, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { Sk } from '@/components/ui/skeleton';

const API = 'http://localhost:3000/api/admin/usuarios';
const token = () => localStorage.getItem('smartbench_token');
const PERFIS = ['MECANICO', 'SUPERVISOR', 'ADMIN'];

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

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalDeletar, setModalDeletar] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', tag_cracha: '', tipo_perfil: 'MECANICO', senha: '' });
  const [showSenha, setShowSenha] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErro, setFormErro] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsuarios(data.dados ?? data);
    } catch { setErro(true); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtrados = usuarios.filter(u =>
    u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    u.email?.toLowerCase().includes(busca.toLowerCase()) ||
    u.tag_cracha?.toLowerCase().includes(busca.toLowerCase())
  );

  const resetForm = () => { setForm({ nome: '', email: '', tag_cracha: '', tipo_perfil: 'MECANICO', senha: '' }); setFormErro(''); setShowSenha(false); };

  const handleCriar = async () => {
    if (!form.nome || !form.email || !form.tag_cracha || !form.senha) return setFormErro('Todos os campos são obrigatórios.');
    setSaving(true); setFormErro('');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setFormErro(data.erro || 'Erro ao criar usuário.');
      setModalCriar(false); resetForm(); load();
    } catch { setFormErro('Erro de conexão.'); }
    finally { setSaving(false); }
  };

  const handleEditar = async () => {
    if (!form.nome || !form.email || !form.tag_cracha) return setFormErro('Nome, email e tag são obrigatórios.');
    setSaving(true); setFormErro('');
    const payload = { nome: form.nome, email: form.email, tag_cracha: form.tag_cracha, tipo_perfil: form.tipo_perfil };
    if (form.senha) payload.senha = form.senha;
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

  const openEditar = (u) => {
    setForm({ nome: u.nome, email: u.email, tag_cracha: u.tag_cracha, tipo_perfil: u.tipo_perfil, senha: '' });
    setFormErro(''); setShowSenha(false);
    setModalEditar(u);
  };

  if (isLoading) return (
    <div className="p-8 font-sans">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users size={32} className="text-[#7033ff]" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold tracking-tight text-white">Usuários</h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">Gerencie todos os usuários do sistema.</p>
        </div>
        <Sk className="h-10 w-32 rounded-lg" />
      </header>
      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10">
          <Sk className="h-10 w-72 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['Nome', 'Email', 'Tag Crachá', 'Perfil', 'Ações'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(10).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-[#7033ff]/5">
                  <td className="px-5 py-3"><Sk className="h-4 w-36" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-48" /></td>
                  <td className="px-5 py-3"><Sk className="h-4 w-20" /></td>
                  <td className="px-5 py-3"><Sk className="h-6 w-20 rounded-full" /></td>
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
        <p className="text-white font-semibold">Erro ao carregar usuários</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 font-sans">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users size={32} className="text-[#7033ff]" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold tracking-tight text-white">Usuários</h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">Gerencie todos os usuários do sistema.</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalCriar(true); }}
          className="cursor-pointer flex items-center gap-2 bg-[#7033ff] hover:bg-[#5a28cc] text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Novo Usuário
        </button>
      </header>

      <div className="bg-[#13102a] border border-[#7033ff]/10 rounded-xl shadow-xl">
        <div className="p-4 border-b border-[#7033ff]/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou tag..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#7033ff]/20 bg-[#0a0a12] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[#7033ff]/10">
                {['Nome', 'Email', 'Tag Crachá', 'Perfil', 'Ações'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id} className="border-b border-[#7033ff]/5 hover:bg-[#7033ff]/5 transition-colors">
                  <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{u.nome}</td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{u.email}</td>
                  <td className="px-5 py-3 font-mono text-slate-400 whitespace-nowrap">{u.tag_cracha}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold border ${
                      u.tipo_perfil === 'ADMIN' ? 'bg-[#7033ff]/10 text-[#7033ff] border-[#7033ff]/20' :
                      u.tipo_perfil === 'SUPERVISOR' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>{u.tipo_perfil}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEditar(u)} className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-[#7033ff] hover:bg-[#7033ff]/10 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => { setFormErro(''); setModalDeletar(u); }} className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-600">Nenhum usuário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar */}
      {modalCriar && (
        <Modal title="Novo Usuário" onClose={() => { setModalCriar(false); resetForm(); }}>
          <div className="flex flex-col gap-4">
            <Field label="Nome">
              <input className={inputCls} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" />
            </Field>
            <Field label="Email">
              <input className={inputCls} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
            </Field>
            <Field label="Tag Crachá">
              <input className={inputCls} value={form.tag_cracha} onChange={e => setForm(f => ({ ...f, tag_cracha: e.target.value.toUpperCase() }))} placeholder="TAG001" />
            </Field>
            <Field label="Perfil">
              <select className={inputCls} value={form.tipo_perfil} onChange={e => setForm(f => ({ ...f, tipo_perfil: e.target.value }))}>
                {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Senha">
              <div className="relative">
                <input className={`${inputCls} pr-10`} type={showSenha ? 'text' : 'password'} value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} placeholder="Mínimo 6 caracteres" />
                <button type="button" onClick={() => setShowSenha(s => !s)} className="cursor-pointer absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            {formErro && <p className="text-xs text-red-400">{formErro}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setModalCriar(false); resetForm(); }} className="cursor-pointer flex-1 h-10 rounded-lg border border-[#7033ff]/20 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleCriar} disabled={saving} className="cursor-pointer flex-1 h-10 rounded-lg bg-[#7033ff] hover:bg-[#5a28cc] text-black font-semibold text-sm transition-colors disabled:opacity-50">
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
            <Field label="Nome">
              <input className={inputCls} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            </Field>
            <Field label="Email">
              <input className={inputCls} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </Field>
            <Field label="Tag Crachá">
              <input className={inputCls} value={form.tag_cracha} onChange={e => setForm(f => ({ ...f, tag_cracha: e.target.value.toUpperCase() }))} />
            </Field>
            <Field label="Perfil">
              <select className={inputCls} value={form.tipo_perfil} onChange={e => setForm(f => ({ ...f, tipo_perfil: e.target.value }))}>
                {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Nova Senha (opcional)">
              <div className="relative">
                <input className={`${inputCls} pr-10`} type={showSenha ? 'text' : 'password'} value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} placeholder="Deixe em branco para manter" />
                <button type="button" onClick={() => setShowSenha(s => !s)} className="cursor-pointer absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            {formErro && <p className="text-xs text-red-400">{formErro}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setModalEditar(null); resetForm(); }} className="cursor-pointer flex-1 h-10 rounded-lg border border-[#7033ff]/20 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleEditar} disabled={saving} className="cursor-pointer flex-1 h-10 rounded-lg bg-[#7033ff] hover:bg-[#5a28cc] text-black font-semibold text-sm transition-colors disabled:opacity-50">
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
              Tem certeza que deseja excluir <strong className="text-white">{modalDeletar.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            {formErro && <p className="text-xs text-red-400">{formErro}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => setModalDeletar(null)} className="cursor-pointer flex-1 h-10 rounded-lg border border-[#7033ff]/20 text-slate-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleDeletar} disabled={saving} className="cursor-pointer flex-1 h-10 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Excluir'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}