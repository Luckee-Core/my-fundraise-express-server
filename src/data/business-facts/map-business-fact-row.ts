import type { BusinessFact, BusinessFactRow } from './types';

/** Maps a database row to API shape. */
export const mapBusinessFactRow = (row: BusinessFactRow): BusinessFact => ({
  id: row.id,
  userId: row.user_id,
  sectionId: row.section_id,
  factKey: row.fact_key,
  factValue: row.fact_value,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
