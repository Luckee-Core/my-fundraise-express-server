import type { SupabaseClient } from '@supabase/supabase-js';
import { mapBusinessContextSectionRow } from './map-business-context-section-row';
import type { BusinessContextSection, BusinessContextSectionRow } from './types';

/** Lists business context sections for a user, ordered by sort_order. */
export const listBusinessContextSectionsByUserId = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<BusinessContextSection[]> => {
  console.log('💾 listBusinessContextSectionsByUserId', { userId });
  const { data, error } = await supabase
    .from('business_context_sections')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to list business context sections: ${error.message}`);
  }

  return (data as BusinessContextSectionRow[]).map(mapBusinessContextSectionRow);
};
