import { Router } from 'express';
import { listBusinessFactsHandler } from './routes/list-handler';
import { upsertBusinessFactHandler } from './routes/upsert-handler';
import { deleteBusinessFactHandler } from './routes/delete-handler';

/** Creates the business facts data router (mount at /business-facts). */
export const createBusinessFactsRouter = (): Router => {
  const router = Router();
  router.get('/', listBusinessFactsHandler);
  router.post('/', upsertBusinessFactHandler);
  router.delete('/:id', deleteBusinessFactHandler);
  return router;
};
