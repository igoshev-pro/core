import { apiRequest, createCrudApi, type PaginationQuery } from "../httpClient";
import type { Client, CreateClientDto, UpdateClientDto } from "../types";

const clientsApi = createCrudApi<Client, CreateClientDto, UpdateClientDto>("/api/core/clients");

export async function getMeClient() {
  return apiRequest<Client>({
    path: "/api/core/clients/get/me",
    method: "GET",
  });
}

export const createClient = (body: CreateClientDto) => clientsApi.create(body);
export const getClients = (limit?: number, offset?: number) =>
  clientsApi.list({ limit, offset } satisfies PaginationQuery);
export const getClient = (id: string) => clientsApi.get(id);
export const updateClient = (id: string, body: UpdateClientDto) => clientsApi.update(id, body);
export const removeClient = (id: string) => clientsApi.remove(id);
