export * from './cursor-api-client';

import { CursorApiClient } from './cursor-api-client';

/**
 * Get an authenticated Cursor API client.
 */
export const getCursorClient = (): CursorApiClient => {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('CURSOR_API_KEY environment variable is not set');
  }
  return new CursorApiClient(apiKey);
};
