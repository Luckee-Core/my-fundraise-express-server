export type PitchDeckIntroSlideGraphic = {
  id: string;
  pitchDeckId: string;
  slideKey: string;
  imageGraphicId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PitchDeckIntroSlideGraphicRow = {
  id: string;
  pitch_deck_id: string;
  slide_key: string;
  image_graphic_id: string | null;
  created_at: string;
  updated_at: string;
};

export type UpsertPitchDeckIntroSlideGraphicInput = {
  pitchDeckId: string;
  slideKey: string;
  imageGraphicId: string | null;
};
