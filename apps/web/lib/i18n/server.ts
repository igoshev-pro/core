import "server-only";
import { headers, cookies } from "next/headers";
import { cache } from "react";
import { I18nMap, normalizeLocale, pickI18n } from "./core";

export const H_LANG = "x-lang";
export const H_LOCALES = "x-locales";
export const H_DEFAULT_LOCALE = "x-default-locale";

export type I18nConfig = {
  locales: string[];
  defaultLocale: string;
};

export const getI18nConfig = cache(async (): Promise<I18nConfig> => {
  const h = await headers();

  const localesRaw = h.get(H_LOCALES) ?? "ru";
  const locales = localesRaw
    .split(",")
    .map((s) => normalizeLocale(s))
    .filter(Boolean);

  const defaultLocale = normalizeLocale(h.get(H_DEFAULT_LOCALE)) || locales[0] || "ru";

  return {
    locales: locales.length ? locales : ["ru"],
    defaultLocale,
  };
});

export const getLocale = cache(async (): Promise<string> => {
  const h = await headers();
  const { locales, defaultLocale } = await getI18nConfig();

  const fromHeader = normalizeLocale(h.get(H_LANG));
  if (fromHeader && locales.includes(fromHeader)) return fromHeader;

  const cookiesStorage = await cookies()
  const fromCookie = normalizeLocale(cookiesStorage.get("lang")?.value);
  if (fromCookie && locales.includes(fromCookie)) return fromCookie;

  return defaultLocale;
});

export async function t(value: I18nMap | string | null | undefined): Promise<string> {
  const { defaultLocale } = await getI18nConfig();
  const lang = await getLocale();
  return pickI18n(value, lang, defaultLocale);
}
