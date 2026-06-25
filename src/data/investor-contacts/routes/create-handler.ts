import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { createInvestorContact } from '../create';

/** POST /api/data/investor-contacts */
export const createInvestorContactHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/investor-contacts');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const investorId = typeof body.investorId === 'string' ? body.investorId : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!investorId || !isUuid(investorId) || !name || !email) {
    res.status(400).json({ success: false, error: 'investorId (UUID), name, and email are required' });
    return;
  }
  try {
    const data = await createInvestorContact(supabase, {
      investorId,
      name,
      email,
      role: typeof body.role === 'string' ? body.role : null,
    });
    console.log('📤 POST /api/data/investor-contacts');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createInvestorContactHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
