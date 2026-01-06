import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { FactoryItem, FactoryUpsertDto } from "./types";

const themesApi = createCrudApi<FactoryItem, FactoryUpsertDto, FactoryUpsertDto>(
  "/api/factory/themes"
);

export const createTheme = (body: FactoryUpsertDto) => themesApi.create(body);
export const getThemes = (limit?: number, offset?: number) =>
  themesApi.list({ limit, offset } satisfies PaginationQuery);
export const getTheme = (id: string) => themesApi.get(id);
export const updateTheme = (id: string, body: FactoryUpsertDto) => themesApi.update(id, body);
export const removeTheme = (id: string) => themesApi.remove(id);