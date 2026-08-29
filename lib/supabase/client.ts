import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://iwxlicuixlfiobyfgvdi.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGxpY3VpeGxmaW9ieWZndmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDI0NTIsImV4cCI6MjA4ODU3ODQ1Mn0.lNy4pe3wU_Os-8pnagBQowbL5MhmbwV8V-zFwYLVNeo';

let supabaseBrowserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(url, anonKey);
  }

  return supabaseBrowserClient;
}

export function getSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const serviceRoleOrAnon =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_SUPABASE_ANON_KEY;

  return createClient(url, serviceRoleOrAnon);
}
