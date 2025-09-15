"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { WarmingConfigDialog } from "@/components/warming/warming-config-dialog"
import { WarmingConfigsTable } from "@/components/warming/warming-configs-table"
import { ApplyConfigDialog } from "@/components/warming/apply-config-dialog"
import { createClient } from "@/lib/supabase/client"

export default function WarmingPage() {
  const [configs, setConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchConfigs = async () => {
    try {
      const supabase = createClient()

      // Verificar autenticação
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        router.push("/")
        return
      }

      // Buscar configurações com dados do criador
      const { data: configsData, error: configsError } = await supabase
        .from("warming_configs")
        .select(`
          *,
          users (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (configsError) throw configsError

      setConfigs(configsData || [])
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [router])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando configurações...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Configuração de Aquecimento</h1>
            <p className="text-gray-400 mt-2">Configure estratégias inteligentes para aquecimento de números</p>
          </div>
          <div className="flex gap-3">
            <ApplyConfigDialog onConfigApplied={fetchConfigs} />
            <WarmingConfigDialog onConfigSaved={fetchConfigs} />
          </div>
        </div>

        {configs.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">Nenhuma configuração de aquecimento criada ainda.</p>
            <p className="text-gray-500 text-sm mt-2">Crie sua primeira configuração para começar.</p>
          </div>
        ) : (
          <WarmingConfigsTable configs={configs} onConfigUpdated={fetchConfigs} />
        )}
      </div>
    </AppLayout>
  )
}
