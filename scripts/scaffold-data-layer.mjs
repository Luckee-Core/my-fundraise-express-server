/**
 * Scaffolds fundraise API data layer, entity routers, and service modules.
 * Run: node scripts/scaffold-data-layer.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
let fileCount = 0;

const write = (rel, content) => {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  fileCount += 1;
};

// ─── Shared snippets ─────────────────────────────────────────────────────────

const HANDLER_HEADER = `import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../../services/managed';
import { isUuid } from '../../../utils/validation';
`;

// ─── 1. Investors ────────────────────────────────────────────────────────────

write('src/data/investors/types.ts', `/** Database row shape for investors table. */
export type InvestorRow = {
  id: string;
  name: string;
  firm: string | null;
  thesis_notes: string | null;
  stage_focus: string | null;
  firm_bio: string | null;
  firm_information: string | null;
  investment_sectors: string | null;
  typical_check_size: string | null;
  office_address: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateInvestorInput = {
  name: string;
  firm?: string | null;
  thesisNotes?: string | null;
  stageFocus?: string | null;
  firmBio?: string | null;
  firmInformation?: string | null;
  investmentSectors?: string | null;
  typicalCheckSize?: string | null;
  officeAddress?: string | null;
  website?: string | null;
};

export type UpdateInvestorInput = {
  name?: string;
  firm?: string | null;
  thesisNotes?: string | null;
  stageFocus?: string | null;
  firmBio?: string | null;
  firmInformation?: string | null;
  investmentSectors?: string | null;
  typicalCheckSize?: string | null;
  officeAddress?: string | null;
  website?: string | null;
};
`);

write('src/data/investors/list.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorRow } from './types';

/**
 * Lists all investors ordered by created_at descending.
 */
export const listInvestors = async (supabase: SupabaseClient): Promise<InvestorRow[]> => {
  console.log('💾 listInvestors');
  const { data, error } = await supabase
    .from('investors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(\`Failed to fetch investors: \${error.message}\`);
  }

  return (data ?? []) as InvestorRow[];
};
`);

