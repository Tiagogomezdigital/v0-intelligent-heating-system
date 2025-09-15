import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WarmFlow</h1>
          <p className="text-gray-400">Acesse o painel administrativo</p>
        </div>

        <LoginForm />

        <p className="text-center text-gray-500 text-sm mt-8">Sistema de aquecimento inteligente</p>
      </div>
    </div>
  )
}
