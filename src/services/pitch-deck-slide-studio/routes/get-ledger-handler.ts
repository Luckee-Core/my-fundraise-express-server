import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../managed';
import { getPitchDeckById } from '../../../data/pitch-decks';
import { isPitchDeckSlideStudioSlideKey } from '../config';
import { buildPitchDeckSlideStudioLedgerTurns } from '../map-pitch-deck-slide-studio-ledger';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * GET /api/pitch-deck-slide-studio/decks/:pitchDeckId/slides/:slideKey/ledger
 */
export const getLedgerHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET pitch-deck-slide-studio ledger');
  const pitchDeckId = typeof req.params.pitchDeckId === 'string' ? req.params.pitchDeckId : '';
  const slideKey = typeof req.params.slideKey === 'string' ? req.params.slideKey : '';
  if (!pitchDeckId || !slideKey) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideKey are required' });
    return;
  }
  if (!isPitchDeckSlideStudioSlideKey(slideKey)) {
    res.status(400).json({ success: false, error: 'Unsupported slide for studio chat' });
    return;
  }
  let limit = DEFAULT_LIMIT;
  if (typeof req.query.limit === 'string') {
    const n = parseInt(req.query.limit, 10);
    if (!Number.isNaN(n) && n > 0) limit = Math.min(n, MAX_LIMIT);
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const deck = await getPitchDeckById(supabase, pitchDeckId);
    if (!deck) {
      res.status(404).json({ success: false, error: 'Pitch deck not found' });
      return;
    }
    const turns = await buildPitchDeckSlideStudioLedgerTurns(supabase, pitchDeckId, slideKey, limit);
    console.log('📤 GET pitch-deck-slide-studio ledger');
    res.status(200).json({ success: true, turns });
  } catch (error) {
    console.error('❌ getLedgerHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
