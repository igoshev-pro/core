// export type PresignUploadResponse = {
//   url: string;
//   // если ты возвращаешь ещё что-то — добавь сюда
// };

// export type PresignDownloadResponse = {
//   url: string;
// };

// export type UploadToStorageInput = {
//   projectId: string;           // если у тебя он обязателен через guard — можно не слать, а просто держать для path
//   file: File;
//   path: string;                // S3 key/path который ты хочешь
//   expiresInSec?: number;
//   apiBaseUrl?: string;         // если нужно
// };

// export async function uploadFileToStorage(input: UploadToStorageInput): Promise<{
//   path: string;
//   contentType: string;
//   size: number;
// }> {
//   const { file, path, expiresInSec, apiBaseUrl = "" } = input;

//   // 1) presign upload
//   const presignRes = await fetch(`${apiBaseUrl}/storage/presign/upload`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Project header/auth сюда же, если нужно
//     },
//     body: JSON.stringify({
//       path,
//       contentType: file.type || "application/octet-stream",
//       expiresInSec: expiresInSec ?? 60,
//     }),
//   });

//   if (!presignRes.ok) {
//     const text = await presignRes.text();
//     throw new Error(`Presign upload failed: ${presignRes.status} ${text}`);
//   }

//   const { url } = (await presignRes.json()) as PresignUploadResponse;

//   // 2) upload to S3
//   const putRes = await fetch(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": file.type || "application/octet-stream",
//     },
//     body: file,
//   });

//   if (!putRes.ok) {
//     const text = await putRes.text();
//     throw new Error(`S3 upload failed: ${putRes.status} ${text}`);
//   }

//   return {
//     path,
//     contentType: file.type || "application/octet-stream",
//     size: file.size,
//   };
// }

// export async function getDownloadUrl(params: {
//   path: string;
//   expiresInSec?: number;
//   apiBaseUrl?: string;
// }): Promise<string> {
//   const { path, expiresInSec, apiBaseUrl = "" } = params;

//   const res = await fetch(`${apiBaseUrl}/storage/presign/download`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ path, expiresInSec: expiresInSec ?? 300 }),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Presign download failed: ${res.status} ${text}`);
//   }

//   const data = (await res.json()) as PresignDownloadResponse;
//   return data.url;
// }
