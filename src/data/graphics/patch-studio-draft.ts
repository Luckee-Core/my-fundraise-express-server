import type { SupabaseClient } from '@supabase/supabase-js';
import type { Graphic, GraphicGenerationStatus } from './types';
import { getGraphicById } from './get-by-id';

/** Merges TSX into metadata.studioDraft for one graphic. */
export const patchGraphicStudioDraft = async (
  supabase: SupabaseClient,
  graphicId: string,
  tsx: string,
): Promise<Graphic | null> => {
  console.log('💾 patchGraphicStudioDraft', { graphicId });
  const prev = await getGraphicById(supabase, graphicId);
  if (!prev) return null;
  const metadata: Record<string, unknown> = { ...prev.metadata, studioDraft: { tsx } };
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from('image_graphics')
    .update({ metadata, updated_at: updatedAt })
    .eq('id', graphicId);
  if (error) throw new Error(error.message);
  return getGraphicById(supabase, graphicId);
};

/** Patches generation-related metadata fields on a graphic. */
export const patchGraphicGenerationMetadata = async (
  supabase: SupabaseClient,
  graphicId: string,
  patch: {
    generationStatus?: GraphicGenerationStatus;
    generationError?: string | null;
    cursorAgentId?: string | null;
  },
): Promise<Graphic | null> => {
  console.log('💾 patchGraphicGenerationMetadata', { graphicId });
  const prev = await getGraphicById(supabase, graphicId);
  if (!prev) return null;
  const metadata: Record<string, unknown> = { ...prev.metadata };
  if (patch.generationStatus !== undefined) metadata.generationStatus = patch.generationStatus;
  if (patch.generationError !== undefined) {
    if (patch.generationError === null) delete metadata.generationError;
    else metadata.generationError = patch.generationError;
  }
  if (patch.cursorAgentId !== undefined) {
    if (patch.cursorAgentId === null) delete metadata.cursorAgentId;
    else metadata.cursorAgentId = patch.cursorAgentId;
  }
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from('image_graphics')
    .update({ metadata, updated_at: updatedAt })
    .eq('id', graphicId);
  if (error) throw new Error(error.message);
  return getGraphicById(supabase, graphicId);
};
