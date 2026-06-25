/**
 * Managed service client accessors.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';

let managedSupabaseClient: SupabaseClient | null = null;
let managedAnthropicClient: Anthropic | null = null;

/** True when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both set. */
export const hasSupabaseCredentials = (): boolean =>
  Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

/** Returns the managed Supabase client, or null if not initialized. */
export const getManagedSupabaseClient = (): SupabaseClient | null => managedSupabaseClient;

/** @internal Set by init-managed-clients at startup. */
export const setManagedSupabaseClient = (client: SupabaseClient | null): void => {
  managedSupabaseClient = client;
};

/** Returns the managed Anthropic client, or null if unavailable. */
export const getManagedAnthropicClient = (): Anthropic | null => {
  if (managedAnthropicClient) return managedAnthropicClient;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  managedAnthropicClient = new Anthropic({ apiKey: key });
  return managedAnthropicClient;
};

/** @internal Set by init-managed-clients at startup. */
export const setManagedAnthropicClient = (client: Anthropic | null): void => {
  managedAnthropicClient = client;
};
