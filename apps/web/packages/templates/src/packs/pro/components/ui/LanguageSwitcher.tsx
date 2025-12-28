"use client";

import { useRouter } from "next/navigation";
import { useI18nConfig } from "@/lib/i18n/client";
import { cn } from "@heroui/react";
import { setLangAction } from "@/app/api/actions/set-lang";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locales, lang } = useI18nConfig();

  const onChange = async (next: string) => {
    // ✅ ставим cookie НА СЕРВЕРЕ
    await setLangAction(next);

    // ✅ обновляем html для клиентских компонентов сразу
    document.documentElement.lang = next;

    // ✅ теперь refresh точно подтянет новый cookie
    window.location.reload();
  };


  if (locales.length <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {locales.map((l) => (
        <button className={cn("cursor-pointer hover:text-primary", {
            ['text-primary']: lang === l
        })} key={l} type="button" disabled={l === lang} onClick={() => onChange(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
