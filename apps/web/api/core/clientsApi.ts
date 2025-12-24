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