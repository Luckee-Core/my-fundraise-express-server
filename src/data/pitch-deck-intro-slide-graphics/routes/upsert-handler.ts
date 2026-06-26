import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { upsertPitchDeckIntroSlideGraphic } from '../upsert';

/** POST /api/data/pitch-deck-intro-slide-graphics */
export const upsertPitchDeckIntroSlideGraphicHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/pitch-deck-intro-slide-graphics');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const pitchDeckId = typeof body.pitchDeckId === 'string' ? body.pitchDeckId : '';
  const slideKey = typeof body.slideKey === 'string' ? body.slideKey.trim() : '';
  const imageGraphicId =
    body.imageGraphicId === null
      ? null
      : typeof body.imageGraphicId === 'string' && isUuid(body.imageGraphicId)
        ? body.imageGraphicId
        : undefined;

  if (!isUuid(pitchDeckId) || !slideKey || imageGraphicId === undefined) {
    res.status(400).json({
      success: false,
      error: 'pitchDeckId, slideKey, and imageGraphicId (uuid or null) are required',
    });
    return;
  }

  try {
    const data = await upsertPitchDeckIntroSlideGraphic(supabase, {
      pitchDeckId,
      slideKey,
      imageGraphicId,
    });
    console.log('📤 POST /api/data/pitch-deck-intro-slide-graphics');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ upsertPitchDeckIntroSlideGraphicHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
