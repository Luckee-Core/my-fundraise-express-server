import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getInvestorContactById } from '../get-by-id';
import { updateInvestorContact } from '../update';
import type { UpdateInvestorContactInput } from '../types';

/** PATCH /api/data/investor-contacts/:id */
export const updateInvestorContactHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/investor-contacts/:id', { id });
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
    const body = req.body ?? {};
    const input: UpdateInvestorContactInput = {};
    if (typeof body.name === 'string') input.name = body.name.trim();
    if (typeof body.email === 'string') input.email = body.email.trim();
    if (body.role === null || typeof body.role === 'string') input.role = body.role;
    if (input.name !== undefined && !input.name) {
      res.status(400).json({ success: false, error: 'name cannot be empty' });
      return;
    }
    if (input.email !== undefined && !input.email) {
      res.status(400).json({ success: false, error: 'email cannot be empty' });
      return;
    }
    const data = await updateInvestorContact(supabase, id, input);
    console.log('📤 PATCH /api/data/investor-contacts/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updateInvestorContactHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
