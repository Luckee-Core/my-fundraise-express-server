import type { SupabaseClient } from '@supabase/supabase-js';
import { createPitchDeck } from '../../data/pitch-decks/create';
import { createPitchDeckSlide } from '../../data/pitch-deck-slides/create';
import {
  DECK_E_SLIDE_ORDER,
  DECK_E_SLIDE_TITLES,
  DECK_E_SLIDE_TSX,
} from './deck-e-slide-tsx';

const DECK_E_NAME = 'Deck E — On-Prem Install';

export type SeedDeckEPitchDeckResult = {
  pitchDeckId: string;
  slidesUpserted: number;
};

/** Creates Deck E pitch deck with pre-filled slide TSX. */
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
  for (let i = 0; i < DECK_E_SLIDE_ORDER.length; i += 1) {
    const templateKey = DECK_E_SLIDE_ORDER[i];
    await createPitchDeckSlide(supabase, {
      pitchDeckId: deck.id,
      title: DECK_E_SLIDE_TITLES[templateKey],
      templateKey,
      contentJson: { tsx: DECK_E_SLIDE_TSX[templateKey] },
      position: i,
    });
    slidesUpserted += 1;
  }

  console.log('✅ seedDeckEPitchDeck', { pitchDeckId: deck.id, slidesUpserted });
  return { pitchDeckId: deck.id, slidesUpserted };
};
