import { withProjectId } from "../utils/withProjectId";

export async function getProjects(limit: any) {
    const res = await fetch(`/api/core/projects${withProjectId()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}