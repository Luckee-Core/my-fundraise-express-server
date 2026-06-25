import type { CursorApiClient } from './cursor-api-client';

export type ExtractTsxFromConversationOptions = {
  expectedComponentName?: string;
};

const looksLikeTsxComponent = (text: string, expectedComponentName: string): boolean => {
  return (
    text.includes('"use client"') &&
    (text.includes(`export default function ${expectedComponentName}`) ||
      /export\s+default\s+function\s+\w+/.test(text))
  );
};

/**
 * Fetch the agent run result and extract the TSX component code from the assistant reply.
 */
export const extractTsxFromConversation = async (
  cursorClient: CursorApiClient,
  agentId: string,
  runId: string,
  options?: ExtractTsxFromConversationOptions,
): Promise<string> => {
  const expectedComponentName = options?.expectedComponentName ?? 'GeneratedGraphic';

  console.log(`📥 Fetching run result for agent ${agentId} run ${runId}`);
  const run = await cursorClient.getRun(agentId, runId);
  const resultText = run.result?.trim();

  if (!resultText) {
    throw new Error(
      'No assistant result found for agent run. The agent may not have output the component code directly.',
    );
  }

  const codeBlockRegex = /```(?:tsx|typescript|ts|jsx|js)?\r?\n([\s\S]*?)```/g;

  const blocks = [...resultText.matchAll(codeBlockRegex)];
  for (let i = blocks.length - 1; i >= 0; i--) {
    const candidate = (blocks[i][1] ?? '').trim();
    if (!candidate) {
      continue;
    }
    if (looksLikeTsxComponent(candidate, expectedComponentName)) {
      console.log(`✅ Extracted TSX from fenced block (${candidate.length} chars)`);
      return candidate;
    }
  }

  if (looksLikeTsxComponent(resultText, expectedComponentName)) {
    console.log(`✅ Extracted TSX from plain run result (${resultText.length} chars)`);
    return resultText;
  }

  throw new Error(
    'No TSX code block found in agent run result. The agent may not have output the component code directly.',
  );
};
