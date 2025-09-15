"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { GenerateConversationDialog } from "@/components/conversations/generate-conversation-dialog"
import { ConversationsTable } from "@/components/conversations/conversations-table"
import { ConversationStats } from "@/components/conversations/conversation-stats"
import { ConversationFilters } from "@/components/conversations/conversation-filters"
import { createClient } from "@/lib/supabase/client"

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalConversations: 0,
    approvedConversations: 0,
    rejectedConversations: 0,
    totalCostUSD: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [templateFilter, setTemplateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [qualityFilter, setQualityFilter] = useState("all")
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

      // Buscar conversas com templates
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("generated_conversations")
        .select(`
          *,
          conversation_templates (
            name,
            category
          )
        `)
        .order("created_at", { ascending: false })

      if (conversationsError) throw conversationsError

      // Buscar templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("conversation_templates")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

      if (templatesError) throw templatesError

      // Buscar custos OpenAI
      const { data: costsData, error: costsError } = await supabase
        .from("openai_costs")
        .select("cost_usd")
        .eq("request_type", "conversation_generation")

      if (costsError) throw costsError

      // Calcular estatísticas
      const totalConversations = conversationsData?.length || 0
      const approvedConversations = conversationsData?.filter((c) => c.is_approved && c.approved_at).length || 0
      const rejectedConversations = conversationsData?.filter((c) => !c.is_approved && c.approved_at).length || 0
      const totalCostUSD = costsData?.reduce((sum, cost) => sum + Number.parseFloat(cost.cost_usd), 0) || 0

      setConversations(conversationsData || [])
      setTemplates(templatesData || [])
      setStats({
        totalConversations,
        approvedConversations,
        rejectedConversations,
        totalCostUSD,
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [router])

  // Filtrar conversas
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.conversation_templates.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTemplate = templateFilter === "all" || conversation.template_id === templateFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && conversation.approved_at === null) ||
      (statusFilter === "approved" && conversation.is_approved && conversation.approved_at) ||
      (statusFilter === "rejected" && !conversation.is_approved && conversation.approved_at)
    const matchesQuality =
      qualityFilter === "all" ||
      (qualityFilter === "5" && conversation.quality_score === 5) ||
      (qualityFilter === "4" && conversation.quality_score >= 4) ||
      (qualityFilter === "3" && conversation.quality_score >= 3)

    return matchesSearch && matchesTemplate && matchesStatus && matchesQuality
  })

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando conversas...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Geração de Conversas</h1>
            <p className="text-gray-400 mt-2">Gere conversas inteligentes com IA para aquecimento natural</p>
          </div>
          <GenerateConversationDialog onConversationGenerated={fetchData} />
        </div>

        {/* Estatísticas */}
        <ConversationStats stats={stats} />

        {/* Filtros */}
        <ConversationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          templateFilter={templateFilter}
          onTemplateFilterChange={setTemplateFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          qualityFilter={qualityFilter}
          onQualityFilterChange={setQualityFilter}
          templates={templates}
        />

        {/* Tabela de Conversas */}
        {filteredConversations.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {conversations.length === 0
                ? "Nenhuma conversa gerada ainda."
                : "Nenhuma conversa encontrada com os filtros aplicados."}
            </p>
          </div>
        ) : (
          <ConversationsTable conversations={filteredConversations} onConversationUpdated={fetchData} />
        )}
      </div>
    </AppLayout>
  )
}
