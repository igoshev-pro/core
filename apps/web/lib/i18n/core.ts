export type Locale = string;

export type I18nMap = Record<string, string>;

export function pickFromAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((p) => p.trim().slice(0, 2).toLowerCase())
    .filter(Boolean);
}

export function normalizeLocale(v: string | null | undefined): string {
  return (v ?? "").trim().toLowerCase();
}

export function pickI18n(
  value: I18nMap | string | null | undefined,
  lang: Locale,
  fallback: Locale,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  return (
    value[lang] ??
    value[fallback] ??
    Object.values(value).find((s) => typeof s === "string" && s.length > 0) ??
    ""
  );
}
