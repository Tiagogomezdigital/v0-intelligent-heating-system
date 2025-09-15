-- Tabela de números WhatsApp
CREATE TABLE IF NOT EXISTS public.numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  instance_id UUID NOT NULL REFERENCES public.evolution_instances(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'warming', 'blocked', 'maintenance')),
  warming_status VARCHAR(50) NOT NULL DEFAULT 'inactive' CHECK (warming_status IN ('active', 'inactive', 'paused', 'completed')),
  daily_limit INTEGER NOT NULL DEFAULT 50,
  messages_sent_today INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  warming_start_date TIMESTAMP WITH TIME ZONE,
  warming_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.numbers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários autenticados podem ver e gerenciar números
CREATE POLICY "numbers_authenticated_all" ON public.numbers 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_numbers_updated_at BEFORE UPDATE ON public.numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
