import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { deleteBusinessContextSection } from '../delete';

/** DELETE /api/data/business-context-sections/:id */
export const deleteBusinessContextSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
  console.log(`📥 DELETE /api/data/business-context-sections/${id}`);
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid section id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    await deleteBusinessContextSection(supabase, id);
    console.log(`📤 DELETE /api/data/business-context-sections/${id}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ deleteBusinessContextSectionHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
