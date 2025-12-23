import { ProjectMode, ProjectRuntime, SiteSchema } from "@/packages/schema/src/site-schema";


const CORE_API_URL = process.env.CORE_API_URL ?? "https://api.igoshev.pro";
const INTERNAL = process.env.CORE_INTERNAL_TOKEN ?? "";

async function coreFetch<T>(path: string, revalidateSeconds = 60): Promise<T> {
  const url = new URL(path, CORE_API_URL).toString();

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "x-internal-token": INTERNAL,
    },
    next: { revalidate: revalidateSeconds }, // либо cache: "no-store" если хочешь всегда свежак
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CORE API ${res.status} ${path}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function getProjectRuntime(projectId: string, mode: ProjectMode) {
  return coreFetch<ProjectRuntime>(`/core/projects/${projectId}/runtime?mode=${mode}`, 60);
}

export async function getSiteSchema(projectId: string, mode: ProjectMode) {
  return coreFetch<SiteSchema>(`/core/projects/${projectId}/schema?mode=${mode}`, 60);
}
