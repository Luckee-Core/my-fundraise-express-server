import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { createPitchDeckSlide } from '../create';

/** POST /api/data/pitch-deck-slides — create a new slide row. */
export const createPitchDeckSlideHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/pitch-deck-slides');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const pitchDeckId = typeof body.pitchDeckId === 'string' ? body.pitchDeckId : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const templateKey =
    body.templateKey === null || typeof body.templateKey === 'string' ? body.templateKey : null;
  const position = typeof body.position === 'number' ? body.position : 0;
  const contentJson =
    typeof body.contentJson === 'object' && body.contentJson !== null
      ? (body.contentJson as Record<string, unknown>)
      : {};
  if (!pitchDeckId || !isUuid(pitchDeckId) || !title) {
    res.status(400).json({ success: false, error: 'pitchDeckId and title are required' });
    return;
  }
  try {
    const data = await createPitchDeckSlide(supabase, {
      pitchDeckId,
      title,
      templateKey,
      position,
      contentJson,
    });
    console.log('📤 POST /api/data/pitch-deck-slides');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createPitchDeckSlideHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
