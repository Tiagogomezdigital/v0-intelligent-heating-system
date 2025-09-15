-- Adicionar instância Evolution API do usuário
INSERT INTO public.evolution_instances (
  name,
  base_url,
  api_key,
  status,
  max_numbers,
  current_numbers
) VALUES (
  'Evolution API - Principal',
  'https://evolution2.revolutiondigital.com.br',
  '429683C4C977415CAAFCCE10F7D57E11',
  'active',
  100,
  0
) ON CONFLICT DO NOTHING;
