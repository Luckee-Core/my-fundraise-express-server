import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckRow } from './types';

/** Fetches one pitch deck by id. */
export const getPitchDeckById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<PitchDeckRow | null> => {
  console.log('💾 getPitchDeckById', { id });
  const { data, error } = await supabase.from('pitch_decks').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to fetch pitch deck: ${error.message}`);
  return (data ?? null) as PitchDeckRow | null;
};
