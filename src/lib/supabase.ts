import { createClient } from '@supabase/supabase-js';

/**
 * IABS-SIP Supabase Client
 * 
 * Esta configuração utiliza fallbacks para evitar falhas críticas de runtime
 * caso as variáveis de ambiente não estejam configuradas.
 */

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as credenciais são válidas e não são os placeholders padrão
const isConfigured = 
  envUrl && 
  envKey && 
  envUrl !== "YOUR_API_KEY" && 
  envKey !== "YOUR_API_KEY" &&
  envUrl.startsWith('http');

// Fallback para URLs sintaticamente válidas para evitar erro: 
// "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"
const supabaseUrl = isConfigured ? envUrl : 'https://iabs-sip-placeholder.supabase.co';
const supabaseAnonKey = isConfigured ? envKey : 'placeholder-key-non-functional';

if (!isConfigured) {
  console.warn(
    "IABS-SIP [AVISO]: Credenciais do Supabase não detectadas. " +
    "O sistema está operando em MODO DE DEMONSTRAÇÃO com dados locais."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
