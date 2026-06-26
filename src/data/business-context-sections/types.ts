/** Database row shape for business_context_sections. */
export type BusinessContextSectionRow = {
  id: string;
  user_id: string;
  section_key: string;
  label: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BusinessContextSection = {
  id: string;
  userId: string;
  sectionKey: string;
  label: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateBusinessContextSectionInput = {
  userId: string;
  sectionKey: string;
  label: string;
  description?: string | null;
  sortOrder?: number;
};

export type UpdateBusinessContextSectionInput = {
  label?: string;
  description?: string | null;
  sortOrder?: number;
};
