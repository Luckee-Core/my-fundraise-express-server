import type { SupabaseClient } from '@supabase/supabase-js';
import { mapBusinessFactRow } from './map-business-fact-row';
import type { BusinessFact, BusinessFactRow } from './types';

type ListBusinessFactsOptions = {
  sectionId?: string;
};

/** Lists business facts for a user, optionally filtered by section. */
export const listBusinessFactsByUserId = async (
  supabase: SupabaseClient,
  userId: string,
  options: ListBusinessFactsOptions = {},
): Promise<BusinessFact[]> => {
  console.log('💾 listBusinessFactsByUserId', { userId, sectionId: options.sectionId });
  let query = supabase.from('business_facts').select('*').eq('user_id', userId);
  if (options.sectionId) {
    query = query.eq('section_id', options.sectionId);
  }
  const { data, error } = await query.order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to list business facts: ${error.message}`);
  }

  return (data as BusinessFactRow[]).map(mapBusinessFactRow);
};
