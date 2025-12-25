import { withProjectId } from "../utils/withProjectId";

export async function uploadFileToStorage(input: any) {
    const { file, path, expiresInSec, apiBaseUrl = "" } = input;

    // 1) presign upload
    const presignRes = await fetch(`/api/storage/presign/upload${withProjectId()}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            path,
            contentType: file.type || "application/octet-stream",
            expiresInSec: expiresInSec ?? 60,
        }),
    });

    
    if (!presignRes.ok) {
        const text = await presignRes.text();
        throw new Error(`Presign upload failed: ${presignRes.status} ${text}`);
    }

    const { url } = (await presignRes.json())

    // 2) upload to S3
    const putRes = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
    });

    if (!putRes.ok) {
        const text = await putRes.text();
        throw new Error(`S3 upload failed: ${putRes.status} ${text}`);
    }

    return {
        path,
        contentType: file.type || "application/octet-stream",
        size: file.size,
    };
}

export async function getDownloadUrl(params: {
    path: string;
    expiresInSec?: number;
    apiBaseUrl?: string;
}): Promise<string> {
    const { path, expiresInSec, apiBaseUrl = "" } = params;

    const res = await fetch(`api/storage/presign/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, expiresInSec: expiresInSec ?? 300 }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Presign download failed: ${res.status} ${text}`);
    }

    const data = (await res.json());
    return data.url;
}