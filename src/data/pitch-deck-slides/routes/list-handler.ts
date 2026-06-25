import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { listPitchDeckSlidesByPitchDeckId } from '../list-by-pitch-deck-id';

const firstQueryString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
};


/** GET /api/data/pitch-deck-slides?pitchDeckId= */
export const listPitchDeckSlidesHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/pitch-deck-slides');
  const pitchDeckId =
    firstQueryString(req.query.pitchDeckId) ?? firstQueryString(req.query.pitch_deck_id) ?? '';
  if (!pitchDeckId || !isUuid(pitchDeckId)) {
    res.status(400).json({ success: false, error: 'pitchDeckId is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listPitchDeckSlidesByPitchDeckId(supabase, pitchDeckId);
    console.log('📤 GET /api/data/pitch-deck-slides');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listPitchDeckSlidesHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
