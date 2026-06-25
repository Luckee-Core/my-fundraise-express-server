import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getGraphicById } from '../get-by-id';
import { patchGraphicGenerationMetadata } from '../patch-studio-draft';
import { runGraphicsTsxGeneration } from '../../../services/graphics/run-graphics-tsx-generation';
import { scheduleBackgroundGraphicGeneration } from '../../../services/graphics/schedule-background-graphic-generation';

/** POST /api/data/graphics/:id/generate-tsx — queue Cursor TSX generation (202). */
export const generateGraphicTsxHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
  console.log(`📥 POST /api/data/graphics/${id}/generate-tsx`);
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
    return;
  }
  if (!process.env.CURSOR_API_KEY?.trim()) {
    res.status(503).json({ success: false, error: 'CURSOR_API_KEY is not configured' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const graphic = await getGraphicById(supabase, id);
    if (!graphic) {
      res.status(404).json({ success: false, error: 'Graphic not found' });
      return;
    }
    const brief =
      typeof req.body?.creativeBrief === 'string'
        ? req.body.creativeBrief.trim()
        : typeof graphic.metadata.creativeBrief === 'string'
          ? graphic.metadata.creativeBrief.trim()
          : '';
    if (!brief) {
      res.status(400).json({ success: false, error: 'creativeBrief is required' });
      return;
    }
    if (typeof req.body?.creativeBrief === 'string' && req.body.creativeBrief.trim()) {
      const metadata = { ...graphic.metadata, creativeBrief: brief };
      await supabase.from('image_graphics').update({ metadata, updated_at: new Date().toISOString() }).eq('id', id);
    }
    await patchGraphicGenerationMetadata(supabase, id, { generationStatus: 'queued', generationError: null });
    const label = `graphics-tsx ${id}`;
    scheduleBackgroundGraphicGeneration(label, async () => {
      try {
        await runGraphicsTsxGeneration(supabase, { graphicId: id });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        await patchGraphicGenerationMetadata(supabase, id, { generationStatus: 'failed', generationError: msg });
        throw error;
      }
    });
    console.log(`📤 202 POST /api/data/graphics/${id}/generate-tsx`);
    res.status(202).json({ success: true, accepted: true, graphicId: id });
  } catch (error) {
    console.error('❌ generateGraphicTsxHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
