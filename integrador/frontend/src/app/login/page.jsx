"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  // 1. Mudamos o nome de 'identificacao' para 'email' para combinar com o seu backend
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Estados para controlar mensagens de erro e o botão de carregamento
  const [erro, setErro] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  // 2. A função que faz a ponte com o seu Backend Node.js
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(""); 
    
    // Validação rápida no frontend
    if (!email || !senha) {
      setErro("Por favor, preencha o email e a senha.");
      return;
    }

    setIsLoading(true); // Muda o botão para "Entrando..."

    try {
      // 3. Fazendo a requisição para a sua rota de Login
      // ATENÇÃO: Substitua 'http://localhost:3001' pela porta correta do seu backend
      const resposta = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Enviando exatamente os nomes que o seu Controller espera (email e senha)
        body: JSON.stringify({ email, senha }), 
      });

      const data = await resposta.json();

      if (resposta.ok && data.sucesso) {

        localStorage.setItem("smartbench_token", data.dados.token);

        localStorage.setItem("smartbench_user", JSON.stringify(data.dados.usuario));

        router.push("/dashboard");
        
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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#1a0a3a] to-[#121212] overflow-hidden font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7033ff] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="z-10 w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
            Smart<span className="text-[#7033ff]">Bench</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Gestão Inteligente de Ferramentas
          </p>
        </div>

        <Card className="bg-[#1e1e1e]/80 backdrop-blur-md border-gray-800 text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center font-bold">Acesso Restrito</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Insira suas credenciais corporativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-300">E-mail de Acesso</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="flex h-11 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7033ff] transition-all"
                  placeholder="Ex: thiago.menezes@gm.com"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300">Senha</label>
                  <a href="#" className="text-xs text-[#7033ff] hover:text-white transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)} 
                  className="flex h-11 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7033ff] transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              {erro && <p className="text-red-500 text-sm text-center font-medium">{erro}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 bg-[#7033ff] hover:bg-[#5a28cc] text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 shadow-[0_0_15px_rgba(112,51,255,0.3)] hover:shadow-[0_0_25px_rgba(112,51,255,0.5)] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
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