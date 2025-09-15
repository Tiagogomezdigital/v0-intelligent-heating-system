"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface WarmingConfig {
  id?: string
  name: string
  description: string
  start_time: string
  end_time: string
  min_interval_minutes: number
  max_interval_minutes: number
  daily_limit: number
  warming_duration_days: number
  is_active: boolean
}

interface WarmingConfigDialogProps {
  config?: WarmingConfig
  onConfigSaved: () => void
}

export function WarmingConfigDialog({ config, onConfigSaved }: WarmingConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<WarmingConfig>({
    name: "",
    description: "",
    start_time: "09:00",
    end_time: "18:00",
    min_interval_minutes: 30,
    max_interval_minutes: 120,
    daily_limit: 50,
    warming_duration_days: 30,
    is_active: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (config) {
      setFormData({
        ...config,
        start_time: config.start_time.slice(0, 5), // Remove seconds
        end_time: config.end_time.slice(0, 5), // Remove seconds
      })
    }
  }, [config])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) throw new Error("Usuário não autenticado")

      const configData = {
        ...formData,
        start_time: `${formData.start_time}:00`,
        end_time: `${formData.end_time}:00`,
        created_by: userData.user.id,
      }

      if (config?.id) {
        // Atualizar configuração existente
        const { error } = await supabase.from("warming_configs").update(configData).eq("id", config.id)
        if (error) throw error
      } else {
        // Criar nova configuração
        const { error } = await supabase.from("warming_configs").insert(configData)
        if (error) throw error
      }

      setOpen(false)
      onConfigSaved()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar configuração")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof WarmingConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {config ? (
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-lime-400 hover:bg-lime-500 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Nova Configuração
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {config ? "Editar Configuração" : "Nova Configuração de Aquecimento"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure os parâmetros para aquecimento inteligente dos números
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-300">
                  Nome da Configuração
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="active" className="text-gray-300">
                  Status
                </Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                  <Label htmlFor="active" className="text-gray-300">
                    {formData.is_active ? "Ativa" : "Inativa"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-300">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time" className="text-gray-300">
                  Horário de Início
                </Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange("start_time", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time" className="text-gray-300">
                  Horário de Fim
                </Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange("end_time", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_interval" className="text-gray-300">
                  Intervalo Mínimo (minutos)
                </Label>
                <Input
                  id="min_interval"
                  type="number"
                  min="1"
                  max="1440"
                  value={formData.min_interval_minutes}
                  onChange={(e) => handleInputChange("min_interval_minutes", Number.parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_interval" className="text-gray-300">
                  Intervalo Máximo (minutos)
                </Label>
                <Input
                  id="max_interval"
                  type="number"
                  min="1"
                  max="1440"
                  value={formData.max_interval_minutes}
                  onChange={(e) => handleInputChange("max_interval_minutes", Number.parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="daily_limit" className="text-gray-300">
                  Limite Diário de Mensagens
                </Label>
                <Input
                  id="daily_limit"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.daily_limit}
                  onChange={(e) => handleInputChange("daily_limit", Number.parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration" className="text-gray-300">
                  Duração do Aquecimento (dias)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.warming_duration_days}
                  onChange={(e) => handleInputChange("warming_duration_days", Number.parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-lime-400 hover:bg-lime-500 text-black">
              {isLoading ? "Salvando..." : config ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
