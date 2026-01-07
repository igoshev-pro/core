import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { FactoryItem, FactoryUpsertDto } from "./types";

const templatesApi = createCrudApi<FactoryItem, FactoryUpsertDto, FactoryUpsertDto>(
  "/api/factory/templates"
);

export const createTemplate = (body: FactoryUpsertDto) => templatesApi.create(body);
export const getTemplates = (limit?: number, offset?: number) =>
  templatesApi.list({ limit, offset } satisfies PaginationQuery);
export const getTemplate = (id: string) => templatesApi.get(id);
export const updateTemplate = (id: string, body: FactoryUpsertDto) =>
  templatesApi.update(id, body);
export const removeTemplate = (id: string) => templatesApi.remove(id);