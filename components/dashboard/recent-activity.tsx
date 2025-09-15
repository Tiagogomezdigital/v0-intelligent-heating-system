"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare, Phone, Settings, AlertTriangle } from "lucide-react"

interface Activity {
  id: string
  type: "message" | "number" | "config" | "alert"
  description: string
  timestamp: string
  status: "success" | "warning" | "error"
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "number":
        return <Phone className="h-4 w-4" />
      case "config":
        return <Settings className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
            <div className="flex-shrink-0 p-2 bg-slate-600/50 rounded-lg text-gray-400">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                <span className="text-xs text-gray-400">{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
