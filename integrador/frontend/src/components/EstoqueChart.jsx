"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { data: "01 Mar", entradas: 120, saidas: 80 },
  { data: "04 Mar", entradas: 250, saidas: 130 },
  { data: "08 Mar", entradas: 180, saidas: 90 },
  { data: "12 Mar", entradas: 300, saidas: 210 },
  { data: "16 Mar", entradas: 200, saidas: 150 },
  { data: "20 Mar", entradas: 270, saidas: 110 },
]

const chartConfig = {
  entradas: { label: "Entradas", color: "#7033ff" },
  saidas: { label: "Saídas", color: "#4b5563" },
}

export function EstoqueChart() {
  return (
    <Card className="bg-[#1e1e1e] border-gray-800 text-white mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fluxo de Movimentações</CardTitle>
            <CardDescription className="text-gray-400">
              Entradas vs Saídas nos últimos 15 dias
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-[#2a2a2a] text-gray-300 rounded hover:text-white transition">3 meses</button>
            <button className="px-3 py-1 text-sm bg-[#7033ff] text-white rounded font-medium">15 dias</button>
            <button className="px-3 py-1 text-sm bg-[#2a2a2a] text-gray-300 rounded hover:text-white transition">7 dias</button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
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