-- Tabela de mensagens enviadas
CREATE TABLE IF NOT EXISTS public.sent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number_id UUID NOT NULL REFERENCES public.numbers(id) ON DELETE CASCADE,
  recipient_number VARCHAR(20) NOT NULL,
  message_content TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio')),
  status VARCHAR(50) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  evolution_message_id VARCHAR(255),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.sent_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "sent_messages_authenticated_all" ON public.sent_messages 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Índices para performance
CREATE INDEX idx_sent_messages_number_id ON public.sent_messages(number_id);
CREATE INDEX idx_sent_messages_sent_at ON public.sent_messages(sent_at);
CREATE INDEX idx_sent_messages_status ON public.sent_messages(status);
