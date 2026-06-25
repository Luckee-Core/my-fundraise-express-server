import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getGraphicById } from '../get-by-id';
import { patchGraphicStudioDraft } from '../patch-studio-draft';

/** PATCH /api/data/graphics/:id/studio-draft */
export const patchGraphicStudioDraftHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/graphics/:id/studio-draft', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
    return;
  }
  const tsx = typeof req.body?.tsx === 'string' ? req.body.tsx : '';
  if (!tsx.trim()) {
    res.status(400).json({ success: false, error: 'tsx is required' });
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
    const data = await patchGraphicStudioDraft(supabase, id, tsx);
    console.log('📤 PATCH /api/data/graphics/:id/studio-draft');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ patchGraphicStudioDraftHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
