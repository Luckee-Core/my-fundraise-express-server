import type { SupabaseClient } from '@supabase/supabase-js';
import { mapBusinessContextSectionRow } from './map-business-context-section-row';
import type {
  BusinessContextSection,
  BusinessContextSectionRow,
  UpdateBusinessContextSectionInput,
} from './types';

/** Updates a business context section by id. */
export const updateBusinessContextSection = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateBusinessContextSectionInput,
): Promise<BusinessContextSection> => {
  console.log('💾 updateBusinessContextSection', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.label !== undefined) patch.label = input.label;
  if (input.description !== undefined) patch.description = input.description;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from('business_context_sections')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update business context section: ${error.message}`);
  }

  return mapBusinessContextSectionRow(data as BusinessContextSectionRow);
};
