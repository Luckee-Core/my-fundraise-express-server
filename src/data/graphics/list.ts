import type { SupabaseClient } from '@supabase/supabase-js';
import { GRAPHIC_SELECT_COLUMNS, type Graphic, type GraphicRow } from './types';
import { mapGraphicRow } from './map-graphic-row';

/** Lists all graphics (newest updated_at first). */
export const listGraphics = async (supabase: SupabaseClient): Promise<Graphic[]> => {
  console.log('💾 listGraphics');
  const { data, error } = await supabase
    .from('image_graphics')
    .select(GRAPHIC_SELECT_COLUMNS)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapGraphicRow(row as GraphicRow));
};
