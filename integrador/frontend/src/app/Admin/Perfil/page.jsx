'use client';

import { useState, useEffect, useRef } from 'react';
import {
  UserCircle, Mail, Lock, Eye, EyeOff, Camera, Loader2,
  AlertCircle, CheckCircle2, Shield, Phone, KeyRound,
  CalendarDays, Clock, BadgeCheck, Hash, MapPin,
  Fingerprint, ShieldCheck, Globe, Monitor, Smartphone,
} from 'lucide-react';

const API = 'http://localhost:3000/api/admin/perfil';
const token = () => localStorage.getItem('smartbench_token');

const inputCls = "h-10 w-full rounded-lg border border-slate-200 dark:border-[#7033ff]/20 bg-slate-50 dark:bg-[#0a0a12]/80 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7033ff]/40 focus:border-[#7033ff]/60 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed";

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-[#7033ff]" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-[#7033ff]/5 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#7033ff]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-[#7033ff]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">{value || '—'}</p>
      </div>
      {badge && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
          {badge}
        </span>
      )}
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white dark:bg-[#13102a] border border-slate-200 dark:border-[#7033ff]/10 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 dark:border-[#7033ff]/10">
        <Icon size={15} className="text-[#7033ff]" />
        <h2 className="text-sm font-semibold text-slate-700 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
      ${type === 'ok'
        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400'
        : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'}`}>
      {type === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 30) return `Há ${days} dias`;
  if (days < 365) return `Há ${Math.floor(days / 30)} meses`;
  return `Há ${Math.floor(days / 365)} anos`;
}

function getInitials(nome) {
  if (!nome) return 'A';
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// Dados simulados para sessão e atividades recentes
const sessaoAtual = {
  dispositivo: 'Chrome no Windows',
  ip: '192.168.45.12',
  localizacao: 'São Paulo, Brasil',
  login: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min atrás
};

const atividadesRecentes = [
  {
    acao: 'Login bem-sucedido',
    dispositivo: 'Chrome no Windows',
    ip: '192.168.45.12',
    data: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    acao: 'Alteração de senha',
    dispositivo: 'Firefox no macOS',
    ip: '177.82.10.5',
    data: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 dias atrás
  },
  {
    acao: 'Login bem-sucedido',
    dispositivo: 'Chrome no Android',
    ip: '189.76.23.9',
    data: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export default function AdminPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSenha, setSavingSenha] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [senhaForm, setSenhaForm] = useState({ atual: '', nova: '', confirmar: '' });
  const [showSenha, setShowSenha] = useState({ atual: false, nova: false, confirmar: false });
  const [senhaForca, setSenhaForca] = useState(0);

  const showToast = (msg, type = 'ok') => setToast({ msg, type });

  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(data => {
        setPerfil(data);
        setForm({ nome: data.nome || '', email: data.email || '', telefone: data.telefone || '' });
      })
      .catch(() => showToast('Erro ao carregar perfil.', 'erro'))
      .finally(() => setLoading(false));
  }, []);

  const calcForca = (senha) => {
    let f = 0;
    if (senha.length >= 6) f++;
    if (senha.length >= 10) f++;
    if (/[A-Z]/.test(senha)) f++;
    if (/[0-9]/.test(senha)) f++;
    if (/[^A-Za-z0-9]/.test(senha)) f++;
    return f;
  };

  const forca = calcForca(senhaForm.nova);
  const forcaLabel = ['', 'Muito fraca', 'Fraca', 'Razoável', 'Forte', 'Muito forte'][forca] || '';
  const forcaCor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'][forca] || '';

  const handleSalvarDados = async () => {
    if (!form.nome || !form.email) return showToast('Nome e e-mail são obrigatórios.', 'erro');
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.erro || 'Erro ao salvar.', 'erro');
      setPerfil(p => ({ ...p, ...form }));
      const u = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
      localStorage.setItem('smartbench_user', JSON.stringify({ ...u, nome: form.nome, email: form.email }));
      showToast('Dados atualizados com sucesso!');
    } catch { showToast('Erro de conexão.', 'erro'); }
    finally { setSaving(false); }
  };

  const handleAlterarSenha = async () => {
    if (!senhaForm.atual || !senhaForm.nova || !senhaForm.confirmar)
      return showToast('Preencha todos os campos de senha.', 'erro');
    if (senhaForm.nova !== senhaForm.confirmar)
      return showToast('Nova senha e confirmação não coincidem.', 'erro');
    if (senhaForm.nova.length < 6)
      return showToast('A nova senha deve ter ao menos 6 caracteres.', 'erro');
    setSavingSenha(true);
    try {
      const res = await fetch(`${API}/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ senha_atual: senhaForm.atual, nova_senha: senhaForm.nova }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.erro || 'Erro ao alterar senha.', 'erro');
      setSenhaForm({ atual: '', nova: '', confirmar: '' });
      setSenhaForca(0);
      showToast('Senha alterada com sucesso!');
    } catch { showToast('Erro de conexão.', 'erro'); }
    finally { setSavingSenha(false); }
  };

  const handleFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('A foto deve ter no máximo 2MB.', 'erro');
    setUploadingFoto(true);
    const fd = new FormData();
    fd.append('foto', file);
    try {
      const res = await fetch(`${API}/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.erro || 'Erro ao enviar foto.', 'erro');
      setPerfil(p => ({ ...p, foto_url: data.foto_url }));
      showToast('Foto atualizada!');
    } catch { showToast('Erro de conexão.', 'erro'); }
    finally { setUploadingFoto(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-[#7033ff]" size={32} />
    </div>
  );

  return (
    <div className="p-6 md:p-10 font-sans min-h-full">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Meu Perfil</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie suas informações pessoais e credenciais de acesso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Coluna esquerda (fixa em desktop) ── */}
        <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-6 self-start">

          {/* Avatar */}
          <div className="bg-white dark:bg-[#13102a] border border-slate-200 dark:border-[#7033ff]/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-2xl bg-[#7033ff]/10 border-2 border-[#7033ff]/20 flex items-center justify-center overflow-hidden">
                {perfil?.foto_url
                  ? <img src={perfil.foto_url} alt="Foto" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-[#7033ff]">{getInitials(perfil?.nome)}</span>
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingFoto}
                className="cursor-pointer absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#7033ff] border-2 border-white dark:border-[#13102a] flex items-center justify-center hover:bg-[#5a28cc] transition-colors disabled:opacity-50 shadow-md"
              >
                {uploadingFoto ? <Loader2 size={13} className="animate-spin text-white" /> : <Camera size={13} className="text-white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </div>
            <p className="font-bold text-slate-800 dark:text-white text-base leading-tight">{perfil?.nome}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{perfil?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-[#7033ff]/10 border border-[#7033ff]/20 text-[#7033ff]">
              <Shield size={11} /> Administrador
            </span>
            <div className="mt-4 w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-3 py-2">
              <BadgeCheck size={14} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Conta ativa</span>
            </div>
          </div>

          {/* Detalhes da conta */}
          <div className="bg-white dark:bg-[#13102a] border border-slate-200 dark:border-[#7033ff]/10 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Detalhes da Conta</p>
            <InfoRow icon={Hash}         label="ID do usuário"  value={`#${perfil?.id}`} />
            <InfoRow icon={Mail}         label="E-mail"         value={perfil?.email} badge="Verificado" />
            <InfoRow icon={Phone}        label="Telefone"       value={perfil?.telefone} />
            <InfoRow icon={Shield}       label="Perfil"         value="Administrador" />
            <InfoRow icon={CalendarDays} label="Membro desde"   value={formatDate(perfil?.data_criacao)} />
            <InfoRow icon={Clock}        label="Tempo de conta" value={timeAgo(perfil?.data_criacao)} />
          </div>

          {/* Sessão Atual (enriquecida) */}
          <div className="bg-white dark:bg-[#13102a] border border-slate-200 dark:border-[#7033ff]/10 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sessão Atual</p>
            <div className="flex flex-col gap-3">
              {/* Info principal */}
              <div className="flex items-center gap-3 p-3 bg-[#7033ff]/5 border border-[#7033ff]/10 rounded-xl">
                <Monitor size={16} className="text-[#7033ff] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{sessaoAtual.dispositivo}</p>
                  <p className="text-[11px] text-slate-400">Sessão ativa agora</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              </div>

              {/* Detalhes extras */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-[#0a0a12]/40 border border-slate-200 dark:border-[#7033ff]/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={12} className="text-[#7033ff]" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Localização</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{sessaoAtual.localizacao}</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#0a0a12]/40 border border-slate-200 dark:border-[#7033ff]/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={12} className="text-[#7033ff]" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">IP</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{sessaoAtual.ip}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#0a0a12]/40 border border-slate-200 dark:border-[#7033ff]/10 rounded-lg">
                <Clock size={12} className="text-[#7033ff]" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Login há</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{timeAgo(sessaoAtual.login)}</span>
              </div>
            </div>
          </div>


        </div>

        {/* ── Coluna direita ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Dados Pessoais */}
          <SectionCard icon={UserCircle} title="Dados Pessoais">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nome completo" icon={UserCircle}>
                  <input className={inputCls} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Seu nome completo" />
                </Field>
                <Field label="E-mail" icon={Mail}>
                  <input className={inputCls} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="seu@email.com" />
                </Field>
                <Field label="Telefone" icon={Phone}>
                  <input className={inputCls} value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(11) 99999-9999" />
                </Field>
                <Field label="Cargo" icon={Shield}>
                  <input className={inputCls} value="Administrador" disabled />
                </Field>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-[#7033ff]/10">
                <button onClick={handleSalvarDados} disabled={saving}
                  className="cursor-pointer flex items-center gap-2 bg-[#7033ff] hover:bg-[#5a28cc] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  Salvar alterações
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Segurança */}
          <SectionCard icon={ShieldCheck} title="Segurança da Conta">
            <div className="flex flex-col gap-5">

              {/* Info cards de segurança */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-[#0a0a12]/50 border border-slate-200 dark:border-[#7033ff]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={13} className="text-[#7033ff]" />
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Conta criada</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">{formatDate(perfil?.data_criacao)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(perfil?.data_criacao)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#0a0a12]/50 border border-slate-200 dark:border-[#7033ff]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={13} className="text-[#7033ff]" />
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Nível de acesso</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">Total</p>
                  <p className="text-xs text-slate-400 mt-0.5">Todas as permissões</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#0a0a12]/50 border border-slate-200 dark:border-[#7033ff]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Fingerprint size={13} className="text-[#7033ff]" />
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Autenticação</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">JWT Token</p>
                  <p className="text-xs text-slate-400 mt-0.5">Login por senha</p>
                </div>
              </div>

              {/* Campos de senha */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'atual', label: 'Senha atual' },
                  { key: 'nova', label: 'Nova senha' },
                  { key: 'confirmar', label: 'Confirmar nova senha' },
                ].map(({ key, label }) => (
                  <Field key={key} label={label} icon={Lock}>
                    <div className="relative">
                      <input
                        className={`${inputCls} pr-10`}
                        type={showSenha[key] ? 'text' : 'password'}
                        value={senhaForm[key]}
                        onChange={e => {
                          setSenhaForm(f => ({ ...f, [key]: e.target.value }));
                          if (key === 'nova') setSenhaForca(calcForca(e.target.value));
                        }}
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowSenha(s => ({ ...s, [key]: !s[key] }))}
                        className="cursor-pointer absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        {showSenha[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                ))}
              </div>

              {/* Indicador de força da senha */}
              {senhaForm.nova && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Força da senha</span>
                    <span className={`text-xs font-semibold ${forca <= 2 ? 'text-red-500' : forca <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {forcaLabel}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= forca ? forcaCor : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Dica */}
              <div className="flex items-start gap-3 bg-[#7033ff]/5 border border-[#7033ff]/15 rounded-xl p-3">
                <Shield size={14} className="text-[#7033ff] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Use pelo menos 6 caracteres, combinando letras maiúsculas, números e símbolos para uma senha mais segura.
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-[#7033ff]/10">
                <button onClick={handleAlterarSenha} disabled={savingSenha}
                  className="cursor-pointer flex items-center gap-2 bg-[#7033ff] hover:bg-[#5a28cc] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                  {savingSenha ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                  Alterar senha
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Permissões */}
          <SectionCard icon={KeyRound} title="Permissões de Acesso">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Gerenciar usuários',     desc: 'Criar, editar e excluir usuários' },
                { label: 'Gerenciar ferramentas',  desc: 'Controle total do inventário' },
                { label: 'Visualizar histórico',   desc: 'Acesso a todas as transações' },
                { label: 'Gerenciar alertas',      desc: 'Resolver e configurar alertas' },
                { label: 'Configurações do sistema', desc: 'Parâmetros e preferências' },
                { label: 'Acesso a relatórios',    desc: 'Dashboard e métricas' },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#0a0a12]/40 border border-slate-200 dark:border-[#7033ff]/10 rounded-xl">
                  <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{p.label}</p>
                    <p className="text-[11px] text-slate-400">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}