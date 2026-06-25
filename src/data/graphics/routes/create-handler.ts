import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { createGraphic } from '../create';

/** POST /api/data/graphics */
export const createGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/graphics');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const title = typeof body.title === 'string' ? body.title : 'Untitled graphic';
  const canvasWidthPx = typeof body.canvasWidthPx === 'number' ? body.canvasWidthPx : 1080;
  const canvasHeightPx = typeof body.canvasHeightPx === 'number' ? body.canvasHeightPx : 1080;
  try {
    const data = await createGraphic(supabase, {
      title,
      canvasWidthPx,
      canvasHeightPx,
      creativeBrief: typeof body.creativeBrief === 'string' ? body.creativeBrief : undefined,
      metadata:
        typeof body.metadata === 'object' && body.metadata !== null
          ? (body.metadata as Record<string, unknown>)
          : undefined,
    });
    console.log('📤 POST /api/data/graphics');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
