import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const hasSupabaseConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://example.supabase.co' &&
  supabaseAnonKey !== 'public-anon-key'
);

if (!hasSupabaseConfig) {
  console.warn('Supabase não configurado. O app continuará em modo local para demonstração.');
}

export const isSupabaseConfigured = hasSupabaseConfig;

export const supabase = hasSupabaseConfig && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
