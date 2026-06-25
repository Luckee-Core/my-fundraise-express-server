import express from 'express';
import dotenv from 'dotenv';
import { setupEarlyMiddleware, setupErrorHandling } from './src/services/middleware';
import { createHealthRouter } from './src/services/health';
import { initManagedClients } from './src/services/managed';
import { createDataRouter } from './src/data/router';
import { createPitchDeckSlideStudioRouter } from './src/services/pitch-deck-slide-studio';
import { createInvestorExtractRouter } from './src/services/investor-extract';
import { startServer } from './src/services/server';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3009;

setupEarlyMiddleware(app);
app.use('/', createHealthRouter());
app.use('/api/health', createHealthRouter());

const bootstrap = async (): Promise<void> => {
  console.log('🚀 [bootstrap] Initializing managed clients');
  await initManagedClients();

  app.use('/api/data', createDataRouter());
  console.log('✅ [bootstrap] Data API mounted at /api/data');

  app.use('/api/investor-extract', createInvestorExtractRouter());
  console.log('✅ [bootstrap] Investor extract API mounted at /api/investor-extract');

  app.use('/api/pitch-deck-slide-studio', createPitchDeckSlideStudioRouter());
  console.log('✅ [bootstrap] Pitch deck slide studio mounted at /api/pitch-deck-slide-studio');

  setupErrorHandling(app);
  startServer(app, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  });
};

bootstrap().catch((err) => {
  console.error('❌ [bootstrap] Failed to start server', err);
  process.exit(1);
});

export default app;
