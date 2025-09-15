"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface GenerateConversationDialogProps {
  onConversationGenerated: () => void
}

export function GenerateConversationDialog({ onConversationGenerated }: GenerateConversationDialogProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [quantity, setQuantity] = useState("5")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  const fetchTemplates = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from("conversation_templates").select("*").eq("is_active", true).order("name")

      setTemplates(data || [])
    } catch (error) {
      console.error("Erro ao carregar templates:", error)
    }
  }

  const generateConversation = async (prompt: string) => {
    // Simulação da geração de conversa com IA
    // Em produção, aqui seria feita a chamada para GPT-4o-mini
    const conversations = [
      {
        messages: [
          { sender: "João", message: "Oi! Como você está?" },
          { sender: "Maria", message: "Oi João! Estou bem, obrigada. E você?" },
          { sender: "João", message: "Também estou bem! O que você tem feito?" },
          { sender: "Maria", message: "Trabalhando bastante, mas tudo correndo bem. E você?" },
          { sender: "João", message: "Mesma coisa aqui. Que tal marcarmos um café?" },
          { sender: "Maria", message: "Adoraria! Que tal amanhã à tarde?" },
          { sender: "João", message: "Perfeito! Te mando o local depois." },
          { sender: "Maria", message: "Combinado! Até amanhã então." },
        ],
      },
      {
        messages: [
          { sender: "Ana", message: "Bom dia! Tudo bem?" },
          { sender: "Carlos", message: "Bom dia Ana! Tudo ótimo por aqui." },
          { sender: "Ana", message: "Que bom! Como foi o final de semana?" },
          { sender: "Carlos", message: "Foi tranquilo, fiquei em casa descansando. E o seu?" },
          { sender: "Ana", message: "Fui visitar minha família no interior." },
          { sender: "Carlos", message: "Que legal! Deve ter sido bom rever todo mundo." },
          { sender: "Ana", message: "Foi sim! Sempre é bom estar com a família." },
        ],
      },
    ]

    return conversations
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) throw new Error("Usuário não autenticado")

      const template = templates.find((t) => t.id === selectedTemplate)
      if (!template) throw new Error("Template não encontrado")

      const prompt = customPrompt || template.prompt
      const conversationCount = Number.parseInt(quantity)

      // Gerar conversas
      for (let i = 0; i < conversationCount; i++) {
        const conversations = await generateConversation(prompt)

        for (const conversation of conversations) {
          // Salvar conversa gerada
          const { error } = await supabase.from("generated_conversations").insert({
            template_id: selectedTemplate,
            conversation_data: conversation,
            quality_score: Math.floor(Math.random() * 2) + 4, // Score entre 4-5 para simulação
            is_approved: false,
          })

          if (error) throw error
        }
      }

      // Simular custo da API OpenAI
      const { error: costError } = await supabase.from("openai_costs").insert({
        user_id: userData.user.id,
        model: "gpt-4o-mini",
        prompt_tokens: conversationCount * 150,
        completion_tokens: conversationCount * 300,
        total_tokens: conversationCount * 450,
        cost_usd: conversationCount * 0.002,
        request_type: "conversation_generation",
      })

      if (costError) console.error("Erro ao registrar custo:", costError)

      setOpen(false)
      setSelectedTemplate("")
      setQuantity("5")
      setCustomPrompt("")
      onConversationGenerated()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao gerar conversas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lime-400 hover:bg-lime-500 text-black">
          <Sparkles className="h-4 w-4 mr-2" />
          Gerar Conversas
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Gerar Conversas com IA</DialogTitle>
          <DialogDescription className="text-gray-400">
            Use GPT-4o-mini para gerar conversas naturais e realistas
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="template" className="text-gray-300">
                  Template de Conversa
                </Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate} required>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="text-white">
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity" className="text-gray-300">
                  Quantidade de Conversas
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="custom-prompt" className="text-gray-300">
                Prompt Personalizado (Opcional)
              </Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Deixe em branco para usar o prompt do template selecionado..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Estimativa de Custo</h4>
              <div className="text-sm text-gray-300">
                <p>Modelo: GPT-4o-mini</p>
                <p>Custo estimado: ${(Number.parseInt(quantity) * 0.002).toFixed(4)} USD</p>
                <p>Tokens estimados: ~{Number.parseInt(quantity) * 450}</p>
              </div>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-600">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-lime-400 hover:bg-lime-500 text-black">
              {isLoading ? "Gerando..." : "Gerar Conversas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
