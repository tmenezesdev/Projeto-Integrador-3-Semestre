'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useRef } from 'react';
import PhotoCropModal from '@/components/PhotoCropModal/PhotoCropModal';
import {
  UserCircle, Mail, Lock, Eye, EyeOff, Camera, Loader2,
  AlertCircle, CheckCircle2, Shield, KeyRound,
  CalendarDays, Clock, BadgeCheck, Hash,
  Fingerprint, ShieldCheck, Globe,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const BASE = BASE_URL + '/api/mecanico';

const inputCls = "h-10 w-full rounded-lg border border-slate-200 dark:border-teal-500/20 bg-slate-50 dark:bg-[#001a18]/80 px-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/60 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed";

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-teal-500" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-teal-500/5 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-teal-500" />
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
    <div className="bg-white dark:bg-[#001a18] border border-slate-200 dark:border-teal-500/10 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 dark:border-teal-500/10">
        <Icon size={15} className="text-teal-500" />
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
  if (!nome) return 'S';
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getLoginTime(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.iat ? new Date(payload.iat * 1000).toISOString() : null;
  } catch { return null; }
}

function getBrowserInfo() {
  if (typeof navigator === 'undefined') return 'Navegador desconhecido';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Google Chrome';
  if (ua.includes('Firefox')) return 'Mozilla Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Microsoft Edge';
  return 'Navegador';
}

