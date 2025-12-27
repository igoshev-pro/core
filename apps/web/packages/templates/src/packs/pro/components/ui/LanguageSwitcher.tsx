"use client";

import { useRouter } from "next/navigation";
import { useI18nConfig } from "@/lib/i18n/client";

function setLangCookie(lang: string) {
  document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function LanguageSwitcher() {
  const router = useRouter();
  const { locales, lang } = useI18nConfig();

  const onChange = (next: string) => {
    setLangCookie(next);

    // обновляем HTML сразу
    document.documentElement.lang = next;

    // перерендер серверных компонентов на новом языке
    router.refresh();
  };

  if (locales.length <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {locales.map((l) => (
        <button key={l} type="button" disabled={l === lang} onClick={() => onChange(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
