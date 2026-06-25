import type { SupabaseClient } from '@supabase/supabase-js';
import { GRAPHIC_SELECT_COLUMNS, type Graphic, type GraphicRow } from './types';
import { mapGraphicRow } from './map-graphic-row';

/** Fetches one graphic by id. */
export const getGraphicById = async (
  supabase: SupabaseClient,
  graphicId: string,
): Promise<Graphic | null> => {
  console.log('💾 getGraphicById', { graphicId });
  const { data, error } = await supabase
    .from('image_graphics')
    .select(GRAPHIC_SELECT_COLUMNS)
    .eq('id', graphicId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapGraphicRow(data as GraphicRow);
};
