export { listPitchDeckSlidesByPitchDeckId } from './list-by-pitch-deck-id';
export { getPitchDeckSlideByDeckAndTemplateKey } from './get-by-deck-and-template-key';
export { createPitchDeckSlide } from './create';
export { updatePitchDeckSlide } from './update';
export { reorderPitchDeckSlides } from './reorder';
export { deletePitchDeckSlide } from './delete';
export { createPitchDeckSlidesRouter } from './router';
export type {
  PitchDeckSlideRow,
  CreatePitchDeckSlideInput,
  UpdatePitchDeckSlideInput,
  ReorderPitchDeckSlidesInput,
} from './types';
