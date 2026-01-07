import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { FactoryItem, FactoryUpsertDto } from "./types";

const layoutsApi = createCrudApi<FactoryItem, FactoryUpsertDto, FactoryUpsertDto>(
  "/api/factory/layouts"
);

export const createLayout = (body: FactoryUpsertDto) => layoutsApi.create(body);
export const getLayouts = (limit?: number, offset?: number) =>
  layoutsApi.list({ limit, offset } satisfies PaginationQuery);
export const getLayout = (id: string) => layoutsApi.get(id);
export const updateLayout = (id: string, body: FactoryUpsertDto) => layoutsApi.update(id, body);
export const removeLayout = (id: string) => layoutsApi.remove(id);