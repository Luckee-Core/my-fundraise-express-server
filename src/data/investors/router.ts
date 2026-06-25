import { Router } from 'express';
import { listInvestorsHandler } from './routes/list-handler';
import { getInvestorHandler } from './routes/get-handler';
import { createInvestorHandler } from './routes/create-handler';
import { updateInvestorHandler } from './routes/update-handler';
import { deleteInvestorHandler } from './routes/delete-handler';

/**
 * Creates the investors data router (mount at /investors).
 */
export const createInvestorsRouter = (): Router => {
  const router = Router();
  router.get('/', listInvestorsHandler);
  router.post('/', createInvestorHandler);
  router.get('/:id', getInvestorHandler);
  router.patch('/:id', updateInvestorHandler);
  router.delete('/:id', deleteInvestorHandler);
  return router;
};
