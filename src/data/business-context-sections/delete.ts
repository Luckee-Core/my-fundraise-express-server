import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes a business context section (cascades facts). */
export const deleteBusinessContextSection = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  console.log('💾 deleteBusinessContextSection', { id });
  const { error } = await supabase.from('business_context_sections').delete().eq('id', id);
  if (error) {
    throw new Error(`Failed to delete business context section: ${error.message}`);
  }
};
