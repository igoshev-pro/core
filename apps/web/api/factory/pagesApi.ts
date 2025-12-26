import { buildQuery } from "../utils/buildQuery";

export async function createPage(body: any) {
    const res = await fetch(`/api/factory/pages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getPages(limit?: number, offset?: number) {
    const res = await fetch(`/api/factory/pages${buildQuery({ limit, offset })}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getPage(id: string) {
    const res = await fetch(`/api/factory/pages/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function updatePage(id: string, body: any) {
    const res = await fetch(`/api/factory/pages/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removePage(id: string) {
    const res = await fetch(`/api/factory/pages/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}