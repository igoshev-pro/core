import { buildQuery } from "../utils/buildQuery";

export async function createTemplate(body: any) {
    const res = await fetch(`/api/factory/templates`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getTemplates(limit?: number, offset?: number) {
    const res = await fetch(`/api/factory/templates${buildQuery({ limit, offset })}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getTemplate(id: string) {
    const res = await fetch(`/api/factory/templates/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function updateTemplate(id: string, body: any) {
    const res = await fetch(`/api/factory/templates/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeTemplate(id: string) {
    const res = await fetch(`/api/factory/templates/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}