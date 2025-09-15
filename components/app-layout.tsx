"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Phone, Settings, MessageSquare, BarChart3, Zap, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"

interface AppLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["administrator", "operator"],
  },
  {
    name: "Números",
    href: "/numbers",
    icon: Phone,
    roles: ["administrator", "operator"],
  },
  {
    name: "Aquecimento",
    href: "/warming",
    icon: Zap,
    roles: ["administrator", "operator"],
  },
  {
    name: "Conversas",
    href: "/conversations",
    icon: MessageSquare,
    roles: ["administrator", "operator"],
  },
  {
    name: "Relatórios",
    href: "/reports",
    icon: BarChart3,
    roles: ["administrator", "operator"],
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    roles: ["administrator"],
  },
]

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<any | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()

      if (authData.user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", authData.user.id).single()

        if (userData) {
          setUser(userData)
        }
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const filteredNavigation = navigationItems.filter((item) => (user?.role ? item.roles.includes(user.role) : false))

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-black" />
                  <Zap className="w-3 h-3 text-black absolute -top-0.5 -right-0.5" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">WarmFlow</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive ? "bg-lime-400 text-black" : "text-gray-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          {item.icon && <item.icon className="h-6 w-6 shrink-0" />}
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* User Info */}
          <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-lime-400 text-black">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Seu perfil</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "Usuário"}</p>
              <p className="text-xs text-gray-400 truncate">
                {user?.role === "administrator" ? "Administrador" : "Operador"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-white">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700">
                  <Menu className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? "relative z-50" : ""}`}>
        {sidebarOpen && <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            {/* Mobile Header */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-black" />
                    <Zap className="w-3 h-3 text-black absolute -top-0.5 -right-0.5" />
                  </div>
                </div>
                <span className="text-xl font-bold text-white">WarmFlow</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {filteredNavigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                              isActive ? "bg-lime-400 text-black" : "text-gray-300 hover:text-white hover:bg-slate-800"
                            }`}
                          >
                            {item.icon && <item.icon className="h-6 w-6 shrink-0" />}
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              </ul>
            </nav>

            {/* Mobile User Info */}
            <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-lime-400 text-black">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || "Usuário"}</p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.role === "administrator" ? "Administrador" : "Operador"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-700 bg-slate-900 px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">WarmFlow</div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
