-- Tabela de instâncias Evolution API
CREATE TABLE IF NOT EXISTS public.evolution_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  api_key VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  max_numbers INTEGER NOT NULL DEFAULT 50,
  current_numbers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.evolution_instances ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - apenas administradores podem gerenciar instâncias
CREATE POLICY "evolution_instances_admin_all" ON public.evolution_instances 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'administrator'
  )
);

-- Operadores podem apenas visualizar
CREATE POLICY "evolution_instances_operator_select" ON public.evolution_instances 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'operator'
  )
);

CREATE TRIGGER update_evolution_instances_updated_at BEFORE UPDATE ON public.evolution_instances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
