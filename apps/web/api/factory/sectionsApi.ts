import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { FactoryItem, FactoryUpsertDto } from "./types";

const sectionsApi = createCrudApi<FactoryItem, FactoryUpsertDto, FactoryUpsertDto>(
  "/api/factory/sections"
);

export const createSection = (body: FactoryUpsertDto) => sectionsApi.create(body);
export const getSections = (limit?: number, offset?: number) =>
  sectionsApi.list({ limit, offset } satisfies PaginationQuery);
export const getSection = (id: string) => sectionsApi.get(id);
export const updateSection = (id: string, body: FactoryUpsertDto) => sectionsApi.update(id, body);
export const removeSection = (id: string) => sectionsApi.remove(id);