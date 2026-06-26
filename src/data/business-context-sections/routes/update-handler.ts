import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { updateBusinessContextSection } from '../update';

/** PATCH /api/data/business-context-sections/:id */
export const updateBusinessContextSectionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
  console.log(`📥 PATCH /api/data/business-context-sections/${id}`);
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid section id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  try {
    const data = await updateBusinessContextSection(supabase, id, {
      label: typeof body.label === 'string' ? body.label.trim() : undefined,
      description:
        body.description === null || typeof body.description === 'string'
          ? body.description
          : undefined,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
    });
    console.log(`📤 PATCH /api/data/business-context-sections/${id}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updateBusinessContextSectionHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
