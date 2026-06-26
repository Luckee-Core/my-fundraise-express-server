import type { BusinessContextSection, BusinessContextSectionRow } from './types';

/** Maps a database row to API shape. */
export const mapBusinessContextSectionRow = (
  row: BusinessContextSectionRow,
): BusinessContextSection => ({
  id: row.id,
  userId: row.user_id,
  sectionKey: row.section_key,
  label: row.label,
  description: row.description,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
