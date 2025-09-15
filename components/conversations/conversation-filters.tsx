"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ConversationFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  templateFilter: string
  onTemplateFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  qualityFilter: string
  onQualityFilterChange: (value: string) => void
  templates: Array<{ id: string; name: string }>
}

export function ConversationFilters({
  searchTerm,
  onSearchChange,
  templateFilter,
  onTemplateFilterChange,
  statusFilter,
  onStatusFilterChange,
  qualityFilter,
  onQualityFilterChange,
  templates,
}: ConversationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar conversas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-700 border-slate-600 text-white"
        />
      </div>
      <Select value={templateFilter} onValueChange={onTemplateFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Template" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="all" className="text-white">
            Todos os Templates
          </SelectItem>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id} className="text-white">
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="all" className="text-white">
            Todos os Status
          </SelectItem>
          <SelectItem value="pending" className="text-white">
            Pendente
          </SelectItem>
          <SelectItem value="approved" className="text-white">
            Aprovada
          </SelectItem>
          <SelectItem value="rejected" className="text-white">
            Rejeitada
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={qualityFilter} onValueChange={onQualityFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Qualidade" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="all" className="text-white">
            Todas as Qualidades
          </SelectItem>
          <SelectItem value="5" className="text-white">
            5 Estrelas
          </SelectItem>
          <SelectItem value="4" className="text-white">
            4+ Estrelas
          </SelectItem>
          <SelectItem value="3" className="text-white">
            3+ Estrelas
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
