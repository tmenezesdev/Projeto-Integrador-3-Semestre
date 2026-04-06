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

  if (!carregado) return <div className="bg-[#121212] min-h-screen"></div>;

  return (
    <div className="flex flex-row min-h-screen w-full bg-[#121212] text-white font-sans overflow-x-hidden">
      
      <SidebarNav />

      <main className="flex-1 w-full min-w-0 p-4 md:p-8 h-screen overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10 mt-4 md:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShelvingUnit className="text-[#7033ff]" /> Estoque
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Controle de ativos e ferramentas de alta precisão</p>
          </div>
          <button
            onClick={() => {
              setItemParaEditar({ id: `FT-${Math.floor(Math.random() * 1000)}`, nome: "", status: "Disponível", responsavel: "-", quantidade: 1, imagem: "" });
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-[#7033ff] px-6 py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#8247ff] active:scale-95 transition-all"
          >
            <Plus size={18} /> Novo Item
          </button>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          <StatCard label="Total" value={ferramentas.reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-white" barColor="bg-[#7033ff]" />
          <StatCard label="Atrasadas" value={ferramentas.filter(f => f.status === "Atrasada").reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-red-500" barColor="bg-red-500" />
          <StatCard label="Em Uso" value={ferramentas.filter(f => f.status === "Em uso").reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-blue-400" barColor="bg-blue-400" />
          <StatCard label="Disponíveis" value={ferramentas.filter(f => f.status === "Disponível").reduce((acc, f) => acc + Number(f.quantidade), 0)} color="text-emerald-500" barColor="bg-emerald-500" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text" placeholder="Pesquisar por nome ou ID..."
              className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-[#7033ff]/50 transition-all text-sm"
              value={busca} onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex bg-[#1e1e1e] p-1 rounded-lg border border-gray-800 w-full sm:w-fit justify-center">
            <button onClick={() => setViewMode("grid")} className={`flex-1 sm:flex-none p-2 rounded-md flex justify-center cursor-pointer transition-all ${viewMode === "grid" ? "bg-[#7033ff] text-white" : "text-gray-400 hover:text-white"}`}><LayoutGrid size={18}/></button>
            <button onClick={() => setViewMode("list")} className={`flex-1 sm:flex-none p-2 rounded-md flex justify-center cursor-pointer transition-all ${viewMode === "list" ? "bg-[#7033ff] text-white" : "text-gray-400 hover:text-white"}`}><List size={18}/></button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20 md:pb-6">
            {ferramentasFiltradas.map((item) => (
              <div key={item.id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden group hover:border-gray-700 transition-all shadow-lg flex flex-col">
                <div className="relative h-48 bg-[#121212] flex items-center justify-center p-0 overflow-hidden flex-shrink-0">
                  {item.imagem ? (
                    <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <ImageIcon size={40} className="text-gray-800" />
                  )}
                  <div className="absolute top-4 left-4"><StatusBadge status={item.status} /></div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base text-white mb-1 truncate" title={item.nome}>{item.nome}</h3>
                  <p className="text-sm text-gray-400 mb-5">{item.id}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex gap-4">
                      <button onClick={() => { setItemParaEditar(item); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#7033ff] cursor-pointer transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => { if(confirm("Remover?")) setFerramentas(f => f.filter(x => x.id !== item.id)) }} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={18}/></button>
                    </div>
                    <span className="text-sm font-medium text-gray-400">Qtd: <span className="text-white ml-1">{item.quantidade}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-x-auto shadow-lg pb-20 md:pb-0 w-full">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-[#1e1e1e] text-sm font-medium text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Item</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Responsável</th>
                  <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {ferramentasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#121212] overflow-hidden flex-shrink-0 border border-gray-800 flex items-center justify-center">
                        {item.imagem ? <img src={item.imagem} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-700" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate max-w-[200px] md:max-w-xs">{item.nome}</div>
                        <div className="text-sm text-gray-400">{item.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">{item.responsavel}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-4 text-gray-400">
                         <button onClick={() => { setItemParaEditar(item); setIsModalOpen(true); }} className="hover:text-white cursor-pointer transition-colors"><Edit2 size={18}/></button>
                         <button onClick={() => { if(confirm("Remover?")) setFerramentas(f => f.filter(x => x.id !== item.id)) }} className="hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={18}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-tight text-white">Editar Ativo</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#2a2a2a] rounded-full cursor-pointer transition-colors text-gray-400 hover:text-white"><X size={20}/></button>
              </div>

              <form className="space-y-5" onSubmit={handleSalvar}>
                <div className="flex justify-center mb-6">
                  <label className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg bg-[#121212] border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-[#7033ff]/50 hover:bg-[#151515] transition-all overflow-hidden group">
                    {itemParaEditar?.imagem ? (
                      <>
                        <img src={itemParaEditar.imagem} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <Camera size={28} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-[#7033ff] transition-colors">
                        <Camera size={28} className="md:w-8 md:h-8" />
                        <span className="text-xs md:text-sm font-medium">Adicionar Foto</span>
                      </div>
                    )}
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
                    <label className="text-sm font-medium text-gray-400">Status</label>
                    <select
                      value={itemParaEditar?.status}
                      onChange={(e) => setItemParaEditar({...itemParaEditar, status: e.target.value})}
                      className="w-full bg-[#121212] border border-gray-800 rounded-md p-2.5 text-sm text-white outline-none focus:border-[#7033ff] cursor-pointer"
                    >
                      <option value="Disponível">Disponível</option>
                      <option value="Em uso">Em uso</option>
                      <option value="Atrasada">Atrasada</option>
                    </select>
                  </div>
                  <InputBox label="Qtd" type="number" value={itemParaEditar?.quantidade} onChange={(v) => setItemParaEditar({...itemParaEditar, quantidade: v})} />
                </div>
                <button type="submit" className="w-full bg-[#7033ff] py-3 rounded-md font-medium text-sm text-white hover:bg-[#8247ff] transition-all mt-6">Salvar Alterações</button>
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
    <div className="bg-[#161616] border border-white/5 rounded-xl p-3 md:p-6 relative overflow-hidden shadow-lg flex flex-col justify-center">
      <div className={`absolute top-0 left-0 w-1 h-full ${barColor}`} />
      <span className={`text-[10px] md:text-xs uppercase font-black tracking-widest block mb-1 opacity-70 ${color}`}>{label}</span>
      <span className="text-2xl md:text-3xl font-black text-white leading-none tracking-tighter truncate">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Atrasada": "bg-red-500/10 text-red-500",
    "Em uso": "bg-blue-400/10 text-blue-400",
    "Disponível": "bg-emerald-500/10 text-emerald-500"
  };
  return <span className={`text-xs px-2.5 py-1 rounded-md font-medium border-none whitespace-nowrap ${styles[status]}`}>{status}</span>;
}

function InputBox({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <input
        required
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#121212] border border-gray-800 rounded-md p-2.5 text-sm text-white outline-none focus:border-[#7033ff] transition-all"
      />
    </div>
  );
}