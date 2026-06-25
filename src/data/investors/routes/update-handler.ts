import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
import { getInvestorById } from '../get-by-id';
import { updateInvestor } from '../update';
import type { UpdateInvestorInput } from '../types';

/**
 * PATCH /api/data/investors/:id
 */
export const updateInvestorHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/investors/:id', { id });
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
    const body = req.body ?? {};
    const input: UpdateInvestorInput = {};
    if (typeof body.name === 'string') input.name = body.name.trim();
    if (body.firm === null || typeof body.firm === 'string') input.firm = body.firm;
    if (body.thesisNotes === null || typeof body.thesisNotes === 'string') input.thesisNotes = body.thesisNotes;
    if (body.stageFocus === null || typeof body.stageFocus === 'string') input.stageFocus = body.stageFocus;
    if (body.firmBio === null || typeof body.firmBio === 'string') input.firmBio = body.firmBio;
    if (body.firmInformation === null || typeof body.firmInformation === 'string') input.firmInformation = body.firmInformation;
    if (body.investmentSectors === null || typeof body.investmentSectors === 'string') input.investmentSectors = body.investmentSectors;
    if (body.typicalCheckSize === null || typeof body.typicalCheckSize === 'string') input.typicalCheckSize = body.typicalCheckSize;
    if (body.officeAddress === null || typeof body.officeAddress === 'string') input.officeAddress = body.officeAddress;
    if (body.website === null || typeof body.website === 'string') input.website = body.website;
    if (typeof body.status === 'string') input.status = body.status;
    if (input.name !== undefined && !input.name) {
      res.status(400).json({ success: false, error: 'name cannot be empty' });
      return;
    }
    const data = await updateInvestor(supabase, id, input);
    console.log('📤 PATCH /api/data/investors/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updateInvestorHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
