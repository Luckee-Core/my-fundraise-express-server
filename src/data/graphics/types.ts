export type GraphicGenerationStatus = 'queued' | 'running' | 'complete' | 'failed';

export type Graphic = {
  id: string;
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type GraphicRow = {
  id: string;
  title: string;
  canvas_width_px: number;
  canvas_height_px: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
};

export const GRAPHIC_SELECT_COLUMNS =
  'id, title, canvas_width_px, canvas_height_px, metadata, created_at, updated_at';

export type CreateGraphicInput = {
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  creativeBrief?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateGraphicDetailsInput = {
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
};
