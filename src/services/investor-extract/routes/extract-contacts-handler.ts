import type { Request, Response } from 'express';
import { getManagedSupabaseClient, getManagedAnthropicClient } from '../../managed';
import { isUuid } from '../../../utils/validation';
import { processExtractContacts } from '../process-extract-contacts';

/**
 * POST /api/investor-extract/:investorId/extract-contacts
 */
export const extractContactsHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/investor-extract/:investorId/extract-contacts');
  const supabase = getManagedSupabaseClient();
  const anthropic = getManagedAnthropicClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const investorId = typeof req.params.investorId === 'string' ? req.params.investorId : '';
  if (!investorId || !isUuid(investorId)) {
    res.status(400).json({ success: false, error: 'Valid investorId is required' });
    return;
  }
  const body = req.body ?? {};
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const textBlob = typeof body.textBlob === 'string' ? body.textBlob : '';
  if (!userId) {
    res.status(400).json({ success: false, error: 'userId is required' });
    return;
  }
  try {
    const data = await processExtractContacts(supabase, anthropic, { userId, investorId, textBlob });
    console.log('📤 POST /api/investor-extract/:investorId/extract-contacts');
    res.status(200).json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extract contacts';
    const status =
      message === 'Investor not found' ? 404 : message === 'textBlob is required' ? 400 : 500;
    console.error('❌ extractContactsHandler', error);
    res.status(status).json({ success: false, error: message });
  }
};
