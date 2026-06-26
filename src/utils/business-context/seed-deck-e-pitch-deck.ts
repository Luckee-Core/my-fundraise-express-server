import type { SupabaseClient } from '@supabase/supabase-js';
import { createPitchDeck } from '../../data/pitch-decks/create';
import { upsertPitchDeckSlide } from '../../data/pitch-deck-slides/upsert';

const DECK_E_NAME = 'Deck E — On-Prem Install';

const DECK_E_SLIDE_CONTENT: Record<string, Record<string, string>> = {
  cover: {
    companyName: 'Luckee',
    tagline: 'Your data. Your workflows. Your brain.',
    purposeStatement: 'On-premise AI infrastructure',
    contact: 'matthew@luckeeapp.com · luckeeapp.com · Philadelphia, PA',
  },
  problem: {
    summaryHeadline: 'Everyday businesses and affluent households still run on tools they do not own.',
    whoHasProblem:
      'Small businesses in America and households earning $200k–$1M who want AI without cloud lock-in.',
    whyProblemExists:
      'Cloud AI stores context on vendor machines; on-prem alternatives size for larger GPUs and always-on agents.',
    severityCost: 'Scattered tools, vendor-owned memory, and overpriced GPU-heavy appliances.',
    optionalBullets:
      'No premier install service picks modules and hands you a brain you control.',
  },
  solution: {
    summaryHeadline: 'On-premise AI infrastructure.',
    formFactor: 'Pick modules for business or household scenarios; Luckee installs on your hardware or hosts Pro Cloud.',
    differentiator: 'Module menu — Lead Studio, ops, fundraise, health, finances, knowledge.',
    finalResult: 'Same modules on-prem with maintenance or in Pro Cloud.',
    optionalBullets:
      'Business: leads, ops, fundraise. Family: health, finances, knowledge.',
  },
  market: {
    tam: 'U.S. $3B · 600,000 accounts',
    sam: 'Tri-state $40M · 8,000',
    som: 'Greater Philadelphia $2.25M · 450',
    notes:
      '2.8M new U.S. service businesses/year; affluent households $200k–$1M for home on-prem AI.',
  },
  how_it_works: {
    headline: 'Pick modules. Luckee installs your brain. You approve every action.',
    aip: 'AI Processes — scheduled bounded jobs, not 24/7 bots.',
    nba: 'Next Best Actions — you define menu; AI ranks; you approve.',
    gpu: 'Less GPU — fact-backed Postgres, not megacontext agent hubs.',
  },
  business_model: {
    stream_1: 'Installation + maintenance',
    stream_2: 'Pro Cloud',
  },
  go_to_market: {
    headline: 'Founder-led installs in Philadelphia.',
    approach: 'Matt/Luckee is the installer; Greater Philadelphia shops and $200k–$1M households first.',
  },
  competition: {
    cloud: 'Cloud SaaS — vendor-owned memory',
    on_prem: 'DevXT-class — larger GPUs, always-on agents',
    luckee: 'Module menu, AIP/NBA, less GPU, Luckee installs',
  },
  team: {
    headline: 'Matthew Ruiz · solo founder · Philadelphia',
    revature: 'Salesforce trainer — explains complex systems to non-technical customers.',
    agency: 'Six years agency owner — custom module configuration per customer.',
    gallen: 'Gallen Restoration crew supervisor — on-site install credibility.',
  },
  traction: {
    headline: 'Module catalog built. Install economics modeled.',
    hub: '15 studios in Luckee Dev Hub; getting-started map live.',
    status: 'Pre-revenue; Philly pipeline; ~$3,360 platform anchor modeled.',
  },
  ask: {
    amount: '$500K',
    inflectionPoint: 'Paid installs + first Pro Cloud tenants + polished module handoff',
    timeFrame: '12 months',
    useOfFunds: '$250K team; $250K tokens, hardware pilots, module polish',
  },
  back_cover: {
    kicker: 'On-premise AI infrastructure',
    tagline: 'Your data. Your workflows. Your brain.',
    contact: 'matthew@luckeeapp.com · luckeeapp.com',
  },
};

const SLIDE_ORDER = [
  'cover',
  'problem',
  'solution',
  'market',
  'how_it_works',
  'business_model',
  'go_to_market',
  'competition',
  'team',
  'traction',
  'ask',
  'back_cover',
] as const;

export type SeedDeckEPitchDeckResult = {
  pitchDeckId: string;
  slidesUpserted: number;
};

/** Creates Deck E pitch deck with pre-filled slide JSON. */
export const seedDeckEPitchDeck = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<SeedDeckEPitchDeckResult> => {
  console.log('💾 seedDeckEPitchDeck', { userId });
  const deck = await createPitchDeck(supabase, {
    name: DECK_E_NAME,
    deckType: 'intro_screener',
    createdByUserId: userId,
  });

  let slidesUpserted = 0;
  for (let i = 0; i < SLIDE_ORDER.length; i += 1) {
    const slideKey = SLIDE_ORDER[i];
    const content = DECK_E_SLIDE_CONTENT[slideKey] ?? {};
    await upsertPitchDeckSlide(supabase, {
      pitchDeckId: deck.id,
      slideKey,
      contentJson: content,
      position: i,
    });
    slidesUpserted += 1;
  }

  console.log('✅ seedDeckEPitchDeck', { pitchDeckId: deck.id, slidesUpserted });
  return { pitchDeckId: deck.id, slidesUpserted };
};
