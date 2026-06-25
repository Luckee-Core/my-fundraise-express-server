import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getInvestorById } from '../get-by-id';
import { deleteInvestor } from '../delete';

/**
 * DELETE /api/data/investors/:id
 */
export const deleteInvestorHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 DELETE /api/data/investors/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid investor id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const existing = await getInvestorById(supabase, id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Investor not found' });
      return;
    }
    await deleteInvestor(supabase, id);
    console.log('📤 DELETE /api/data/investors/:id');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ deleteInvestorHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
