import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { upsertPitchDeckSlide } from '../upsert';

/** POST /api/data/pitch-deck-slides (upsert) */
export const upsertPitchDeckSlideHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/pitch-deck-slides');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const pitchDeckId = typeof body.pitchDeckId === 'string' ? body.pitchDeckId : '';
  const slideKey = typeof body.slideKey === 'string' ? body.slideKey : '';
  const position = typeof body.position === 'number' ? body.position : 0;
  const contentJson =
    typeof body.contentJson === 'object' && body.contentJson !== null
      ? (body.contentJson as Record<string, unknown>)
      : {};
  if (!pitchDeckId || !isUuid(pitchDeckId) || !slideKey) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideKey are required' });
    return;
  }
  try {
    const data = await upsertPitchDeckSlide(supabase, { pitchDeckId, slideKey, position, contentJson });
    console.log('📤 POST /api/data/pitch-deck-slides');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ upsertPitchDeckSlideHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
