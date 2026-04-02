"use client"

import { useState } from "react";
import SidebarNav from "@/components/Sidebar/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EstoqueChart } from "@/components/EstoqueChart";
import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Dashboard() {
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resumoEstoque = {
    totalFerramentas: 8,
    emUso: 3,
    alertas: 2
  };

  const alertasAtivos = [
    {
      id: 1,
      ferramenta: "Torquímetro Digital 200Nm",
      mensagem: "Ferramenta fora da bancada há mais de 4 horas. Limite de tempo excedido.",
      status: "ATIVO"
    },
    {
      id: 8,
      ferramenta: "Lanterna de Inspeção LED",
      mensagem: "Ferramenta enviada para calibração. Retorno previsto para amanhã.",
      status: "ATIVO"
    }
  ];

  const ultimasMovimentacoes = [
    {
      id: 7,
      tag_rfid: "RFID-FER-006",
      ferramenta: "Kit Chaves Torx (Jogo 9 peças)",
      usuario: "Juliana Oliveira",
      perfil: "SUPERVISOR",
      tipo: "RETIRADA",
      metodo: "MANUAL",
      dataHora: "Hoje, há 30 min"
    },
    {
      id: 6,
      tag_rfid: "RFID-FER-003",
      ferramenta: "Chave de Impacto Pneumática",
      usuario: "Carlos Silva",
      perfil: "MECANICO",
      tipo: "RETIRADA",
      metodo: "RFID_AUTOMATICO",
      dataHora: "Hoje, há 2 horas"
    },
    {
      id: 5,
      tag_rfid: "RFID-FER-001",
      ferramenta: "Torquímetro Digital 200Nm",
      usuario: "Bávaro",
      perfil: "MECANICO",
      tipo: "RETIRADA",
      metodo: "RFID_AUTOMATICO",
      dataHora: "Hoje, há 5 horas"
    },
    {
      id: 4,
      tag_rfid: "RFID-FER-002",
      ferramenta: "Alicate Amperímetro",
      usuario: "Carlos Silva",
      perfil: "MECANICO",
      tipo: "DEVOLUCAO",
      metodo: "MANUAL",
      dataHora: "Ontem"
    },
  ];

  const handleOpenDetails = (item) => {
    setMovimentacaoSelecionada(item);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-sans">
      <SidebarNav />

      <main className="flex-1 p-8">
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Visão Geral da Bancada
          </h2>
          <p className="text-sm text-gray-400">
            Acompanhe o status físico das ferramentas em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total de Ferramentas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7033ff]">{resumoEstoque.totalFerramentas}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Ferramentas Em Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{resumoEstoque.emUso}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{resumoEstoque.alertas}</div>
            </CardContent>
          </Card>
        </div>

        {alertasAtivos.length > 0 && (
          <Card className="bg-[#170f0f] border-[#4a1c1c] text-white shadow-lg mb-8">
            <CardHeader className="pb-4 border-b border-[#4a1c1c]/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500 h-5 w-5" />
                <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                  Alertas do Sistema ({alertasAtivos.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              {alertasAtivos.map((alerta) => (
                <div key={alerta.id} className="flex justify-between items-center p-4 bg-[#1e1e1e] border border-gray-800 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white text-base">{alerta.ferramenta}</span>
                    <span className="text-sm text-gray-400">{alerta.mensagem}</span>
                  </div>
                  <Badge className="bg-red-500/10 text-red-500 border border-red-900/50 px-3 py-1">
                    {alerta.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <EstoqueChart />

        <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">TAG RFID</TableHead>
                  <TableHead className="text-gray-400">Ferramenta</TableHead>
                  <TableHead className="text-gray-400">Mecânico/Usuário</TableHead>
                  <TableHead className="text-gray-400">Operação</TableHead>
                  <TableHead className="text-right text-gray-400">Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasMovimentacoes.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-gray-800 cursor-pointer hover:bg-[#252525] transition-colors"
                    onClick={() => handleOpenDetails(item)}
                  >
                    <TableCell className="font-mono text-xs text-gray-400">{item.tag_rfid}</TableCell>
                    <TableCell className="font-medium text-white">{item.ferramenta}</TableCell>
                    <TableCell>
                      <div className="text-gray-300">{item.usuario}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={item.tipo === "DEVOLUCAO" ? "bg-green-500/10 text-green-400 border-none" : "bg-orange-500/10 text-orange-400 border-none"}>
                        {item.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-400">{item.dataHora}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1e1e1e] border-gray-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#7033ff] text-2xl font-bold">Detalhes da Transação</DialogTitle>
            <DialogDescription className="text-gray-400">
              ID da Transação: #{movimentacaoSelecionada?.id}
            </DialogDescription>
          </DialogHeader>

          {movimentacaoSelecionada && (
            <div className="grid gap-6 py-4 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ferramenta</p>
                  <p className="text-sm font-semibold">{movimentacaoSelecionada.ferramenta}</p>
                  <p className="text-[11px] font-mono text-gray-400">{movimentacaoSelecionada.tag_rfid}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Operação</p>
                  <Badge className={movimentacaoSelecionada.tipo === "DEVOLUCAO" ? "bg-green-600 text-white" : "bg-orange-600 text-white"}>
                    {movimentacaoSelecionada.tipo}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Responsável</p>
                  <p className="text-sm">{movimentacaoSelecionada.usuario}</p>
                  <p className="text-[10px] text-[#7033ff] font-bold">Perfil: {movimentacaoSelecionada.perfil}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Data/Hora</p>
                  <p className="text-sm">{movimentacaoSelecionada.dataHora}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Método de Captura</p>
                <div className="flex items-center gap-2 bg-[#121212] p-2 rounded border border-gray-800">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${movimentacaoSelecionada.metodo === 'RFID_AUTOMATICO' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'}`} />
                  <p className="text-xs font-mono">{movimentacaoSelecionada.metodo}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}