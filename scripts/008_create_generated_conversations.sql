-- Tabela de conversas geradas
CREATE TABLE IF NOT EXISTS public.generated_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.conversation_templates(id),
  conversation_data JSONB NOT NULL,
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.generated_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "generated_conversations_authenticated_all" ON public.generated_conversations 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Índices para performance
CREATE INDEX idx_generated_conversations_template_id ON public.generated_conversations(template_id);
CREATE INDEX idx_generated_conversations_quality_score ON public.generated_conversations(quality_score);
CREATE INDEX idx_generated_conversations_is_approved ON public.generated_conversations(is_approved);
