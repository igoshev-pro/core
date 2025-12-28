"use client";

import { useEffect, useMemo, useState } from "react";
import { I18nMap, normalizeLocale, pickI18n } from "./core";

export type ClientI18nConfig = {
  locales: string[];
  defaultLocale: string;
  lang: string;
};

function readConfigFromHtml(): ClientI18nConfig {
  const el = document.documentElement;

  const localesRaw = el.dataset.locales ?? "ru";
  const locales = localesRaw
    .split(",")
    .map((s) => normalizeLocale(s))
    .filter(Boolean);

  const defaultLocale = normalizeLocale(el.dataset.defaultLocale) || locales[0] || "ru";
  const lang = normalizeLocale(el.lang) || defaultLocale;

  return { locales: locales.length ? locales : ["ru"], defaultLocale, lang };
}

export function useI18nConfig(): ClientI18nConfig {
  const [cfg, setCfg] = useState<ClientI18nConfig>(() => {
    if (typeof document === "undefined") return { locales: ["ru"], defaultLocale: "ru", lang: "ru" };
    return readConfigFromHtml();
  });

  useEffect(() => {
    const update = () => setCfg(readConfigFromHtml());

    update();

    // отслеживаем изменение lang / data-атрибутов на <html>
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang", "data-locales", "data-default-locale"],
    });

    return () => obs.disconnect();
  }, []);

  return cfg;
}

export function useT() {
  const { lang, defaultLocale } = useI18nConfig();

  return useMemo(
    () => (value: I18nMap | string | null | undefined) => pickI18n(value, lang, defaultLocale),
    [lang, defaultLocale]
  );
}
