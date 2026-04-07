"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(""); 
    
    if (!email || !senha) {
      setErro("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);

    try {
      const resposta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await resposta.json();

      if (resposta.ok && data.sucesso) {
        const usuario = data.dados.usuario;
        
        console.log("DADOS DO USUÁRIO RECEBIDOS:", usuario); // Ajuda a debugar no F12

        // Salvando no navegador
        localStorage.setItem("smartbench_token", data.dados.token);
        localStorage.setItem("smartbench_user", JSON.stringify(usuario));

        // Pega o perfil e transforma em maiúsculo para evitar erro de digitação do banco
        const perfilBruto = usuario.tipo_perfil || usuario.cargo || "";
        const perfilUsuario = String(perfilBruto).toUpperCase();

        if (perfilUsuario === 'SUPERVISOR') {
          router.push("/Supervisor"); // Manda o supervisor para a pasta correta
        } else if (perfilUsuario === 'ADMIN') {
          router.push("/dashboard"); // Admin vai para o Dashboard (já que /Admin não existe)
        } else {
          // Fallback caso seja um usuário comum ou mecânico
          router.push("/dashboard"); 
        }
        
      } else {
        setErro(data.mensagem || "Erro ao tentar fazer login.");
      }
      
    } catch (error) {
      console.error("Erro de conexão:", error);
      setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-primaria via-[#1a0a3a] to-primaria overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-segundaria opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="z-10 w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
            Smart<span className="text-segundaria">Bench</span>
          </h1>
          <p className="text-gray-400 text-lg">Gestão Inteligente de Ferramentas</p>
        </div>

        <Card className="bg-[#1e1e1e]/80 backdrop-blur-md border-gray-800 text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center font-bold">Acesso Restrito</CardTitle>
            <CardDescription className="text-center text-gray-400">Insira suas credenciais corporativas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-300">E-mail Corporativo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-gray-700 bg-primaria px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-segundaria transition-all"
                  placeholder="Ex: thiago.menezes@gm.com"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300">Senha</label>
                  <a href="#" className="text-xs text-segundaria hover:text-white transition-colors">Esqueceu a senha?</a>
                </div>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)} 
                  className="flex h-11 w-full rounded-md border border-gray-700 bg-primaria px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-segundaria transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              {erro && <p className="text-red-500 text-sm text-center font-medium">{erro}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 bg-segundaria hover:bg-[#5a28cc] text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 shadow-[0_0_15px_rgba(112,51,255,0.3)] hover:shadow-[0_0_25px_rgba(112,51,255,0.5)] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Autenticando..." : "Entrar no Sistema"}
              </button>

            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-8">
          &copy; 2026 SmartBench System. Acesso monitorado.
        </p>
      </div>
    </section>
  );
}