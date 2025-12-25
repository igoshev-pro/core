import { buildQuery } from "../utils/buildQuery";
import { withProjectId } from "../utils/withProjectId";

export async function getMeClient() {
    const res = await fetch(`/api/core/clients/get/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function createClient(body: any) {
    const res = await fetch(`/api/core/clients`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getClients(limit?: number, offset?: number) {
    const res = await fetch(`/api/core/clients${buildQuery({ limit, offset })}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getClient(id: string) {
    const res = await fetch(`/api/core/clients/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function updateClient(id: string, body: any) {
    const res = await fetch(`/api/core/clients/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeClient(id: string) {
    const res = await fetch(`/api/core/clients/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}