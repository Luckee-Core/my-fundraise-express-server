import type { SupabaseClient } from '@supabase/supabase-js';
import type { Graphic, UpdateGraphicDetailsInput } from './types';
import { getGraphicById } from './get-by-id';

/** Updates title and canvas dimensions for one graphic. */
export const updateGraphicDetails = async (
  supabase: SupabaseClient,
  graphicId: string,
  patch: UpdateGraphicDetailsInput,
): Promise<Graphic | null> => {
  console.log('💾 updateGraphicDetails', { graphicId });
  const prev = await getGraphicById(supabase, graphicId);
  if (!prev) return null;
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from('image_graphics')
    .update({
      title: patch.title.trim() || 'Untitled graphic',
      canvas_width_px: patch.canvasWidthPx,
      canvas_height_px: patch.canvasHeightPx,
      updated_at: updatedAt,
    })
    .eq('id', graphicId);
  if (error) throw new Error(error.message);
  return getGraphicById(supabase, graphicId);
};
