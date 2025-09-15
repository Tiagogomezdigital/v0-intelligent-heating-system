# Sistema de Aquecimento Inteligente de WhatsApp

Sistema completo para aquecimento automatizado de números WhatsApp com geração de conversas por IA.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com)

## Funcionalidades

- 🤖 **Aquecimento Automatizado**: Sistema inteligente para aquecimento gradual de números WhatsApp
- 💬 **Geração de Conversas**: IA para criar conversas naturais e realistas
- 📊 **Dashboard Completo**: Monitoramento em tempo real de todas as atividades
- 🔒 **Segurança Avançada**: RLS (Row Level Security) e controle de acesso baseado em roles
- 📈 **Relatórios Detalhados**: Análise completa de performance e custos
- 🔌 **Integração Evolution API**: Conexão direta com instâncias Evolution API

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: Radix UI, Shadcn/ui
- **Integração**: Evolution API para WhatsApp
- **IA**: OpenAI para geração de conversas
- **Deploy**: Vercel

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure:

```bash
cp .env.example .env.local
```

Configure as seguintes variáveis:

```env
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Evolution API (opcional)
EVOLUTION_API_BASE_URL=your_evolution_api_url
EVOLUTION_API_KEY=your_evolution_api_key

# OpenAI (opcional)
OPENAI_API_KEY=your_openai_api_key
```

### 2. Banco de Dados

Execute os scripts SQL na pasta `scripts/` no seu projeto Supabase:

```bash
# Scripts já aplicados automaticamente:
001_create_users_table.sql
002_create_evolution_instances.sql
003_create_numbers_table.sql
004_create_warming_configs.sql
005_create_sent_messages.sql
006_create_activity_logs.sql
007_create_conversation_templates.sql
008_create_generated_conversations.sql
009_create_openai_costs.sql
```

### 3. Instalação Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Deploy na Vercel

### Método 1: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Método 2: Via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

## Estrutura do Projeto

```
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── numbers/           # Gerenciamento de números
│   ├── warming/           # Configurações de aquecimento
│   └── conversations/     # Geração de conversas
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn/ui)
│   └── [feature]/        # Componentes específicos
├── lib/                  # Utilitários e configurações
│   └── supabase/         # Cliente Supabase
└── scripts/              # Scripts SQL do banco
```