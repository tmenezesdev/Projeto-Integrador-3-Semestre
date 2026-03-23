"use client";

import React, { useState, useEffect } from "react";
import { ShelvingUnit, Plus, Edit2, Trash2, Search, X, Image as ImageIcon, LayoutGrid, List, Camera } from "lucide-react";
import SidebarNav from "@/components/Sidebar/page.jsx";

export default function GestaoEstoque() {
  const [ferramentas, setFerramentas] = useState([]);
  const [busca, setBusca] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("estoque_ferramentas");
    if (dadosSalvos) {
      setFerramentas(JSON.parse(dadosSalvos));
    } else {
      setFerramentas([
        { 
          id: "FT-001", 
          nome: "Torquímetro Digital 200Nm", 
          status: "Atrasada", 
          responsavel: "Carlos Silva", 
          quantidade: 1, 
          imagem: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop" 
        },
        { 
          id: "FT-002", 
          nome: "Multímetro Industrial", 
          status: "Disponível", 
          responsavel: "-", 
          quantidade: 5, 
          imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500&auto=format&fit=crop" 
        },
        { 
          id: "FT-003", 
          nome: 'Chave Inglesa 12"', 
          status: "Em uso", 
          responsavel: "João Silva", 
          quantidade: 1, 
          imagem: "https://images.unsplash.com/photo-1530124560676-4fbc912f22c5?q=80&w=500&auto=format&fit=crop" 
        },
      ]);
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("estoque_ferramentas", JSON.stringify(ferramentas));
    }
  }, [ferramentas, carregado]);

  const ferramentasFiltradas = ferramentas.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) || f.id.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSalvar = (e) => {
    e.preventDefault();
    const itemFormatado = { ...itemParaEditar, quantidade: Number(itemParaEditar.quantidade) };
    const index = ferramentas.findIndex(f => f.id === itemFormatado.id);
    
    if (index !== -1) {
      const novas = [...ferramentas];
      novas[index] = itemFormatado;
      setFerramentas(novas);
    } else {
      setFerramentas([...ferramentas, itemFormatado]);
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemParaEditar({ ...itemParaEditar, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!carregado) return <div className="bg-[#0a0a0a] min-h-screen"></div>;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans">
      
      <aside className="sticky top-0 h-screen w-20 lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex-shrink-0 transition-all duration-300">
        <SidebarNav />
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
              <ShelvingUnit className="text-[#7033ff]" /> Estoque
            </h1>
            <p className="text-gray-500 text-[10px] md:text-xs">Controle de ativos e ferramentas de alta precisão</p>
          </div>
          <button 
            onClick={() => {
              setItemParaEditar({ id: `FT-${Math.floor(Math.random() * 1000)}`, nome: "", status: "Disponível", responsavel: "-", quantidade: 1, imagem: "" });
              setIsModalOpen(true);
            }} 
            className="w-full lg:w-auto bg-[#7033ff] px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-[#8247ff] active:scale-95 transition-all"
          >
            <Plus size={18} /> Novo Item
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-20">
          <StatCard label="Total" value={ferramentas.reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-white" barColor="bg-[#7033ff]" />
          <StatCard label="Atrasadas" value={ferramentas.filter(f => f.status === "Atrasada").reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-red-500" barColor="bg-red-500" />
          <StatCard label="Em Uso" value={ferramentas.filter(f => f.status === "Em uso").reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-blue-400" barColor="bg-blue-400" />
          <StatCard label="Disponíveis" value={ferramentas.filter(f => f.status === "Disponível").reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-emerald-500" barColor="bg-emerald-500" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" placeholder="Pesquisar por nome ou ID..." 
              className="w-full bg-[#161616] border border-white/5 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#7033ff]/50 transition-all text-sm"
              value={busca} onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex bg-[#161616] p-1 rounded-xl border border-white/5 w-fit self-end md:self-auto">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg cursor-pointer transition-all ${viewMode === "grid" ? "bg-[#7033ff] text-white" : "text-gray-500 hover:text-white"}`}><LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-lg cursor-pointer transition-all ${viewMode === "list" ? "bg-[#7033ff] text-white" : "text-gray-500 hover:text-white"}`}><List size={20}/></button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {ferramentasFiltradas.map((item) => (
              <div key={item.id} className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all shadow-xl">
                <div className="relative h-48 bg-[#1a1a1a] flex items-center justify-center p-0 overflow-hidden">
                  {item.imagem ? (
                    <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  ) : (
                    <ImageIcon size={40} className="text-white/5" />
                  )}
                  <div className="absolute top-4 left-4"><StatusBadge status={item.status} /></div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-bold text-sm mb-1 truncate">{item.nome}</h3>
                  <p className="text-[9px] text-gray-600 font-mono mb-4 md:mb-6 uppercase tracking-widest">{item.id}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-4">
                      <button onClick={() => { setItemParaEditar(item); setIsModalOpen(true); }} className="text-gray-500 hover:text-[#7033ff] cursor-pointer transition-all active:scale-125"><Edit2 size={16}/></button>
                      <button onClick={() => { if(confirm("Remover?")) setFerramentas(f => f.filter(x => x.id !== item.id)) }} className="text-gray-500 hover:text-red-500 cursor-pointer transition-all active:scale-125"><Trash2 size={16}/></button>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase">Qtd: <span className="text-white ml-1">{item.quantidade}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white/5 text-[9px] md:text-[10px] uppercase font-black text-gray-500 tracking-widest">
                <tr>
                  <th className="px-6 py-5">Item</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Responsável</th>
                  <th className="px-6 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ferramentasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] overflow-hidden flex-shrink-0 border border-white/5">
                        {item.imagem ? <img src={item.imagem} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="m-auto mt-3 text-white/10" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{item.nome}</div>
                        <div className="text-[9px] text-gray-600 font-mono">{item.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{item.responsavel}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-4 text-gray-500">
                         <button onClick={() => { setItemParaEditar(item); setIsModalOpen(true); }} className="hover:text-white cursor-pointer"><Edit2 size={16}/></button>
                         <button onClick={() => { if(confirm("Remover?")) setFerramentas(f => f.filter(x => x.id !== item.id)) }} className="hover:text-red-500 cursor-pointer"><Trash2 size={16}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL ATUALIZADO AQUI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-[#161616] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Editar Ativo</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full cursor-pointer transition-colors text-white"><X size={20}/></button>
              </div>

              <form className="space-y-5" onSubmit={handleSalvar}>
                
                {/* UPLOAD EM FORMATO DE QUADRADO NO TOPO */}
                <div className="flex justify-center mb-6">
                  <label className="relative w-120 h-75 rounded-2xl bg-[#1a1a1a] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#7033ff]/50 hover:bg-[#1a1a1a]/80 transition-all overflow-hidden group">
                    {itemParaEditar?.imagem ? (
                      <>
                        <img src={itemParaEditar.imagem} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <Camera size={28} className="text-white drop-shadow-lg" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-[#7033ff] transition-colors">
                        <Camera size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Foto</span>
                      </div>
                    )}
                    {/* INPUT ESCONDIDO */}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputBox label="Nome do Item" value={itemParaEditar?.nome} onChange={(v) => setItemParaEditar({...itemParaEditar, nome: v})} />
                  <InputBox label="ID" value={itemParaEditar?.id} onChange={(v) => setItemParaEditar({...itemParaEditar, id: v})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Status</label>
                    <select 
                      value={itemParaEditar?.status} 
                      onChange={(e) => setItemParaEditar({...itemParaEditar, status: e.target.value})} 
                      className="bg-[#1a1a1a] border border-white/5 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#7033ff] cursor-pointer"
                    >
                      <option value="Disponível">Disponível</option>
                      <option value="Em uso">Em uso</option>
                      <option value="Atrasada">Atrasada</option>
                    </select>
                  </div>
                  <InputBox label="Qtd" type="number" value={itemParaEditar?.quantidade} onChange={(v) => setItemParaEditar({...itemParaEditar, quantidade: v})} />
                </div>
                <button type="submit" className="w-full bg-[#7033ff] py-4 rounded-xl font-black uppercase text-sm cursor-pointer hover:bg-[#8247ff] transition-all mt-4">Salvar Alterações</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, barColor }) {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-xl p-3 md:p-6 relative overflow-hidden shadow-lg">
      <div className={`absolute top-0 left-0 w-1 h-full ${barColor}`} />
      <span className={`text-[8px] md:text-[10px] uppercase font-black tracking-widest block mb-1 opacity-70 ${color}`}>{label}</span>
      <span className="text-xl md:text-3xl font-black text-white leading-none tracking-tighter">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Atrasada": "bg-red-500/10 text-red-500 border-red-500/20",
    "Em uso": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Disponível": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  };
  return <span className={`text-[8px] md:text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest border ${styles[status]}`}>{status}</span>;
}

function InputBox({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{label}</label>
      <input 
        required
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-[#1a1a1a] border border-white/5 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#7033ff]/50 transition-all"
      />
    </div>
  );
}