"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PARTICLES = [
  { w:2, x:7,  y:18, delay:0,   dur:9,  color:'#a87fff' },
  { w:3, x:23, y:65, delay:1.4, dur:12, color:'#f59e0b' },
  { w:2, x:38, y:32, delay:2.8, dur:8,  color:'#2dd4bf' },
  { w:2, x:55, y:80, delay:0.6, dur:13, color:'#7033ff' },
  { w:3, x:72, y:12, delay:3.5, dur:7,  color:'#f59e0b' },
  { w:2, x:88, y:50, delay:1.9, dur:11, color:'#2dd4bf' },
  { w:2, x:14, y:78, delay:4.2, dur:10, color:'#7033ff' },
  { w:3, x:48, y:90, delay:0.3, dur:9,  color:'#a87fff' },
  { w:2, x:30, y:45, delay:2.1, dur:14, color:'#f59e0b' },
  { w:2, x:78, y:35, delay:3.0, dur:8,  color:'#2dd4bf' },
  { w:2, x:62, y:8,  delay:1.1, dur:11, color:'#a87fff' },
  { w:2, x:18, y:88, delay:4.7, dur:7,  color:'#7033ff' },
  { w:3, x:93, y:72, delay:2.6, dur:10, color:'#f59e0b' },
  { w:2, x:42, y:55, delay:0.9, dur:13, color:'#2dd4bf' },
  { w:2, x:5,  y:50, delay:3.8, dur:9,  color:'#a87fff' },
  { w:2, x:85, y:90, delay:1.6, dur:11, color:'#f59e0b' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [senha, setSenha]     = useState("");
  const [erro, setErro]       = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg]         = useState({ tipo: '', texto: '' });

  const particles = useMemo(() => PARTICLES.map((p, i) => (
    <div key={i} className="particle absolute rounded-full pointer-events-none" style={{
      width: p.w, height: p.w,
      left: `${p.x}%`, top: `${p.y}%`,
      background: p.color,
      animationDuration: `${p.dur}s`,
      animationDelay: `${p.delay}s`,
      filter: 'blur(0.4px)',
      boxShadow: `0 0 4px 1px ${p.color}55`,
    }} />
  )), []);

  const handleEsqueceuSenha = async () => {
    if (!email.trim()) {
      setResetMsg({ tipo: 'erro', texto: 'Preencha o campo de e-mail antes de continuar.' });
      return;
    }
    setResetLoading(true);
    setResetMsg({ tipo: '', texto: '' });
    try {
      const res  = await fetch('http://localhost:3000/api/auth/esqueceu-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResetMsg({ tipo: res.ok ? 'sucesso' : 'erro', texto: data.mensagem });
    } catch {
      setResetMsg({ tipo: 'erro', texto: 'Não foi possível conectar ao servidor.' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    if (!email || !senha) { setErro("Preencha e-mail e senha."); return; }
    setIsLoading(true);
    try {
      const res  = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        const u = data.dados.usuario;
        localStorage.setItem("smartbench_token", data.dados.token);
        localStorage.setItem("smartbench_user", JSON.stringify(u));
        const p = String(u.tipo_perfil || u.cargo || "").toUpperCase();
        if (p === "SUPERVISOR") router.push("/Supervisor");
        else if (p === "ADMIN") router.push("/Admin");
        else router.push("/Mecanico");
      } else {
        setErro(data.mensagem || "Credenciais inválidas.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section data-login-page className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans" style={{ background: '#04030d' }}>

        {/* Grid */}
        <div className="grid-anim absolute inset-0 pointer-events-none" style={{
          backgroundImage:`linear-gradient(rgba(112,51,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(112,51,255,0.035) 1px,transparent 1px)`,
          backgroundSize:'60px 60px',
        }} />

        {/* Vinheta radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(4,3,13,0.85) 100%)',
        }} />

        {/* Grain noise */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]" style={{ mixBlendMode:'overlay' }}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* Blob roxo — Admin */}
        <div className="blob-purple absolute pointer-events-none" style={{
          top:'42%', left:'48%',
          width:'580px', height:'580px',
          background:'radial-gradient(circle, rgba(112,51,255,0.55) 0%, transparent 68%)',
          filter:'blur(48px)', willChange:'transform',
        }} />

        {/* Blob âmbar — Mecânico */}
        <div className="blob-amber absolute pointer-events-none" style={{
          top:'72%', left:'18%',
          width:'420px', height:'420px',
          background:'radial-gradient(circle, rgba(245,158,11,0.45) 0%, transparent 68%)',
          filter:'blur(56px)', willChange:'transform',
        }} />

        {/* Blob teal — Supervisor */}
        <div className="blob-teal absolute pointer-events-none" style={{
          top:'15%', left:'72%',
          width:'380px', height:'380px',
          background:'radial-gradient(circle, rgba(45,212,191,0.4) 0%, transparent 68%)',
          filter:'blur(52px)', willChange:'transform',
        }} />

        {/* Blob rosa secundário — profundidade */}
        <div className="blob-pink absolute pointer-events-none" style={{
          top:'20%', left:'10%',
          width:'280px', height:'280px',
          background:'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 68%)',
          filter:'blur(60px)', willChange:'transform',
        }} />

        {/* Streaks de luz */}
        <div className="streak absolute pointer-events-none" style={{
          top:'25%', left:'-20%',
          width:'40%', height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(112,51,255,0.7), rgba(45,212,191,0.4), transparent)',
          filter:'blur(1px)',
        }} />
        <div className="streak-2 absolute pointer-events-none" style={{
          top:'60%', left:'-20%',
          width:'35%', height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), rgba(112,51,255,0.3), transparent)',
          filter:'blur(1px)',
        }} />
        <div className="streak-3 absolute pointer-events-none" style={{
          top:'40%', left:'-20%',
          width:'30%', height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(45,212,191,0.5), transparent)',
          filter:'blur(1px)',
        }} />

        {/* Partículas */}
        {particles}

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-md px-4">

          {/* Logo */}
          <div className="title-in text-center mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-white">
              Smart<span style={{ color:'#7033ff' }}>Bench</span>
            </h1>
            <p className="text-slate-400 text-base">Gestão Inteligente de Ferramentas</p>
          </div>

          {/* Card com borda animada */}
          <div className="card-in card-border-wrap">
            <div className="card-inner">


              <h2 className="text-xl font-bold text-white text-center mb-1">Acesso Restrito</h2>
              <p className="text-slate-400 text-sm text-center mb-6">Insira suas credenciais corporativas</p>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">E-mail Corporativo</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="login-input" placeholder="email@empresa.com" disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Senha</label>
                    <button type="button" onClick={handleEsqueceuSenha} disabled={resetLoading} className="text-xs cursor-pointer" style={{ color:'#7033ff', background:'none', border:'none', padding:0, opacity: resetLoading ? 0.6 : 1 }}>
                      {resetLoading ? 'Enviando...' : 'Esqueceu?'}
                    </button>
                  </div>
                  <input
                    type="password" value={senha} onChange={e => setSenha(e.target.value)}
                    className="login-input" placeholder="••••••••" disabled={isLoading}
                  />
                </div>

                {resetMsg.texto && (
                  <div style={{
                    background: resetMsg.tipo === 'sucesso' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${resetMsg.tipo === 'sucesso' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    borderRadius: 8, padding: '10px 14px',
                  }}>
                    <p style={{ color: resetMsg.tipo === 'sucesso' ? '#4ade80' : '#f87171', fontSize: 12, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                      {resetMsg.texto}
                    </p>
                  </div>
                )}

                {erro && (
                  <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, padding:'10px 14px' }}>
                    <p className="text-red-400 text-xs text-center">{erro}</p>
                  </div>
                )}

                <button
                  type="submit" disabled={isLoading}
                  style={{
                    marginTop:4, height:46, borderRadius:10,
                    background: isLoading ? 'rgba(112,51,255,0.45)' : '#7033ff',
                    color:'#fff', fontWeight:700, fontSize:14,
                    border:'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    transition:'background 0.2s, box-shadow 0.2s',
                    boxShadow: isLoading ? 'none' : '0 0 24px rgba(112,51,255,0.4)',
                  }}
                  onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background='#5a28cc'; }}
                  onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background='#7033ff'; }}
                >
                  {isLoading
                    ? <><Loader2 size={16} className="animate-spin" /> Autenticando...</>
                    : 'Entrar no Sistema'
                  }
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-slate-300 mt-6">
            &copy; 2026 SmartBench System · Acesso monitorado
          </p>
        </div>
      </section>
    </>
  );
}
