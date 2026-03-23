"use client";

import React, { useState, useEffect } from "react";
import { ShelvingUnit, Plus, Edit2, Trash2, Search, X, Image as ImageIcon, Upload, LayoutGrid, List, Menu } from "lucide-react";
import SidebarNav from "@/components/Sidebar/page.jsx";

export default function GestaoEstoque() {
  const [ferramentas, setFerramentas] = useState([]);
  const [busca, setBusca] = useState("");
  const [viewMode, setViewMode] = useState("grid"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("estoque_ferramentas");
    if (dadosSalvos) {
      setFerramentas(JSON.parse(dadosSalvos));
    } else {
      setFerramentas([
        { id: "FT-001", nome: "Torquímetro Digital 200Nm", status: "Atrasada", responsavel: "Carlos Silva", quantidade: 1, imagem: "" },
        { id: "FT-003", nome: 'Chave Inglesa 12"', status: "Em uso", responsavel: "João Silva", quantidade: 1, imagem: "" },
      ]);
    }
    setCarregado(true);
  }, []);

  const ferramentasFiltradas = ferramentas.filter(f => 
    f.nome.toLowerCase().includes(busca.toLowerCase()) || f.id.toLowerCase().includes(busca.toLowerCase())
  );

  if (!carregado) return <div className="bg-[#0a0a0a] min-h-screen"></div>;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      
      {/* Sidebar - Fixa no Desktop, Overlay no Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0a0a0a] transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarNav />
      </div>

      {/* Overlay para fechar o menu mobile ao clicar fora */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Container Principal - Ajustado para nunca transbordar */}
      <main className="flex-1 w-full max-w-full min-w-0 p-4 md:p-8">
        
        {/* Header Mobile: Menu Hambúrguer */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#161616] rounded-lg border border-white/5">
            <Menu size={24} className="text-[#7033ff]" />
          </button>
          <span className="font-black text-sm tracking-tighter">SMART<span className="text-[#7033ff]">BENCH</span></span>
          <div className="w-10" /> 
        </div>

        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#7033ff]/10 rounded-lg">
                 <ShelvingUnit size={28} className="text-[#7033ff]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Estoque</h1>
            </div>
            <p className="text-gray-500 text-xs md:text-sm">Controle de ativos e ferramentas de alta precisão</p>
          </div>
          
          <button 
            onClick={() => {
              setItemParaEditar({ id: `FT-${Math.floor(Math.random() * 1000)}`, nome: "", status: "Disponível", responsavel: "-", quantidade: 1, imagem: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#7033ff] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all text-sm"
          >
            <Plus size={18} /> Novo Item
          </button>
        </header>

        {/* Métricas Responsivas: 1 col no celular, 2 no tablet, 4 no desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Geral" value={ferramentas.length} icon="box" />
          <StatCard label="Alertas/Atraso" value={ferramentas.filter(f => f.status === "Atrasada").length} icon="alert" isAlert />
          <StatCard label="Em Operação" value={ferramentas.filter(f => f.status === "Em uso").length} icon="pulse" />
          <StatCard label="Patrimônio" value={ferramentas.length} icon="shield" />
        </div>

        {/* Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" placeholder="Pesquisar ferramenta ou código..." 
              className="w-full bg-[#161616] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#7033ff]/50 text-sm transition-all"
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex bg-[#161616] p-1 rounded-xl border border-white/5 w-fit self-end">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-[#7033ff]" : "text-gray-500"}`}><LayoutGrid size={18}/></button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-[#7033ff]" : "text-gray-500"}`}><List size={18}/></button>
          </div>
        </div>

        {/* Grid de Ferramentas - Ajustado para Mobile */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {ferramentasFiltradas.map((item) => (
              <div key={item.id} className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden flex flex-col group transition-all">
                <div className="relative h-44 bg-[#1a1a1a] flex items-center justify-center p-4">
                  {item.imagem ? <img src={item.imagem} className="max-h-full object-contain" /> : <ImageIcon size={32} className="text-white/5" />}
                  <div className="absolute top-3 left-3"><StatusBadge status={item.status} /></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sm mb-1 truncate">{item.nome}</h3>
                  <p className="text-[10px] text-gray-600 font-mono mb-6 uppercase">{item.id}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                      <button onClick={() => {setItemParaEditar(item); setIsModalOpen(true);}} className="p-2 hover:text-[#7033ff] transition-colors"><Edit2 size={16}/></button>
                      <button className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Qtd: <span className="text-white">{item.quantidade}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tabela vira cards no mobile para não quebrar layout */
          <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white/5 text-[10px] uppercase font-black text-gray-500">
                <tr>
                  <th className="px-6 py-4">Ferramenta</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Responsável</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {ferramentasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-bold">{item.nome}</td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 text-gray-400">{item.responsavel}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 text-gray-500">
                         <button className="p-1 hover:text-white"><Edit2 size={16}/></button>
                         <button className="p-1 hover:text-red-500"><Trash2 size={16}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponentes com Design Corrigido
function StatCard({ label, value, isAlert }) {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${isAlert ? 'bg-red-500' : 'bg-[#7033ff]'}`} />
      <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider block mb-1">{label}</span>
      <span className={`text-3xl font-black ${isAlert ? 'text-red-500' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const isAtrasada = status === "Atrasada";
  return (
    <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider ${
      isAtrasada ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
    }`}>
      {status}
    </span>
  );
}