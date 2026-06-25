import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { createPitchDeckVersion } from '../create-version';

/** POST /api/data/pitch-decks/:id/versions */
export const createPitchDeckVersionHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 POST /api/data/pitch-decks/:id/versions', { id });
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
    const data = await createPitchDeckVersion(supabase, id);
    console.log('📤 POST /api/data/pitch-decks/:id/versions');
    res.status(201).json({ success: true, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    const status = msg === 'Pitch deck not found' ? 404 : 500;
    console.error('❌ createPitchDeckVersionHandler', error);
    res.status(status).json({ success: false, error: msg });
  }
};
