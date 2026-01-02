import { uploadFileToStorage } from "@/api/feature/storageApi";

async function makePageScreenshotAndUpload(params: {
  projectId: string;
  projectEntityId: string; // = project._id
  url: string;
  pageId: string;
}) {
  const res = await fetch(`/api/screenshot?url=${encodeURIComponent(params.url)}`);
  if (!res.ok) throw new Error("screenshot failed");

  const blob = await res.blob();
  const file = new File([blob], `${params.pageId}.png`, { type: "image/png" });

  const path = `projects/${params.projectId}/pages/${params.pageId}/preview/${Date.now()}.png`;

  const uploaded = await uploadFileToStorage({
    projectId: params.projectId,
    file,
    path,
    expiresInSec: 60,
    apiBaseUrl: process.env.CORE_API_URL! || "https://api.igoshev.pro/core",
  });

  if (!uploaded) throw new Error("upload failed");

  return uploaded.path; // это previewPath для page
}
