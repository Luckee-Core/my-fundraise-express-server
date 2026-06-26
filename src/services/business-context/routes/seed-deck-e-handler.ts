import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { processSeedDeckE } from '../process-seed-deck-e';

/** POST /api/business-context/seed-deck-e */
export const seedDeckEHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/business-context/seed-deck-e');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  if (!userId) {
    res.status(400).json({ success: false, error: 'userId is required' });
    return;
  }
  try {
    const data = await processSeedDeckE(supabase, {
      userId,
      includePitchDeck: body.includePitchDeck === true,
    });
    console.log('📤 POST /api/business-context/seed-deck-e');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ seedDeckEHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
