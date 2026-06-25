import { Router } from 'express';
import { extractFirmProfileHandler } from './routes/extract-firm-profile-handler';
import { extractContactsHandler } from './routes/extract-contacts-handler';

/**
 * Investor extract API router.
 */
export const createInvestorExtractRouter = (): Router => {
  const router = Router();
  router.post('/:investorId/extract-firm-profile', extractFirmProfileHandler);
  router.post('/:investorId/extract-contacts', extractContactsHandler);
  return router;
};
