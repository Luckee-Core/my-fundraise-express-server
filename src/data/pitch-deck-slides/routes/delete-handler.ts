import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { deletePitchDeckSlide } from '../delete';

/** DELETE /api/data/pitch-deck-slides/:id */
export const deletePitchDeckSlideHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 DELETE /api/data/pitch-deck-slides/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid slide id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    await deletePitchDeckSlide(supabase, id);
    console.log('📤 DELETE /api/data/pitch-deck-slides/:id');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ deletePitchDeckSlideHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
