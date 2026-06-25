/** Slide keys with a dedicated chat ledger in Pitch Deck Studio. */
export const PITCH_DECK_SLIDE_STUDIO_KEYS = [
  'cover',
  'problem',
  'solution',
  'market',
  'ask',
] as const;

export type PitchDeckSlideStudioSlideKey = (typeof PITCH_DECK_SLIDE_STUDIO_KEYS)[number];

export const PITCH_DECK_SLIDE_STUDIO_LABELS: Record<PitchDeckSlideStudioSlideKey, string> = {
  cover: 'Cover',
  problem: 'Problem',
  solution: 'Solution',
  market: 'Market',
  ask: 'Ask',
};

/** Returns true when value is a supported studio slide key. */
export const isPitchDeckSlideStudioSlideKey = (
  value: string,
): value is PitchDeckSlideStudioSlideKey =>
  (PITCH_DECK_SLIDE_STUDIO_KEYS as readonly string[]).includes(value);
