import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { createPitchDeck } from '../create';

/** POST /api/data/pitch-decks */
export const createPitchDeckHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/pitch-decks');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    res.status(400).json({ success: false, error: 'name is required' });
    return;
  }
  const deckType = body.deckType === 'investor_deep_dive' ? 'investor_deep_dive' : 'intro_screener';
  try {
    const data = await createPitchDeck(supabase, {
      name,
      deckType,
      createdByUserId: typeof body.createdByUserId === 'string' ? body.createdByUserId : null,
    });
    console.log('📤 POST /api/data/pitch-decks');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createPitchDeckHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
