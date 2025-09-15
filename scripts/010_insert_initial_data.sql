-- Inserir dados iniciais

-- Adicionando usuário administrador padrão
-- Usuário administrador padrão (senha: admin123)
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@warmflow.com', 'Administrador', 'administrator', NOW(), NOW());

-- Template de conversa padrão
INSERT INTO public.conversation_templates (id, name, category, prompt, created_by) VALUES
(gen_random_uuid(), 'Conversa Casual', 'casual', 
'Gere uma conversa natural e casual entre duas pessoas que se conhecem. A conversa deve ter entre 5-10 mensagens, ser em português brasileiro, e abordar temas do dia a dia como trabalho, família, hobbies ou eventos atuais. Mantenha um tom amigável e descontraído.',
'00000000-0000-0000-0000-000000000000'),

(gen_random_uuid(), 'Conversa Profissional', 'profissional',
'Gere uma conversa profissional entre colegas de trabalho ou parceiros de negócios. A conversa deve ter entre 5-10 mensagens, ser em português brasileiro, e abordar temas como projetos, reuniões, prazos ou oportunidades de negócio. Mantenha um tom respeitoso e profissional.',
'00000000-0000-0000-0000-000000000000'),

(gen_random_uuid(), 'Conversa Familiar', 'familiar',
'Gere uma conversa entre familiares próximos (pais, filhos, irmãos, etc.). A conversa deve ter entre 5-10 mensagens, ser em português brasileiro, e abordar temas familiares como saúde, eventos familiares, planos para o fim de semana ou notícias da família. Mantenha um tom carinhoso e próximo.',
'00000000-0000-0000-0000-000000000000');

-- Configuração de aquecimento padrão
INSERT INTO public.warming_configs (id, name, description, created_by) VALUES
(gen_random_uuid(), 'Aquecimento Padrão', 'Configuração padrão para aquecimento de números WhatsApp com 50 mensagens por dia durante 30 dias.',
'00000000-0000-0000-0000-000000000000'),

(gen_random_uuid(), 'Aquecimento Intensivo', 'Configuração para aquecimento mais intensivo com 100 mensagens por dia durante 21 dias.',
'00000000-0000-0000-0000-000000000000');

-- Atualizar a configuração intensiva
UPDATE public.warming_configs 
SET daily_limit = 100, warming_duration_days = 21 
WHERE name = 'Aquecimento Intensivo';
