import { Router } from 'express';
import { seedDeckEHandler } from './routes/seed-deck-e-handler';

/** Creates the business context service router (mount at /api/business-context). */
export const createBusinessContextRouter = (): Router => {
  const router = Router();
  router.post('/seed-deck-e', seedDeckEHandler);
  return router;
};
