/** Database row shape for business_facts. */
export type BusinessFactRow = {
  id: string;
  user_id: string;
  section_id: string;
  fact_key: string;
  fact_value: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BusinessFact = {
  id: string;
  userId: string;
  sectionId: string;
  factKey: string;
  factValue: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type UpsertBusinessFactInput = {
  userId: string;
  sectionId: string;
  factKey: string;
  factValue: string;
  sortOrder?: number;
};

export type BulkUpsertBusinessFactInput = {
  userId: string;
  facts: Array<{
    sectionKey: string;
    factKey: string;
    factValue: string;
    sortOrder?: number;
  }>;
};
