/** AI model configuration per message type. */
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
  if (!config) throw new Error(`Unknown message type: ${messageType}`);
  return config;
};
