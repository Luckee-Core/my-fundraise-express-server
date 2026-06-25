import { randomUUID } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateGraphicInput, Graphic } from './types';
import { getGraphicById } from './get-by-id';

/** Inserts a new graphic row. */
export const createGraphic = async (
  supabase: SupabaseClient,
  input: CreateGraphicInput,
): Promise<Graphic> => {
  console.log('💾 createGraphic', { title: input.title });
  const id = randomUUID();
  const now = new Date().toISOString();
  const creativeBrief = input.creativeBrief?.trim() ?? '';
  const metadata: Record<string, unknown> = {
    ...(input.metadata ?? {}),
    ...(creativeBrief ? { creativeBrief } : {}),
    generationStatus: 'queued',
  };
  const { error } = await supabase.from('image_graphics').insert({
    id,
    title: input.title.trim() || 'Untitled graphic',
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    metadata,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
  const row = await getGraphicById(supabase, id);
  if (!row) throw new Error('Failed to load graphic after insert');
  return row;
};
