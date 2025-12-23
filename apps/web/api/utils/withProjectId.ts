export function withProjectId(): string {
  if (process.env.NODE_ENV !== "development") return "";
  return `?pid=694900375118e605d8b89551`;
}