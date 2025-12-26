import { buildQuery } from "../utils/buildQuery";

export async function createWidget(body: any) {
    const res = await fetch(`/api/factory/widgets`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getWidgets(limit?: number, offset?: number) {
    const res = await fetch(`/api/factory/widgets${buildQuery({ limit, offset })}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getWidget(id: string) {
    const res = await fetch(`/api/factory/widgets/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function updateWidget(id: string, body: any) {
    const res = await fetch(`/api/factory/widgets/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeWidget(id: string) {
    const res = await fetch(`/api/factory/widgets/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}