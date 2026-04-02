"use client"

import SidebarNav from "@/components/Sidebar/page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, Clock, AlertTriangle, Search } from "lucide-react";

export default function AtrasosPage() {

  const ferramentasAtrasadas = [
    {
      id: 1,
      tag_rfid: "RFID-FER-001",
      nome: "Torquímetro Digital 200Nm",
      responsavel: "Bávaro",
      perfil: "MECANICO",
      dataRetirada: "Hoje, às 05:00",
      tempoLimite: "4 horas",
      tempoFora: "5h 15m",
      status: "CRÍTICO"
    },
    {
      id: 2,
      tag_rfid: "RFID-FER-007",
      nome: "Macaco Hidráulico Garrafa 2T",
      responsavel: "Lucas Mendes",
      perfil: "MECANICO",
      dataRetirada: "Ontem, às 16:30",
      tempoLimite: "4 horas",
      tempoFora: "17h 45m",
      status: "CRÍTICO"
    },
    {
      id: 3,
      tag_rfid: "RFID-FER-003",
      nome: "Chave de Impacto Pneumática",
      responsavel: "Carlos Silva",
      perfil: "MECANICO",
      dataRetirada: "Hoje, às 08:00",
      tempoLimite: "4 horas",
      tempoFora: "2h 15m",
      status: "ATENÇÃO"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-sans">
      <SidebarNav />

      <main className="flex-1 p-8">

        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3">
            <AlertOctagon className="text-red-500 h-8 w-8" />
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Monitoramento de Atrasos
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-11">
            Gestão de ferramentas que excederam o tempo limite fora da bancada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Total em Atraso</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">2</div>
              <p className="text-xs text-gray-500 mt-1">Ferramentas fora do prazo</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Alertas Críticos</CardTitle>
              <AlertOctagon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">2</div>
              <p className="text-xs text-gray-500 mt-1">+ de 2 horas de atraso</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Próximos do Limite</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">1</div>
              <p className="text-xs text-gray-500 mt-1">Faltam menos de 2 horas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1e1e1e] border-gray-800 text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Relação de Pendências</CardTitle>
              <CardDescription className="text-gray-400">Lista detalhada de equipamentos não devolvidos.</CardDescription>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar responsável ou TAG..."
                className="h-9 w-full rounded-md border border-gray-700 bg-[#121212] pl-8 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Equipamento</TableHead>
                  <TableHead className="text-gray-400">Responsável</TableHead>
                  <TableHead className="text-gray-400">Retirada</TableHead>
                  <TableHead className="text-gray-400">Tempo Fora</TableHead>
                  <TableHead className="text-right text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ferramentasAtrasadas.map((item) => (
                  <TableRow key={item.id} className="border-gray-800 hover:bg-[#252525] transition-colors">
                    <TableCell>
                      <div className="font-medium text-white">{item.nome}</div>
                      <div className="text-xs font-mono text-gray-500">{item.tag_rfid}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300">{item.responsavel}</div>
                      <div className="text-[10px] text-gray-500 font-bold tracking-wider">{item.perfil}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">{item.dataRetirada}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">{item.tempoFora}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "CRÍTICO" && (
                        <Badge className="bg-red-600/20 text-red-500 border border-red-900/50 hover:bg-red-600/30">
                          {item.status}
                        </Badge>
                      )}
                      {item.status === "ATRASADO" && (
                        <Badge className="bg-orange-500/20 text-orange-400 border border-orange-900/50 hover:bg-orange-500/30">
                          {item.status}
                        </Badge>
                      )}
                      {item.status === "ATENÇÃO" && (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-900/50 hover:bg-yellow-500/30">
                          {item.status}
                        </Badge>
                      )}
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