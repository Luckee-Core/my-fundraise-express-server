import { Router } from 'express';
import { listPitchDeckSlidesHandler } from './routes/list-handler';
import { upsertPitchDeckSlideHandler } from './routes/upsert-handler';
import { deletePitchDeckSlideHandler } from './routes/delete-handler';

/** Creates the pitch-deck-slides data router. */
export const createPitchDeckSlidesRouter = (): Router => {
  const router = Router();
  router.get('/', listPitchDeckSlidesHandler);
  router.post('/', upsertPitchDeckSlideHandler);
  router.delete('/:id', deletePitchDeckSlideHandler);
  return router;
};
