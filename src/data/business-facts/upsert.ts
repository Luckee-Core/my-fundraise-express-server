import type { SupabaseClient } from '@supabase/supabase-js';
import { mapBusinessFactRow } from './map-business-fact-row';
import type { BusinessFact, BusinessFactRow, UpsertBusinessFactInput } from './types';

/** Upserts one business fact by (user_id, section_id, fact_key). */
export const upsertBusinessFact = async (
  supabase: SupabaseClient,
  input: UpsertBusinessFactInput,
): Promise<BusinessFact> => {
  console.log('💾 upsertBusinessFact', { sectionId: input.sectionId, factKey: input.factKey });
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('business_facts')
    .upsert(
      {
        user_id: input.userId,
        section_id: input.sectionId,
        fact_key: input.factKey,
        fact_value: input.factValue,
        sort_order: input.sortOrder ?? 0,
        updated_at: now,
      },
      { onConflict: 'user_id,section_id,fact_key' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to upsert business fact: ${error.message}`);
  }

  return mapBusinessFactRow(data as BusinessFactRow);
};
