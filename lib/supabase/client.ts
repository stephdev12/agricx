import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseBrowserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === 'OFFLINE' || url.includes('votre-projet') || url.includes('placeholder')) {
    return null;
  }

  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(url, anonKey);
  }

  return supabaseBrowserClient;
}

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleOrAnon = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceRoleOrAnon || url === 'OFFLINE' || url.includes('votre-projet') || url.includes('placeholder')) {
    return null;
  }

  return createClient(url, serviceRoleOrAnon);
}
