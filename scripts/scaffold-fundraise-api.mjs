import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const write = (rel, content) => {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
};

// managed clients
write('src/services/managed/clients.ts', `/**
 * Managed service client accessors.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';

let managedSupabaseClient: SupabaseClient | null = null;
let managedAnthropicClient: Anthropic | null = null;

/** True when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both set. */
export const hasSupabaseCredentials = (): boolean =>
  Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

/** Returns the managed Supabase client, or null if not initialized. */
export const getManagedSupabaseClient = (): SupabaseClient | null => managedSupabaseClient;

/** @internal Set by init-managed-clients at startup. */
export const setManagedSupabaseClient = (client: SupabaseClient | null): void => {
  managedSupabaseClient = client;
};

/** Returns the managed Anthropic client, or null if unavailable. */
export const getManagedAnthropicClient = (): Anthropic | null => {
  if (managedAnthropicClient) return managedAnthropicClient;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  managedAnthropicClient = new Anthropic({ apiKey: key });
  return managedAnthropicClient;
};

/** @internal Set by init-managed-clients at startup. */
export const setManagedAnthropicClient = (client: Anthropic | null): void => {
  managedAnthropicClient = client;
};
`);

write('src/services/managed/init-managed-clients.ts', `/**
 * Initialize managed service clients once at server startup.
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { setManagedAnthropicClient, setManagedSupabaseClient } from './clients';

/** Initializes Supabase and Anthropic clients for reuse across requests. */
export const initManagedClients = async (): Promise<void> => {
  console.log('🚀 [initManagedClients] Initializing managed clients');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ [initManagedClients] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    setManagedSupabaseClient(null);
  } else {
    const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws as never },
    });
    setManagedSupabaseClient(client);
    console.log('✅ [initManagedClients] Supabase client initialized');
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) {
    console.error('❌ [initManagedClients] Missing ANTHROPIC_API_KEY');
    setManagedAnthropicClient(null);
  } else {
    setManagedAnthropicClient(new Anthropic({ apiKey: anthropicApiKey }));
    console.log('✅ [initManagedClients] Anthropic client initialized');
  }
};
`);

write('src/services/managed/index.ts', `export {
  getManagedAnthropicClient,
  getManagedSupabaseClient,
  hasSupabaseCredentials,
  setManagedAnthropicClient,
  setManagedSupabaseClient,
} from './clients';
export { initManagedClients } from './init-managed-clients';
`);

write('src/services/ai/model-config.ts', `/** AI model configuration per message type. */
export type ModelConfig = {
  model: string;
  temperature: number;
  maxTokens: number;
};

const HAIKU = 'claude-haiku-4-5-20251001';

const CONFIGS: Record<string, ModelConfig> = {
  extract_investor_firm_profile: { model: HAIKU, temperature: 0.1, maxTokens: 4096 },
  extract_investor_contact_sheet: { model: HAIKU, temperature: 0.1, maxTokens: 8192 },
  pitch_deck_slide_studio: { model: HAIKU, temperature: 0.35, maxTokens: 4096 },
};

/** Returns model config for a message type. */
export const getModelConfig = (messageType: string): ModelConfig => {
  const config = CONFIGS[messageType];
  if (!config) throw new Error(\`Unknown message type: \${messageType}\`);
  return config;
};
`);

write('src/services/ai/generate-completion.ts', `import type Anthropic from '@anthropic-ai/sdk';

export type CompletionOptions = {
  systemPrompt: string;
  userMessage: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

/** Generates a single-turn completion with Anthropic Claude. */
export const generateCompletion = async (
  client: Anthropic,
  options: CompletionOptions,
): Promise<{ response: string; usage: { input_tokens: number; output_tokens: number } }> => {
  const {
    systemPrompt,
    userMessage,
    model = 'claude-haiku-4-5-20251001',
    temperature = 0.7,
    maxTokens = 4000,
  } = options;

  console.log('🤖 generateCompletion', { model });
  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const block = message.content[0];
  const response = block?.type === 'text' ? block.text : '';
  return {
    response,
    usage: {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
    },
  };
};
`);

write('src/services/ai/index.ts', `export { generateCompletion, type CompletionOptions } from './generate-completion';
export { getModelConfig, type ModelConfig } from './model-config';
`);

write('src/utils/validation/is-uuid.ts', `const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Returns true when value is a UUID string. */
export const isUuid = (value: string): boolean => UUID_RE.test(value);
`);

write('src/utils/validation/index.ts', `export { isUuid } from './is-uuid';
`);

write('src/utils/graphics/build-graphics-tsx-prompt.ts', `export type GraphicsTsxPromptInput = {
  title: string;
  creativeBrief: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
};

/** Builds the Cursor agent prompt for standalone graphics TSX generation. */
export const buildGraphicsTsxPrompt = (input: GraphicsTsxPromptInput): string => {
  return \`Generate a single Next.js "use client" React component as a fixed-size marketing graphic.

Title: \${input.title}
Canvas width: \${input.canvasWidthPx}px
Canvas height: \${input.canvasHeightPx}px

Creative brief:
\${input.creativeBrief}

Requirements:
1. export default a React component named GeneratedGraphic.
2. Root element MUST use exact dimensions: className="w-[\${input.canvasWidthPx}px] h-[\${input.canvasHeightPx}px]".
3. Use Tailwind CSS only with static className strings.
4. Do not use next/image or external fonts.
5. Return only the TSX source — no markdown fences.\`;
};
`);

write('src/utils/graphics/index.ts', `export { buildGraphicsTsxPrompt, type GraphicsTsxPromptInput } from './build-graphics-tsx-prompt';
`);

write('.env.example', `# Supabase (required for /api/data)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (required for investor-extract and pitch-deck-slide-studio)
ANTHROPIC_API_KEY=

# Server
PORT=3009
NODE_ENV=development

# Optional: Cursor agent TSX generation for graphics
CURSOR_API_KEY=
CURSOR_TARGET_REPO=
`);

write('index.ts', `import express from 'express';
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
`);

console.log('Core infrastructure files written');
