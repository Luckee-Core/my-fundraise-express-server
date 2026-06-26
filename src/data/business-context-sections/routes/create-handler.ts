import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { createBusinessContextSection } from '../create';

/** POST /api/data/business-context-sections */
export const createBusinessContextSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/business-context-sections');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const sectionKey = typeof body.sectionKey === 'string' ? body.sectionKey.trim() : '';
  const label = typeof body.label === 'string' ? body.label.trim() : '';
  if (!userId || !sectionKey || !label) {
    res.status(400).json({ success: false, error: 'userId, sectionKey, and label are required' });
    return;
  }
  try {
    const data = await createBusinessContextSection(supabase, {
      userId,
      sectionKey,
      label,
      description: typeof body.description === 'string' ? body.description : null,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    });
    console.log('📤 POST /api/data/business-context-sections');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createBusinessContextSectionHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
