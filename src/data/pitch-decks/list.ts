import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckRow } from './types';

/** Lists all pitch decks. */
export const listPitchDecks = async (supabase: SupabaseClient): Promise<PitchDeckRow[]> => {
  console.log('💾 listPitchDecks');
  const { data, error } = await supabase.from('pitch_decks').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch pitch decks: ${error.message}`);
  return (data ?? []) as PitchDeckRow[];
};
