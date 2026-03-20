
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const isProd = import.meta.env.PROD;
const supabaseUrl = isProd
    ? window.location.origin + '/_database'
    : (import.meta.env.VITE_SUPABASE_URL || '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!isProd && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error('Supabase URL or Anon Key is missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
