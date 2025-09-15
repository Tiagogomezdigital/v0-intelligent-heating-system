"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Wifi, WifiOff } from "lucide-react"

interface Instance {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance"
  currentNumbers: number
  maxNumbers: number
}

interface InstancesStatusProps {
  instances: Instance[]
}

export function InstancesStatus({ instances }: InstancesStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Wifi className="h-4 w-4" />
      case "inactive":
        return <WifiOff className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "inactive":
        return "Inativo"
      case "maintenance":
        return "Manutenção"
      default:
        return "Desconhecido"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Server className="h-5 w-5" />
          Status das Instâncias Evolution API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {instances.map((instance) => (
          <div key={instance.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(instance.status)}
                <span className="text-white font-medium">{instance.name}</span>
              </div>
              <Badge className={getStatusColor(instance.status)}>{getStatusText(instance.status)}</Badge>
            </div>
            <div className="text-sm text-gray-400">
              {instance.currentNumbers}/{instance.maxNumbers} números
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
