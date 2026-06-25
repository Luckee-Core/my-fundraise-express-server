import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getGraphicById } from '../get-by-id';

/** GET /api/data/graphics/:id */
export const getGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 GET /api/data/graphics/:id', { id });
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
    const data = await getGraphicById(supabase, id);
    if (!data) {
      res.status(404).json({ success: false, error: 'Graphic not found' });
      return;
    }
    console.log('📤 GET /api/data/graphics/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ getGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
