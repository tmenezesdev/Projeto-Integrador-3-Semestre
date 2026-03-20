"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 1. Expandimos os dados para simular 3 meses inteiros
const allChartData = [
  { data: "10 Jan", entradas: 90, saidas: 60 },
  { data: "25 Jan", entradas: 110, saidas: 80 },
  { data: "05 Fev", entradas: 140, saidas: 90 },
  { data: "20 Fev", entradas: 160, saidas: 100 },
  { data: "01 Mar", entradas: 120, saidas: 80 },
  { data: "04 Mar", entradas: 250, saidas: 130 },
  { data: "08 Mar", entradas: 180, saidas: 90 },
  { data: "12 Mar", entradas: 300, saidas: 210 },
  { data: "14 Mar", entradas: 200, saidas: 150 },
  { data: "16 Mar", entradas: 270, saidas: 110 },
  { data: "17 Mar", entradas: 190, saidas: 80 },
]

const chartConfig = {
  entradas: { label: "Entradas", color: "#7033ff" },
  saidas: { label: "Saídas", color: "#4b5563" },
}

export function EstoqueChart() {
  // 2. Criamos o Estado para controlar o filtro atual (padrão: 15 dias)
  const [timeRange, setTimeRange] = useState("15d")

  // 3. Lógica que corta a lista de dados dependendo do botão clicado
  const filteredData = allChartData.filter((item, index) => {
    if (timeRange === "7d") return index >= allChartData.length - 4; // Pega os últimos 4 registros
    if (timeRange === "15d") return index >= allChartData.length - 7; // Pega os últimos 7 registros
    return true; // Se for "3m", mostra tudo
  });

  return (
    <Card className="bg-[#1e1e1e] border-gray-800 text-white mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fluxo de Movimentações</CardTitle>
            <CardDescription className="text-gray-400">
              Entradas vs Saídas {timeRange === "3m" ? "nos últimos 3 meses" : `nos últimos ${timeRange.replace('d', ' dias')}`}
            </CardDescription>
          </div>
          
          {/* 4. Botões Inteligentes com onClick e mudança de cor dinâmica */}
          <div className="flex gap-2">
            <button 
              onClick={() => setTimeRange("3m")}
              className={`px-3 py-1 text-sm rounded transition ${timeRange === "3m" ? "bg-[#7033ff] text-white font-medium" : "bg-[#2a2a2a] text-gray-300 hover:text-white"}`}
            >
              3 meses
            </button>
            <button 
              onClick={() => setTimeRange("15d")}
              className={`px-3 py-1 text-sm rounded transition ${timeRange === "15d" ? "bg-[#7033ff] text-white font-medium" : "bg-[#2a2a2a] text-gray-300 hover:text-white"}`}
            >
              15 dias
            </button>
            <button 
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 text-sm rounded transition ${timeRange === "7d" ? "bg-[#7033ff] text-white font-medium" : "bg-[#2a2a2a] text-gray-300 hover:text-white"}`}
            >
              7 dias
            </button>
          </div>

        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart accessibilityLayer data={filteredData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="#333" strokeDasharray="4 4" />
              <XAxis dataKey="data" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#9ca3af' }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-entradas)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-entradas)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-saidas)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-saidas)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area dataKey="saidas" type="natural" fill="url(#fillSaidas)" fillOpacity={0.4} stroke="var(--color-saidas)" stackId="a" />
              <Area dataKey="entradas" type="natural" fill="url(#fillEntradas)" fillOpacity={0.4} stroke="var(--color-entradas)" stackId="a" />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[250px] w-full flex items-center justify-center border border-dashed border-gray-800 rounded-lg text-gray-500 bg-[#1a1a1a]">
            Aguardando dados...
          </div>
        )}
      </CardContent>
    </Card>
  )
}