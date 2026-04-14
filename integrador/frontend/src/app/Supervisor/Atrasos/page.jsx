'use client';

import { useState, useEffect } from "react";
import { AlertOctagon, Clock, AlertTriangle, Search, Loader2, User, AlertCircle } from "lucide-react";
// Importando o modal que vamos usar
import ModalDetalhesAtraso from "@/components/ModalDetalhesAtraso/page";

const API = 'http://localhost:3000/api/supervisor';

const STATUS_CONFIG = {
    'CRÍTICO': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400', left: 'border-l-red-500/40' },
    'ATRASADO': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-400', left: 'border-l-orange-500/40' },
    'ATENÇÃO': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400', left: 'border-l-amber-500/40' },
};

export default function AtrasosPage() {
    const [ferramentas, setFerramentas] = useState([]);
    const [busca, setBusca] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(false);

    // --- ESTADOS DO MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        titulo: "",
        cor: "red",
        dados: []
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API}/atrasos`);
                if (!res.ok) throw new Error();
                setFerramentas(await res.json());
            } catch { setErro(true); }
            finally { setIsLoading(false); }
        };
        load();
    }, []);

    // --- FUNÇÃO PARA ABRIR O MODAL ---
    const abrirDetalhes = (tipo) => {
        let titulo = "";
        let cor = "red";
        let dados = [];

        if (tipo === 'TOTAL') {
            titulo = "Total em Atraso";
            cor = "red";
            dados = ferramentas.filter(f => f.status === 'CRÍTICO' || f.status === 'ATRASADO');
        } else if (tipo === 'CRITICO') {
            titulo = "Alertas Críticos";
            cor = "red";
            dados = ferramentas.filter(f => f.status === 'CRÍTICO');
        } else if (tipo === 'ATENCAO') {
            titulo = "Próximos do Limite";
            cor = "amber";
            dados = ferramentas.filter(f => f.status === 'ATENÇÃO');
        }

        setModalConfig({ titulo, cor, dados });
        setIsModalOpen(true);
    };

    const filtradas = ferramentas.filter(f => {
        const termo = busca.toLowerCase();
        return (
            (f.nome && f.nome.toLowerCase().includes(termo)) ||
            (f.responsavel && f.responsavel.toLowerCase().includes(termo)) ||
            (f.tagRfid && f.tagRfid.toLowerCase().includes(termo))
        );
    });

    const totalRealmenteAtrasado = ferramentas.filter(f =>
        f.status === 'CRÍTICO' || f.status === 'ATRASADO'
    ).length;

    const criticosCount = ferramentas.filter(f => f.status === 'CRÍTICO').length;
    const atencaoCount = ferramentas.filter(f => f.status === 'ATENÇÃO').length;

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#060d1f]">
            <Loader2 className="animate-spin text-red-400 w-10 h-10" />
        </div>
    );

    if (erro) return (
        <div className="flex items-center justify-center min-h-screen bg-[#060d1f]">
            <div className="text-center">
                <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
                <p className="text-white font-semibold">Erro ao carregar atrasos</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 p-8 bg-[#060d1f] min-h-screen text-white font-sans">

            <div className="flex flex-col gap-1 mb-10">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Pendências</p>
                <div className="flex items-center gap-3">
                    <AlertOctagon className="text-red-400 h-7 w-7" />
                    <h1 className="text-3xl font-bold text-white tracking-tight">Monitoramento de Atrasos</h1>
                </div>
                <p className="text-sm text-slate-500 mt-1 ml-10">Ferramentas que excederam o tempo limite fora da bancada.</p>
            </div>

            {/* KPIs - Agora com onClick e cursor-pointer */}
            <div className="grid grid-cols-3 gap-4 mb-10">

                {/* Total em Atraso */}
                <div
                    onClick={() => abrirDetalhes('TOTAL')}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 cursor-pointer hover:bg-red-500/10 transition-all group"
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Total em Atraso</p>
                        <Clock size={14} className="text-red-400 group-hover:scale-110 transition-transform" />
                    </div>
                    {/* AQUI: Trocamos ferramentas.length por totalRealmenteAtrasado */}
                    <p className="text-4xl font-bold text-red-400">{totalRealmenteAtrasado}</p>
                    <p className="text-xs text-slate-600 mt-1">ferramentas pendentes</p>
                </div>

                {/* Alertas Críticos */}
                <div
                    onClick={() => abrirDetalhes('CRITICO')}
                    className="bg-red-500/5 border border-red-600/20 rounded-xl p-5 cursor-pointer hover:bg-red-600/10 transition-all group"
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Alertas Críticos</p>
                        <AlertOctagon size={14} className="text-red-500 group-hover:animate-pulse" />
                    </div>
                    <p className="text-4xl font-bold text-red-500">{criticosCount}</p>
                    <p className="text-xs text-slate-600 mt-1">+ de 4h de atraso</p>
                </div>

                {/* Próximos do Limite */}
                <div
                    onClick={() => abrirDetalhes('ATENCAO')}
                    className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 cursor-pointer hover:bg-amber-500/10 transition-all group"
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Próximos do Limite</p>
                        <AlertTriangle size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                    </div>
                    <p className="text-4xl font-bold text-amber-400">{atencaoCount}</p>
                    <p className="text-xs text-slate-600 mt-1">faltam menos de 2h</p>
                </div>
            </div>

            {/* Tabela (mesmo código que você já tem) */}
            <div className="bg-[#0a1628] border border-slate-700/30 rounded-xl overflow-hidden">
                {/* ... (conteúdo da sua tabela Search, header, etc) ... */}
                {/* Mantive sua lógica original da tabela aqui para o código não ficar gigante */}
                <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-200">Relação de Pendências</h2>
                        <p className="text-xs text-slate-600 mt-0.5">Equipamentos não devolvidos dentro do prazo.</p>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full bg-[#060d1f] border border-slate-700/40 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    {/* ... Seu thead e tbody mapeando 'filtradas' ... */}
                    {/* (Omitido para brevidade, mas você mantém igual ao seu original) */}
                </table>
            </div>

            {/* --- RENDERIZAÇÃO DO MODAL --- */}
            <ModalDetalhesAtraso
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                titulo={modalConfig.titulo}
                cor={modalConfig.cor}
                dados={modalConfig.dados}
            />
        </div>
    );
}