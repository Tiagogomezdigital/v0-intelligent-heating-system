"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AddNumberDialogProps {
  instances: Array<{ id: string; name: string }>
  onNumberAdded: () => void
}

export function AddNumberDialog({ instances, onNumberAdded }: AddNumberDialogProps) {
  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [instanceId, setInstanceId] = useState("")
  const [dailyLimit, setDailyLimit] = useState("50")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Validar formato do número
      const cleanNumber = phoneNumber.replace(/\D/g, "")
      if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        throw new Error("Número de telefone inválido")
      }

      const { error } = await supabase.from("numbers").insert({
        phone_number: cleanNumber,
        instance_id: instanceId,
        daily_limit: Number.parseInt(dailyLimit),
        status: "disconnected",
        warming_status: "inactive",
      })

      if (error) throw error

      setOpen(false)
      setPhoneNumber("")
      setInstanceId("")
      setDailyLimit("50")
      onNumberAdded()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao adicionar número")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lime-400 hover:bg-lime-500 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Número
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Adicionar Novo Número</DialogTitle>
          <DialogDescription className="text-gray-400">
            Adicione um novo número do WhatsApp para aquecimento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-gray-300">
                Número do WhatsApp
              </Label>
              <Input
                id="phone"
                placeholder="5511999999999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instance" className="text-gray-300">
                Instância Evolution API
              </Label>
              <Select value={instanceId} onValueChange={setInstanceId} required>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione uma instância" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id} className="text-white">
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit" className="text-gray-300">
                Limite Diário de Mensagens
              </Label>
              <Input
                id="limit"
                type="number"
                min="1"
                max="1000"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          </div>
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-lime-400 hover:bg-lime-500 text-black">
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
