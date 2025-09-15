"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users, Trash2, Copy } from "lucide-react"
import { WarmingConfigDialog } from "./warming-config-dialog"
import { createClient } from "@/lib/supabase/client"

interface WarmingConfig {
  id: string
  name: string
  description: string
  start_time: string
  end_time: string
  min_interval_minutes: number
  max_interval_minutes: number
  daily_limit: number
  warming_duration_days: number
  is_active: boolean
  created_at: string
  users: { name: string }
}

interface WarmingConfigsTableProps {
  configs: WarmingConfig[]
  onConfigUpdated: () => void
}

export function WarmingConfigsTable({ configs, onConfigUpdated }: WarmingConfigsTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})

  const handleAction = async (configId: string, action: string) => {
    setLoadingActions((prev) => ({ ...prev, [configId]: true }))

    try {
      const supabase = createClient()

      switch (action) {
        case "toggle":
          const config = configs.find((c) => c.id === configId)
          if (config) {
            await supabase.from("warming_configs").update({ is_active: !config.is_active }).eq("id", configId)
          }
          break
        case "duplicate":
          const originalConfig = configs.find((c) => c.id === configId)
          if (originalConfig) {
            const { data: userData } = await supabase.auth.getUser()
            if (userData.user) {
              await supabase.from("warming_configs").insert({
                name: `${originalConfig.name} (Cópia)`,
                description: originalConfig.description,
                start_time: originalConfig.start_time,
                end_time: originalConfig.end_time,
                min_interval_minutes: originalConfig.min_interval_minutes,
                max_interval_minutes: originalConfig.max_interval_minutes,
                daily_limit: originalConfig.daily_limit,
                warming_duration_days: originalConfig.warming_duration_days,
                is_active: false,
                created_by: userData.user.id,
              })
            }
          }
          break
        case "delete":
          await supabase.from("warming_configs").delete().eq("id", configId)
          break
      }

      onConfigUpdated()
    } catch (error) {
      console.error("Erro ao executar ação:", error)
    } finally {
      setLoadingActions((prev) => ({ ...prev, [configId]: false }))
    }
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/50">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <TableHead className="text-gray-300">Nome</TableHead>
            <TableHead className="text-gray-300">Horário</TableHead>
            <TableHead className="text-gray-300">Intervalo (min)</TableHead>
            <TableHead className="text-gray-300">Limite Diário</TableHead>
            <TableHead className="text-gray-300">Duração (dias)</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Criado em</TableHead>
            <TableHead className="text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id} className="border-slate-700">
              <TableCell>
                <div>
                  <div className="text-white font-medium">{config.name}</div>
                  {config.description && <div className="text-gray-400 text-sm">{config.description}</div>}
                </div>
              </TableCell>
              <TableCell className="text-gray-300">
                {formatTime(config.start_time)} - {formatTime(config.end_time)}
              </TableCell>
              <TableCell className="text-gray-300">
                {config.min_interval_minutes} - {config.max_interval_minutes}
              </TableCell>
              <TableCell className="text-gray-300">{config.daily_limit}</TableCell>
              <TableCell className="text-gray-300">{config.warming_duration_days}</TableCell>
              <TableCell>
                <Badge
                  className={
                    config.is_active
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  }
                >
                  {config.is_active ? "Ativa" : "Inativa"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">{formatDate(config.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <WarmingConfigDialog config={config} onConfigSaved={onConfigUpdated} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        disabled={loadingActions[config.id]}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem
                        onClick={() => handleAction(config.id, "toggle")}
                        className="text-gray-300 hover:text-white hover:bg-slate-700"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {config.is_active ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(config.id, "duplicate")}
                        className="text-gray-300 hover:text-white hover:bg-slate-700"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(config.id, "delete")}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
