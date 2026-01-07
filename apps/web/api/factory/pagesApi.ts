import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { FactoryItem, FactoryUpsertDto } from "./types";

const pagesApi = createCrudApi<FactoryItem, FactoryUpsertDto, FactoryUpsertDto>("/api/factory/pages");

export const createPage = (body: FactoryUpsertDto) => pagesApi.create(body);
export const getPages = (limit?: number, offset?: number) =>
  pagesApi.list({ limit, offset } satisfies PaginationQuery);
export const getPage = (id: string) => pagesApi.get(id);
export const updatePage = (id: string, body: FactoryUpsertDto) => pagesApi.update(id, body);
export const removePage = (id: string) => pagesApi.remove(id);