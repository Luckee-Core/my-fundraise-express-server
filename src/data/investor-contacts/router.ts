import { Router } from 'express';
import { listInvestorContactsHandler } from './routes/list-handler';
import { getInvestorContactHandler } from './routes/get-handler';
import { createInvestorContactHandler } from './routes/create-handler';
import { updateInvestorContactHandler } from './routes/update-handler';
import { deleteInvestorContactHandler } from './routes/delete-handler';

/** Creates the investor-contacts data router. */
export const createInvestorContactsRouter = (): Router => {
  const router = Router();
  router.get('/', listInvestorContactsHandler);
  router.post('/', createInvestorContactHandler);
  router.get('/:id', getInvestorContactHandler);
  router.patch('/:id', updateInvestorContactHandler);
  router.delete('/:id', deleteInvestorContactHandler);
  return router;
};
