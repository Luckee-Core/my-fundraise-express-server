import { Router } from 'express';
import { listPitchDeckSlidesHandler } from './routes/list-handler';
import { createPitchDeckSlideHandler } from './routes/create-handler';
import { updatePitchDeckSlideHandler } from './routes/update-handler';
import { reorderPitchDeckSlidesHandler } from './routes/reorder-handler';
import { deletePitchDeckSlideHandler } from './routes/delete-handler';

/** Creates the pitch-deck-slides data router. */
export const createPitchDeckSlidesRouter = (): Router => {
  const router = Router();
  router.get('/', listPitchDeckSlidesHandler);
  router.post('/', createPitchDeckSlideHandler);
  router.patch('/reorder', reorderPitchDeckSlidesHandler);
  router.patch('/:id', updatePitchDeckSlideHandler);
  router.delete('/:id', deletePitchDeckSlideHandler);
  return router;
};
