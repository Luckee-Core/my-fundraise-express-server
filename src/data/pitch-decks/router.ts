import { Router } from 'express';
import { listPitchDecksHandler } from './routes/list-handler';
import { createPitchDeckHandler } from './routes/create-handler';
import { getPitchDeckHandler } from './routes/get-handler';
import { updatePitchDeckHandler } from './routes/update-handler';
import { createPitchDeckVersionHandler } from './routes/create-version-handler';

/** Creates the pitch-decks data router. */
export const createPitchDecksRouter = (): Router => {
  const router = Router();
  router.get('/', listPitchDecksHandler);
  router.post('/', createPitchDeckHandler);
  router.post('/:id/versions', createPitchDeckVersionHandler);
  router.get('/:id', getPitchDeckHandler);
  router.patch('/:id', updatePitchDeckHandler);
  return router;
};
