type Primitive = string | number | boolean;

export type QueryParams = Record<string, Primitive | null | undefined>;

export type ApiRequestOptions<TBody> = {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: TBody;
  query?: QueryParams;
  throwOnError?: boolean;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
};

export function buildQueryString(query?: QueryParams) {
  if (!query) return "";

  const search = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function apiRequest<TResponse, TBody = unknown>(
  options: ApiRequestOptions<TBody>
): Promise<TResponse | null> {
  const {
    path,
    method = "GET",
    body,
    query,
    throwOnError = false,
    credentials = "include",
    headers,
  } = options;

  const url = `${path}${buildQueryString(query)}`;

  const hasJsonBody = body !== undefined;
  const response = await fetch(url, {
    method,
    credentials,
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    if (throwOnError) {
      throw new Error(`API ${response.status} ${path}: ${text || response.statusText}`);
    }
    return null;
  }

  // 204 No Content или пустой ответ
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as TResponse;
}

export type PaginationQuery = {
  limit?: number;
  offset?: number;
};

export function createCrudApi<TItem, TCreate = Partial<TItem>, TUpdate = Partial<TItem>>(
  basePath: string
) {
  return {
    create: (body: TCreate) =>
      apiRequest<TItem, TCreate>({
        path: basePath,
        method: "POST",
        body,
        includeProjectId,
      }),
    list: (query?: PaginationQuery) =>
      apiRequest<TItem[], PaginationQuery>({
        path: basePath,
        method: "GET",
        query,
        includeProjectId,
      }),
    get: (id: string) =>
      apiRequest<TItem>({
        path: `${basePath}/${id}`,
        method: "GET",
        includeProjectId,
      }),
    update: (id: string, body: TUpdate) =>
      apiRequest<TItem, TUpdate>({
        path: `${basePath}/${id}`,
        method: "PATCH",
        body,
        includeProjectId,
      }),
    remove: (id: string) =>
      apiRequest<TItem>({
        path: `${basePath}/${id}`,
        method: "DELETE",
        includeProjectId,
      }),
  };
}

