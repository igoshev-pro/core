export function withProjectId(): string {
  if (process.env.NODE_ENV !== "development") return "";
  return `?pid=${process.env.CURRENT_DEV_PROJECT_ID}`;
}
