import { createClient } from '@supabase/supabase-js';

/**
 * IABS-SIP Supabase Client
 * Utiliza fallbacks para evitar falhas críticas de runtime
 * caso as variáveis de ambiente não estejam configuradas.
 */

const getEnv = (key: string): string => {
  try {
    return import.meta.env?.[key] ?? '';
  } catch {
    return '';
  }
};

const envUrl = getEnv('VITE_SUPABASE_URL');
const envKey = getEnv('VITE_SUPABASE_ANON_KEY');

const isConfigured =
  envUrl &&
  envKey &&
  envUrl !== 'YOUR_API_KEY' &&
  envKey !== 'YOUR_API_KEY' &&
  envUrl.startsWith('http');

const supabaseUrl = isConfigured ? envUrl : 'https://iabs-sip-placeholder.supabase.co';
const supabaseAnonKey = isConfigured ? envKey : 'placeholder-key-non-functional';

if (!isConfigured) {
  console.warn(
    'IABS-SIP [AVISO]: Credenciais do Supabase não detectadas. ' +
    'O sistema está operando em MODO DE DEMONSTRAÇÃO com dados locais.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
