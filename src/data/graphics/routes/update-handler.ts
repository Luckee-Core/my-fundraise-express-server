import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getGraphicById } from '../get-by-id';
import { updateGraphicDetails } from '../update-details';

/** PATCH /api/data/graphics/:id */
export const updateGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/graphics/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const existing = await getGraphicById(supabase, id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Graphic not found' });
      return;
    }
    const body = req.body ?? {};
    const data = await updateGraphicDetails(supabase, id, {
      title: typeof body.title === 'string' ? body.title : existing.title,
      canvasWidthPx: typeof body.canvasWidthPx === 'number' ? body.canvasWidthPx : existing.canvasWidthPx,
      canvasHeightPx: typeof body.canvasHeightPx === 'number' ? body.canvasHeightPx : existing.canvasHeightPx,
    });
    console.log('📤 PATCH /api/data/graphics/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updateGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
