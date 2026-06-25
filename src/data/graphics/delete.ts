import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes a graphic by id. */
export const deleteGraphic = async (supabase: SupabaseClient, graphicId: string): Promise<void> => {
  console.log('💾 deleteGraphic', { graphicId });
  const { error } = await supabase.from('image_graphics').delete().eq('id', graphicId);
  if (error) throw new Error(error.message);
};
