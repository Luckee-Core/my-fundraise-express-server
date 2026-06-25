import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { listGraphics } from '../list';

/** GET /api/data/graphics */
export const listGraphicsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/graphics');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listGraphics(supabase);
    console.log('📤 GET /api/data/graphics');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listGraphicsHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
