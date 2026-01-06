import { createCrudApi, type PaginationQuery } from "../httpClient";
import type { FactoryItem, FactoryUpsertDto } from "./types";

const widgetsApi = createCrudApi<FactoryItem, FactoryUpsertDto, FactoryUpsertDto>(
  "/api/factory/widgets"
);

export const createWidget = (body: FactoryUpsertDto) => widgetsApi.create(body);
export const getWidgets = (limit?: number, offset?: number) =>
  widgetsApi.list({ limit, offset } satisfies PaginationQuery);
export const getWidget = (id: string) => widgetsApi.get(id);
export const updateWidget = (id: string, body: FactoryUpsertDto) => widgetsApi.update(id, body);
export const removeWidget = (id: string) => widgetsApi.remove(id);