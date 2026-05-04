'use client';

import { useState } from "react";
import {
  User,
  Save,
  UserPlus,
  CheckCircle2,
  Mail,
  IdCard,
  Users,
  AlertCircle,
  KeyRound
} from "lucide-react";

export default function CadastroPage() {
  const [salvando, setSalvando] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [erro, setErro] = useState('');
  const [senhaGerada, setSenhaGerada] = useState('');

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    email: '',
    tag_cracha: '',
    tipo_perfil: 'MECANICO'
  });

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setSenhaGerada('');

    try {
      const token = localStorage.getItem('smartbench_token');
      const res = await fetch('http://localhost:3000/api/supervisor/funcionarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(novoFuncionario)
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || 'Erro ao cadastrar funcionário.');
        return;
      }

      setSenhaGerada(data.dados.senhaTemporaria);
      setShowToast(true);
      setNovoFuncionario({ nome: '', email: '', tag_cracha: '', tipo_perfil: 'MECANICO' });
      setTimeout(() => setShowToast(false), 6000);

    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#09090A] min-h-screen text-white font-sans w-full overflow-x-hidden">

      {showToast && (
        <div className="fixed top-8 right-8 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-right-4">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">Funcionário cadastrado com sucesso!</span>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-10 w-full">
        <p className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em]">Painel de Controle</p>
        <div className="flex items-center gap-3">
          <UserPlus className="text-teal-400 h-7 w-7" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Cadastro do Sistema</h1>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[#0a1628] border border-slate-700/20 rounded-xl overflow-hidden shadow-2xl w-full">
          <div className="px-6 py-5 border-b border-slate-700/20 bg-[#0c1b31]/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <UserPlus size={16} className="text-teal-500" /> Registro de Novo Operador                                                                                                                            
            </h2>
            <span className="text-[9px] bg-teal-500/10 text-teal-500 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-teal-500/20">Acesso Supervisor</span>
          </div>

          <form onSubmit={handleCadastrar} className="p-8 space-y-8 bg-[#0a1628]">

            {/* Nome */}
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                <User size={12} className="text-slate-600" /> Nome Completo
              </label>
              <input
                required
                type="text"
                placeholder="Ex: Carlos Silva"
                value={novoFuncionario.nome}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none transition-all"
              />
            </div>

            {/* E-mail e Tag do Crachá */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <Mail size={12} className="text-slate-600" /> E-mail Corporativo
                </label>
                <input
                  required
                  type="email"
                  placeholder="carlos.silva@gm.com"
                  value={novoFuncionario.email}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <IdCard size={12} className="text-slate-600" /> Tag do Crachá (RFID)
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: TAG-MEC-007"
                  value={novoFuncionario.tag_cracha}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, tag_cracha: e.target.value.toUpperCase() })}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none font-mono"
                />
              </div>
            </div>

            {/* Tipo de Perfil */}
            <div className="w-full md:w-1/2">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                <Users size={12} className="text-slate-600" /> Perfil de Acesso
              </label>
              <select
                value={novoFuncionario.tipo_perfil}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, tipo_perfil: e.target.value })}
                className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 focus:border-teal-500/50 outline-none cursor-pointer appearance-none"
              >
                <option value="MECANICO">Mecânico</option>
                <option value="SUPERVISOR">Supervisor</option>
              </select>
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-xs font-bold">
                <AlertCircle size={14} />
                {erro}
              </div>
            )}

            {senhaGerada && (
              <div className="flex items-center gap-2 text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-lg px-4 py-3 text-xs font-bold">
                <KeyRound size={14} />
                Senha temporária gerada:&nbsp;
                <span className="font-mono text-white bg-black/30 px-2 py-0.5 rounded">{senhaGerada}</span>
                &nbsp;— Informe ao funcionário e peça para trocar.
              </div>
            )}

            <div className="pt-6 flex justify-end border-t border-slate-700/10">
              <button
                type="submit"
                disabled={salvando}
                className="cursor-pointer flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-teal-500/10 uppercase tracking-widest"
              >
                {salvando ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                {salvando ? 'Salvando...' : 'Finalizar Cadastro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}