import { apiRequest } from "../httpClient";
import type { Client } from "../types";

export async function getSuperAdmins() {
  return apiRequest<Client[]>({
    path: "/api/core/super-admins",
    method: "GET",
    throwOnError: true,
  });
}

export async function getMeSuperAdmin() {
  return apiRequest<Client>({
    path: "/api/core/super-admins/get/me",
    method: "GET",
  });
}