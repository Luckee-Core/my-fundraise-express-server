import type { Request, Response } from 'express';
import { getManagedSupabaseClient, getManagedAnthropicClient } from '../../managed';
import { getPitchDeckById } from '../../../data/pitch-decks';
import {
  listPitchDeckSlideStudioExchangesForDeckSlide,
  listPitchDeckSlideStudioRequestsByIds,
  listPitchDeckSlideStudioResponsesByIds,
} from '../../../data/pitch-deck-slide-studio';
import { isPitchDeckSlideStudioSlideKey } from '../config';
import { processPitchDeckSlideStudioChat } from '../process-pitch-deck-slide-studio-chat';
import { turnFromExchangeRow } from '../map-pitch-deck-slide-studio-ledger';

/**
 * POST /api/pitch-deck-slide-studio/decks/:pitchDeckId/slides/:slideKey/messages
 */
export const postMessageHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST pitch-deck-slide-studio message');
  const pitchDeckId = typeof req.params.pitchDeckId === 'string' ? req.params.pitchDeckId : '';
  const slideKey = typeof req.params.slideKey === 'string' ? req.params.slideKey : '';
  const body = req.body ?? {};
  const userId = typeof body.userId === 'string' ? body.userId : '';
  const content = typeof body.content === 'string' ? body.content : '';

  if (!pitchDeckId || !slideKey) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideKey are required' });
    return;
  }
  if (!isPitchDeckSlideStudioSlideKey(slideKey)) {
    res.status(400).json({ success: false, error: 'Unsupported slide for studio chat' });
    return;
  }
  if (!userId || !content.trim()) {
    res.status(400).json({ success: false, error: 'userId and content are required' });
    return;
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

    const anthropic = getManagedAnthropicClient();
    await processPitchDeckSlideStudioChat(
      supabase,
      anthropic,
      userId,
      pitchDeckId,
      slideKey,
      content.trim(),
    );

    const latest = await listPitchDeckSlideStudioExchangesForDeckSlide(supabase, pitchDeckId, slideKey, 1);
    const ex = latest[0];
    if (!ex) {
      res.status(500).json({ success: false, error: 'Failed to read exchange after chat' });
      return;
    }

    const [reqRows, resRows] = await Promise.all([
      listPitchDeckSlideStudioRequestsByIds(supabase, [ex.request_id]),
      ex.response_id
        ? listPitchDeckSlideStudioResponsesByIds(supabase, [ex.response_id])
        : Promise.resolve([]),
    ]);
    const userRow = reqRows[0];
    const resRow = ex.response_id ? resRows.find((r) => r.id === ex.response_id) : undefined;
    const structured = (resRow?.structured ?? {}) as Record<string, unknown>;
    const assistantContent =
      typeof structured.content === 'string' && structured.content.trim() ? structured.content : '';

    const turn = turnFromExchangeRow(ex, userRow?.content ?? '', assistantContent);
    console.log('📤 POST pitch-deck-slide-studio message');
    res.status(200).json({ success: true, turn });
  } catch (error) {
    console.error('❌ postMessageHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
