export type FactoryItem = {
  _id: string;
  name?: string | Record<string, string>;
  slug?: string;
  sortOrder?: number;
  [key: string]: unknown;
};

export type FactoryUpsertDto = Record<string, unknown>;

