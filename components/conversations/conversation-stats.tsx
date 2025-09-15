"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, CheckCircle, XCircle, DollarSign } from "lucide-react"

interface ConversationStatsProps {
  stats: {
    totalConversations: number
    approvedConversations: number
    rejectedConversations: number
    totalCostUSD: number
  }
}

export function ConversationStats({ stats }: ConversationStatsProps) {
  const approvalRate = stats.totalConversations > 0 ? (stats.approvedConversations / stats.totalConversations) * 100 : 0

  const cards = [
    {
      title: "Total de Conversas",
      value: stats.totalConversations.toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Conversas Aprovadas",
      value: `${stats.approvedConversations} (${approvalRate.toFixed(1)}%)`,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Conversas Rejeitadas",
      value: stats.rejectedConversations.toLocaleString(),
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      title: "Custo Total (OpenAI)",
      value: `$${stats.totalCostUSD.toFixed(4)}`,
      icon: DollarSign,
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
