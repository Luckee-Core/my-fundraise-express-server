import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { createInvestor } from '../create';

/**
 * POST /api/data/investors
 */
export const createInvestorHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/investors');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    res.status(400).json({ success: false, error: 'name is required' });
    return;
  }
  try {
    const data = await createInvestor(supabase, {
      name,
      firm: typeof body.firm === 'string' ? body.firm : null,
      thesisNotes: typeof body.thesisNotes === 'string' ? body.thesisNotes : null,
      stageFocus: typeof body.stageFocus === 'string' ? body.stageFocus : null,
      firmBio: typeof body.firmBio === 'string' ? body.firmBio : null,
      firmInformation: typeof body.firmInformation === 'string' ? body.firmInformation : null,
      investmentSectors: typeof body.investmentSectors === 'string' ? body.investmentSectors : null,
      typicalCheckSize: typeof body.typicalCheckSize === 'string' ? body.typicalCheckSize : null,
      officeAddress: typeof body.officeAddress === 'string' ? body.officeAddress : null,
      website: typeof body.website === 'string' ? body.website.trim() || null : null,
    });
    console.log('📤 POST /api/data/investors');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createInvestorHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
