import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { listBusinessFactsByUserId } from '../list-by-user-id';

/** GET /api/data/business-facts?userId=&sectionId= */
export const listBusinessFactsHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/business-facts');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const userId = typeof req.query.userId === 'string' ? req.query.userId.trim() : '';
  if (!userId) {
    res.status(400).json({ success: false, error: 'userId is required' });
    return;
  }
  const sectionId =
    typeof req.query.sectionId === 'string' && isUuid(req.query.sectionId.trim())
      ? req.query.sectionId.trim()
      : undefined;
  try {
    const data = await listBusinessFactsByUserId(supabase, userId, { sectionId });
    console.log('📤 GET /api/data/business-facts');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listBusinessFactsHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
