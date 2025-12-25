import { buildQuery } from "../utils/buildQuery";
import { withProjectId } from "../utils/withProjectId";

export async function getProjects(limit?: number, offset?: number) {
    const res = await fetch(`/api/core/projects${buildQuery({ limit, offset })}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeProject(id: string) {
    const res = await fetch(`/api/core/projects/${id}}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}