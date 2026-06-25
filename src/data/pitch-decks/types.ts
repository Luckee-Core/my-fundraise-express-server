export type PitchDeckType = 'intro_screener' | 'investor_deep_dive';
export type PitchDeckStatus = 'draft' | 'sent' | 'archived';

export type PitchDeckRow = {
  id: string;
  name: string;
  deck_type: PitchDeckType;
  version_number: number;
  status: PitchDeckStatus;
  parent_deck_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePitchDeckInput = {
  name: string;
  deckType?: PitchDeckType;
  createdByUserId?: string | null;
};

export type UpdatePitchDeckInput = {
  name?: string;
  status?: PitchDeckStatus;
};
