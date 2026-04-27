"use client";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

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
      <style>{`
        /* ── Blobs morfantes ── */
        @keyframes morph-purple {
          0%   { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; transform:translate(0px,   0px)   scale(1);    }
          25%  { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; transform:translate(50px, -40px)  scale(1.06); }
          50%  { border-radius:50% 30% 60% 40%/30% 60% 40% 70%; transform:translate(-30px, 50px)  scale(0.94); }
          75%  { border-radius:40% 70% 40% 60%/60% 40% 60% 30%; transform:translate(40px,  30px)  scale(1.04); }
          100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; transform:translate(0px,   0px)   scale(1);    }
        }
        @keyframes morph-amber {
          0%   { border-radius:40% 60% 60% 40%/40% 40% 60% 60%; transform:translate(0px,   0px)   scale(1);    }
          33%  { border-radius:70% 30% 40% 60%/60% 50% 40% 50%; transform:translate(-60px, 40px)  scale(1.08); }
          66%  { border-radius:30% 70% 60% 40%/50% 30% 70% 40%; transform:translate(30px, -50px)  scale(0.92); }
          100% { border-radius:40% 60% 60% 40%/40% 40% 60% 60%; transform:translate(0px,   0px)   scale(1);    }
        }
        @keyframes morph-teal {
          0%   { border-radius:50% 50% 40% 60%/30% 70% 40% 60%; transform:translate(0px,   0px)   scale(1);    }
          40%  { border-radius:60% 40% 70% 30%/60% 40% 50% 50%; transform:translate(-40px,-50px)  scale(1.1);  }
          80%  { border-radius:30% 60% 50% 50%/50% 30% 60% 40%; transform:translate(50px,  30px)  scale(0.9);  }
          100% { border-radius:50% 50% 40% 60%/30% 70% 40% 60%; transform:translate(0px,   0px)   scale(1);    }
        }
        @keyframes morph-pink {
          0%   { border-radius:50% 50% 60% 40%/50% 40% 60% 50%; transform:translate(0px,0px)     scale(1);   }
          50%  { border-radius:70% 30% 40% 60%/40% 60% 30% 70%; transform:translate(-35px,45px)  scale(1.07);}
          100% { border-radius:50% 50% 60% 40%/50% 40% 60% 50%; transform:translate(0px,0px)     scale(1);   }
        }

        /* ── Streaks de luz ── */
        @keyframes streak {
          0%   { transform:translateX(-100%) rotate(-25deg); opacity:0;   }
          10%  { opacity:0.6; }
          30%  { opacity:0; }
          100% { transform:translateX(220%)  rotate(-25deg); opacity:0;   }
        }

        /* ── Partículas ── */
        @keyframes float-up {
          0%   { transform:translateY(0)     translateX(0);   opacity:0;   }
          8%   { opacity:1; }
          90%  { opacity:0.6; }
          100% { transform:translateY(-140px) translateX(22px); opacity:0; }
        }

        /* ── Entrada do card ── */
        @keyframes card-in {
          from { opacity:0; transform:translateY(32px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes title-in {
          from { opacity:0; transform:translateY(-18px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Borda rotativa no card ── */
        @keyframes border-spin {
          from { --angle: 0deg; }
          to   { --angle: 360deg; }
        }
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes scan {
          0%   { top:0%;   opacity:0.7; }
          60%  { opacity:0.15; }
          100% { top:100%; opacity:0; }
        }
        @keyframes grid-scroll {
          from { background-position:0 0; }
          to   { background-position:0 60px; }
        }

        /* ── Classes ── */
        .blob-purple { animation: morph-purple 12s ease-in-out infinite; }
        .blob-amber  { animation: morph-amber  15s ease-in-out infinite; }
        .blob-teal   { animation: morph-teal   18s ease-in-out infinite; }
        .blob-pink   { animation: morph-pink   10s ease-in-out infinite; }
        .streak      { animation: streak 7s ease-in-out infinite; }
        .streak-2    { animation: streak 9s ease-in-out 3.5s infinite; }
        .streak-3    { animation: streak 11s ease-in-out 6s infinite; }
        .particle    { animation: float-up linear infinite; }
        .card-in     { animation: card-in  0.6s cubic-bezier(.22,.68,0,1.15) forwards; }
        .title-in    { animation: title-in 0.5s ease-out 0.1s both; }
        .scan-line   { animation: scan 5s ease-in 1.5s infinite; }
        .grid-anim   { animation: grid-scroll 10s linear infinite; }

        /* Borda animada via conic-gradient */
        .card-border-wrap {
          padding: 1px;
          border-radius: 18px;
          background: conic-gradient(
            from var(--angle),
            #7033ff 0%,
            #2dd4bf 25%,
            #f59e0b 50%,
            #7033ff 75%,
            #7033ff 100%
          );
          animation: border-spin 6s linear infinite;
        }
        .card-inner {
          background: rgba(10, 8, 22, 0.92);
          backdrop-filter: blur(24px);
          border-radius: 17px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }

        .input-field {
          height:44px; width:100%;
          border-radius:8px;
          border:1px solid rgba(112,51,255,0.2);
          background:rgba(6,4,15,0.8);
          padding:0 12px;
          font-size:14px; color:#fff;
          outline:none;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color:#3a3a4a; }
        .input-field:focus {
          border-color:rgba(112,51,255,0.6);
          box-shadow:0 0 0 3px rgba(112,51,255,0.12);
        }
        .input-field:disabled { opacity:0.5; cursor:not-allowed; }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans" style={{ background: '#04030d' }}>

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
          filter:'blur(72px)', willChange:'transform',
        }} />

        {/* Blob âmbar — Mecânico */}
        <div className="blob-amber absolute pointer-events-none" style={{
          top:'72%', left:'18%',
          width:'420px', height:'420px',
          background:'radial-gradient(circle, rgba(245,158,11,0.45) 0%, transparent 68%)',
          filter:'blur(90px)', willChange:'transform',
        }} />

        {/* Blob teal — Supervisor */}
        <div className="blob-teal absolute pointer-events-none" style={{
          top:'15%', left:'72%',
          width:'380px', height:'380px',
          background:'radial-gradient(circle, rgba(45,212,191,0.4) 0%, transparent 68%)',
          filter:'blur(80px)', willChange:'transform',
        }} />

        {/* Blob rosa secundário — profundidade */}
        <div className="blob-pink absolute pointer-events-none" style={{
          top:'20%', left:'10%',
          width:'280px', height:'280px',
          background:'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 68%)',
          filter:'blur(100px)', willChange:'transform',
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
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle absolute rounded-full pointer-events-none" style={{
            width:p.w, height:p.w,
            left:`${p.x}%`, top:`${p.y}%`,
            background:p.color,
            animationDuration:`${p.dur}s`,
            animationDelay:`${p.delay}s`,
            filter:'blur(0.4px)',
            boxShadow:`0 0 4px 1px ${p.color}55`,
          }} />
        ))}

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-md px-4">

          {/* Logo */}
          <div className="title-in text-center mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-white">
              Smart<span style={{ color:'#7033ff' }}>Bench</span>
            </h1>
            <p className="text-slate-500 text-base">Gestão Inteligente de Ferramentas</p>
          </div>

          {/* Card com borda animada */}
          <div className="card-in card-border-wrap">
            <div className="card-inner">


              <h2 className="text-xl font-bold text-white text-center mb-1">Acesso Restrito</h2>
              <p className="text-slate-500 text-sm text-center mb-6">Insira suas credenciais corporativas</p>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">E-mail Corporativo</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field" placeholder="email@empresa.com" disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Senha</label>
                    <a href="#" className="text-xs" style={{ color:'#7033ff' }}>Esqueceu?</a>
                  </div>
                  <input
                    type="password" value={senha} onChange={e => setSenha(e.target.value)}
                    className="input-field" placeholder="••••••••" disabled={isLoading}
                  />
                </div>

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

          <p className="text-center text-xs text-slate-700 mt-6">
            &copy; 2026 SmartBench System · Acesso monitorado
          </p>
        </div>
      </section>
    </>
  );
}
