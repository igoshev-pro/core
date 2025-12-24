import { withProjectId } from "../utils/withProjectId";

export async function getProjects(limit?: number) {
    const query = withProjectId({ limit })

    const res = await fetch(`/api/core/projects${query}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeProject(id: string) {
    const res = await fetch(`/api/core/projects/${id}${withProjectId()}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}