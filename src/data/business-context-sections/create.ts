import type { SupabaseClient } from '@supabase/supabase-js';
import { mapBusinessContextSectionRow } from './map-business-context-section-row';
import type {
  BusinessContextSection,
  BusinessContextSectionRow,
  CreateBusinessContextSectionInput,
} from './types';

/** Inserts a business context section. */
export const createBusinessContextSection = async (
  supabase: SupabaseClient,
  input: CreateBusinessContextSectionInput,
): Promise<BusinessContextSection> => {
  console.log('💾 createBusinessContextSection', { sectionKey: input.sectionKey });
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('business_context_sections')
    .insert({
      user_id: input.userId,
      section_key: input.sectionKey,
      label: input.label,
      description: input.description ?? null,
      sort_order: input.sortOrder ?? 0,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create business context section: ${error.message}`);
  }

  return mapBusinessContextSectionRow(data as BusinessContextSectionRow);
};
