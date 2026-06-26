import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { listBusinessContextSectionsByUserId } from '../list-by-user-id';

/** GET /api/data/business-context-sections?userId= */
export const listBusinessContextSectionsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/business-context-sections');
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
  try {
    const data = await listBusinessContextSectionsByUserId(supabase, userId);
    console.log('📤 GET /api/data/business-context-sections');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listBusinessContextSectionsHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
