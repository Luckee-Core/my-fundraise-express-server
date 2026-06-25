import { Router } from 'express';
import { getLedgerHandler } from './routes/get-ledger-handler';
import { postMessageHandler } from './routes/post-message-handler';

/**
 * Pitch Deck Slide Studio API — per-deck, per-slide AI coach chat ledger.
 */
export const createPitchDeckSlideStudioRouter = (): Router => {
  const router = Router();
  router.get('/decks/:pitchDeckId/slides/:slideKey/ledger', getLedgerHandler);
  router.post('/decks/:pitchDeckId/slides/:slideKey/messages', postMessageHandler);
  return router;
};
