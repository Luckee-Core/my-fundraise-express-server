import type { SupabaseClient } from '@supabase/supabase-js';
import { getGraphicById } from '../../data/graphics';
import { patchGraphicGenerationMetadata, patchGraphicStudioDraft } from '../../data/graphics/patch-studio-draft';
import { buildGraphicsTsxPrompt } from '../../utils/graphics';
import { getCursorClient } from '../cursor';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { pollAgentStatus } from '../cursor/poll-agent-status';

export type RunGraphicsTsxGenerationInput = {
  graphicId: string;
};

export type RunGraphicsTsxGenerationResult = {
  tsx: string;
  agentId: string;
};

const readCreativeBrief = (metadata: Record<string, unknown>): string => {
  const value = metadata.creativeBrief;
  return typeof value === 'string' ? value.trim() : '';
};

/**
 * Run Cursor agent TSX generation for one graphic and persist the studio draft.
 */
export const runGraphicsTsxGeneration = async (
  supabase: SupabaseClient,
  input: RunGraphicsTsxGenerationInput,
): Promise<RunGraphicsTsxGenerationResult> => {
  if (!process.env.CURSOR_API_KEY?.trim()) {
    throw new Error('CURSOR_API_KEY environment variable is not set');
  }

  const graphicId = input.graphicId.trim();
  const graphic = await getGraphicById(supabase, graphicId);
  if (!graphic) throw new Error('Graphic not found');

  const creativeBrief = readCreativeBrief(graphic.metadata);
  if (!creativeBrief) throw new Error('creativeBrief is required on the graphic metadata');

  const targetRepo = process.env.CURSOR_TARGET_REPO?.trim();
  if (!targetRepo) throw new Error('CURSOR_TARGET_REPO environment variable is not set');

  await patchGraphicGenerationMetadata(supabase, graphicId, {
    generationStatus: 'running',
    generationError: null,
  });

  const cursorClient = getCursorClient();
  const prompt = buildGraphicsTsxPrompt({
    title: graphic.title,
    creativeBrief,
    canvasWidthPx: graphic.canvasWidthPx,
    canvasHeightPx: graphic.canvasHeightPx,
  });

  console.log(`🚀 Launching Cursor agent for graphic ${graphicId}: ${graphic.title}`);

  const agent = await cursorClient.launchAgent({
    prompt: { text: prompt },
    source: { repository: targetRepo, ref: 'main' },
    target: { autoCreatePr: false },
  });

  await patchGraphicGenerationMetadata(supabase, graphicId, { cursorAgentId: agent.id });
  await pollAgentStatus(cursorClient, agent.id, agent.runId);

  const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId, {
    expectedComponentName: 'GeneratedGraphic',
  });

  const patched = await patchGraphicStudioDraft(supabase, graphicId, tsx);
  if (!patched) throw new Error(`Failed to patch studio draft for graphic ${graphicId}`);

  await patchGraphicGenerationMetadata(supabase, graphicId, {
    generationStatus: 'complete',
    generationError: null,
  });

  console.log(`✅ Graphics TSX generation complete for ${graphicId}`);
  return { tsx, agentId: agent.id };
};