export default function SupervisorPerfil() {
  const { getToken } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSenha, setSavingSenha] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const fileRef = useRef();

  const [form, setForm] = useState({ nome: '', email: '' });
  const [senhaForm, setSenhaForm] = useState({ atual: '', nova: '', confirmar: '' });
  const [showSenha, setShowSenha] = useState({ atual: false, nova: false, confirmar: false });

  const showToast = (msg, type = 'ok') => setToast({ msg, type });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    fetch(`${BASE}/perfil`, { headers })
      .then(r => r.json())
      .then(res => {
        const dados = res.dados ?? res;
        setPerfil(dados);
        setForm({ nome: dados.nome || '', email: dados.email || '' });
      })
      .catch(() => showToast('Erro ao carregar perfil.', 'erro'))
      .finally(() => setLoading(false));
  }, []);

  const calcForca = (s) => {
    let f = 0;
    if (s.length >= 6) f++;
    if (s.length >= 10) f++;
    if (/[A-Z]/.test(s)) f++;
    if (/[0-9]/.test(s)) f++;
    if (/[^A-Za-z0-9]/.test(s)) f++;
    return f;
  };
  const forca = calcForca(senhaForm.nova);
  const forcaLabel = ['', 'Muito fraca', 'Fraca', 'Razoável', 'Forte', 'Muito forte'][forca] || '';
  const forcaCor   = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'][forca] || '';

  const handleSalvarDados = async () => {
    if (!form.nome || !form.email) return showToast('Nome e e-mail são obrigatórios.', 'erro');
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
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
      const res = await fetch(`${BASE}/perfil/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ senha_atual: senhaForm.atual, nova_senha: senhaForm.nova }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.erro || 'Erro ao alterar senha.', 'erro');
      setSenhaForm({ atual: '', nova: '', confirmar: '' });
      showToast('Senha alterada com sucesso!');
    } catch { showToast('Erro de conexão.', 'erro'); }
    finally { setSavingSenha(false); }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showToast('A foto deve ter no máximo 5MB.', 'erro');
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    e.target.value = '';
  };

  const handleCropConfirm = async (blob) => {
    setUploadingFoto(true);
    const fd = new FormData();
    fd.append('foto', blob, 'foto.jpg');
    try {
      const res = await fetch(`${BASE}/perfil/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.erro || 'Erro ao enviar foto.', 'erro');
      setPerfil(p => ({ ...p, foto_url: data.foto_url }));
      const u = JSON.parse(localStorage.getItem('smartbench_user') || '{}');
      localStorage.setItem('smartbench_user', JSON.stringify({ ...u, foto_url: data.foto_url }));
      setCropSrc(null);
      showToast('Foto de perfil atualizada com sucesso!');
    } catch { showToast('Erro de conexão.', 'erro'); }
    finally { setUploadingFoto(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-teal-500" size={32} />
    </div>
  );

  const loginTime = getLoginTime(getToken());
  const browser   = getBrowserInfo();
  const fotoUrl   = perfil?.foto_url || null;

  return (
    <div className="p-6 md:p-10 font-sans min-h-full bg-white dark:bg-[#060d1f]">

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Meu Perfil</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie suas informações pessoais e credenciais de acesso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Coluna esquerda ── */}
        <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-6 self-start">

          {/* Avatar */}
          <div className="bg-white dark:bg-[#001a18] border border-slate-200 dark:border-teal-500/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-2xl bg-teal-500/10 border-2 border-teal-500/20 flex items-center justify-center overflow-hidden">
                {fotoUrl
                  ? <img src={fotoUrl} alt="Foto" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-teal-500">{getInitials(perfil?.nome)}</span>
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingFoto}
                className="cursor-pointer absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal-500 border-2 border-white dark:border-[#001a18] flex items-center justify-center hover:bg-teal-400 transition-colors disabled:opacity-50 shadow-md"
              >
                {uploadingFoto ? <Loader2 size={13} className="animate-spin text-white" /> : <Camera size={13} className="text-white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            <p className="font-bold text-slate-800 dark:text-white text-base leading-tight">{perfil?.nome}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{perfil?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
              <ShieldCheck size={11} /> Supervisor
            </span>
            <div className="mt-4 w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-3 py-2">
              <BadgeCheck size={14} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Conta ativa</span>
            </div>
          </div>

          {/* Detalhes da conta */}
          <div className="bg-white dark:bg-[#001a18] border border-slate-200 dark:border-teal-500/10 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detalhes da Conta</p>
            <InfoRow icon={Hash}         label="ID do usuário"  value={`#${perfil?.id}`} />
            <InfoRow icon={Mail}         label="E-mail"         value={perfil?.email} badge="Verificado" />
            <InfoRow icon={ShieldCheck}  label="Função"         value="Supervisor" />
            <InfoRow icon={CalendarDays} label="Membro desde"   value={formatDate(perfil?.data_criacao)} />
            <InfoRow icon={Clock}        label="Tempo de conta" value={timeAgo(perfil?.data_criacao)} />
          </div>


          {/* Sessão atual */}
          <div className="bg-white dark:bg-[#001a18] border border-slate-200 dark:border-teal-500/10 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sessão Atual</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-teal-500/5 border border-slate-200 dark:border-teal-500/10 rounded-xl">
                <Globe size={15} className="text-teal-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{browser}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sessão ativa</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              </div>
              {loginTime && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-teal-500/5 border border-slate-200 dark:border-teal-500/10 rounded-lg">
                  <Clock size={12} className="text-teal-500" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Login em</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(loginTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">· {timeAgo(loginTime)}</span>
                </div>
              )}
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
                <Field label="Função" icon={ShieldCheck}>
                  <input className={inputCls} value="Supervisor" disabled />
                </Field>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-teal-500/10">
                <button onClick={handleSalvarDados} disabled={saving}
                  className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  Salvar alterações
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Segurança */}
          <SectionCard icon={ShieldCheck} title="Segurança da Conta">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-teal-50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={13} className="text-teal-500" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Conta criada</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">{formatDate(perfil?.data_criacao)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{timeAgo(perfil?.data_criacao)}</p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={13} className="text-teal-500" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Nível de acesso</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">Operacional</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gestão de equipe</p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Fingerprint size={13} className="text-teal-500" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Autenticação</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">JWT Token</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Expira em 1 hora</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'atual',     label: 'Senha atual',          placeholder: 'Digite a senha atual', autoComplete: 'current-password' },
                  { key: 'nova',      label: 'Nova senha',           placeholder: 'Mín. 6 caracteres',    autoComplete: 'new-password'     },
                  { key: 'confirmar', label: 'Confirmar nova senha', placeholder: 'Repita a nova senha',  autoComplete: 'new-password'     },
                ].map(({ key, label, placeholder, autoComplete }) => (
                  <Field key={key} label={label} icon={Lock}>
                    <div className="relative">
                      <input
                        className={`${inputCls} pr-10`}
                        type={showSenha[key] ? 'text' : 'password'}
                        autoComplete={autoComplete}
                        value={senhaForm[key]}
                        onChange={e => setSenhaForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenha(s => ({ ...s, [key]: !s[key] }))}
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors"
                      >
                        {showSenha[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </Field>
                ))}
              </div>

              {senhaForm.nova && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Força da senha</span>
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

              <div className="flex items-start gap-3 bg-teal-50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/15 rounded-xl p-3">
                <Shield size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use pelo menos 6 caracteres, combinando letras maiúsculas, números e símbolos para uma senha mais segura.
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-teal-500/10">
                <button onClick={handleAlterarSenha} disabled={savingSenha}
                  className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
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
                { label: 'Visão geral da operação',   desc: 'Dashboard com métricas em tempo real' },
                { label: 'Gerenciar funcionários',    desc: 'Cadastrar e editar mecânicos' },
                { label: 'Monitorar ferramentas',     desc: 'Ver ferramentas em campo e atrasos' },
                { label: 'Registrar devoluções',      desc: 'Devolução manual de ferramentas' },
                { label: 'Acessar histórico',         desc: 'Histórico completo da equipe' },
                { label: 'Alterar senha',             desc: 'Gerenciar credenciais de acesso' },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/10 rounded-xl">
                  <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{p.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          loading={uploadingFoto}
          onConfirm={handleCropConfirm}
          onCancel={() => { setCropSrc(null); URL.revokeObjectURL(cropSrc); }}
        />
      )}
    </div>
  );
}
