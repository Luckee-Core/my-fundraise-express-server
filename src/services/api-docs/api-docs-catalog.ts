import type { ApiDocsCatalog, ApiDocsGroup } from './types';

const DEFAULT_PORT = 3009;
const ts = '2026-06-27T12:00:00.000Z';

const successExample = { success: true, data: {} };
const errorExample = { success: false, error: 'Error message' };

const envelopeResponses = [
  { status: 200, description: 'Success', example: successExample },
  { status: 400, description: 'Validation error', example: errorExample },
  { status: 500, description: 'Server error', example: errorExample },
];

const crudEndpoints = (entity: string, path: string) => [
  { method: 'GET' as const, path, summary: `List ${entity}`, responses: envelopeResponses },
  {
    method: 'POST' as const,
    path,
    summary: `Create ${entity}`,
    requestBody: { contentType: 'application/json', example: {} },
    responses: envelopeResponses,
  },
  {
    method: 'PATCH' as const,
    path: `${path}/:id`,
    summary: `Update ${entity}`,
    requestBody: { contentType: 'application/json', example: { id: 'uuid' } },
    responses: envelopeResponses,
  },
  {
    method: 'DELETE' as const,
    path: `${path}/:id`,
    summary: `Delete ${entity}`,
    responses: envelopeResponses,
  },
];

const buildOverviewGroup = (): ApiDocsGroup => ({
  name: 'Overview',
  description: [
    'REST API for the My Fundraise CRM. Operator-provided Supabase stores investors, contacts, graphics, pitch decks, slides, and business context; this Express server exposes HTTP for the Next.js web app.',
    'Route layout: `/api/data/*` — entity CRUD; `/api/investor-extract` — AI paste import; `/api/pitch-deck-slide-studio` — per-slide AI coach; `/api/business-context` — context orchestration; `GET /api-docs.json` — this catalog.',
    'Browser calls Express directly via `NEXT_PUBLIC_SERVER_URL` (Lead Studio pattern). Success JSON on data routes: `{ success: true, data }`. Error JSON: `{ success: false, error: string }`.',
    'OSS default has no auth — bind to localhost for trusted local dev. Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; `ANTHROPIC_API_KEY` for AI routes.',
  ].join('\n\n'),
  endpoints: [],
});

/**
 * Builds the full API documentation catalog for My Fundraise Express.
 */
export const buildApiDocsCatalog = (): ApiDocsCatalog => {
  const portFromEnv = Number(process.env.PORT);
  const port = Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : DEFAULT_PORT;
  const baseUrl =
    process.env.PUBLIC_API_URL?.trim().replace(/\/$/, '') || `http://localhost:${port}`;

  const groups: ApiDocsGroup[] = [
    buildOverviewGroup(),
    {
      name: 'Health',
      description: 'Liveness probe for load balancers and local dev.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          summary: 'Health check',
          responses: [
            {
              status: 200,
              description: 'Server is running',
              example: {
                status: 'ok',
                message: 'My Fundraise Express Server is running',
                timestamp: ts,
                environment: 'development',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Investors',
      description: 'Investor pipeline CRUD and contacts.',
      endpoints: [
        ...crudEndpoints('investors', '/api/data/investors'),
        ...crudEndpoints('investor contacts', '/api/data/investor-contacts'),
      ],
    },
    {
      name: 'Graphics',
      description: 'Image graphics with TSX studio draft and optional AI generation.',
      endpoints: [
        ...crudEndpoints('graphics', '/api/data/graphics'),
        {
          method: 'PATCH',
          path: '/api/data/graphics/:id/studio-draft',
          summary: 'Save studio draft metadata',
          responses: envelopeResponses,
        },
        {
          method: 'POST',
          path: '/api/data/graphics/:id/generate-tsx',
          summary: 'Generate TSX via Cursor agent (optional keys)',
          responses: envelopeResponses,
        },
      ],
    },
    {
      name: 'Pitch decks',
      description: 'Pitch decks, slides, versions, and intro slide graphics.',
      endpoints: [
        ...crudEndpoints('pitch decks', '/api/data/pitch-decks'),
        {
          method: 'POST',
          path: '/api/data/pitch-decks/:id/versions',
          summary: 'Create new deck version',
          responses: envelopeResponses,
        },
        {
          method: 'POST',
          path: '/api/data/pitch-deck-slides/reorder',
          summary: 'Reorder slides',
          responses: envelopeResponses,
        },
        ...crudEndpoints('pitch deck slides', '/api/data/pitch-deck-slides'),
        ...crudEndpoints('intro slide graphics', '/api/data/pitch-deck-intro-slide-graphics'),
      ],
    },
    {
      name: 'Business context',
      description: 'What-is facts and sections for pitch copy.',
      endpoints: [
        ...crudEndpoints('business context sections', '/api/data/business-context-sections'),
        ...crudEndpoints('business facts', '/api/data/business-facts'),
        {
          method: 'POST',
          path: '/api/business-context/generate',
          summary: 'Generate context content',
          responses: envelopeResponses,
        },
      ],
    },
    {
      name: 'AI services',
      description: 'Anthropic-powered extract and slide coaching.',
      endpoints: [
        {
          method: 'POST',
          path: '/api/investor-extract',
          summary: 'Extract investor profile from pasted text',
          requestBody: {
            contentType: 'application/json',
            example: { text: 'Firm name, partners, focus…', userId: 'dev-user-id' },
          },
          responses: envelopeResponses,
        },
        {
          method: 'POST',
          path: '/api/pitch-deck-slide-studio/chat',
          summary: 'Per-slide AI coach message',
          requestBody: {
            contentType: 'application/json',
            example: { slideKey: 'cover', message: 'Tighten the hook', userId: 'dev-user-id' },
          },
          responses: envelopeResponses,
        },
      ],
    },
  ];

  return {
    version: '1.0.0',
    baseUrl,
    responseEnvelope: '{ success: true, data } | { success: false, error: string }',
    groups,
  };
};
