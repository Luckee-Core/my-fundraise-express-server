import type Anthropic from '@anthropic-ai/sdk';

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
