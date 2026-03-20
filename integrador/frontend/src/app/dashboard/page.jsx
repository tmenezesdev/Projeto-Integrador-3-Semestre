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
    totalProdutos: 1284,
    estoqueBaixo: 12,
    movimentacoesHoje: 48
  };

  const alertasAtivos = [
    {
      id: 1,
      ferramenta: "Torquímetro Digital 200Nm",
      mensagem: "Ferramenta está fora da bancada há 5 horas. Limite: 4 horas.",
      responsavel: "Carlos Silva",
      status: "Tempo Excedido"
    },
    {
      id: 2,
      ferramenta: "Alicate Amperímetro",
      mensagem: "Ferramenta está fora da bancada há 6 horas. Limite: 4 horas.",
      responsavel: "Juliana Oliveira",
      status: "Tempo Excedido"
    },
    {
      id: 3,
      ferramenta: "Chave Dinamométrica 150Nm",
      mensagem: "Ferramenta próxima do limite de tempo (3h 30m de 4h).",
      responsavel: "Ana Santos",
      status: "Atraso"
    }
  ];

  const ultimasMovimentacoes = [
    { 
      id: 1, codigo: "PRD-001", nome: "Filtro de Óleo", usuario: "Thiago Menezes", 
      tipo: "Entrada", quantidade: 50, dataHora: "17/03/2026 às 10:30", metodo: "RFID_AUTOMATICO", perfil: "ADMIN"
    },
    { 
      id: 2, codigo: "PRD-042", nome: "Pastilha de Freio", usuario: "Lucas Silva", 
      tipo: "Saída", quantidade: 8, dataHora: "17/03/2026 às 09:15", metodo: "MANUAL", perfil: "MECANICO"
    },
    { 
      id: 3, codigo: "PRD-015", nome: "Correia Dentada", usuario: "Thiago Menezes", 
      tipo: "Entrada", quantidade: 20, dataHora: "17/03/2026 às 08:45", metodo: "RFID_AUTOMATICO", perfil: "ADMIN"
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
            Visão Geral do Estoque
          </h2>
          <p className="text-sm text-gray-400">
            Acompanhe as movimentações, entradas e saídas recentes dos seus produtos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7033ff]">{resumoEstoque.totalProdutos}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{resumoEstoque.estoqueBaixo}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Movimentações Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7033ff]">+{resumoEstoque.movimentacoesHoje}</div>
            </CardContent>
          </Card>
        </div>

        {alertasAtivos.length > 0 && (
          <Card className="bg-[#250808] border-[#611919] text-white shadow-lg mb-8">
            <CardHeader className="pb-4 border-b border-[#4a1c1c]/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500 h-5 w-5" />
                <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                  Alertas Ativos ({alertasAtivos.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              {alertasAtivos.map((alerta) => (
                <div 
                  key={alerta.id} 
                  className="flex justify-between items-center p-4 bg-[#1e1e1e] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white text-base">{alerta.ferramenta}</span>
                    <span className="text-sm text-gray-400">{alerta.mensagem}</span>
                    <span className="text-xs text-gray-500 mt-1">Responsável: {alerta.responsavel}</span>
                  </div>
                  <Badge 
                    className={
                      alerta.status === "Tempo Excedido" 
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-900/50 px-3 py-1" 
                        : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-900/50 px-3 py-1"
                    }
                  >
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
            <CardTitle>Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Código</TableHead>
                  <TableHead className="text-gray-400">Produto</TableHead>
                  <TableHead className="text-gray-400">Usuário</TableHead>
                  <TableHead className="text-gray-400">Tipo</TableHead>
                  <TableHead className="text-right text-gray-400">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasMovimentacoes.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="border-gray-800 cursor-pointer hover:bg-[#252525] transition-colors"
                    onClick={() => handleOpenDetails(item)}
                  >
                    <TableCell className="font-medium text-white">{item.codigo}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell className="text-gray-300">{item.usuario}</TableCell>
                    <TableCell>
                      <Badge className={item.tipo === "Entrada" ? "bg-[#7033ff]/20 text-[#7033ff] border-none" : "bg-red-500/10 text-red-500 border-none"}>
                        {item.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.tipo === "Entrada" ? "+" : "-"}{item.quantidade}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      </Dialog>
    </div>
  );
}