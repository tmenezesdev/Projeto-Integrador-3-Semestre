'use client';

import { useState } from "react";
import { 
  Settings, 
  User, 
  Save, 
  UserPlus, 
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
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
    telefone: '',
    cpf: '',
    genero: '',
    dataNascimento: ''
  });

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setNovoFuncionario({ ...novoFuncionario, telefone: value });
  };

  const handleCPFChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setNovoFuncionario({ ...novoFuncionario, cpf: value });
    }
  };

  const handleDataChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) {
      value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
    }
    setNovoFuncionario({ ...novoFuncionario, dataNascimento: value });
  };

  const handleCadastrarFuncionario = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setSenhaGerada('');

    try {
      const res = await fetch('http://localhost:3000/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoFuncionario)
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || 'Erro ao cadastrar funcionário.');
        return;
      }

      setSenhaGerada(data.senhaTemporaria);
      setShowToast(true);
      setNovoFuncionario({ nome: '', email: '', telefone: '', cpf: '', genero: '', dataNascimento: '' });
      setTimeout(() => setShowToast(false), 4000);

    } catch (err) {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#060d1f] min-h-screen text-white font-sans w-full overflow-x-hidden">
      
      {showToast && (
        <div className="fixed top-8 right-8 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-right-4">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">Funcionário cadastrado com sucesso!</span>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-10 w-full">
        <p className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em]">Painel de Controle</p>
        <div className="flex items-center gap-3">
          <Settings className="text-teal-400 h-7 w-7" />
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
          
          <form onSubmit={handleCadastrarFuncionario} className="p-8 space-y-8 bg-[#0a1628]">
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                <User size={12} className="text-slate-600" /> Nome Completo
              </label>
              <input 
                required
                type="text" 
                placeholder="Ex: Marina Montagnini"
                value={novoFuncionario.nome}
                onChange={(e) => setNovoFuncionario({...novoFuncionario, nome: e.target.value})}
                className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <Mail size={12} className="text-slate-600" /> E-mail Corporativo
                </label>
                <input 
                  required
                  type="email" 
                  placeholder="marina.montagnini@email.com"
                  value={novoFuncionario.email}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, email: e.target.value})}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <Phone size={12} className="text-slate-600" /> Telefone
                </label>
                <input 
                  required
                  type="tel" 
                  placeholder="(11) 12345-6789"
                  value={novoFuncionario.telefone}
                  onChange={handleTelefoneChange}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <IdCard size={12} className="text-slate-600" /> CPF
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="000.000.000-00"
                  value={novoFuncionario.cpf}
                  onChange={handleCPFChange}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <Users size={12} className="text-slate-600" /> Gênero
                </label>
                <select 
                  required
                  value={novoFuncionario.genero}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, genero: e.target.value})}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 focus:border-teal-500/50 outline-none cursor-pointer appearance-none"
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2 tracking-[0.15em]">
                  <Calendar size={12} className="text-slate-600" /> Nascimento
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="DD/MM/AAAA"
                  value={novoFuncionario.dataNascimento}
                  onChange={handleDataChange}
                  className="w-full bg-[#060d1f] border border-slate-700/50 rounded-lg py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-800 focus:border-teal-500/50 outline-none"
                />
              </div>
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
                Senha temporária gerada: <span className="font-mono text-white ml-1">{senhaGerada}</span> — informe ao funcionário.
              </div>
            )}

            <div className="pt-6 flex justify-end border-t border-slate-700/10">
              <button 
                type="submit"
                disabled={salvando}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-lg text-xs font-bold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-teal-500/10 uppercase tracking-widest"
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