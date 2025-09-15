"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona diretamente para o dashboard para demonstração
    router.push("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-black font-bold text-xl">W</span>
        </div>
        <p className="text-white">Redirecionando para o dashboard...</p>
      </div>
    </div>
  )
}
