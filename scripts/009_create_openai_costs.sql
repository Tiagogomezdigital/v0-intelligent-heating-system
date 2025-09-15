-- Tabela de custos OpenAI
CREATE TABLE IF NOT EXISTS public.openai_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  model VARCHAR(100) NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  request_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.openai_costs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - apenas administradores podem ver custos
CREATE POLICY "openai_costs_admin_select" ON public.openai_costs 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'administrator'
  )
);

-- Usuários podem inserir seus próprios custos
CREATE POLICY "openai_costs_user_insert" ON public.openai_costs 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_openai_costs_user_id ON public.openai_costs(user_id);
CREATE INDEX idx_openai_costs_created_at ON public.openai_costs(created_at);
CREATE INDEX idx_openai_costs_model ON public.openai_costs(model);
