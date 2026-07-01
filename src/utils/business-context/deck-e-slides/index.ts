import { askTsx } from './ask';
import { backCoverTsx } from './back-cover';
import { businessModelTsx } from './business-model';
import { competitionTsx } from './competition';
import { coverTsx } from './cover';
import { goToMarketTsx } from './go-to-market';
import { marketTsx } from './market';
import { problemTsx } from './problem';
import { solutionTsx } from './solution';
import { teamTsx } from './team';
import { tractionTsx } from './traction';

export type DeckESlideTemplateKey =
  | 'cover'
  | 'problem'
  | 'solution'
  | 'market'
  | 'business_model'
  | 'go_to_market'
  | 'competition'
  | 'team'
  | 'traction'
  | 'ask'
  | 'back_cover';

export const DECK_E_SLIDE_ORDER: DeckESlideTemplateKey[] = [
  'cover',
  'problem',
  'solution',
  'market',
  'business_model',
  'go_to_market',
  'competition',
  'ask',
  'back_cover',
];

export const DECK_E_SLIDE_TITLES: Record<DeckESlideTemplateKey, string> = {
  cover: 'Cover',
  problem: 'Opportunity',
  solution: 'Solution',
  market: 'Market',
  business_model: 'Business model',
  go_to_market: 'Go to market',
  competition: 'Competition',
  team: 'Team',
  traction: 'Traction',
  ask: 'Ask',
  back_cover: 'Contact',
};

export const DECK_E_SLIDE_TSX: Record<DeckESlideTemplateKey, string> = {
  cover: coverTsx,
  problem: problemTsx,
  solution: solutionTsx,
  market: marketTsx,
  business_model: businessModelTsx,
  go_to_market: goToMarketTsx,
  competition: competitionTsx,
  team: teamTsx,
  traction: tractionTsx,
  ask: askTsx,
  back_cover: backCoverTsx,
};

export const DECK_E_SLIDE_IDS: Record<DeckESlideTemplateKey, string> = {
  cover: 'de000000-0000-4000-8000-000000000101',
  problem: 'de000000-0000-4000-8000-000000000102',
  solution: 'de000000-0000-4000-8000-000000000103',
  market: 'de000000-0000-4000-8000-000000000104',
  business_model: 'de000000-0000-4000-8000-000000000106',
  go_to_market: 'de000000-0000-4000-8000-000000000107',
  competition: 'de000000-0000-4000-8000-000000000108',
  team: 'de000000-0000-4000-8000-000000000109',
  traction: 'de000000-0000-4000-8000-00000000010a',
  ask: 'de000000-0000-4000-8000-00000000010b',
  back_cover: 'de000000-0000-4000-8000-00000000010c',
};

export const DECK_E_PITCH_DECK_ID = 'de000000-0000-4000-8000-000000000001';

/** Fixed UUIDs for Deck E on-prem graphics (`{slide title} - On Premise`). */
export const DECK_E_GRAPHIC_IDS: Record<DeckESlideTemplateKey, string> = {
  cover: 'de000000-0000-4000-8000-000000000201',
  problem: 'de000000-0000-4000-8000-000000000202',
  solution: 'de000000-0000-4000-8000-000000000203',
  market: 'de000000-0000-4000-8000-000000000204',
  business_model: 'de000000-0000-4000-8000-000000000206',
  go_to_market: 'de000000-0000-4000-8000-000000000207',
  competition: 'de000000-0000-4000-8000-000000000208',
  team: 'de000000-0000-4000-8000-000000000209',
  traction: 'de000000-0000-4000-8000-00000000020a',
  ask: 'de000000-0000-4000-8000-00000000020b',
  back_cover: 'de000000-0000-4000-8000-00000000020c',
};

export const deckEOnPremGraphicTitle = (slideTitle: string): string => `${slideTitle} - On Premise`;

export const DECK_E_GRAPHIC_TITLES: Record<DeckESlideTemplateKey, string> = {
  cover: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.cover),
  problem: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.problem),
  solution: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.solution),
  market: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.market),
  business_model: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.business_model),
  go_to_market: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.go_to_market),
  competition: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.competition),
  team: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.team),
  traction: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.traction),
  ask: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.ask),
  back_cover: deckEOnPremGraphicTitle(DECK_E_SLIDE_TITLES.back_cover),
};

export const DECK_E_SLIDE_CANVAS_WIDTH_PX = 1920;
export const DECK_E_SLIDE_CANVAS_HEIGHT_PX = 1080;
