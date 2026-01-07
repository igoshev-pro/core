import { apiRequest } from "../httpClient";

type UploadFileInput = {
  file: File | Blob;
  path: string;
  expiresInSec?: number;
  apiBaseUrl?: string;
  projectId?: string;
};

type PresignUploadResponse = { url: string };

export async function uploadFileToStorage(input: UploadFileInput) {
  const { file, path, expiresInSec, apiBaseUrl = "", projectId } = input;
  const base = apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : "";
  const presignPath = `${base}/api/storage/presign/upload`;

  // 1) presign upload
  const presignRes = await apiRequest<PresignUploadResponse>({
    path: presignPath,
    method: "POST",
    throwOnError: true,
    body: {
      path,
      contentType: (file as File).type || "application/octet-stream",
      expiresInSec: expiresInSec ?? 60,
      ...(projectId ? { projectId } : {}),
    },
  });

  if (!presignRes?.url) {
    throw new Error("Presign upload failed: empty url");
  }

  const url = presignRes.url;

  // 2) upload to S3
  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": (file as File).type || "application/octet-stream",
    },
    body: file,
    credentials: "omit",
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`S3 upload failed: ${putRes.status} ${text}`);
  }

  return {
    path,
    contentType: (file as File).type || "application/octet-stream",
    size: (file as File).size,
  };
}

export async function getDownloadUrl(params: {
  path: string;
  expiresInSec?: number;
}): Promise<string> {
  const { path, expiresInSec = 300 } = params;

  const res = await apiRequest<{ url: string }, { path: string; expiresInSec: number }>({
    path: "/api/storage/presign/download",
    method: "POST",
    body: { path, expiresInSec },
    throwOnError: true,
  });

  if (!res?.url) {
    throw new Error("Presign download failed: empty url");
  }

  return res.url;
}