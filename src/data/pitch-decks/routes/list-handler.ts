import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { listPitchDecks } from '../list';

/** GET /api/data/pitch-decks */
export const listPitchDecksHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/pitch-decks');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listPitchDecks(supabase);
    console.log('📤 GET /api/data/pitch-decks');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listPitchDecksHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
