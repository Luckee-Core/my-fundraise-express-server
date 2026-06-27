export type PitchDeckSlideRow = {
  id: string;
  pitch_deck_id: string;
  template_key: string | null;
  title: string;
  content_json: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
};

export type CreatePitchDeckSlideInput = {
  pitchDeckId: string;
  title: string;
  templateKey?: string | null;
  contentJson: Record<string, unknown>;
  position: number;
};

export type UpdatePitchDeckSlideInput = {
  id: string;
  title?: string;
  templateKey?: string | null;
  contentJson?: Record<string, unknown>;
  position?: number;
};

export type ReorderPitchDeckSlidesInput = {
  pitchDeckId: string;
  slideIds: string[];
};
