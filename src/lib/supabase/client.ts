import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    supabaseKey.length > 20
  );
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return a mock client that does nothing
    // This allows the app to build even without Supabase configured
    return null as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
