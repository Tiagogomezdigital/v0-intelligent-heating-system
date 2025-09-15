"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "00:00", messages: 0 },
  { name: "04:00", messages: 12 },
  { name: "08:00", messages: 45 },
  { name: "12:00", messages: 89 },
  { name: "16:00", messages: 156 },
  { name: "20:00", messages: 203 },
  { name: "23:59", messages: 187 },
]

export function ActivityChart() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Atividade de Mensagens (Hoje)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
            />
            <Line type="monotone" dataKey="messages" stroke="#84CC16" strokeWidth={2} dot={{ fill: "#84CC16" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
