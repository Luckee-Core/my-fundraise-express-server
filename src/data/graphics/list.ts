import type { SupabaseClient } from '@supabase/supabase-js';
import type { Graphic, GraphicRow } from './types';
import { mapGraphicRow } from './map-graphic-row';

/** Lists all graphics (newest updated_at first). */
export const listGraphics = async (supabase: SupabaseClient): Promise<Graphic[]> => {
  console.log('💾 listGraphics');
  const { data, error } = await supabase
    .from('image_graphics')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapGraphicRow(row as GraphicRow));
};
