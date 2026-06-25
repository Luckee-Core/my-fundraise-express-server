import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { listInvestorContactsByInvestorId } from '../list-by-investor-id';

const firstQueryString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
};


/** GET /api/data/investor-contacts?investorId= */
export const listInvestorContactsHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/investor-contacts');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const rawId = firstQueryString(req.query.investorId) ?? firstQueryString(req.query.investor_id);
  if (rawId && !isUuid(rawId)) {
    res.status(400).json({ success: false, error: 'investorId must be a valid UUID' });
    return;
  }
  try {
    const data = await listInvestorContactsByInvestorId(supabase, rawId);
    console.log('📤 GET /api/data/investor-contacts');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listInvestorContactsHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
