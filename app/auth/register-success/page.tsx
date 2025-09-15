import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Zap, Mail } from "lucide-react"
import Link from "next/link"

export default function RegisterSuccessPage() {
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
          </div>
        </div>

        {/* Card de Sucesso */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-lime-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Conta criada com sucesso!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">
              Enviamos um email de confirmação para o seu endereço. Verifique sua caixa de entrada e clique no link para
              ativar sua conta.
            </p>
            <p className="text-sm text-gray-400">Não esqueça de verificar a pasta de spam caso não encontre o email.</p>
            <div className="pt-4">
              <Link href="/" className="text-lime-400 hover:text-lime-300 transition-colors text-sm">
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">Sistema de aquecimento inteligente para WhatsApp</p>
        </div>
      </div>
    </div>
  )
}
