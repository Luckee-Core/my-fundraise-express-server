/**
 * Initialize managed service clients once at server startup.
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { setManagedAnthropicClient, setManagedSupabaseClient } from './clients';

/** Initializes Supabase and Anthropic clients for reuse across requests. */
export const initManagedClients = async (): Promise<void> => {
  console.log('🚀 [initManagedClients] Initializing managed clients');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ [initManagedClients] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    setManagedSupabaseClient(null);
  } else {
    const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws as never },
    });
    setManagedSupabaseClient(client);
    console.log('✅ [initManagedClients] Supabase client initialized');
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) {
    console.error('❌ [initManagedClients] Missing ANTHROPIC_API_KEY');
    setManagedAnthropicClient(null);
  } else {
    setManagedAnthropicClient(new Anthropic({ apiKey: anthropicApiKey }));
    console.log('✅ [initManagedClients] Anthropic client initialized');
  }
};
