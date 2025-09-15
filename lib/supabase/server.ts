import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Cria cliente Supabase para uso no servidor
 * Importante: sempre criar novo cliente para cada função (Fluid compute)
 */
export function createClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
