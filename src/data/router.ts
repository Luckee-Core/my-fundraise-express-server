import { Router } from 'express';
import { createInvestorsRouter } from './investors';
import { createInvestorContactsRouter } from './investor-contacts';
import { createPitchDecksRouter } from './pitch-decks';
import { createPitchDeckSlidesRouter } from './pitch-deck-slides';
import { createGraphicsRouter } from './graphics';

/**
 * Aggregates all /api/data entity routers.
 */
export const createDataRouter = (): Router => {
  const router = Router();
  router.use('/investors', createInvestorsRouter());
  router.use('/investor-contacts', createInvestorContactsRouter());
  router.use('/pitch-decks', createPitchDecksRouter());
  router.use('/pitch-deck-slides', createPitchDeckSlidesRouter());
  router.use('/graphics', createGraphicsRouter());
  return router;
};
