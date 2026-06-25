import { Router } from 'express';
import { listGraphicsHandler } from './routes/list-handler';
import { createGraphicHandler } from './routes/create-handler';
import { getGraphicHandler } from './routes/get-handler';
import { updateGraphicHandler } from './routes/update-handler';
import { patchGraphicStudioDraftHandler } from './routes/patch-studio-draft-handler';
import { deleteGraphicHandler } from './routes/delete-handler';
import { generateGraphicTsxHandler } from './routes/generate-tsx-handler';

/** Creates the graphics data router. */
export const createGraphicsRouter = (): Router => {
  const router = Router();
  router.get('/', listGraphicsHandler);
  router.post('/', createGraphicHandler);
  router.get('/:id', getGraphicHandler);
  router.patch('/:id/studio-draft', patchGraphicStudioDraftHandler);
  router.patch('/:id', updateGraphicHandler);
  router.delete('/:id', deleteGraphicHandler);
  router.post('/:id/generate-tsx', generateGraphicTsxHandler);
  return router;
};
