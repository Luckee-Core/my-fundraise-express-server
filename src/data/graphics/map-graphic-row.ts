import type { Graphic, GraphicRow } from './types';

const DEFAULT_CANVAS_W = 1080;
const DEFAULT_CANVAS_H = 1080;

const clampCanvas = (n: unknown, fallback: number): number => {
  if (typeof n !== 'number' || !Number.isFinite(n)) return fallback;
  const rounded = Math.round(n);
  if (rounded < 64) return 64;
  if (rounded > 8192) return 8192;
  return rounded;
};

const metadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
};

/** Maps a Supabase row to the API Graphic shape. */
export const mapGraphicRow = (row: GraphicRow): Graphic => ({
  id: row.id,
  title: row.title.trim() || 'Untitled graphic',
  canvasWidthPx: clampCanvas(row.canvas_width_px, DEFAULT_CANVAS_W),
  canvasHeightPx: clampCanvas(row.canvas_height_px, DEFAULT_CANVAS_H),
  metadata: metadataRecord(row.metadata),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
