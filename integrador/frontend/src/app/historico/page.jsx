"use client"

import SidebarNav from "@/components/Sidebar/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Search, Filter, CalendarDays, Download } from "lucide-react";

export default function HistoricoPage() {

    const historicoMovimentacoes = [
        {
            id: 7,
            transacao: "TRX-0007",
            ferramenta: "Kit Chaves Torx (Jogo 9 peças)",
            tag_rfid: "RFID-FER-006",
            usuario: "Juliana Oliveira",
            perfil: "SUPERVISOR",
            tipo: "RETIRADA",
            dataHora: "Hoje, às 09:45",
            metodo: "MANUAL",
        },
        {
            id: 6,
            transacao: "TRX-0006",
            ferramenta: "Chave de Impacto Pneumática",
            tag_rfid: "RFID-FER-003",
            usuario: "Carlos Silva",
            perfil: "MECANICO",
            tipo: "RETIRADA",
            dataHora: "Hoje, às 08:00",
            metodo: "RFID_AUTOMATICO",
        },
        {
            id: 5,
            transacao: "TRX-0005",
            ferramenta: "Torquímetro Digital 200Nm",
            tag_rfid: "RFID-FER-001",
            usuario: "Bávaro",
            perfil: "MECANICO",
            tipo: "RETIRADA",
            dataHora: "Hoje, às 05:00",
            metodo: "RFID_AUTOMATICO",
        },
        {
            id: 4,
            transacao: "TRX-0004",
            ferramenta: "Alicate Amperímetro",
            tag_rfid: "RFID-FER-002",
            usuario: "Carlos Silva",
            perfil: "MECANICO",
            tipo: "DEVOLUCAO",
            dataHora: "Ontem, às 15:00",
            metodo: "MANUAL",
        },
        {
            id: 3,
            transacao: "TRX-0003",
            ferramenta: "Alicate Amperímetro",
            tag_rfid: "RFID-FER-002",
            usuario: "Carlos Silva",
            perfil: "MECANICO",
            tipo: "RETIRADA",
            dataHora: "Ontem, às 14:00",
            metodo: "MANUAL",
        },
        {
            id: 2,
            transacao: "TRX-0002",
            ferramenta: "Multímetro Digital Fluke",
            tag_rfid: "RFID-FER-004",
            usuario: "Thiago Menezes",
            perfil: "ADMIN",
            tipo: "DEVOLUCAO",
            dataHora: "Ontem, às 10:00",
            metodo: "RFID_AUTOMATICO",
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#121212] text-white font-sans">
            <SidebarNav />

            <main className="flex-1 p-8">

                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-3">
                        <History className="text-[#7033ff] h-8 w-8" />
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Histórico de Movimentações
                        </h2>
                    </div>
                    <p className="text-sm text-gray-400 ml-11">
                        Auditoria completa de todas as retiradas e devoluções registradas no SmartBench.
                    </p>
                </div>

                <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg mb-6">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">

                        <div className="flex w-full md:w-auto gap-4">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por TAG, ferramenta ou mecânico..."
                                    className="h-10 w-full rounded-md border border-gray-700 bg-[#121212] pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7033ff] transition-all"
                                />
                            </div>

                            <button className="flex items-center gap-2 h-10 px-4 rounded-md border border-gray-700 bg-[#121212] text-sm text-gray-300 hover:bg-[#252525] transition-colors">
                                <CalendarDays className="h-4 w-4 text-gray-400" />
                                <span>Últimos 7 dias</span>
                            </button>

                            <button className="flex items-center gap-2 h-10 px-4 rounded-md border border-gray-700 bg-[#121212] text-sm text-gray-300 hover:bg-[#252525] transition-colors">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <span>Filtrar</span>
                            </button>
                        </div>

                        <button className="flex items-center gap-2 h-10 px-4 rounded-md bg-[#7033ff] hover:bg-[#5a28cc] text-sm font-medium text-white transition-colors shadow-md w-full md:w-auto justify-center">
                            <Download className="h-4 w-4" />
                            <span>Exportar Relatório</span>
                        </button>

                    </CardContent>
                </Card>

                <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
                    <CardHeader>
                        <CardTitle>Log de Eventos (Transações)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-transparent">
                                    <TableHead className="text-gray-400">ID Transação</TableHead>
                                    <TableHead className="text-gray-400">Data e Hora</TableHead>
                                    <TableHead className="text-gray-400">Ferramenta</TableHead>
                                    <TableHead className="text-gray-400">Responsável</TableHead>
                                    <TableHead className="text-gray-400">Operação</TableHead>
                                    <TableHead className="text-right text-gray-400">Método de Captura</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historicoMovimentacoes.map((item) => (
                                    <TableRow key={item.id} className="border-gray-800 hover:bg-[#252525] transition-colors">
                                        <TableCell className="font-mono text-xs text-gray-400">{item.transacao}</TableCell>
                                        <TableCell className="text-sm">{item.dataHora}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-white">{item.ferramenta}</div>
                                            <div className="text-xs font-mono text-gray-500">{item.tag_rfid}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-gray-300">{item.usuario}</div>
                                            <div className="text-[10px] text-gray-500 font-bold tracking-wider">{item.perfil}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    item.tipo === "DEVOLUCAO"
                                                        ? "bg-green-500/10 text-green-400 border border-green-900/50"
                                                        : "bg-orange-500/10 text-orange-400 border border-orange-900/50"
                                                }
                                            >
                                                {item.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-xs font-mono text-gray-400 bg-[#121212] px-2 py-1 rounded border border-gray-800 flex items-center justify-end gap-2 w-max ml-auto">
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.metodo === 'RFID_AUTOMATICO' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                {item.metodo.replace("_", " ")}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </main>
        </div>
    );
}