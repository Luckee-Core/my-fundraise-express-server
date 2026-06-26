import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { upsertBusinessFact } from '../upsert';

/** POST /api/data/business-facts */
export const upsertBusinessFactHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/business-facts');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const sectionId = typeof body.sectionId === 'string' ? body.sectionId.trim() : '';
  const factKey = typeof body.factKey === 'string' ? body.factKey.trim() : '';
  const factValue = typeof body.factValue === 'string' ? body.factValue : '';
  if (!userId || !sectionId || !factKey || !isUuid(sectionId)) {
    res.status(400).json({
      success: false,
      error: 'userId, sectionId (uuid), and factKey are required',
    });
    return;
  }
  try {
    const data = await upsertBusinessFact(supabase, {
      userId,
      sectionId,
      factKey,
      factValue,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    });
    console.log('📤 POST /api/data/business-facts');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ upsertBusinessFactHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
