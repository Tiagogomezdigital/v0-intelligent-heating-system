"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Eye, Check, X, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Conversation {
  id: string
  conversation_data: {
    messages: Array<{ sender: string; message: string }>
  }
  quality_score: number
  is_approved: boolean
  approved_by: string | null
  approved_at: string | null
  created_at: string
  conversation_templates: { name: string; category: string }
}

interface ConversationsTableProps {
  conversations: Conversation[]
  onConversationUpdated: () => void
}

export function ConversationsTable({ conversations, onConversationUpdated }: ConversationsTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})

  const handleAction = async (conversationId: string, action: string) => {
    setLoadingActions((prev) => ({ ...prev, [conversationId]: true }))

    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      switch (action) {
        case "approve":
          await supabase
            .from("generated_conversations")
            .update({
              is_approved: true,
              approved_by: userData.user?.id,
              approved_at: new Date().toISOString(),
            })
            .eq("id", conversationId)
          break
        case "reject":
          await supabase
            .from("generated_conversations")
            .update({
              is_approved: false,
              approved_by: userData.user?.id,
              approved_at: new Date().toISOString(),
            })
            .eq("id", conversationId)
          break
        case "delete":
          await supabase.from("generated_conversations").delete().eq("id", conversationId)
          break
      }

      onConversationUpdated()
    } catch (error) {
      console.error("Erro ao executar ação:", error)
    } finally {
      setLoadingActions((prev) => ({ ...prev, [conversationId]: false }))
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 4) return "text-green-400"
    if (score >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const getApprovalBadge = (isApproved: boolean, approvedAt: string | null) => {
    if (approvedAt === null) {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pendente</Badge>
    }
    return isApproved ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprovada</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejeitada</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const ConversationPreview = ({ conversation }: { conversation: Conversation }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Prévia da Conversa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Template: {conversation.conversation_templates.name}</p>
              <p className="text-gray-400 text-sm">Categoria: {conversation.conversation_templates.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < conversation.quality_score ? "text-yellow-400 fill-current" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm">({conversation.quality_score}/5)</span>
            </div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
            {conversation.conversation_data.messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lime-400 font-medium text-sm">{msg.sender}:</span>
                </div>
                <div className="text-gray-300 bg-slate-600/30 rounded-lg p-3 ml-4">{msg.message}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/50">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <TableHead className="text-gray-300">Template</TableHead>
            <TableHead className="text-gray-300">Qualidade</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Mensagens</TableHead>
            <TableHead className="text-gray-300">Criado em</TableHead>
            <TableHead className="text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <TableRow key={conversation.id} className="border-slate-700">
              <TableCell>
                <div>
                  <div className="text-white font-medium">{conversation.conversation_templates.name}</div>
                  <div className="text-gray-400 text-sm">{conversation.conversation_templates.category}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < conversation.quality_score ? "text-yellow-400 fill-current" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${getQualityColor(conversation.quality_score)}`}>
                    {conversation.quality_score}/5
                  </span>
                </div>
              </TableCell>
              <TableCell>{getApprovalBadge(conversation.is_approved, conversation.approved_at)}</TableCell>
              <TableCell className="text-gray-300">{conversation.conversation_data.messages.length}</TableCell>
              <TableCell className="text-gray-300">{formatDate(conversation.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ConversationPreview conversation={conversation} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        disabled={loadingActions[conversation.id]}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      {!conversation.is_approved && conversation.approved_at === null && (
                        <DropdownMenuItem
                          onClick={() => handleAction(conversation.id, "approve")}
                          className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Aprovar
                        </DropdownMenuItem>
                      )}
                      {conversation.approved_at === null && (
                        <DropdownMenuItem
                          onClick={() => handleAction(conversation.id, "reject")}
                          className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeitar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleAction(conversation.id, "delete")}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
