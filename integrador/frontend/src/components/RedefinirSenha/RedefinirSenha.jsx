"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

function RedefinirSenhaForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus]       = useState(null);
  const [mensagem, setMensagem]   = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("erro");
      setMensagem("Link inválido. Solicite uma nova redefinição de senha.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      setStatus("erro");
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmar) {
      setStatus("erro");
      setMensagem("As senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    setStatus(null);
    try {
      const res  = await fetch("http://localhost:3000/api/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nova_senha: novaSenha }),
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        setStatus("sucesso");
        setMensagem(data.mensagem);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("erro");
        setMensagem(data.mensagem || "Erro ao redefinir senha.");
      }
    } catch {
      setStatus("erro");
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section data-login-page className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans" style={{ background: "#04030d" }}>

      <div className="blob-purple absolute pointer-events-none" style={{
        top: "42%", left: "48%", width: "580px", height: "580px",
        background: "radial-gradient(circle,rgba(112,51,255,0.5) 0%,transparent 68%)",
        filter: "blur(48px)", willChange: "transform",
      }} />

      <div className="relative z-10 w-full max-w-md px-4">

        <div className="title-in text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-white">
            Smart<span style={{ color: "#7033ff" }}>Bench</span>
          </h1>
          <p className="text-slate-400 text-base">Redefinição de Senha</p>
        </div>

        <div className="card-in card-border-wrap">
          <div className="card-inner">

            {status === "sucesso" ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle2 size={48} style={{ color: "#4ade80" }} />
                <h2 className="text-xl font-bold text-white">Senha redefinida!</h2>
                <p className="text-slate-400 text-sm">{mensagem}</p>
                <p className="text-slate-500 text-xs">Redirecionando para o login...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white text-center mb-1">Nova Senha</h2>
                <p className="text-slate-400 text-sm text-center mb-6">
                  Crie uma senha forte com pelo menos 6 caracteres.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nova Senha</label>
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={e => setNovaSenha(e.target.value)}
                      className="login-input"
                      placeholder="••••••••"
                      disabled={isLoading || !token}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Confirmar Senha</label>
                    <input
                      type="password"
                      value={confirmar}
                      onChange={e => setConfirmar(e.target.value)}
                      className="login-input"
                      placeholder="••••••••"
                      disabled={isLoading || !token}
                    />
                  </div>

                  {status === "erro" && (
                    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 14px" }}>
                      <p className="text-red-400 text-xs text-center">{mensagem}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !token}
                    style={{
                      marginTop: 4, height: 46, borderRadius: 10,
                      background: isLoading ? "rgba(112,51,255,0.45)" : "#7033ff",
                      color: "#fff", fontWeight: 700, fontSize: 14,
                      border: "none", cursor: isLoading || !token ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.2s, box-shadow 0.2s",
                      boxShadow: isLoading ? "none" : "0 0 24px rgba(112,51,255,0.4)",
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#5a28cc"; }}
                    onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "#7033ff"; }}
                  >
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : "Salvar Nova Senha"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    style={{ background: "none", border: "none", color: "#7033ff", fontSize: 13, cursor: "pointer", textAlign: "center" }}
                  >
                    Voltar ao login
                  </button>
                </form>
              </>
            )}

          </div>
        </div>

        <p className="text-center text-xs text-slate-300 mt-6">
          &copy; 2026 SmartBench System · Acesso monitorado
        </p>
      </div>
    </section>
  );
}

export default function RedefinirSenha() {
  return (
    <Suspense>
      <RedefinirSenhaForm />
    </Suspense>
  );
}
