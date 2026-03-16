import Image from "next/image";
import SidebarNav from "@/components/Sidebar/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// 1. Faltou essa importação aqui:
import { EstoqueChart } from "@/components/EstoqueChart";

export default function Dashboard() {
  const resumoEstoque = {
    totalProdutos: 1284,
    estoqueBaixo: 12,
    movimentacoesHoje: 48
  };

  const ultimasMovimentacoes = [
    { id: 1, codigo: "PRD-001", nome: "Filtro de Óleo", tipo: "Entrada", quantidade: 50 },
    { id: 2, codigo: "PRD-042", nome: "Pastilha de Freio", tipo: "Saída", quantidade: 8 },
    { id: 3, codigo: "PRD-015", nome: "Correia Dentada", tipo: "Entrada", quantidade: 20 },
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
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
          <Card className="bg-[#1e1e1e] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7033ff]">{resumoEstoque.totalProdutos}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{resumoEstoque.estoqueBaixo}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Movimentações Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7033ff]">+{resumoEstoque.movimentacoesHoje}</div>
            </CardContent>
          </Card>
        </div>

        {/* 2. E faltou colocar a tag do gráfico aqui! */}
        <EstoqueChart />

        <Card className="bg-[#1e1e1e] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Código</TableHead>
                  <TableHead className="text-gray-400">Produto</TableHead>
                  <TableHead className="text-gray-400">Tipo</TableHead>
                  <TableHead className="text-right text-gray-400">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasMovimentacoes.length > 0 ? (
                  ultimasMovimentacoes.map((item) => (
                    <TableRow key={item.id} className="border-gray-800">
                      <TableCell className="font-medium text-white">{item.codigo}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.tipo === "Saída" ? "destructive" : "default"}
                          className={item.tipo === "Entrada" ? "bg-[#7033ff]/20 text-[#7033ff] hover:bg-[#7033ff]/30 border-none" : ""}
                        >
                          {item.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.tipo === "Entrada" ? "+" : "-"}{item.quantidade}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500 hover:bg-transparent">
                      Nenhuma movimentação registrada no banco de dados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}