import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pitch deck slide studio response row. */
export const insertPitchDeckSlideStudioResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: Record<string, unknown>,
): Promise<void> => {
  console.log('💾 insertPitchDeckSlideStudioResponse', { id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('pitch_deck_slide_studio_responses').insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
