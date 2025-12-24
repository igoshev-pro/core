import { withProjectId } from "../utils/withProjectId";

export async function getMeClient() {
    const res = await fetch(`/api/core/clients/get/me${withProjectId()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function getClients(limit?: number) {
    const query = withProjectId({ limit })

    const res = await fetch(`/api/core/clients${query}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}

export async function removeClient(id: string) {
    const res = await fetch(`/api/core/clients/${id}${withProjectId()}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}