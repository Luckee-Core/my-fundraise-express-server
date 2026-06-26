import { Router } from 'express';
import { listBusinessContextSectionsHandler } from './routes/list-handler';
import { createBusinessContextSectionHandler } from './routes/create-handler';
import { updateBusinessContextSectionHandler } from './routes/update-handler';
import { deleteBusinessContextSectionHandler } from './routes/delete-handler';

/** Creates the business context sections data router (mount at /business-context-sections). */
export const createBusinessContextSectionsRouter = (): Router => {
  const router = Router();
  router.get('/', listBusinessContextSectionsHandler);
  router.post('/', createBusinessContextSectionHandler);
  router.patch('/:id', updateBusinessContextSectionHandler);
  router.delete('/:id', deleteBusinessContextSectionHandler);
  return router;
};
