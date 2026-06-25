import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getInvestorContactById } from '../get-by-id';

/** GET /api/data/investor-contacts/:id */
export const getInvestorContactHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 GET /api/data/investor-contacts/:id', { id });
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
    const data = await getInvestorContactById(supabase, id);
    if (!data) {
      res.status(404).json({ success: false, error: 'Investor contact not found' });
      return;
    }
    console.log('📤 GET /api/data/investor-contacts/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ getInvestorContactHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
