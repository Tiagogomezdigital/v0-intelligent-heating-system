import { RegisterForm } from "@/components/register-form"
import { MessageSquare, Zap } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Link href="/">
              <div className="relative cursor-pointer">
                <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-black" />
                  <Zap className="w-4 h-4 text-black absolute -top-1 -right-1" />
                </div>
              </div>
            </Link>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">WarmFlow</h1>
            <p className="text-gray-400 text-sm">Crie sua conta</p>
          </div>
        </div>

        {/* Formulário de Registro */}
        <RegisterForm />

        {/* Rodapé */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">Sistema de aquecimento inteligente para WhatsApp</p>
        </div>
      </div>
    </div>
  )
}
