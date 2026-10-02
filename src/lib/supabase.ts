import { createClient } from '@supabase/supabase-js';

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured =
  envUrl &&
  envKey &&
  envUrl !== 'YOUR_API_KEY' &&
  envKey !== 'YOUR_API_KEY' &&
  envUrl.startsWith('http');

const supabaseUrl = isConfigured ? envUrl! : 'https://iabs-sip-placeholder.supabase.co';
const supabaseAnonKey = isConfigured ? envKey! : 'placeholder-key-non-functional';

if (!isConfigured) {
  console.warn(
    'IABS-SIP [AVISO]: Credenciais do Supabase não detectadas. ' +
    'O sistema está operando em MODO DE DEMONSTRAÇÃO com dados locais.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
