export type PitchDeckSlideStudioExchangeRow = {
  id: string;
  user_id: string;
  pitch_deck_id: string;
  slide_key: string;
  request_id: string;
  response_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  model_used: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

export type PitchDeckSlideStudioRequestRow = {
  id: string;
  user_id: string;
  pitch_deck_id: string;
  slide_key: string;
  content: string;
  exchange_id: string | null;
  response_id: string | null;
  status: string;
  created_at: string;
};

export type PitchDeckSlideStudioResponseRow = {
  id: string;
  structured: Record<string, unknown>;
  created_at: string;
};
