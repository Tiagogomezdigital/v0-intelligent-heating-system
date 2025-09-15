import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/")
  }

  // Verificar se é administrador
  const { data: userData } = await supabase.from("users").select("role").eq("id", data.user.id).single()

  if (userData?.role !== "administrator") {
    redirect("/dashboard")
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações do Sistema</h1>
          <p className="text-gray-400 mt-2">Gerencie configurações globais do sistema</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-gray-300">Módulo de configurações em desenvolvimento...</p>
        </div>
      </div>
    </AppLayout>
  )
}
