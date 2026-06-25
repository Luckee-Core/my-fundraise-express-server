export type PitchDeckSlideRow = {
  id: string;
  pitch_deck_id: string;
  slide_key: string;
  content_json: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
};

export type UpsertPitchDeckSlideInput = {
  pitchDeckId: string;
  slideKey: string;
  contentJson: Record<string, unknown>;
  position: number;
};
