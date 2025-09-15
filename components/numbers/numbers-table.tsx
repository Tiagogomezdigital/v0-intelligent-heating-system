"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Phone, PhoneOff, Play, Pause, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Number {
  id: string
  phone_number: string
  status: "connected" | "disconnected" | "warming" | "blocked" | "maintenance"
  warming_status: "active" | "inactive" | "paused" | "completed"
  daily_limit: number
  messages_sent_today: number
  last_message_at: string | null
  evolution_instances: { name: string }
}

interface NumbersTableProps {
  numbers: Number[]
  onNumberUpdated: () => void
}

export function NumbersTable({ numbers, onNumberUpdated }: NumbersTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "disconnected":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "warming":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "blocked":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "maintenance":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado"
      case "disconnected":
        return "Desconectado"
      case "warming":
        return "Aquecendo"
      case "blocked":
        return "Bloqueado"
      case "maintenance":
        return "Manutenção"
      default:
        return "Desconhecido"
    }
  }

  const getWarmingStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-lime-500/20 text-lime-400 border-lime-500/30"
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "paused":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getWarmingStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "inactive":
        return "Inativo"
      case "paused":
        return "Pausado"
      case "completed":
        return "Concluído"
      default:
        return "Desconhecido"
    }
  }

  const handleAction = async (numberId: string, action: string) => {
    setLoadingActions((prev) => ({ ...prev, [numberId]: true }))

    try {
      const supabase = createClient()

      switch (action) {
        case "connect":
          await supabase.from("numbers").update({ status: "connected" }).eq("id", numberId)
          break
        case "disconnect":
          await supabase.from("numbers").update({ status: "disconnected" }).eq("id", numberId)
          break
        case "start-warming":
          await supabase
            .from("numbers")
            .update({
              warming_status: "active",
              warming_start_date: new Date().toISOString(),
              status: "warming",
            })
            .eq("id", numberId)
          break
        case "pause-warming":
          await supabase.from("numbers").update({ warming_status: "paused" }).eq("id", numberId)
          break
        case "delete":
          await supabase.from("numbers").delete().eq("id", numberId)
          break
      }

      onNumberUpdated()
    } catch (error) {
      console.error("Erro ao executar ação:", error)
    } finally {
      setLoadingActions((prev) => ({ ...prev, [numberId]: false }))
    }
  }

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }
    return phone
  }

  const formatLastMessage = (timestamp: string | null) => {
    if (!timestamp) return "Nunca"
    const date = new Date(timestamp)
    return date.toLocaleString("pt-BR")
  }

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/50">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <TableHead className="text-gray-300">Número</TableHead>
            <TableHead className="text-gray-300">Instância</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Aquecimento</TableHead>
            <TableHead className="text-gray-300">Mensagens Hoje</TableHead>
            <TableHead className="text-gray-300">Última Mensagem</TableHead>
            <TableHead className="text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {numbers.map((number) => (
            <TableRow key={number.id} className="border-slate-700">
              <TableCell className="text-white font-mono">{formatPhoneNumber(number.phone_number)}</TableCell>
              <TableCell className="text-gray-300">{number.evolution_instances?.name || "N/A"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(number.status)}>{getStatusText(number.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getWarmingStatusColor(number.warming_status)}>
                  {getWarmingStatusText(number.warming_status)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">
                {number.messages_sent_today}/{number.daily_limit}
              </TableCell>
              <TableCell className="text-gray-300">{formatLastMessage(number.last_message_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      disabled={loadingActions[number.id]}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    {number.status === "disconnected" && (
                      <DropdownMenuItem
                        onClick={() => handleAction(number.id, "connect")}
                        className="text-gray-300 hover:text-white hover:bg-slate-700"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Conectar
                      </DropdownMenuItem>
                    )}
                    {number.status === "connected" && (
                      <DropdownMenuItem
                        onClick={() => handleAction(number.id, "disconnect")}
                        className="text-gray-300 hover:text-white hover:bg-slate-700"
                      >
                        <PhoneOff className="mr-2 h-4 w-4" />
                        Desconectar
                      </DropdownMenuItem>
                    )}
                    {number.warming_status === "inactive" && (
                      <DropdownMenuItem
                        onClick={() => handleAction(number.id, "start-warming")}
                        className="text-gray-300 hover:text-white hover:bg-slate-700"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar Aquecimento
                      </DropdownMenuItem>
                    )}
                    {number.warming_status === "active" && (
                      <DropdownMenuItem
                        onClick={() => handleAction(number.id, "pause-warming")}
                        className="text-gray-300 hover:text-white hover:bg-slate-700"
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pausar Aquecimento
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleAction(number.id, "delete")}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
