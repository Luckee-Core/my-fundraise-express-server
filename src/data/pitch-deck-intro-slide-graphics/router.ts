import { Router } from 'express';
import { listPitchDeckIntroSlideGraphicsHandler } from './routes/list-handler';
import { upsertPitchDeckIntroSlideGraphicHandler } from './routes/upsert-handler';

/** Creates the pitch-deck-intro-slide-graphics data router. */
export const createPitchDeckIntroSlideGraphicsRouter = (): Router => {
  const router = Router();
  router.get('/', listPitchDeckIntroSlideGraphicsHandler);
  router.post('/', upsertPitchDeckIntroSlideGraphicHandler);
  return router;
};
