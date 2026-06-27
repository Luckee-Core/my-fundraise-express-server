import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { reorderPitchDeckSlides } from '../reorder';

/** PATCH /api/data/pitch-deck-slides/reorder */
export const reorderPitchDeckSlidesHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/pitch-deck-slides/reorder');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const pitchDeckId = typeof body.pitchDeckId === 'string' ? body.pitchDeckId : '';
  const slideIds = Array.isArray(body.slideIds)
    ? (body.slideIds as unknown[]).filter(
        (id): id is string => typeof id === 'string' && isUuid(id),
      )
    : [];
  if (!pitchDeckId || !isUuid(pitchDeckId) || slideIds.length === 0) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideIds are required' });
    return;
  }
  try {
    await reorderPitchDeckSlides(supabase, { pitchDeckId, slideIds });
    console.log('📤 PATCH /api/data/pitch-deck-slides/reorder');
    res.status(200).json({ success: true, data: true });
  } catch (error) {
    console.error('❌ reorderPitchDeckSlidesHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
