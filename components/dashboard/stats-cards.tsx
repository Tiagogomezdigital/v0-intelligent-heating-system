"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalNumbers: number
    activeNumbers: number
    messagesSentToday: number
    successRate: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Números Ativos",
      value: `${stats.activeNumbers}/${stats.totalNumbers}`,
      icon: Phone,
      color: "text-lime-400",
      bgColor: "bg-lime-400/10",
    },
    {
      title: "Mensagens Hoje",
      value: stats.messagesSentToday.toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Taxa de Sucesso",
      value: `${stats.successRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Alertas",
      value: "3",
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
