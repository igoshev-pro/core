import { nanoid } from "nanoid";

export function buildUserPhotoPath(params: {
  projectId: string;
  userId: string;
  kind: "avatar" | "photo";
  ext: string; // "jpg" | "png" etc
}) {
  const { projectId, userId, kind, ext } = params;
  const id = nanoid(12);
  return `projects/${projectId}/users/${userId}/${kind}/${id}.${ext}`;
}

export function fileExt(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  // fallback by mime
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "bin";
}
