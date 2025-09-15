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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ApplyConfigDialogProps {
  onConfigApplied: () => void
}

export function ApplyConfigDialog({ onConfigApplied }: ApplyConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const [configs, setConfigs] = useState<any[]>([])
  const [numbers, setNumbers] = useState<any[]>([])
  const [selectedConfig, setSelectedConfig] = useState("")
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Buscar configurações ativas
      const { data: configsData } = await supabase
        .from("warming_configs")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

      // Buscar números conectados
      const { data: numbersData } = await supabase
        .from("numbers")
        .select("id, phone_number")
        .eq("status", "connected")
        .order("phone_number")

      setConfigs(configsData || [])
      setNumbers(numbersData || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Aplicar configuração aos números selecionados
      for (const numberId of selectedNumbers) {
        await supabase
          .from("numbers")
          .update({
            warming_status: "active",
            warming_start_date: new Date().toISOString(),
            status: "warming",
          })
          .eq("id", numberId)
      }

      setOpen(false)
      setSelectedConfig("")
      setSelectedNumbers([])
      onConfigApplied()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao aplicar configuração")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNumberToggle = (numberId: string, checked: boolean) => {
    if (checked) {
      setSelectedNumbers((prev) => [...prev, numberId])
    } else {
      setSelectedNumbers((prev) => prev.filter((id) => id !== numberId))
    }
  }

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }
    return phone
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-600 text-gray-300 hover:text-white bg-transparent">
          <Settings className="h-4 w-4 mr-2" />
          Aplicar Configuração
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Aplicar Configuração de Aquecimento</DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecione uma configuração e os números para aplicar o aquecimento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="config" className="text-gray-300">
                Configuração de Aquecimento
              </Label>
              <Select value={selectedConfig} onValueChange={setSelectedConfig} required>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione uma configuração" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {configs.map((config) => (
                    <SelectItem key={config.id} value={config.id} className="text-white">
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-300">Números para Aplicar ({selectedNumbers.length} selecionados)</Label>
              <div className="max-h-64 overflow-y-auto border border-slate-600 rounded-md p-3 bg-slate-700/30">
                {numbers.length === 0 ? (
                  <p className="text-gray-400 text-sm">Nenhum número conectado disponível</p>
                ) : (
                  <div className="space-y-2">
                    {numbers.map((number) => (
                      <div key={number.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={number.id}
                          checked={selectedNumbers.includes(number.id)}
                          onCheckedChange={(checked) => handleNumberToggle(number.id, checked as boolean)}
                        />
                        <Label htmlFor={number.id} className="text-gray-300 font-mono">
                          {formatPhoneNumber(number.phone_number)}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedConfig || selectedNumbers.length === 0}
              className="bg-lime-400 hover:bg-lime-500 text-black"
            >
              {isLoading ? "Aplicando..." : "Aplicar Configuração"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
