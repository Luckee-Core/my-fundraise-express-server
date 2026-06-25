import type { PitchDeckSlideStudioSlideKey } from './config';
import { PITCH_DECK_SLIDE_STUDIO_LABELS } from './config';

type BuildUserPayloadParams = {
  slideKey: PitchDeckSlideStudioSlideKey;
  slideContentJson: Record<string, unknown>;
  recentLines: { role: 'user' | 'assistant'; content: string }[];
  userMessage: string;
};

/** Built-in system prompt for pitch deck slide studio coach. */
export const buildPitchDeckSlideStudioSystemPrompt = (
  slideKey: PitchDeckSlideStudioSlideKey,
): string => {
  const label = PITCH_DECK_SLIDE_STUDIO_LABELS[slideKey];
  return [
    `You are an expert pitch deck coach helping refine the "${label}" slide.`,
    'Give concise, actionable feedback: clarity, specificity, metrics where relevant, and what investors expect on this slide.',
    'Do not invent facts; if the slide is thin, say what to add or validate.',
    'Reply as plain prose only (no JSON, no markdown code fences unless a short example helps).',
  ].join('\n');
};

/** User payload: current slide JSON + optional recent chat + latest user message. */
export const buildPitchDeckSlideStudioUserPayload = (params: BuildUserPayloadParams): string => {
  const label = PITCH_DECK_SLIDE_STUDIO_LABELS[params.slideKey];
  const slideBlock = JSON.stringify(params.slideContentJson ?? {}, null, 2);
  const history =
    params.recentLines.length > 0
      ? params.recentLines
          .map((l) => `${l.role === 'user' ? 'User' : 'Assistant'}: ${l.content}`)
          .join('\n')
      : '(no prior messages in the last 24h for this slide)';

  return [
    `Slide: ${label} (${params.slideKey})`,
    '',
    'Current slide content (JSON fields from the editor):',
    slideBlock,
    '',
    'Recent conversation (same slide, last 24h):',
    history,
    '',
    'User message:',
    params.userMessage,
  ].join('\n');
};
