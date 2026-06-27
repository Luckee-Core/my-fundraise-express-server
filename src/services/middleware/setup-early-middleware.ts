/**
 * Setup Early Middleware
 * Configures CORS, body parsing, and other early middleware
 */

import cors from 'cors';
import express, { Express } from 'express';

const parseCorsOrigins = (): string[] | undefined => {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) {
    return undefined;
  }
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return origins.length > 0 ? origins : undefined;
};

export const setupEarlyMiddleware = (app: Express): void => {
  const corsOrigins = parseCorsOrigins();
  app.use(
    cors(
      corsOrigins
        ? {
            origin: corsOrigins,
          }
        : undefined,
    ),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
