"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { AddNumberDialog } from "@/components/numbers/add-number-dialog"
import { NumbersTable } from "@/components/numbers/numbers-table"
import { NumbersFilters } from "@/components/numbers/numbers-filters"
import { createClient } from "@/lib/supabase/client"

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<any[]>([])
  const [instances, setInstances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [warmingFilter, setWarmingFilter] = useState("all")
  const router = useRouter()

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Verificar autenticação
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        router.push("/")
        return
      }

      // Buscar números com instâncias
      const { data: numbersData, error: numbersError } = await supabase
        .from("numbers")
        .select(`
          *,
          evolution_instances (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (numbersError) throw numbersError

      // Buscar instâncias para o dialog
      const { data: instancesData, error: instancesError } = await supabase
        .from("evolution_instances")
        .select("id, name")
        .eq("status", "active")

      if (instancesError) throw instancesError

      setNumbers(numbersData || [])
      setInstances(instancesData || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [router])

  // Filtrar números
  const filteredNumbers = numbers.filter((number) => {
    const matchesSearch = number.phone_number.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || number.status === statusFilter
    const matchesWarming = warmingFilter === "all" || number.warming_status === warmingFilter

    return matchesSearch && matchesStatus && matchesWarming
  })

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando números...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Números</h1>
            <p className="text-gray-400 mt-2">Gerencie seus números do WhatsApp e configure aquecimento</p>
          </div>
          <AddNumberDialog instances={instances} onNumberAdded={fetchData} />
        </div>

        <NumbersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          warmingFilter={warmingFilter}
          onWarmingFilterChange={setWarmingFilter}
        />

        {filteredNumbers.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {numbers.length === 0
                ? "Nenhum número cadastrado ainda."
                : "Nenhum número encontrado com os filtros aplicados."}
            </p>
          </div>
        ) : (
          <NumbersTable numbers={filteredNumbers} onNumberUpdated={fetchData} />
        )}
      </div>
    </AppLayout>
  )
}
