"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface NumbersFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  warmingFilter: string
  onWarmingFilterChange: (value: string) => void
}

export function NumbersFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  warmingFilter,
  onWarmingFilterChange,
}: NumbersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por número..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-700 border-slate-600 text-white"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="all" className="text-white">
            Todos os Status
          </SelectItem>
          <SelectItem value="connected" className="text-white">
            Conectado
          </SelectItem>
          <SelectItem value="disconnected" className="text-white">
            Desconectado
          </SelectItem>
          <SelectItem value="warming" className="text-white">
            Aquecendo
          </SelectItem>
          <SelectItem value="blocked" className="text-white">
            Bloqueado
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={warmingFilter} onValueChange={onWarmingFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Aquecimento" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="all" className="text-white">
            Todos
          </SelectItem>
          <SelectItem value="active" className="text-white">
            Ativo
          </SelectItem>
          <SelectItem value="inactive" className="text-white">
            Inativo
          </SelectItem>
          <SelectItem value="paused" className="text-white">
            Pausado
          </SelectItem>
          <SelectItem value="completed" className="text-white">
            Concluído
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
