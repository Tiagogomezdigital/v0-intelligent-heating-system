-- Tabela de configurações de aquecimento
CREATE TABLE IF NOT EXISTS public.warming_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '18:00:00',
  min_interval_minutes INTEGER NOT NULL DEFAULT 30,
  max_interval_minutes INTEGER NOT NULL DEFAULT 120,
  daily_limit INTEGER NOT NULL DEFAULT 50,
  warming_duration_days INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.warming_configs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "warming_configs_authenticated_all" ON public.warming_configs 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_warming_configs_updated_at BEFORE UPDATE ON public.warming_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
