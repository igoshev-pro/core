import { withProjectId } from "../utils/withProjectId";

export async function getSuperAdmins() {
    const res = await fetch(`/api/core/super-admins${withProjectId()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`searchUsers failed (${res.status}): ${text || res.statusText}`);
    }

    return res.json();
}

export async function getMeSuperAdmin() {
    const res = await fetch(`/api/core/super-admins/get/me${withProjectId()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) return null;

    return res.json();
}