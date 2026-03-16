import Image from "next/image";
import SidebarNav from "@/components/Sidebar/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const resumoEstoque = {
    totalProdutos: 0,
    estoqueBaixo: 0,
    movimentacoesHoje: 0
  };

  const ultimasMovimentacoes = [
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <SidebarNav />

      <main className="flex-1 p-8">
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Visão Geral do Estoque
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acompanhe as movimentações, entradas e saídas recentes dos seus produtos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{resumoEstoque.totalProdutos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{resumoEstoque.estoqueBaixo}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Movimentações Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{resumoEstoque.movimentacoesHoje}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {ultimasMovimentacoes.length > 0 ? (
                  ultimasMovimentacoes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.tipo === "Saída" ? "destructive" : "default"}
                          className={item.tipo === "Entrada" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : ""}
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
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
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