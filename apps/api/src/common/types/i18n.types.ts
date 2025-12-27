export type I18nMap = Record<string, string>;

export function buildI18nText(map: I18nMap | null | undefined): string {
  if (!map) return "";
  return Object.values(map)
    .filter((v) => typeof v === "string" && v.trim().length > 0)
    .join(" ");
}
