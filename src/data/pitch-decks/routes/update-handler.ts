import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getPitchDeckById } from '../get-by-id';
import { updatePitchDeck } from '../update';

/** PATCH /api/data/pitch-decks/:id */
export const updatePitchDeckHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/pitch-decks/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid pitch deck id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const existing = await getPitchDeckById(supabase, id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Pitch deck not found' });
      return;
    }
    const body = req.body ?? {};
    const data = await updatePitchDeck(supabase, id, {
      ...(typeof body.name === 'string' ? { name: body.name } : {}),
      ...(body.status === 'draft' || body.status === 'sent' || body.status === 'archived'
        ? { status: body.status }
        : {}),
    });
    console.log('📤 PATCH /api/data/pitch-decks/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updatePitchDeckHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
