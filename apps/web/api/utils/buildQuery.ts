import { buildQueryString, type QueryParams } from "../httpClient";

export function buildQuery(params?: QueryParams) {
  return buildQueryString(params);
}