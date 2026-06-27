import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { updatePitchDeckSlide } from '../update';

/** PATCH /api/data/pitch-deck-slides/:id */
export const updatePitchDeckSlideHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/pitch-deck-slides/:id');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid slide id is required' });
    return;
  }
  const body = req.body ?? {};
  const title = typeof body.title === 'string' ? body.title.trim() : undefined;
  const templateKey =
    body.templateKey === null
      ? null
      : typeof body.templateKey === 'string'
        ? body.templateKey
        : undefined;
  const position = typeof body.position === 'number' ? body.position : undefined;
  const contentJson =
    typeof body.contentJson === 'object' && body.contentJson !== null
      ? (body.contentJson as Record<string, unknown>)
      : undefined;
  try {
    const data = await updatePitchDeckSlide(supabase, {
      id,
      title,
      templateKey,
      position,
      contentJson,
    });
    console.log('📤 PATCH /api/data/pitch-deck-slides/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updatePitchDeckSlideHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
