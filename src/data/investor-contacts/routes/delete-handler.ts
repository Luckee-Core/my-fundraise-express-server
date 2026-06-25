import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getInvestorContactById } from '../get-by-id';
import { deleteInvestorContact } from '../delete';

/** DELETE /api/data/investor-contacts/:id */
export const deleteInvestorContactHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 DELETE /api/data/investor-contacts/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid contact id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const existing = await getInvestorContactById(supabase, id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Investor contact not found' });
      return;
    }
    await deleteInvestorContact(supabase, id);
    console.log('📤 DELETE /api/data/investor-contacts/:id');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ deleteInvestorContactHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
