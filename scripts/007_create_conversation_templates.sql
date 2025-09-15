-- Tabela de templates de conversa
CREATE TABLE IF NOT EXISTS public.conversation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  prompt TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.conversation_templates ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "conversation_templates_authenticated_all" ON public.conversation_templates 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_conversation_templates_updated_at BEFORE UPDATE ON public.conversation_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
