"use client"

import { useState } from "react";
import SidebarNav from "@/components/Sidebar/page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Users, Wrench, Cpu, Bell, Save, Plus, Wifi, Radio } from "lucide-react";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("regras");
  const [isScanning, setIsScanning] = useState(false);

  const handleScanRFID = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-sans">
      <SidebarNav />

      <main className="flex-1 p-8">

        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3">
            <Settings className="text-[#7033ff] h-8 w-8" />
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Configurações do Sistema
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-11">
            Gerencie regras de negócio, usuários, inventário e hardware da bancada.
          </p>
        </div>

        <div className="flex border-b border-gray-800 mb-6 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab("regras")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "regras" ? "border-[#7033ff] text-[#7033ff]" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            <Bell size={18} /> Regras e Alertas
          </button>
          <button 
            onClick={() => setActiveTab("usuarios")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "usuarios" ? "border-[#7033ff] text-[#7033ff]" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            <Users size={18} /> Gestão de Equipe
          </button>
          <button 
            onClick={() => setActiveTab("ferramentas")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "ferramentas" ? "border-[#7033ff] text-[#7033ff]" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            <Wrench size={18} /> Novo Inventário
          </button>
          <button 
            onClick={() => setActiveTab("hardware")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "hardware" ? "border-[#7033ff] text-[#7033ff]" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            <Cpu size={18} /> Hardware (Leitores)
          </button>
        </div>

        {activeTab === "regras" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle>Limites de Tempo</CardTitle>
                <CardDescription className="text-gray-400">Defina os parâmetros para os alertas de atraso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Tempo limite de uso (Horas)</label>
                  <input type="number" defaultValue={4} className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#7033ff]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Aviso prévio de atraso (Minutos)</label>
                  <input type="number" defaultValue={30} className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#7033ff]" />
                </div>
                <button className="flex items-center gap-2 mt-4 bg-[#7033ff] hover:bg-[#5a28cc] text-white px-4 py-2 rounded-md transition-colors font-medium text-sm">
                  <Save size={16} /> Salvar Regras
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "usuarios" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle>Cadastrar Funcionário</CardTitle>
                <CardDescription className="text-gray-400">Adicione um novo membro e vincule o crachá RFID.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <input type="text" placeholder="Ex: João da Silva" className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#7033ff]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Perfil de Acesso</label>
                  <select className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#7033ff]">
                    <option value="MECANICO">Mecânico</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleScanRFID}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium text-sm transition-all border ${isScanning ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 animate-pulse' : 'bg-[#121212] hover:bg-[#252525] text-gray-300 border-gray-700'}`}
                  >
                    <Radio size={18} className={isScanning ? "animate-spin" : ""} />
                    {isScanning ? "Aproxime o Crachá do Leitor..." : "Ler TAG do Crachá"}
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 mt-2 bg-[#7033ff] hover:bg-[#5a28cc] text-white px-4 py-2 rounded-md transition-colors font-medium text-sm">
                  <Plus size={16} /> Finalizar Cadastro
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "ferramentas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle>Cadastrar Ferramenta</CardTitle>
                <CardDescription className="text-gray-400">Insira um novo item no inventário da oficina.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome do Equipamento</label>
                  <input type="text" placeholder="Ex: Chave de Fenda Philips" className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#7033ff]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Peso de Referência (kg) - Sistema RF13</label>
                  <input type="number" step="0.01" placeholder="Ex: 0.45" className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#7033ff]" />
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleScanRFID}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium text-sm transition-all border ${isScanning ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 animate-pulse' : 'bg-[#121212] hover:bg-[#252525] text-gray-300 border-gray-700'}`}
                  >
                    <Radio size={18} className={isScanning ? "animate-spin" : ""} />
                    {isScanning ? "Aproxime a Ferramenta do Leitor..." : "Ler TAG da Ferramenta"}
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm">
                  <Plus size={16} /> Adicionar ao Inventário
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "hardware" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle>Status dos Leitores</CardTitle>
                <CardDescription className="text-gray-400">Monitoramento dos dispositivos IoT da bancada.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-[#121212] border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <Wifi className="text-green-500 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Antena Principal (Bancada A)</p>
                      <p className="text-xs text-gray-400">IP: 192.168.1.105</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-green-500">Online</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#121212] border border-gray-800 rounded-lg opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                      <Wifi className="text-red-500 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-300">Leitor Secundário (Reserva)</p>
                      <p className="text-xs text-gray-500">IP: 192.168.1.106</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    <span className="text-sm font-medium text-red-500">Offline</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-500">
                  <span>Última sincronização do Node.js:</span>
                  <span className="font-mono">Hoje, 10:15</span>
                </div>

              </CardContent>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}