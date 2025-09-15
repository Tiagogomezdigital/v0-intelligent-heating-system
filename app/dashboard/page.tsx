import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { InstancesStatus } from "@/components/dashboard/instances-status"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/")
  }

  // Buscar dados do usuário
  const { data: userData } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  // Buscar estatísticas do sistema
  const { data: numbersData } = await supabase.from("numbers").select("status, messages_sent_today")

  const { data: instancesData } = await supabase
    .from("evolution_instances")
    .select("id, name, status, current_numbers, max_numbers")

  const { data: messagesData } = await supabase
    .from("sent_messages")
    .select("status")
    .gte("sent_at", new Date().toISOString().split("T")[0])

  // Calcular estatísticas
  const totalNumbers = numbersData?.length || 0
  const activeNumbers = numbersData?.filter((n) => n.status === "connected").length || 0
  const messagesSentToday = messagesData?.length || 0
  const successfulMessages = messagesData?.filter((m) => m.status === "delivered" || m.status === "read").length || 0
  const successRate = messagesSentToday > 0 ? (successfulMessages / messagesSentToday) * 100 : 0

  const stats = {
    totalNumbers,
    activeNumbers,
    messagesSentToday,
    successRate,
  }

  // Dados mock para instâncias (caso não existam)
  const instances = instancesData?.length
    ? instancesData
    : [
        {
          id: "1",
          name: "Evolution API - Principal",
          status: "active" as const,
          current_numbers: 15,
          max_numbers: 50,
        },
        {
          id: "2",
          name: "Evolution API - Backup",
          status: "inactive" as const,
          current_numbers: 0,
          max_numbers: 30,
        },
      ]

  // Atividades recentes mock
  const recentActivities = [
    {
      id: "1",
      type: "message" as const,
      description: "150 mensagens enviadas com sucesso",
      timestamp: "há 5 minutos",
      status: "success" as const,
    },
    {
      id: "2",
      type: "number" as const,
      description: "Número +55 11 99999-9999 conectado",
      timestamp: "há 15 minutos",
      status: "success" as const,
    },
    {
      id: "3",
      type: "alert" as const,
      description: "Taxa de entrega abaixo de 90%",
      timestamp: "há 1 hora",
      status: "warning" as const,
    },
    {
      id: "4",
      type: "config" as const,
      description: "Configuração de aquecimento atualizada",
      timestamp: "há 2 horas",
      status: "success" as const,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Bem-vindo, {userData?.name || data.user.email}! Visão geral do sistema de aquecimento
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <StatsCards stats={stats} />

        {/* Gráficos e Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart />
          <InstancesStatus instances={instances} />
        </div>

        {/* Atividade Recente */}
        <RecentActivity activities={recentActivities} />
      </div>
    </AppLayout>
  )
}
