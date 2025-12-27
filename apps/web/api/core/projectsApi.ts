import { buildQuery } from "../utils/buildQuery";

export async function createProject(body: any) {
    const res = await fetch(`/api/core/projects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getProjects(limit?: number, offset?: number) {
    const res = await fetch(`/api/core/projects${buildQuery({ limit, offset })}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getProject(id: string) {
    const res = await fetch(`/api/core/projects/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function updateProject(id: string, body: any) {
    const res = await fetch(`/api/core/projects/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeProject(id: string) {
    const res = await fetch(`/api/core/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}