write('src/data/investors/get-by-id.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorRow } from './types';

/**
 * Fetches a single investor by primary key.
 */
export const getInvestorById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<InvestorRow | null> => {
  console.log('💾 getInvestorById', { id });
  const { data, error } = await supabase.from('investors').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(\`Failed to fetch investor: \${error.message}\`);
  }

  return (data ?? null) as InvestorRow | null;
};
`);

write('src/data/investors/create.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateInvestorInput, InvestorRow } from './types';

/**
 * Inserts a new investor row.
 */
export const createInvestor = async (
  supabase: SupabaseClient,
  input: CreateInvestorInput,
): Promise<InvestorRow> => {
  console.log('💾 createInvestor', { name: input.name });
  const { data, error } = await supabase
    .from('investors')
    .insert({
      name: input.name,
      firm: input.firm ?? null,
      thesis_notes: input.thesisNotes ?? null,
      stage_focus: input.stageFocus ?? null,
      firm_bio: input.firmBio ?? null,
      firm_information: input.firmInformation ?? null,
      investment_sectors: input.investmentSectors ?? null,
      typical_check_size: input.typicalCheckSize ?? null,
      office_address: input.officeAddress ?? null,
      website: input.website ?? null,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(\`Failed to create investor: \${error.message}\`);
  }

  return data as InvestorRow;
};
`);

write('src/data/investors/update.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorRow, UpdateInvestorInput } from './types';

/**
 * Updates an investor row by id.
 */
export const updateInvestor = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateInvestorInput,
): Promise<InvestorRow> => {
  console.log('💾 updateInvestor', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.firm !== undefined) patch.firm = input.firm;
  if (input.thesisNotes !== undefined) patch.thesis_notes = input.thesisNotes;
  if (input.stageFocus !== undefined) patch.stage_focus = input.stageFocus;
  if (input.firmBio !== undefined) patch.firm_bio = input.firmBio;
  if (input.firmInformation !== undefined) patch.firm_information = input.firmInformation;
  if (input.investmentSectors !== undefined) patch.investment_sectors = input.investmentSectors;
  if (input.typicalCheckSize !== undefined) patch.typical_check_size = input.typicalCheckSize;
  if (input.officeAddress !== undefined) patch.office_address = input.officeAddress;
  if (input.website !== undefined) patch.website = input.website;

  const { data, error } = await supabase.from('investors').update(patch).eq('id', id).select('*').single();

  if (error) {
    throw new Error(\`Failed to update investor: \${error.message}\`);
  }

  return data as InvestorRow;
};
`);

write('src/data/investors/delete.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes an investor row by id.
 */
export const deleteInvestor = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deleteInvestor', { id });
  const { error } = await supabase.from('investors').delete().eq('id', id);

  if (error) {
    throw new Error(\`Failed to delete investor: \${error.message}\`);
  }
};
`);

write('src/data/investors/routes/list-handler.ts', `${HANDLER_HEADER}import { listInvestors } from '../list';

/**
 * GET /api/data/investors
 */
export const listInvestorsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/investors');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listInvestors(supabase);
    console.log('📤 GET /api/data/investors');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listInvestorsHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
`);

write('src/data/investors/routes/get-handler.ts', `${HANDLER_HEADER}import { getInvestorById } from '../get-by-id';

/**
 * GET /api/data/investors/:id
 */
export const getInvestorHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 GET /api/data/investors/:id', { id });
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
    const data = await getInvestorById(supabase, id);
    if (!data) {
      res.status(404).json({ success: false, error: 'Investor not found' });
      return;
    }
    console.log('📤 GET /api/data/investors/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ getInvestorHandler', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
`);

write('src/data/investors/routes/create-handler.ts', `${HANDLER_HEADER}import { createInvestor } from '../create';

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
`);

write('src/data/investors/routes/update-handler.ts', `${HANDLER_HEADER}import { getInvestorById } from '../get-by-id';
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
`);

write('src/data/investors/routes/delete-handler.ts', `${HANDLER_HEADER}import { getInvestorById } from '../get-by-id';
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
`);

write('src/data/investors/router.ts', `import { Router } from 'express';
import { listInvestorsHandler } from './routes/list-handler';
import { getInvestorHandler } from './routes/get-handler';
import { createInvestorHandler } from './routes/create-handler';
import { updateInvestorHandler } from './routes/update-handler';
import { deleteInvestorHandler } from './routes/delete-handler';

/**
 * Creates the investors data router (mount at /investors).
 */
export const createInvestorsRouter = (): Router => {
  const router = Router();
  router.get('/', listInvestorsHandler);
  router.post('/', createInvestorHandler);
  router.get('/:id', getInvestorHandler);
  router.patch('/:id', updateInvestorHandler);
  router.delete('/:id', deleteInvestorHandler);
  return router;
};
`);

write('src/data/investors/index.ts', `export { listInvestors } from './list';
export { getInvestorById } from './get-by-id';
export { createInvestor } from './create';
export { updateInvestor } from './update';
export { deleteInvestor } from './delete';
export { createInvestorsRouter } from './router';
export type { InvestorRow, CreateInvestorInput, UpdateInvestorInput } from './types';
`);

console.log('✅ investors');

// ─── 2. Investor contacts ────────────────────────────────────────────────────

write('src/data/investor-contacts/types.ts', `export type InvestorContactRow = {
  id: string;
  investor_id: string;
  name: string;
  email: string;
  role: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateInvestorContactInput = {
  investorId: string;
  name: string;
  email: string;
  role?: string | null;
};

export type UpdateInvestorContactInput = {
  name?: string;
  email?: string;
  role?: string | null;
};
`);

write('src/data/investor-contacts/list-by-investor-id.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorContactRow } from './types';

/**
 * Lists investor contacts, optionally filtered by investor_id.
 */
export const listInvestorContactsByInvestorId = async (
  supabase: SupabaseClient,
  investorId?: string,
): Promise<InvestorContactRow[]> => {
  console.log('💾 listInvestorContactsByInvestorId', { investorId });
  let query = supabase.from('investor_contacts').select('*').order('created_at', { ascending: false });
  if (investorId) query = query.eq('investor_id', investorId);
  const { data, error } = await query;
  if (error) throw new Error(\`Failed to fetch investor contacts: \${error.message}\`);
  return (data ?? []) as InvestorContactRow[];
};
`);

write('src/data/investor-contacts/get-by-id.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorContactRow } from './types';

/** Fetches one investor contact by id. */
export const getInvestorContactById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<InvestorContactRow | null> => {
  console.log('💾 getInvestorContactById', { id });
  const { data, error } = await supabase.from('investor_contacts').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(\`Failed to fetch investor contact: \${error.message}\`);
  return (data ?? null) as InvestorContactRow | null;
};
`);

write('src/data/investor-contacts/create.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateInvestorContactInput, InvestorContactRow } from './types';

/** Inserts a new investor contact. */
export const createInvestorContact = async (
  supabase: SupabaseClient,
  input: CreateInvestorContactInput,
): Promise<InvestorContactRow> => {
  console.log('💾 createInvestorContact', { investorId: input.investorId });
  const { data, error } = await supabase
    .from('investor_contacts')
    .insert({
      investor_id: input.investorId,
      name: input.name,
      email: input.email,
      role: input.role ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(\`Failed to create investor contact: \${error.message}\`);
  return data as InvestorContactRow;
};
`);

write('src/data/investor-contacts/update.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorContactRow, UpdateInvestorContactInput } from './types';

/** Updates an investor contact by id. */
export const updateInvestorContact = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateInvestorContactInput,
): Promise<InvestorContactRow> => {
  console.log('💾 updateInvestorContact', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.email !== undefined) patch.email = input.email;
  if (input.role !== undefined) patch.role = input.role;
  const { data, error } = await supabase.from('investor_contacts').update(patch).eq('id', id).select('*').single();
  if (error) throw new Error(\`Failed to update investor contact: \${error.message}\`);
  return data as InvestorContactRow;
};
`);

write('src/data/investor-contacts/delete.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes an investor contact by id. */
export const deleteInvestorContact = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deleteInvestorContact', { id });
  const { error } = await supabase.from('investor_contacts').delete().eq('id', id);
  if (error) throw new Error(\`Failed to delete investor contact: \${error.message}\`);
};
`);

const firstQueryString = `const firstQueryString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
};
`;

write('src/data/investor-contacts/routes/list-handler.ts', `${HANDLER_HEADER}import { listInvestorContactsByInvestorId } from '../list-by-investor-id';

${firstQueryString}

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
`);

write('src/data/investor-contacts/routes/get-handler.ts', `${HANDLER_HEADER}import { getInvestorContactById } from '../get-by-id';

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
`);

write('src/data/investor-contacts/routes/create-handler.ts', `${HANDLER_HEADER}import { createInvestorContact } from '../create';

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
`);

write('src/data/investor-contacts/routes/update-handler.ts', `${HANDLER_HEADER}import { getInvestorContactById } from '../get-by-id';
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
`);

write('src/data/investor-contacts/routes/delete-handler.ts', `${HANDLER_HEADER}import { getInvestorContactById } from '../get-by-id';
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
`);

write('src/data/investor-contacts/router.ts', `import { Router } from 'express';
import { listInvestorContactsHandler } from './routes/list-handler';
import { getInvestorContactHandler } from './routes/get-handler';
import { createInvestorContactHandler } from './routes/create-handler';
import { updateInvestorContactHandler } from './routes/update-handler';
import { deleteInvestorContactHandler } from './routes/delete-handler';

/** Creates the investor-contacts data router. */
export const createInvestorContactsRouter = (): Router => {
  const router = Router();
  router.get('/', listInvestorContactsHandler);
  router.post('/', createInvestorContactHandler);
  router.get('/:id', getInvestorContactHandler);
  router.patch('/:id', updateInvestorContactHandler);
  router.delete('/:id', deleteInvestorContactHandler);
  return router;
};
`);

write('src/data/investor-contacts/index.ts', `export { listInvestorContactsByInvestorId } from './list-by-investor-id';
export { getInvestorContactById } from './get-by-id';
export { createInvestorContact } from './create';
export { updateInvestorContact } from './update';
export { deleteInvestorContact } from './delete';
export { createInvestorContactsRouter } from './router';
export type { InvestorContactRow, CreateInvestorContactInput, UpdateInvestorContactInput } from './types';
`);

console.log('✅ investor-contacts');

// ─── 3. Pitch decks ──────────────────────────────────────────────────────────

write('src/data/pitch-decks/types.ts', `export type PitchDeckType = 'intro_screener' | 'investor_deep_dive';
export type PitchDeckStatus = 'draft' | 'sent' | 'archived';

export type PitchDeckRow = {
  id: string;
  name: string;
  deck_type: PitchDeckType;
  version_number: number;
  status: PitchDeckStatus;
  parent_deck_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePitchDeckInput = {
  name: string;
  deckType?: PitchDeckType;
  createdByUserId?: string | null;
};

export type UpdatePitchDeckInput = {
  name?: string;
  status?: PitchDeckStatus;
};
`);

write('src/data/pitch-decks/list.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckRow } from './types';

/** Lists all pitch decks. */
export const listPitchDecks = async (supabase: SupabaseClient): Promise<PitchDeckRow[]> => {
  console.log('💾 listPitchDecks');
  const { data, error } = await supabase.from('pitch_decks').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(\`Failed to fetch pitch decks: \${error.message}\`);
  return (data ?? []) as PitchDeckRow[];
};
`);

write('src/data/pitch-decks/get-by-id.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckRow } from './types';

/** Fetches one pitch deck by id. */
export const getPitchDeckById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<PitchDeckRow | null> => {
  console.log('💾 getPitchDeckById', { id });
  const { data, error } = await supabase.from('pitch_decks').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(\`Failed to fetch pitch deck: \${error.message}\`);
  return (data ?? null) as PitchDeckRow | null;
};
`);

write('src/data/pitch-decks/create.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreatePitchDeckInput, PitchDeckRow } from './types';

/** Inserts a new pitch deck. */
export const createPitchDeck = async (
  supabase: SupabaseClient,
  input: CreatePitchDeckInput,
): Promise<PitchDeckRow> => {
  console.log('💾 createPitchDeck', { name: input.name });
  const { data, error } = await supabase
    .from('pitch_decks')
    .insert({
      name: input.name,
      deck_type: input.deckType ?? 'intro_screener',
      created_by_user_id: input.createdByUserId ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(\`Failed to create pitch deck: \${error.message}\`);
  return data as PitchDeckRow;
};
`);

write('src/data/pitch-decks/update.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckRow, UpdatePitchDeckInput } from './types';

/** Updates a pitch deck by id. */
export const updatePitchDeck = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdatePitchDeckInput,
): Promise<PitchDeckRow> => {
  console.log('💾 updatePitchDeck', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  const { data, error } = await supabase.from('pitch_decks').update(patch).eq('id', id).select('*').single();
  if (error) throw new Error(\`Failed to update pitch deck: \${error.message}\`);
  return data as PitchDeckRow;
};
`);

write('src/data/pitch-decks/create-version.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import { getPitchDeckById } from './get-by-id';
import type { PitchDeckRow } from './types';

/** Creates a new version row from an existing pitch deck. */
export const createPitchDeckVersion = async (
  supabase: SupabaseClient,
  id: string,
): Promise<PitchDeckRow> => {
  console.log('💾 createPitchDeckVersion', { id });
  const currentDeck = await getPitchDeckById(supabase, id);
  if (!currentDeck) throw new Error('Pitch deck not found');
  const { data, error } = await supabase
    .from('pitch_decks')
    .insert({
      name: currentDeck.name,
      deck_type: currentDeck.deck_type,
      version_number: currentDeck.version_number + 1,
      status: 'draft',
      parent_deck_id: currentDeck.id,
      created_by_user_id: currentDeck.created_by_user_id,
    })
    .select('*')
    .single();
  if (error) throw new Error(\`Failed to create pitch deck version: \${error.message}\`);
  return data as PitchDeckRow;
};
`);

write('src/data/pitch-decks/routes/list-handler.ts', `${HANDLER_HEADER}import { listPitchDecks } from '../list';

/** GET /api/data/pitch-decks */
export const listPitchDecksHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/pitch-decks');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listPitchDecks(supabase);
    console.log('📤 GET /api/data/pitch-decks');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listPitchDecksHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-decks/routes/get-handler.ts', `${HANDLER_HEADER}import { getPitchDeckById } from '../get-by-id';

/** GET /api/data/pitch-decks/:id */
export const getPitchDeckHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 GET /api/data/pitch-decks/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid pitch deck id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await getPitchDeckById(supabase, id);
    if (!data) {
      res.status(404).json({ success: false, error: 'Pitch deck not found' });
      return;
    }
    console.log('📤 GET /api/data/pitch-decks/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ getPitchDeckHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-decks/routes/create-handler.ts', `${HANDLER_HEADER}import { createPitchDeck } from '../create';

/** POST /api/data/pitch-decks */
export const createPitchDeckHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/pitch-decks');
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
  const deckType = body.deckType === 'investor_deep_dive' ? 'investor_deep_dive' : 'intro_screener';
  try {
    const data = await createPitchDeck(supabase, {
      name,
      deckType,
      createdByUserId: typeof body.createdByUserId === 'string' ? body.createdByUserId : null,
    });
    console.log('📤 POST /api/data/pitch-decks');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createPitchDeckHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-decks/routes/update-handler.ts', `${HANDLER_HEADER}import { getPitchDeckById } from '../get-by-id';
import { updatePitchDeck } from '../update';

/** PATCH /api/data/pitch-decks/:id */
export const updatePitchDeckHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/pitch-decks/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid pitch deck id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const existing = await getPitchDeckById(supabase, id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Pitch deck not found' });
      return;
    }
    const body = req.body ?? {};
    const data = await updatePitchDeck(supabase, id, {
      ...(typeof body.name === 'string' ? { name: body.name } : {}),
      ...(body.status === 'draft' || body.status === 'sent' || body.status === 'archived'
        ? { status: body.status }
        : {}),
    });
    console.log('📤 PATCH /api/data/pitch-decks/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updatePitchDeckHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-decks/routes/create-version-handler.ts', `${HANDLER_HEADER}import { createPitchDeckVersion } from '../create-version';

/** POST /api/data/pitch-decks/:id/versions */
export const createPitchDeckVersionHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 POST /api/data/pitch-decks/:id/versions', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid pitch deck id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await createPitchDeckVersion(supabase, id);
    console.log('📤 POST /api/data/pitch-decks/:id/versions');
    res.status(201).json({ success: true, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    const status = msg === 'Pitch deck not found' ? 404 : 500;
    console.error('❌ createPitchDeckVersionHandler', error);
    res.status(status).json({ success: false, error: msg });
  }
};
`);

write('src/data/pitch-decks/router.ts', `import { Router } from 'express';
import { listPitchDecksHandler } from './routes/list-handler';
import { createPitchDeckHandler } from './routes/create-handler';
import { getPitchDeckHandler } from './routes/get-handler';
import { updatePitchDeckHandler } from './routes/update-handler';
import { createPitchDeckVersionHandler } from './routes/create-version-handler';

/** Creates the pitch-decks data router. */
export const createPitchDecksRouter = (): Router => {
  const router = Router();
  router.get('/', listPitchDecksHandler);
  router.post('/', createPitchDeckHandler);
  router.post('/:id/versions', createPitchDeckVersionHandler);
  router.get('/:id', getPitchDeckHandler);
  router.patch('/:id', updatePitchDeckHandler);
  return router;
};
`);

write('src/data/pitch-decks/index.ts', `export { listPitchDecks } from './list';
export { getPitchDeckById } from './get-by-id';
export { createPitchDeck } from './create';
export { updatePitchDeck } from './update';
export { createPitchDeckVersion } from './create-version';
export { createPitchDecksRouter } from './router';
export type { PitchDeckRow, PitchDeckType, PitchDeckStatus, CreatePitchDeckInput, UpdatePitchDeckInput } from './types';
`);

console.log('✅ pitch-decks');

// ─── 4. Pitch deck slides ────────────────────────────────────────────────────

write('src/data/pitch-deck-slides/types.ts', `export type PitchDeckSlideRow = {
  id: string;
  pitch_deck_id: string;
  slide_key: string;
  content_json: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
};

export type UpsertPitchDeckSlideInput = {
  pitchDeckId: string;
  slideKey: string;
  contentJson: Record<string, unknown>;
  position: number;
};
`);

write('src/data/pitch-deck-slides/list-by-pitch-deck-id.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow } from './types';

/** Lists slides for a pitch deck ordered by position. */
export const listPitchDeckSlidesByPitchDeckId = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
): Promise<PitchDeckSlideRow[]> => {
  console.log('💾 listPitchDeckSlidesByPitchDeckId', { pitchDeckId });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .select('*')
    .eq('pitch_deck_id', pitchDeckId)
    .order('position', { ascending: true });
  if (error) throw new Error(\`Failed to fetch pitch deck slides: \${error.message}\`);
  return (data ?? []) as PitchDeckSlideRow[];
};
`);

write('src/data/pitch-deck-slides/get-by-deck-and-slide-key.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow } from './types';

/** Fetches one slide by deck id and slide_key. */
export const getPitchDeckSlideByDeckAndSlideKey = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
): Promise<PitchDeckSlideRow | null> => {
  console.log('💾 getPitchDeckSlideByDeckAndSlideKey', { pitchDeckId, slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .select('*')
    .eq('pitch_deck_id', pitchDeckId)
    .eq('slide_key', slideKey)
    .maybeSingle();
  if (error) throw new Error(\`Failed to fetch pitch deck slide: \${error.message}\`);
  return (data ?? null) as PitchDeckSlideRow | null;
};
`);

write('src/data/pitch-deck-slides/upsert.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow, UpsertPitchDeckSlideInput } from './types';

/** Upserts a pitch deck slide by deck + slide_key. */
export const upsertPitchDeckSlide = async (
  supabase: SupabaseClient,
  input: UpsertPitchDeckSlideInput,
): Promise<PitchDeckSlideRow> => {
  console.log('💾 upsertPitchDeckSlide', { pitchDeckId: input.pitchDeckId, slideKey: input.slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .upsert(
      {
        pitch_deck_id: input.pitchDeckId,
        slide_key: input.slideKey,
        content_json: input.contentJson,
        position: input.position,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'pitch_deck_id,slide_key' },
    )
    .select('*')
    .single();
  if (error) throw new Error(\`Failed to upsert pitch deck slide: \${error.message}\`);
  return data as PitchDeckSlideRow;
};
`);

write('src/data/pitch-deck-slides/delete.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes a pitch deck slide by id. */
export const deletePitchDeckSlide = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deletePitchDeckSlide', { id });
  const { error } = await supabase.from('pitch_deck_slides').delete().eq('id', id);
  if (error) throw new Error(\`Failed to delete pitch deck slide: \${error.message}\`);
};
`);

write('src/data/pitch-deck-slides/routes/list-handler.ts', `${HANDLER_HEADER}import { listPitchDeckSlidesByPitchDeckId } from '../list-by-pitch-deck-id';

${firstQueryString}

/** GET /api/data/pitch-deck-slides?pitchDeckId= */
export const listPitchDeckSlidesHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/pitch-deck-slides');
  const pitchDeckId =
    firstQueryString(req.query.pitchDeckId) ?? firstQueryString(req.query.pitch_deck_id) ?? '';
  if (!pitchDeckId || !isUuid(pitchDeckId)) {
    res.status(400).json({ success: false, error: 'pitchDeckId is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listPitchDeckSlidesByPitchDeckId(supabase, pitchDeckId);
    console.log('📤 GET /api/data/pitch-deck-slides');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listPitchDeckSlidesHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-deck-slides/routes/upsert-handler.ts', `${HANDLER_HEADER}import { upsertPitchDeckSlide } from '../upsert';

/** POST /api/data/pitch-deck-slides (upsert) */
export const upsertPitchDeckSlideHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/pitch-deck-slides');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const pitchDeckId = typeof body.pitchDeckId === 'string' ? body.pitchDeckId : '';
  const slideKey = typeof body.slideKey === 'string' ? body.slideKey : '';
  const position = typeof body.position === 'number' ? body.position : 0;
  const contentJson =
    typeof body.contentJson === 'object' && body.contentJson !== null
      ? (body.contentJson as Record<string, unknown>)
      : {};
  if (!pitchDeckId || !isUuid(pitchDeckId) || !slideKey) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideKey are required' });
    return;
  }
  try {
    const data = await upsertPitchDeckSlide(supabase, { pitchDeckId, slideKey, position, contentJson });
    console.log('📤 POST /api/data/pitch-deck-slides');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ upsertPitchDeckSlideHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-deck-slides/routes/delete-handler.ts', `${HANDLER_HEADER}import { deletePitchDeckSlide } from '../delete';

/** DELETE /api/data/pitch-deck-slides/:id */
export const deletePitchDeckSlideHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 DELETE /api/data/pitch-deck-slides/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid slide id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    await deletePitchDeckSlide(supabase, id);
    console.log('📤 DELETE /api/data/pitch-deck-slides/:id');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ deletePitchDeckSlideHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/pitch-deck-slides/router.ts', `import { Router } from 'express';
import { listPitchDeckSlidesHandler } from './routes/list-handler';
import { upsertPitchDeckSlideHandler } from './routes/upsert-handler';
import { deletePitchDeckSlideHandler } from './routes/delete-handler';

/** Creates the pitch-deck-slides data router. */
export const createPitchDeckSlidesRouter = (): Router => {
  const router = Router();
  router.get('/', listPitchDeckSlidesHandler);
  router.post('/', upsertPitchDeckSlideHandler);
  router.delete('/:id', deletePitchDeckSlideHandler);
  return router;
};
`);

write('src/data/pitch-deck-slides/index.ts', `export { listPitchDeckSlidesByPitchDeckId } from './list-by-pitch-deck-id';
export { getPitchDeckSlideByDeckAndSlideKey } from './get-by-deck-and-slide-key';
export { upsertPitchDeckSlide } from './upsert';
export { deletePitchDeckSlide } from './delete';
export { createPitchDeckSlidesRouter } from './router';
export type { PitchDeckSlideRow, UpsertPitchDeckSlideInput } from './types';
`);

console.log('✅ pitch-deck-slides');

// ─── 5. Graphics ─────────────────────────────────────────────────────────────

write('src/data/graphics/types.ts', `export type GraphicGenerationStatus = 'queued' | 'running' | 'complete' | 'failed';

export type Graphic = {
  id: string;
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type GraphicRow = {
  id: string;
  title: string;
  canvas_width_px: number;
  canvas_height_px: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
};

export const GRAPHIC_SELECT_COLUMNS =
  'id, title, canvas_width_px, canvas_height_px, metadata, created_at, updated_at';

export type CreateGraphicInput = {
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  creativeBrief?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateGraphicDetailsInput = {
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
};
`);

write('src/data/graphics/map-graphic-row.ts', `import type { Graphic, GraphicRow } from './types';

const DEFAULT_CANVAS_W = 1080;
const DEFAULT_CANVAS_H = 1080;

const clampCanvas = (n: unknown, fallback: number): number => {
  if (typeof n !== 'number' || !Number.isFinite(n)) return fallback;
  const rounded = Math.round(n);
  if (rounded < 64) return 64;
  if (rounded > 8192) return 8192;
  return rounded;
};

const metadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
};

/** Maps a Supabase row to the API Graphic shape. */
export const mapGraphicRow = (row: GraphicRow): Graphic => ({
  id: row.id,
  title: row.title.trim() || 'Untitled graphic',
  canvasWidthPx: clampCanvas(row.canvas_width_px, DEFAULT_CANVAS_W),
  canvasHeightPx: clampCanvas(row.canvas_height_px, DEFAULT_CANVAS_H),
  metadata: metadataRecord(row.metadata),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
`);

write('src/data/graphics/list.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import { GRAPHIC_SELECT_COLUMNS, type Graphic, type GraphicRow } from './types';
import { mapGraphicRow } from './map-graphic-row';

/** Lists all graphics (newest updated_at first). */
export const listGraphics = async (supabase: SupabaseClient): Promise<Graphic[]> => {
  console.log('💾 listGraphics');
  const { data, error } = await supabase
    .from('image_graphics')
    .select(GRAPHIC_SELECT_COLUMNS)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapGraphicRow(row as GraphicRow));
};
`);

write('src/data/graphics/get-by-id.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import { GRAPHIC_SELECT_COLUMNS, type Graphic, type GraphicRow } from './types';
import { mapGraphicRow } from './map-graphic-row';

/** Fetches one graphic by id. */
export const getGraphicById = async (
  supabase: SupabaseClient,
  graphicId: string,
): Promise<Graphic | null> => {
  console.log('💾 getGraphicById', { graphicId });
  const { data, error } = await supabase
    .from('image_graphics')
    .select(GRAPHIC_SELECT_COLUMNS)
    .eq('id', graphicId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapGraphicRow(data as GraphicRow);
};
`);

write('src/data/graphics/create.ts', `import { randomUUID } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateGraphicInput, Graphic } from './types';
import { getGraphicById } from './get-by-id';

/** Inserts a new graphic row. */
export const createGraphic = async (
  supabase: SupabaseClient,
  input: CreateGraphicInput,
): Promise<Graphic> => {
  console.log('💾 createGraphic', { title: input.title });
  const id = randomUUID();
  const now = new Date().toISOString();
  const creativeBrief = input.creativeBrief?.trim() ?? '';
  const metadata: Record<string, unknown> = {
    ...(input.metadata ?? {}),
    ...(creativeBrief ? { creativeBrief } : {}),
    generationStatus: 'queued',
  };
  const { error } = await supabase.from('image_graphics').insert({
    id,
    title: input.title.trim() || 'Untitled graphic',
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    metadata,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
  const row = await getGraphicById(supabase, id);
  if (!row) throw new Error('Failed to load graphic after insert');
  return row;
};
`);

write('src/data/graphics/update-details.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { Graphic, UpdateGraphicDetailsInput } from './types';
import { getGraphicById } from './get-by-id';

/** Updates title and canvas dimensions for one graphic. */
export const updateGraphicDetails = async (
  supabase: SupabaseClient,
  graphicId: string,
  patch: UpdateGraphicDetailsInput,
): Promise<Graphic | null> => {
  console.log('💾 updateGraphicDetails', { graphicId });
  const prev = await getGraphicById(supabase, graphicId);
  if (!prev) return null;
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from('image_graphics')
    .update({
      title: patch.title.trim() || 'Untitled graphic',
      canvas_width_px: patch.canvasWidthPx,
      canvas_height_px: patch.canvasHeightPx,
      updated_at: updatedAt,
    })
    .eq('id', graphicId);
  if (error) throw new Error(error.message);
  return getGraphicById(supabase, graphicId);
};
`);

write('src/data/graphics/patch-studio-draft.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { Graphic, GraphicGenerationStatus } from './types';
import { getGraphicById } from './get-by-id';

/** Merges TSX into metadata.studioDraft for one graphic. */
export const patchGraphicStudioDraft = async (
  supabase: SupabaseClient,
  graphicId: string,
  tsx: string,
): Promise<Graphic | null> => {
  console.log('💾 patchGraphicStudioDraft', { graphicId });
  const prev = await getGraphicById(supabase, graphicId);
  if (!prev) return null;
  const metadata: Record<string, unknown> = { ...prev.metadata, studioDraft: { tsx } };
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from('image_graphics')
    .update({ metadata, updated_at: updatedAt })
    .eq('id', graphicId);
  if (error) throw new Error(error.message);
  return getGraphicById(supabase, graphicId);
};

/** Patches generation-related metadata fields on a graphic. */
export const patchGraphicGenerationMetadata = async (
  supabase: SupabaseClient,
  graphicId: string,
  patch: {
    generationStatus?: GraphicGenerationStatus;
    generationError?: string | null;
    cursorAgentId?: string | null;
  },
): Promise<Graphic | null> => {
  console.log('💾 patchGraphicGenerationMetadata', { graphicId });
  const prev = await getGraphicById(supabase, graphicId);
  if (!prev) return null;
  const metadata: Record<string, unknown> = { ...prev.metadata };
  if (patch.generationStatus !== undefined) metadata.generationStatus = patch.generationStatus;
  if (patch.generationError !== undefined) {
    if (patch.generationError === null) delete metadata.generationError;
    else metadata.generationError = patch.generationError;
  }
  if (patch.cursorAgentId !== undefined) {
    if (patch.cursorAgentId === null) delete metadata.cursorAgentId;
    else metadata.cursorAgentId = patch.cursorAgentId;
  }
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from('image_graphics')
    .update({ metadata, updated_at: updatedAt })
    .eq('id', graphicId);
  if (error) throw new Error(error.message);
  return getGraphicById(supabase, graphicId);
};
`);

write('src/data/graphics/delete.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes a graphic by id. */
export const deleteGraphic = async (supabase: SupabaseClient, graphicId: string): Promise<void> => {
  console.log('💾 deleteGraphic', { graphicId });
  const { error } = await supabase.from('image_graphics').delete().eq('id', graphicId);
  if (error) throw new Error(error.message);
};
`);

write('src/data/graphics/routes/list-handler.ts', `${HANDLER_HEADER}import { listGraphics } from '../list';

/** GET /api/data/graphics */
export const listGraphicsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/graphics');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await listGraphics(supabase);
    console.log('📤 GET /api/data/graphics');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ listGraphicsHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/graphics/routes/get-handler.ts', `${HANDLER_HEADER}import { getGraphicById } from '../get-by-id';

/** GET /api/data/graphics/:id */
export const getGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 GET /api/data/graphics/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const data = await getGraphicById(supabase, id);
    if (!data) {
      res.status(404).json({ success: false, error: 'Graphic not found' });
      return;
    }
    console.log('📤 GET /api/data/graphics/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ getGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/graphics/routes/create-handler.ts', `${HANDLER_HEADER}import { createGraphic } from '../create';

/** POST /api/data/graphics */
export const createGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/graphics');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  const body = req.body ?? {};
  const title = typeof body.title === 'string' ? body.title : 'Untitled graphic';
  const canvasWidthPx = typeof body.canvasWidthPx === 'number' ? body.canvasWidthPx : 1080;
  const canvasHeightPx = typeof body.canvasHeightPx === 'number' ? body.canvasHeightPx : 1080;
  try {
    const data = await createGraphic(supabase, {
      title,
      canvasWidthPx,
      canvasHeightPx,
      creativeBrief: typeof body.creativeBrief === 'string' ? body.creativeBrief : undefined,
      metadata:
        typeof body.metadata === 'object' && body.metadata !== null
          ? (body.metadata as Record<string, unknown>)
          : undefined,
    });
    console.log('📤 POST /api/data/graphics');
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ createGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/graphics/routes/update-handler.ts', `${HANDLER_HEADER}import { getGraphicById } from '../get-by-id';
import { updateGraphicDetails } from '../update-details';

/** PATCH /api/data/graphics/:id */
export const updateGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 PATCH /api/data/graphics/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
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
    const body = req.body ?? {};
    const data = await updateGraphicDetails(supabase, id, {
      title: typeof body.title === 'string' ? body.title : existing.title,
      canvasWidthPx: typeof body.canvasWidthPx === 'number' ? body.canvasWidthPx : existing.canvasWidthPx,
      canvasHeightPx: typeof body.canvasHeightPx === 'number' ? body.canvasHeightPx : existing.canvasHeightPx,
    });
    console.log('📤 PATCH /api/data/graphics/:id');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ updateGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/graphics/routes/patch-studio-draft-handler.ts', `${HANDLER_HEADER}import { getGraphicById } from '../get-by-id';
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
`);

write('src/data/graphics/routes/delete-handler.ts', `${HANDLER_HEADER}import { getGraphicById } from '../get-by-id';
import { deleteGraphic } from '../delete';

/** DELETE /api/data/graphics/:id */
export const deleteGraphicHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  console.log('📥 DELETE /api/data/graphics/:id', { id });
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
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
    await deleteGraphic(supabase, id);
    console.log('📤 DELETE /api/data/graphics/:id');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ deleteGraphicHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/graphics/routes/generate-tsx-handler.ts', `${HANDLER_HEADER}import { getGraphicById } from '../get-by-id';
import { patchGraphicGenerationMetadata } from '../patch-studio-draft';
import { runGraphicsTsxGeneration } from '../../../services/graphics/run-graphics-tsx-generation';
import { scheduleBackgroundGraphicGeneration } from '../../../services/graphics/schedule-background-graphic-generation';

/** POST /api/data/graphics/:id/generate-tsx — queue Cursor TSX generation (202). */
export const generateGraphicTsxHandler = async (req: Request, res: Response): Promise<void> => {
  const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
  console.log(\`📥 POST /api/data/graphics/\${id}/generate-tsx\`);
  if (!id || !isUuid(id)) {
    res.status(400).json({ success: false, error: 'Valid graphic id is required' });
    return;
  }
  if (!process.env.CURSOR_API_KEY?.trim()) {
    res.status(503).json({ success: false, error: 'CURSOR_API_KEY is not configured' });
    return;
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const graphic = await getGraphicById(supabase, id);
    if (!graphic) {
      res.status(404).json({ success: false, error: 'Graphic not found' });
      return;
    }
    const brief =
      typeof req.body?.creativeBrief === 'string'
        ? req.body.creativeBrief.trim()
        : typeof graphic.metadata.creativeBrief === 'string'
          ? graphic.metadata.creativeBrief.trim()
          : '';
    if (!brief) {
      res.status(400).json({ success: false, error: 'creativeBrief is required' });
      return;
    }
    if (typeof req.body?.creativeBrief === 'string' && req.body.creativeBrief.trim()) {
      const metadata = { ...graphic.metadata, creativeBrief: brief };
      await supabase.from('image_graphics').update({ metadata, updated_at: new Date().toISOString() }).eq('id', id);
    }
    await patchGraphicGenerationMetadata(supabase, id, { generationStatus: 'queued', generationError: null });
    const label = \`graphics-tsx \${id}\`;
    scheduleBackgroundGraphicGeneration(label, async () => {
      try {
        await runGraphicsTsxGeneration(supabase, { graphicId: id });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        await patchGraphicGenerationMetadata(supabase, id, { generationStatus: 'failed', generationError: msg });
        throw error;
      }
    });
    console.log(\`📤 202 POST /api/data/graphics/\${id}/generate-tsx\`);
    res.status(202).json({ success: true, accepted: true, graphicId: id });
  } catch (error) {
    console.error('❌ generateGraphicTsxHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/data/graphics/router.ts', `import { Router } from 'express';
import { listGraphicsHandler } from './routes/list-handler';
import { createGraphicHandler } from './routes/create-handler';
import { getGraphicHandler } from './routes/get-handler';
import { updateGraphicHandler } from './routes/update-handler';
import { patchGraphicStudioDraftHandler } from './routes/patch-studio-draft-handler';
import { deleteGraphicHandler } from './routes/delete-handler';
import { generateGraphicTsxHandler } from './routes/generate-tsx-handler';

/** Creates the graphics data router. */
export const createGraphicsRouter = (): Router => {
  const router = Router();
  router.get('/', listGraphicsHandler);
  router.post('/', createGraphicHandler);
  router.get('/:id', getGraphicHandler);
  router.patch('/:id/studio-draft', patchGraphicStudioDraftHandler);
  router.patch('/:id', updateGraphicHandler);
  router.delete('/:id', deleteGraphicHandler);
  router.post('/:id/generate-tsx', generateGraphicTsxHandler);
  return router;
};
`);

write('src/data/graphics/index.ts', `export { listGraphics } from './list';
export { getGraphicById } from './get-by-id';
export { createGraphic } from './create';
export { updateGraphicDetails } from './update-details';
export { patchGraphicStudioDraft, patchGraphicGenerationMetadata } from './patch-studio-draft';
export { deleteGraphic } from './delete';
export { mapGraphicRow } from './map-graphic-row';
export { createGraphicsRouter } from './router';
export type {
  Graphic,
  GraphicRow,
  GraphicGenerationStatus,
  CreateGraphicInput,
  UpdateGraphicDetailsInput,
} from './types';
`);

console.log('✅ graphics');

// ─── 6–8. Extract + studio data (no routers) ─────────────────────────────────

write('src/data/investor-firm-profile-extract/insert-request.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pending firm-profile extract request. */
export const insertInvestorFirmProfileExtractRequest = async (
  supabase: SupabaseClient,
  params: { id: string; userId: string; investorId: string; content: string },
): Promise<void> => {
  console.log('💾 insertInvestorFirmProfileExtractRequest', { investorId: params.investorId });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_firm_profile_extract_requests').insert({
    id: params.id,
    user_id: params.userId,
    investor_id: params.investorId,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-firm-profile-extract/insert-response.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a firm-profile extract response row. */
export const insertInvestorFirmProfileExtractResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  console.log('💾 insertInvestorFirmProfileExtractResponse', { id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_firm_profile_extract_responses').insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-firm-profile-extract/insert-exchange.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a firm-profile extract exchange row. */
export const insertInvestorFirmProfileExtractExchange = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    userId: string;
    investorId: string;
    requestId: string;
    responseId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    modelUsed: string;
    status: 'completed' | 'failed' | 'pending';
  },
): Promise<void> => {
  console.log('💾 insertInvestorFirmProfileExtractExchange', { id: params.id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_firm_profile_extract_exchanges').insert({
    id: params.id,
    user_id: params.userId,
    investor_id: params.investorId,
    request_id: params.requestId,
    response_id: params.responseId,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    total_tokens: params.totalTokens,
    model_used: params.modelUsed,
    status: params.status,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-firm-profile-extract/update-request.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Updates a firm-profile extract request after completion. */
export const updateInvestorFirmProfileExtractRequest = async (
  supabase: SupabaseClient,
  requestId: string,
  patch: { responseId: string; status: 'completed' | 'failed' },
): Promise<void> => {
  console.log('💾 updateInvestorFirmProfileExtractRequest', { requestId });
  const { error } = await supabase
    .from('investor_firm_profile_extract_requests')
    .update({ response_id: patch.responseId, status: patch.status, updated_at: new Date().toISOString() })
    .eq('id', requestId);
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-firm-profile-extract/index.ts', `export { insertInvestorFirmProfileExtractRequest } from './insert-request';
export { insertInvestorFirmProfileExtractResponse } from './insert-response';
export { insertInvestorFirmProfileExtractExchange } from './insert-exchange';
export { updateInvestorFirmProfileExtractRequest } from './update-request';
`);

write('src/data/investor-contact-sheet-extract/insert-request.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pending contact-sheet extract request. */
export const insertInvestorContactSheetExtractRequest = async (
  supabase: SupabaseClient,
  params: { id: string; userId: string; investorId: string; content: string },
): Promise<void> => {
  console.log('💾 insertInvestorContactSheetExtractRequest', { investorId: params.investorId });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_contact_sheet_extract_requests').insert({
    id: params.id,
    user_id: params.userId,
    investor_id: params.investorId,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-contact-sheet-extract/insert-response.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a contact-sheet extract response row. */
export const insertInvestorContactSheetExtractResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  console.log('💾 insertInvestorContactSheetExtractResponse', { id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_contact_sheet_extract_responses').insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-contact-sheet-extract/insert-exchange.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a contact-sheet extract exchange row. */
export const insertInvestorContactSheetExtractExchange = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    userId: string;
    investorId: string;
    requestId: string;
    responseId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    modelUsed: string;
    status: 'completed' | 'failed' | 'pending';
  },
): Promise<void> => {
  console.log('💾 insertInvestorContactSheetExtractExchange', { id: params.id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_contact_sheet_extract_exchanges').insert({
    id: params.id,
    user_id: params.userId,
    investor_id: params.investorId,
    request_id: params.requestId,
    response_id: params.responseId,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    total_tokens: params.totalTokens,
    model_used: params.modelUsed,
    status: params.status,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-contact-sheet-extract/update-request.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Updates a contact-sheet extract request after completion. */
export const updateInvestorContactSheetExtractRequest = async (
  supabase: SupabaseClient,
  requestId: string,
  patch: { responseId: string; status: 'completed' | 'failed' },
): Promise<void> => {
  console.log('💾 updateInvestorContactSheetExtractRequest', { requestId });
  const { error } = await supabase
    .from('investor_contact_sheet_extract_requests')
    .update({ response_id: patch.responseId, status: patch.status, updated_at: new Date().toISOString() })
    .eq('id', requestId);
  if (error) throw new Error(error.message);
};
`);

write('src/data/investor-contact-sheet-extract/index.ts', `export { insertInvestorContactSheetExtractRequest } from './insert-request';
export { insertInvestorContactSheetExtractResponse } from './insert-response';
export { insertInvestorContactSheetExtractExchange } from './insert-exchange';
export { updateInvestorContactSheetExtractRequest } from './update-request';
`);

write('src/data/pitch-deck-slide-studio/types.ts', `export type PitchDeckSlideStudioExchangeRow = {
  id: string;
  user_id: string;
  pitch_deck_id: string;
  slide_key: string;
  request_id: string;
  response_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  model_used: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

export type PitchDeckSlideStudioRequestRow = {
  id: string;
  user_id: string;
  pitch_deck_id: string;
  slide_key: string;
  content: string;
  exchange_id: string | null;
  response_id: string | null;
  status: string;
  created_at: string;
};

export type PitchDeckSlideStudioResponseRow = {
  id: string;
  structured: Record<string, unknown>;
  created_at: string;
};
`);

write('src/data/pitch-deck-slide-studio/insert-request.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pitch deck slide studio user request. */
export const insertPitchDeckSlideStudioRequest = async (
  supabase: SupabaseClient,
  params: { id: string; userId: string; pitchDeckId: string; slideKey: string; content: string },
): Promise<void> => {
  console.log('💾 insertPitchDeckSlideStudioRequest', { pitchDeckId: params.pitchDeckId, slideKey: params.slideKey });
  const now = new Date().toISOString();
  const { error } = await supabase.from('pitch_deck_slide_studio_requests').insert({
    id: params.id,
    user_id: params.userId,
    pitch_deck_id: params.pitchDeckId,
    slide_key: params.slideKey,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/pitch-deck-slide-studio/insert-response.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pitch deck slide studio response row. */
export const insertPitchDeckSlideStudioResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: Record<string, unknown>,
): Promise<void> => {
  console.log('💾 insertPitchDeckSlideStudioResponse', { id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('pitch_deck_slide_studio_responses').insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/pitch-deck-slide-studio/insert-exchange.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pitch deck slide studio exchange row. */
export const insertPitchDeckSlideStudioExchange = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    userId: string;
    pitchDeckId: string;
    slideKey: string;
    requestId: string;
    responseId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    modelUsed: string;
    status: 'completed' | 'failed' | 'pending';
    errorMessage?: string | null;
  },
): Promise<void> => {
  console.log('💾 insertPitchDeckSlideStudioExchange', { id: params.id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('pitch_deck_slide_studio_exchanges').insert({
    id: params.id,
    user_id: params.userId,
    pitch_deck_id: params.pitchDeckId,
    slide_key: params.slideKey,
    request_id: params.requestId,
    response_id: params.responseId,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    total_tokens: params.totalTokens,
    credits_used: 0,
    model_used: params.modelUsed,
    status: params.status,
    error_message: params.errorMessage ?? null,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
`);

write('src/data/pitch-deck-slide-studio/update-request-completion.ts', `import type { SupabaseClient } from '@supabase/supabase-js';

/** Marks a studio request completed with exchange + response ids. */
export const updatePitchDeckSlideStudioRequestCompletion = async (
  supabase: SupabaseClient,
  requestId: string,
  patch: { exchangeId: string; responseId: string; status: 'completed' | 'failed' },
): Promise<void> => {
  console.log('💾 updatePitchDeckSlideStudioRequestCompletion', { requestId });
  const { error } = await supabase
    .from('pitch_deck_slide_studio_requests')
    .update({
      exchange_id: patch.exchangeId,
      response_id: patch.responseId,
      status: patch.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  if (error) throw new Error(error.message);
};
`);

write('src/data/pitch-deck-slide-studio/list-exchanges-for-deck-slide.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioExchangeRow } from './types';

/** Lists exchanges for a deck + slide (newest first). */
export const listPitchDeckSlideStudioExchangesForDeckSlide = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  limit: number,
): Promise<PitchDeckSlideStudioExchangeRow[]> => {
  console.log('💾 listPitchDeckSlideStudioExchangesForDeckSlide', { pitchDeckId, slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_exchanges')
    .select(
      'id, user_id, pitch_deck_id, slide_key, request_id, response_id, input_tokens, output_tokens, total_tokens, model_used, status, error_message, created_at',
    )
    .eq('pitch_deck_id', pitchDeckId)
    .eq('slide_key', slideKey)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioExchangeRow[];
};
`);

write('src/data/pitch-deck-slide-studio/list-exchanges-chronological.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioExchangeRow } from './types';

/** Lists exchanges chronologically (oldest first) for recent-chat context. */
export const listPitchDeckSlideStudioExchangesChronological = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  limit: number,
): Promise<PitchDeckSlideStudioExchangeRow[]> => {
  console.log('💾 listPitchDeckSlideStudioExchangesChronological', { pitchDeckId, slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_exchanges')
    .select(
      'id, user_id, pitch_deck_id, slide_key, request_id, response_id, input_tokens, output_tokens, total_tokens, model_used, status, error_message, created_at',
    )
    .eq('pitch_deck_id', pitchDeckId)
    .eq('slide_key', slideKey)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioExchangeRow[];
};
`);

write('src/data/pitch-deck-slide-studio/list-requests-by-ids.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioRequestRow } from './types';

/** Loads studio request rows by ids. */
export const listPitchDeckSlideStudioRequestsByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<PitchDeckSlideStudioRequestRow[]> => {
  if (ids.length === 0) return [];
  console.log('💾 listPitchDeckSlideStudioRequestsByIds', { count: ids.length });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_requests')
    .select('id, user_id, pitch_deck_id, slide_key, content, exchange_id, response_id, status, created_at')
    .in('id', ids);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioRequestRow[];
};
`);

write('src/data/pitch-deck-slide-studio/list-responses-by-ids.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioResponseRow } from './types';

/** Loads studio response rows by ids. */
export const listPitchDeckSlideStudioResponsesByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<PitchDeckSlideStudioResponseRow[]> => {
  if (ids.length === 0) return [];
  console.log('💾 listPitchDeckSlideStudioResponsesByIds', { count: ids.length });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_responses')
    .select('id, structured, created_at')
    .in('id', ids);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioResponseRow[];
};
`);

write('src/data/pitch-deck-slide-studio/index.ts', `export { insertPitchDeckSlideStudioRequest } from './insert-request';
export { insertPitchDeckSlideStudioResponse } from './insert-response';
export { insertPitchDeckSlideStudioExchange } from './insert-exchange';
export { updatePitchDeckSlideStudioRequestCompletion } from './update-request-completion';
export { listPitchDeckSlideStudioExchangesForDeckSlide } from './list-exchanges-for-deck-slide';
export { listPitchDeckSlideStudioExchangesChronological } from './list-exchanges-chronological';
export { listPitchDeckSlideStudioRequestsByIds } from './list-requests-by-ids';
export { listPitchDeckSlideStudioResponsesByIds } from './list-responses-by-ids';
export type {
  PitchDeckSlideStudioExchangeRow,
  PitchDeckSlideStudioRequestRow,
  PitchDeckSlideStudioResponseRow,
} from './types';
`);

console.log('✅ extract + studio data');

// ─── 9. Data router aggregate ────────────────────────────────────────────────

write('src/data/router.ts', `import { Router } from 'express';
import { createInvestorsRouter } from './investors';
import { createInvestorContactsRouter } from './investor-contacts';
import { createPitchDecksRouter } from './pitch-decks';
import { createPitchDeckSlidesRouter } from './pitch-deck-slides';
import { createGraphicsRouter } from './graphics';

/**
 * Aggregates all /api/data entity routers.
 */
export const createDataRouter = (): Router => {
  const router = Router();
  router.use('/investors', createInvestorsRouter());
  router.use('/investor-contacts', createInvestorContactsRouter());
  router.use('/pitch-decks', createPitchDecksRouter());
  router.use('/pitch-deck-slides', createPitchDeckSlidesRouter());
  router.use('/graphics', createGraphicsRouter());
  return router;
};
`);

// ─── 10. Investor extract service ──────────────────────────────────────────

write('src/services/investor-extract/types.ts', `export type InvestorFirmProfileExtraction = {
  suggestedName: string | null;
  suggestedFirm: string | null;
  firmBio: string | null;
  firmInformation: string | null;
  investmentSectors: string | null;
  stageFocus: string | null;
  typicalCheckSize: string | null;
  officeAddress: string | null;
  thesisNotes: string | null;
  website: string | null;
};

export type InvestorContactExtractionRow = {
  name: string;
  email: string;
  role: string | null;
};

export type InvestorContactSheetExtraction = {
  contacts: InvestorContactExtractionRow[];
};

export type ProcessExtractInvestorFirmProfileResult = {
  extraction: InvestorFirmProfileExtraction;
  requestId: string;
  responseId: string;
  exchangeId: string;
};

export type ProcessExtractInvestorContactsResult = {
  extraction: InvestorContactSheetExtraction;
  requestId: string;
  responseId: string;
  exchangeId: string;
};
`);

write('src/services/investor-extract/process-extract-firm-profile.ts', `import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { getInvestorById } from '../../data/investors';
import {
  insertInvestorFirmProfileExtractExchange,
  insertInvestorFirmProfileExtractRequest,
  insertInvestorFirmProfileExtractResponse,
  updateInvestorFirmProfileExtractRequest,
} from '../../data/investor-firm-profile-extract';
import { generateCompletion } from '../ai';
import { getModelConfig } from '../ai/model-config';
import type { InvestorFirmProfileExtraction, ProcessExtractInvestorFirmProfileResult } from './types';

const MAX_TEXT_LENGTH = 50000;

const SYSTEM_PROMPT = \`You extract structured investor / VC / fund profile fields from messy pasted text (websites, PDFs, emails, LinkedIn dumps).

Return ONE JSON object only (no markdown fences), with these keys (use null when unknown):
{
  "suggestedName": string | null,
  "suggestedFirm": string | null,
  "firmBio": string | null,
  "firmInformation": string | null,
  "investmentSectors": string | null,
  "stageFocus": string | null,
  "typicalCheckSize": string | null,
  "officeAddress": string | null,
  "thesisNotes": string | null,
  "website": string | null
}

Rules:
- suggestedName = how the fund or person is commonly named as an investor (not necessarily legal entity).
- suggestedFirm = firm / fund brand name if distinct from suggestedName.
- firmBio = short narrative bio suitable for CRM.
- firmInformation = other factual bullets not covered elsewhere (portfolio themes, geography, structure).
- investmentSectors = comma-separated or short prose list of sectors/themes.
- stageFocus = stages they invest in (e.g. pre-seed–Series B).
- typicalCheckSize = typical check / round participation if stated.
- officeAddress = HQ or mailing address if present.
- thesisNotes = explicit thesis / mandate language if present.
- website = canonical fund / firm website URL (include https when obvious from source; null if unknown).
- Prefer null over empty strings.\`;

const stripCodeFences = (raw: string): string => {
  let t = raw.trim();
  if (t.startsWith('\`\`\`')) {
    t = t.replace(/^\`\`\`(?:json)?\\s*/i, '').replace(/\\s*\`\`\`$/i, '');
  }
  return t.trim();
};

const parseExtraction = (raw: string): InvestorFirmProfileExtraction => {
  const text = stripCodeFences(raw);
  const parsed = JSON.parse(text) as Record<string, unknown>;
  const str = (k: string): string | null => {
    const v = parsed[k];
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    return s.length ? s : null;
  };
  return {
    suggestedName: str('suggestedName'),
    suggestedFirm: str('suggestedFirm'),
    firmBio: str('firmBio'),
    firmInformation: str('firmInformation'),
    investmentSectors: str('investmentSectors'),
    stageFocus: str('stageFocus'),
    typicalCheckSize: str('typicalCheckSize'),
    officeAddress: str('officeAddress'),
    thesisNotes: str('thesisNotes'),
    website: str('website'),
  };
};

const persistOutcome = async (
  supabase: SupabaseClient,
  params: {
    userId: string;
    investorId: string;
    requestId: string;
    structured: unknown;
    usage: { input_tokens: number; output_tokens: number } | null;
    modelUsed: string;
    status: 'completed' | 'failed';
  },
): Promise<{ responseId: string; exchangeId: string }> => {
  const responseId = randomUUID();
  await insertInvestorFirmProfileExtractResponse(supabase, responseId, params.structured);
  const exchangeId = randomUUID();
  const inputTokens = params.usage?.input_tokens ?? 0;
  const outputTokens = params.usage?.output_tokens ?? 0;
  await insertInvestorFirmProfileExtractExchange(supabase, {
    id: exchangeId,
    userId: params.userId,
    investorId: params.investorId,
    requestId: params.requestId,
    responseId,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    modelUsed: params.modelUsed,
    status: params.status,
  });
  await updateInvestorFirmProfileExtractRequest(supabase, params.requestId, {
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });
  return { responseId, exchangeId };
};

/**
 * Runs firm-profile extraction for an investor.
 */
export const processExtractFirmProfile = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  params: { userId: string; investorId: string; textBlob: string },
): Promise<ProcessExtractInvestorFirmProfileResult> => {
  const text = params.textBlob.trim();
  if (!text) throw new Error('textBlob is required');
  if (text.length > MAX_TEXT_LENGTH) throw new Error(\`Text is too long (max \${MAX_TEXT_LENGTH} characters)\`);

  const investor = await getInvestorById(supabase, params.investorId);
  if (!investor) throw new Error('Investor not found');

  const requestId = randomUUID();
  await insertInvestorFirmProfileExtractRequest(supabase, {
    id: requestId,
    userId: params.userId,
    investorId: params.investorId,
    content: text,
  });

  const modelConfig = getModelConfig('extract_investor_firm_profile');
  const modelUsed = modelConfig.model;

  if (!anthropic) {
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'AI service not configured' },
      usage: null,
      modelUsed: 'none',
      status: 'failed',
    });
    throw new Error('AI service not configured');
  }

  let responseText = '';
  let usage: { input_tokens: number; output_tokens: number } | null = null;
  try {
    const result = await generateCompletion(anthropic, {
      systemPrompt: SYSTEM_PROMPT,
      userMessage: \`Current investor record (may be incomplete):\\n\${JSON.stringify(
        {
          name: investor.name,
          firm: investor.firm,
          website: investor.website,
          thesis_notes: investor.thesis_notes,
          stage_focus: investor.stage_focus,
        },
        null,
        2,
      )}\\n\\n---\\n\\nPasted source text:\\n\${text}\`,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    });
    responseText = result.response;
    usage = result.usage;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Model request failed';
    console.error('❌ processExtractFirmProfile model:', e);
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: msg },
      usage: null,
      modelUsed,
      status: 'failed',
    });
    throw new Error(msg);
  }

  let extraction: InvestorFirmProfileExtraction;
  try {
    extraction = parseExtraction(responseText);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON from model';
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'Model returned invalid JSON', details: msg },
      usage,
      modelUsed,
      status: 'failed',
    });
    throw new Error('Model returned invalid JSON');
  }

  const { responseId, exchangeId } = await persistOutcome(supabase, {
    userId: params.userId,
    investorId: params.investorId,
    requestId,
    structured: extraction,
    usage,
    modelUsed,
    status: 'completed',
  });

  return { extraction, requestId, responseId, exchangeId };
};
`);

write('src/services/investor-extract/process-extract-contacts.ts', `import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { getInvestorById } from '../../data/investors';
import {
  insertInvestorContactSheetExtractExchange,
  insertInvestorContactSheetExtractRequest,
  insertInvestorContactSheetExtractResponse,
  updateInvestorContactSheetExtractRequest,
} from '../../data/investor-contact-sheet-extract';
import { generateCompletion } from '../ai';
import { getModelConfig } from '../ai/model-config';
import type {
  InvestorContactSheetExtraction,
  ProcessExtractInvestorContactsResult,
} from './types';

const MAX_TEXT_LENGTH = 50000;

const SYSTEM_PROMPT = \`You extract people / contacts for an investor CRM from pasted text (email threads, team pages, signatures, spreadsheets pasted as text).

Return ONE JSON object only (no markdown fences):
{
  "contacts": [
    { "name": string, "email": string, "role": string | null }
  ]
}

Rules:
- Every contact MUST have a non-empty name and a plausible email address.
- If email is missing, omit that person from contacts (do not invent emails).
- role may be null.
- De-duplicate the same email address.
- Order contacts roughly as they appear in the source.
- Include every distinct person with a valid email found in the source.\`;

const stripCodeFences = (raw: string): string => {
  let t = raw.trim();
  if (t.startsWith('\`\`\`')) {
    t = t.replace(/^\`\`\`(?:json)?\\s*/i, '').replace(/\\s*\`\`\`$/i, '');
  }
  return t.trim();
};

const parseExtraction = (raw: string): InvestorContactSheetExtraction => {
  const text = stripCodeFences(raw);
  const parsed = JSON.parse(text) as { contacts?: unknown };
  const rows = Array.isArray(parsed.contacts) ? parsed.contacts : [];
  const contacts: InvestorContactSheetExtraction['contacts'] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const name = typeof r.name === 'string' ? r.name.trim() : '';
    const email = typeof r.email === 'string' ? r.email.trim().toLowerCase() : '';
    const role =
      r.role === null || r.role === undefined
        ? null
        : typeof r.role === 'string'
          ? r.role.trim() || null
          : null;
    if (!name || !email || !email.includes('@')) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    contacts.push({ name, email, role });
  }
  return { contacts };
};

const persistOutcome = async (
  supabase: SupabaseClient,
  params: {
    userId: string;
    investorId: string;
    requestId: string;
    structured: unknown;
    usage: { input_tokens: number; output_tokens: number } | null;
    modelUsed: string;
    status: 'completed' | 'failed';
  },
): Promise<{ responseId: string; exchangeId: string }> => {
  const responseId = randomUUID();
  await insertInvestorContactSheetExtractResponse(supabase, responseId, params.structured);
  const exchangeId = randomUUID();
  const inputTokens = params.usage?.input_tokens ?? 0;
  const outputTokens = params.usage?.output_tokens ?? 0;
  await insertInvestorContactSheetExtractExchange(supabase, {
    id: exchangeId,
    userId: params.userId,
    investorId: params.investorId,
    requestId: params.requestId,
    responseId,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    modelUsed: params.modelUsed,
    status: params.status,
  });
  await updateInvestorContactSheetExtractRequest(supabase, params.requestId, {
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });
  return { responseId, exchangeId };
};

/**
 * Runs contact-sheet extraction for an investor.
 */
export const processExtractContacts = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  params: { userId: string; investorId: string; textBlob: string },
): Promise<ProcessExtractInvestorContactsResult> => {
  const text = params.textBlob.trim();
  if (!text) throw new Error('textBlob is required');
  if (text.length > MAX_TEXT_LENGTH) throw new Error(\`Text is too long (max \${MAX_TEXT_LENGTH} characters)\`);

  const investor = await getInvestorById(supabase, params.investorId);
  if (!investor) throw new Error('Investor not found');

  const requestId = randomUUID();
  await insertInvestorContactSheetExtractRequest(supabase, {
    id: requestId,
    userId: params.userId,
    investorId: params.investorId,
    content: text,
  });

  const modelConfig = getModelConfig('extract_investor_contact_sheet');
  const modelUsed = modelConfig.model;

  if (!anthropic) {
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'AI service not configured', contacts: [] },
      usage: null,
      modelUsed: 'none',
      status: 'failed',
    });
    throw new Error('AI service not configured');
  }

  let responseText = '';
  let usage: { input_tokens: number; output_tokens: number } | null = null;
  try {
    const result = await generateCompletion(anthropic, {
      systemPrompt: SYSTEM_PROMPT,
      userMessage: \`Investor context (for disambiguation only):\\n\${JSON.stringify(
        { name: investor.name, firm: investor.firm },
        null,
        2,
      )}\\n\\n---\\n\\nPasted source text:\\n\${text}\`,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    });
    responseText = result.response;
    usage = result.usage;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Model request failed';
    console.error('❌ processExtractContacts model:', e);
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: msg, contacts: [] },
      usage: null,
      modelUsed,
      status: 'failed',
    });
    throw new Error(msg);
  }

  let extraction: InvestorContactSheetExtraction;
  try {
    extraction = parseExtraction(responseText);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON from model';
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'Model returned invalid JSON', details: msg, contacts: [] },
      usage,
      modelUsed,
      status: 'failed',
    });
    throw new Error('Model returned invalid JSON');
  }

  const { responseId, exchangeId } = await persistOutcome(supabase, {
    userId: params.userId,
    investorId: params.investorId,
    requestId,
    structured: extraction,
    usage,
    modelUsed,
    status: 'completed',
  });

  return { extraction, requestId, responseId, exchangeId };
};
`);

write('src/services/investor-extract/routes/extract-firm-profile-handler.ts', `import type { Request, Response } from 'express';
import { getManagedSupabaseClient, getManagedAnthropicClient } from '../../managed';
import { isUuid } from '../../../utils/validation';
import { processExtractFirmProfile } from '../process-extract-firm-profile';

/**
 * POST /api/investor-extract/:investorId/extract-firm-profile
 */
export const extractFirmProfileHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/investor-extract/:investorId/extract-firm-profile');
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
    const data = await processExtractFirmProfile(supabase, anthropic, { userId, investorId, textBlob });
    console.log('📤 POST /api/investor-extract/:investorId/extract-firm-profile');
    res.status(200).json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extract firm profile';
    const status =
      message === 'Investor not found' ? 404 : message === 'textBlob is required' ? 400 : 500;
    console.error('❌ extractFirmProfileHandler', error);
    res.status(status).json({ success: false, error: message });
  }
};
`);

write('src/services/investor-extract/routes/extract-contacts-handler.ts', `import type { Request, Response } from 'express';
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
`);

write('src/services/investor-extract/routes/index.ts', `export { extractFirmProfileHandler } from './extract-firm-profile-handler';
export { extractContactsHandler } from './extract-contacts-handler';
`);

write('src/services/investor-extract/router.ts', `import { Router } from 'express';
import { extractFirmProfileHandler } from './routes/extract-firm-profile-handler';
import { extractContactsHandler } from './routes/extract-contacts-handler';

/**
 * Investor extract API router.
 */
export const createInvestorExtractRouter = (): Router => {
  const router = Router();
  router.post('/:investorId/extract-firm-profile', extractFirmProfileHandler);
  router.post('/:investorId/extract-contacts', extractContactsHandler);
  return router;
};
`);

write('src/services/investor-extract/index.ts', `export { createInvestorExtractRouter } from './router';
export { processExtractFirmProfile } from './process-extract-firm-profile';
export { processExtractContacts } from './process-extract-contacts';
export type {
  InvestorFirmProfileExtraction,
  InvestorContactSheetExtraction,
  ProcessExtractInvestorFirmProfileResult,
  ProcessExtractInvestorContactsResult,
} from './types';
`);

console.log('✅ investor-extract service');

// ─── 11. Pitch deck slide studio service ─────────────────────────────────────

write('src/services/pitch-deck-slide-studio/config.ts', `/** Slide keys with a dedicated chat ledger in Pitch Deck Studio. */
export const PITCH_DECK_SLIDE_STUDIO_KEYS = [
  'cover',
  'problem',
  'solution',
  'market',
  'ask',
] as const;

export type PitchDeckSlideStudioSlideKey = (typeof PITCH_DECK_SLIDE_STUDIO_KEYS)[number];

export const PITCH_DECK_SLIDE_STUDIO_LABELS: Record<PitchDeckSlideStudioSlideKey, string> = {
  cover: 'Cover',
  problem: 'Problem',
  solution: 'Solution',
  market: 'Market',
  ask: 'Ask',
};

/** Returns true when value is a supported studio slide key. */
export const isPitchDeckSlideStudioSlideKey = (
  value: string,
): value is PitchDeckSlideStudioSlideKey =>
  (PITCH_DECK_SLIDE_STUDIO_KEYS as readonly string[]).includes(value);
`);

write('src/services/pitch-deck-slide-studio/build-pitch-deck-slide-studio-prompt.ts', `import type { PitchDeckSlideStudioSlideKey } from './config';
import { PITCH_DECK_SLIDE_STUDIO_LABELS } from './config';

type BuildUserPayloadParams = {
  slideKey: PitchDeckSlideStudioSlideKey;
  slideContentJson: Record<string, unknown>;
  recentLines: { role: 'user' | 'assistant'; content: string }[];
  userMessage: string;
};

/** Built-in system prompt for pitch deck slide studio coach. */
export const buildPitchDeckSlideStudioSystemPrompt = (
  slideKey: PitchDeckSlideStudioSlideKey,
): string => {
  const label = PITCH_DECK_SLIDE_STUDIO_LABELS[slideKey];
  return [
    \`You are an expert pitch deck coach helping refine the "\${label}" slide.\`,
    'Give concise, actionable feedback: clarity, specificity, metrics where relevant, and what investors expect on this slide.',
    'Do not invent facts; if the slide is thin, say what to add or validate.',
    'Reply as plain prose only (no JSON, no markdown code fences unless a short example helps).',
  ].join('\\n');
};

/** User payload: current slide JSON + optional recent chat + latest user message. */
export const buildPitchDeckSlideStudioUserPayload = (params: BuildUserPayloadParams): string => {
  const label = PITCH_DECK_SLIDE_STUDIO_LABELS[params.slideKey];
  const slideBlock = JSON.stringify(params.slideContentJson ?? {}, null, 2);
  const history =
    params.recentLines.length > 0
      ? params.recentLines
          .map((l) => \`\${l.role === 'user' ? 'User' : 'Assistant'}: \${l.content}\`)
          .join('\\n')
      : '(no prior messages in the last 24h for this slide)';

  return [
    \`Slide: \${label} (\${params.slideKey})\`,
    '',
    'Current slide content (JSON fields from the editor):',
    slideBlock,
    '',
    'Recent conversation (same slide, last 24h):',
    history,
    '',
    'User message:',
    params.userMessage,
  ].join('\\n');
};
`);

write('src/services/pitch-deck-slide-studio/map-pitch-deck-slide-studio-ledger.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import {
  listPitchDeckSlideStudioExchangesForDeckSlide,
  listPitchDeckSlideStudioRequestsByIds,
  listPitchDeckSlideStudioResponsesByIds,
  type PitchDeckSlideStudioExchangeRow,
} from '../../data/pitch-deck-slide-studio';

export type PitchDeckSlideStudioLedgerTurn = {
  exchangeId: string;
  createdAt: string;
  userContent: string;
  assistantContent: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  modelUsed: string;
  status: string;
};

const assistantTextFromStructured = (structured: Record<string, unknown>): string => {
  const c = structured.content;
  if (typeof c === 'string' && c.trim()) return c;
  return '';
};

/**
 * Maps DB rows to UI-friendly ledger turns (chronological order).
 */
export const buildPitchDeckSlideStudioLedgerTurns = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  limit: number,
): Promise<PitchDeckSlideStudioLedgerTurn[]> => {
  const exchanges = await listPitchDeckSlideStudioExchangesForDeckSlide(
    supabase,
    pitchDeckId,
    slideKey,
    limit,
  );
  if (exchanges.length === 0) return [];

  const requestIds = [...new Set(exchanges.map((e) => e.request_id))];
  const responseIds = exchanges.map((e) => e.response_id).filter((id): id is string => Boolean(id));

  const [reqRows, resRows] = await Promise.all([
    listPitchDeckSlideStudioRequestsByIds(supabase, requestIds),
    listPitchDeckSlideStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const turns: PitchDeckSlideStudioLedgerTurn[] = [];
  for (const ex of exchanges) {
    const req = reqById.get(ex.request_id);
    const res = ex.response_id ? resById.get(ex.response_id) : undefined;
    const structured = (res?.structured ?? {}) as Record<string, unknown>;
    turns.push({
      exchangeId: ex.id,
      createdAt: ex.created_at,
      userContent: req?.content ?? '',
      assistantContent: assistantTextFromStructured(structured),
      inputTokens: ex.input_tokens ?? 0,
      outputTokens: ex.output_tokens ?? 0,
      totalTokens: ex.total_tokens ?? 0,
      modelUsed: ex.model_used ?? 'none',
      status: ex.status,
    });
  }

  return turns.reverse();
};

/** Builds a single turn DTO from an exchange row. */
export const turnFromExchangeRow = (
  ex: PitchDeckSlideStudioExchangeRow,
  reqContent: string,
  assistantContent: string,
): PitchDeckSlideStudioLedgerTurn => ({
  exchangeId: ex.id,
  createdAt: ex.created_at,
  userContent: reqContent,
  assistantContent,
  inputTokens: ex.input_tokens ?? 0,
  outputTokens: ex.output_tokens ?? 0,
  totalTokens: ex.total_tokens ?? 0,
  modelUsed: ex.model_used ?? 'none',
  status: ex.status,
});
`);

write('src/services/pitch-deck-slide-studio/process-pitch-deck-slide-studio-chat.ts', `import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import {
  insertPitchDeckSlideStudioExchange,
  insertPitchDeckSlideStudioRequest,
  insertPitchDeckSlideStudioResponse,
  listPitchDeckSlideStudioExchangesChronological,
  listPitchDeckSlideStudioRequestsByIds,
  listPitchDeckSlideStudioResponsesByIds,
  updatePitchDeckSlideStudioRequestCompletion,
} from '../../data/pitch-deck-slide-studio';
import { getPitchDeckSlideByDeckAndSlideKey } from '../../data/pitch-deck-slides';
import { generateCompletion } from '../ai';
import { getModelConfig } from '../ai/model-config';
import {
  buildPitchDeckSlideStudioSystemPrompt,
  buildPitchDeckSlideStudioUserPayload,
} from './build-pitch-deck-slide-studio-prompt';
import type { PitchDeckSlideStudioSlideKey } from './config';

const MS_24H = 24 * 60 * 60 * 1000;

const assistantTextFromStructured = (structured: Record<string, unknown>): string => {
  const c = structured.content;
  if (typeof c === 'string' && c.trim()) return c;
  return 'I could not produce a text reply.';
};

const loadRecentChatLines = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  excludeRequestId: string,
): Promise<{ role: 'user' | 'assistant'; content: string }[]> => {
  const exchanges = await listPitchDeckSlideStudioExchangesChronological(
    supabase,
    pitchDeckId,
    slideKey,
    200,
  );
  const cutoff = Date.now() - MS_24H;
  const completed = exchanges.filter(
    (ex) =>
      ex.response_id &&
      ex.status === 'completed' &&
      new Date(ex.created_at).getTime() >= cutoff &&
      ex.request_id !== excludeRequestId,
  );
  if (completed.length === 0) return [];

  const requestIds = [...new Set(completed.map((ex) => ex.request_id))];
  const responseIds = completed.map((ex) => ex.response_id as string);
  const [reqRows, resRows] = await Promise.all([
    listPitchDeckSlideStudioRequestsByIds(supabase, requestIds),
    listPitchDeckSlideStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const lines: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const ex of completed) {
    const req = reqById.get(ex.request_id);
    if (req) lines.push({ role: 'user', content: req.content });
    const resp = ex.response_id ? resById.get(ex.response_id) : undefined;
    const s = (resp?.structured ?? {}) as Record<string, unknown>;
    lines.push({ role: 'assistant', content: assistantTextFromStructured(s) });
  }
  return lines;
};

const persistExchangeOutcome = async (
  supabase: SupabaseClient,
  params: {
    userId: string;
    pitchDeckId: string;
    slideKey: string;
    requestId: string;
    structured: Record<string, unknown>;
    ai: { inputTokens: number; outputTokens: number; totalTokens: number; modelUsed: string } | null;
    status: 'completed' | 'failed';
    errorMessage?: string | null;
  },
): Promise<void> => {
  const responseId = randomUUID();
  await insertPitchDeckSlideStudioResponse(supabase, responseId, params.structured);
  const exchangeId = randomUUID();
  await insertPitchDeckSlideStudioExchange(supabase, {
    id: exchangeId,
    userId: params.userId,
    pitchDeckId: params.pitchDeckId,
    slideKey: params.slideKey,
    requestId: params.requestId,
    responseId,
    inputTokens: params.ai?.inputTokens ?? 0,
    outputTokens: params.ai?.outputTokens ?? 0,
    totalTokens: params.ai?.totalTokens ?? 0,
    modelUsed: params.ai?.modelUsed ?? 'none',
    status: params.status,
    errorMessage: params.errorMessage ?? null,
  });
  await updatePitchDeckSlideStudioRequestCompletion(supabase, params.requestId, {
    exchangeId,
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });
};

/**
 * Persist user request, run coach AI for one slide, store response + exchange.
 */
export const processPitchDeckSlideStudioChat = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  userId: string,
  pitchDeckId: string,
  slideKey: PitchDeckSlideStudioSlideKey,
  userMessageContent: string,
): Promise<void> => {
  const slideRow = await getPitchDeckSlideByDeckAndSlideKey(supabase, pitchDeckId, slideKey);
  const slideContentJson = (slideRow?.content_json ?? {}) as Record<string, unknown>;

  const requestId = randomUUID();
  await insertPitchDeckSlideStudioRequest(supabase, {
    id: requestId,
    userId,
    pitchDeckId,
    slideKey,
    content: userMessageContent,
  });

  const fallback = 'I could not generate a detailed reply right now. Please try again in a moment.';

  try {
    const recentChat = await loadRecentChatLines(supabase, pitchDeckId, slideKey, requestId);

    if (!anthropic) {
      await persistExchangeOutcome(supabase, {
        userId,
        pitchDeckId,
        slideKey,
        requestId,
        structured: { content: 'AI is not configured. Add API keys to enable the coach.' },
        ai: null,
        status: 'completed',
      });
      return;
    }

    const systemPrompt = buildPitchDeckSlideStudioSystemPrompt(slideKey);
    const userPayload = buildPitchDeckSlideStudioUserPayload({
      slideKey,
      slideContentJson,
      recentLines: recentChat,
      userMessage: userMessageContent,
    });
    const modelConfig = getModelConfig('pitch_deck_slide_studio');
    const result = await generateCompletion(anthropic, {
      systemPrompt,
      userMessage: userPayload,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    });
    const structured = { content: result.response || fallback };

    await persistExchangeOutcome(supabase, {
      userId,
      pitchDeckId,
      slideKey,
      requestId,
      structured,
      ai: {
        inputTokens: result.usage.input_tokens,
        outputTokens: result.usage.output_tokens,
        totalTokens: result.usage.input_tokens + result.usage.output_tokens,
        modelUsed: modelConfig.model,
      },
      status: 'completed',
    });
  } catch (e: unknown) {
    console.error('❌ processPitchDeckSlideStudioChat error:', e);
    const msg = e instanceof Error ? e.message : 'Unknown error';
    try {
      await persistExchangeOutcome(supabase, {
        userId,
        pitchDeckId,
        slideKey,
        requestId,
        structured: { content: \`\${fallback} (\${msg})\` },
        ai: null,
        status: 'failed',
        errorMessage: msg,
      });
    } catch (persistErr: unknown) {
      console.error('❌ processPitchDeckSlideStudioChat failed to persist error outcome:', persistErr);
    }
  }
};
`);

write('src/services/pitch-deck-slide-studio/routes/get-ledger-handler.ts', `import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../managed';
import { getPitchDeckById } from '../../../data/pitch-decks';
import { isPitchDeckSlideStudioSlideKey } from '../config';
import { buildPitchDeckSlideStudioLedgerTurns } from '../map-pitch-deck-slide-studio-ledger';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * GET /api/pitch-deck-slide-studio/decks/:pitchDeckId/slides/:slideKey/ledger
 */
export const getLedgerHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET pitch-deck-slide-studio ledger');
  const pitchDeckId = typeof req.params.pitchDeckId === 'string' ? req.params.pitchDeckId : '';
  const slideKey = typeof req.params.slideKey === 'string' ? req.params.slideKey : '';
  if (!pitchDeckId || !slideKey) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideKey are required' });
    return;
  }
  if (!isPitchDeckSlideStudioSlideKey(slideKey)) {
    res.status(400).json({ success: false, error: 'Unsupported slide for studio chat' });
    return;
  }
  let limit = DEFAULT_LIMIT;
  if (typeof req.query.limit === 'string') {
    const n = parseInt(req.query.limit, 10);
    if (!Number.isNaN(n) && n > 0) limit = Math.min(n, MAX_LIMIT);
  }
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }
  try {
    const deck = await getPitchDeckById(supabase, pitchDeckId);
    if (!deck) {
      res.status(404).json({ success: false, error: 'Pitch deck not found' });
      return;
    }
    const turns = await buildPitchDeckSlideStudioLedgerTurns(supabase, pitchDeckId, slideKey, limit);
    console.log('📤 GET pitch-deck-slide-studio ledger');
    res.status(200).json({ success: true, turns });
  } catch (error) {
    console.error('❌ getLedgerHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/services/pitch-deck-slide-studio/routes/post-message-handler.ts', `import type { Request, Response } from 'express';
import { getManagedSupabaseClient, getManagedAnthropicClient } from '../../managed';
import { getPitchDeckById } from '../../../data/pitch-decks';
import {
  listPitchDeckSlideStudioExchangesForDeckSlide,
  listPitchDeckSlideStudioRequestsByIds,
  listPitchDeckSlideStudioResponsesByIds,
} from '../../../data/pitch-deck-slide-studio';
import { isPitchDeckSlideStudioSlideKey } from '../config';
import { processPitchDeckSlideStudioChat } from '../process-pitch-deck-slide-studio-chat';
import { turnFromExchangeRow } from '../map-pitch-deck-slide-studio-ledger';

/**
 * POST /api/pitch-deck-slide-studio/decks/:pitchDeckId/slides/:slideKey/messages
 */
export const postMessageHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST pitch-deck-slide-studio message');
  const pitchDeckId = typeof req.params.pitchDeckId === 'string' ? req.params.pitchDeckId : '';
  const slideKey = typeof req.params.slideKey === 'string' ? req.params.slideKey : '';
  const body = req.body ?? {};
  const userId = typeof body.userId === 'string' ? body.userId : '';
  const content = typeof body.content === 'string' ? body.content : '';

  if (!pitchDeckId || !slideKey) {
    res.status(400).json({ success: false, error: 'pitchDeckId and slideKey are required' });
    return;
  }
  if (!isPitchDeckSlideStudioSlideKey(slideKey)) {
    res.status(400).json({ success: false, error: 'Unsupported slide for studio chat' });
    return;
  }
  if (!userId || !content.trim()) {
    res.status(400).json({ success: false, error: 'userId and content are required' });
    return;
  }

  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Service unavailable' });
    return;
  }

  try {
    const deck = await getPitchDeckById(supabase, pitchDeckId);
    if (!deck) {
      res.status(404).json({ success: false, error: 'Pitch deck not found' });
      return;
    }

    const anthropic = getManagedAnthropicClient();
    await processPitchDeckSlideStudioChat(
      supabase,
      anthropic,
      userId,
      pitchDeckId,
      slideKey,
      content.trim(),
    );

    const latest = await listPitchDeckSlideStudioExchangesForDeckSlide(supabase, pitchDeckId, slideKey, 1);
    const ex = latest[0];
    if (!ex) {
      res.status(500).json({ success: false, error: 'Failed to read exchange after chat' });
      return;
    }

    const [reqRows, resRows] = await Promise.all([
      listPitchDeckSlideStudioRequestsByIds(supabase, [ex.request_id]),
      ex.response_id
        ? listPitchDeckSlideStudioResponsesByIds(supabase, [ex.response_id])
        : Promise.resolve([]),
    ]);
    const userRow = reqRows[0];
    const resRow = ex.response_id ? resRows.find((r) => r.id === ex.response_id) : undefined;
    const structured = (resRow?.structured ?? {}) as Record<string, unknown>;
    const assistantContent =
      typeof structured.content === 'string' && structured.content.trim() ? structured.content : '';

    const turn = turnFromExchangeRow(ex, userRow?.content ?? '', assistantContent);
    console.log('📤 POST pitch-deck-slide-studio message');
    res.status(200).json({ success: true, turn });
  } catch (error) {
    console.error('❌ postMessageHandler', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
};
`);

write('src/services/pitch-deck-slide-studio/routes/index.ts', `export { getLedgerHandler } from './get-ledger-handler';
export { postMessageHandler } from './post-message-handler';
`);

write('src/services/pitch-deck-slide-studio/router.ts', `import { Router } from 'express';
import { getLedgerHandler } from './routes/get-ledger-handler';
import { postMessageHandler } from './routes/post-message-handler';

/**
 * Pitch Deck Slide Studio API — per-deck, per-slide AI coach chat ledger.
 */
export const createPitchDeckSlideStudioRouter = (): Router => {
  const router = Router();
  router.get('/decks/:pitchDeckId/slides/:slideKey/ledger', getLedgerHandler);
  router.post('/decks/:pitchDeckId/slides/:slideKey/messages', postMessageHandler);
  return router;
};
`);

write('src/services/pitch-deck-slide-studio/index.ts', `export { createPitchDeckSlideStudioRouter } from './router';
export { processPitchDeckSlideStudioChat } from './process-pitch-deck-slide-studio-chat';
export { buildPitchDeckSlideStudioLedgerTurns } from './map-pitch-deck-slide-studio-ledger';
export type { PitchDeckSlideStudioSlideKey } from './config';
`);

// ─── 12. Graphics service ────────────────────────────────────────────────────

write('src/services/graphics/schedule-background-graphic-generation.ts', `/**
 * Runs a long-running generation task without blocking the HTTP response.
 */
export const scheduleBackgroundGraphicGeneration = (
  label: string,
  work: () => Promise<void>,
): void => {
  void work().catch((error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(\`❌ \${label} background generation failed:\`, msg);
  });
};
`);

write('src/services/graphics/run-graphics-tsx-generation.ts', `import type { SupabaseClient } from '@supabase/supabase-js';
import { getGraphicById } from '../../data/graphics';
import { patchGraphicGenerationMetadata, patchGraphicStudioDraft } from '../../data/graphics/patch-studio-draft';
import { buildGraphicsTsxPrompt } from '../../utils/graphics';
import { getCursorClient } from '../cursor';
import { extractTsxFromConversation } from '../cursor/extract-tsx-from-conversation';
import { pollAgentStatus } from '../cursor/poll-agent-status';

export type RunGraphicsTsxGenerationInput = {
  graphicId: string;
};

export type RunGraphicsTsxGenerationResult = {
  tsx: string;
  agentId: string;
};

const readCreativeBrief = (metadata: Record<string, unknown>): string => {
  const value = metadata.creativeBrief;
  return typeof value === 'string' ? value.trim() : '';
};

/**
 * Run Cursor agent TSX generation for one graphic and persist the studio draft.
 */
export const runGraphicsTsxGeneration = async (
  supabase: SupabaseClient,
  input: RunGraphicsTsxGenerationInput,
): Promise<RunGraphicsTsxGenerationResult> => {
  if (!process.env.CURSOR_API_KEY?.trim()) {
    throw new Error('CURSOR_API_KEY environment variable is not set');
  }

  const graphicId = input.graphicId.trim();
  const graphic = await getGraphicById(supabase, graphicId);
  if (!graphic) throw new Error('Graphic not found');

  const creativeBrief = readCreativeBrief(graphic.metadata);
  if (!creativeBrief) throw new Error('creativeBrief is required on the graphic metadata');

  const targetRepo = process.env.CURSOR_TARGET_REPO?.trim();
  if (!targetRepo) throw new Error('CURSOR_TARGET_REPO environment variable is not set');

  await patchGraphicGenerationMetadata(supabase, graphicId, {
    generationStatus: 'running',
    generationError: null,
  });

  const cursorClient = getCursorClient();
  const prompt = buildGraphicsTsxPrompt({
    title: graphic.title,
    creativeBrief,
    canvasWidthPx: graphic.canvasWidthPx,
    canvasHeightPx: graphic.canvasHeightPx,
  });

  console.log(\`🚀 Launching Cursor agent for graphic \${graphicId}: \${graphic.title}\`);

  const agent = await cursorClient.launchAgent({
    prompt: { text: prompt },
    source: { repository: targetRepo, ref: 'main' },
    target: { autoCreatePr: false },
  });

  await patchGraphicGenerationMetadata(supabase, graphicId, { cursorAgentId: agent.id });
  await pollAgentStatus(cursorClient, agent.id, agent.runId);

  const tsx = await extractTsxFromConversation(cursorClient, agent.id, agent.runId, {
    expectedComponentName: 'GeneratedGraphic',
  });

  const patched = await patchGraphicStudioDraft(supabase, graphicId, tsx);
  if (!patched) throw new Error(\`Failed to patch studio draft for graphic \${graphicId}\`);

  await patchGraphicGenerationMetadata(supabase, graphicId, {
    generationStatus: 'complete',
    generationError: null,
  });

  console.log(\`✅ Graphics TSX generation complete for \${graphicId}\`);
  return { tsx, agentId: agent.id };
};
`);

write('src/services/graphics/index.ts', `export { scheduleBackgroundGraphicGeneration } from './schedule-background-graphic-generation';
export { runGraphicsTsxGeneration } from './run-graphics-tsx-generation';
export type { RunGraphicsTsxGenerationInput, RunGraphicsTsxGenerationResult } from './run-graphics-tsx-generation';
`);

console.log('✅ pitch-deck-slide-studio + graphics services');
console.log(`\n🎉 Scaffold complete — ${fileCount} files written`);
