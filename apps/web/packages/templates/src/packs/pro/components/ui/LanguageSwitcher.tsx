"use client";

import { useRouter } from "next/navigation";
import { useI18nConfig } from "@/lib/i18n/client";
import { cn } from "@heroui/react";
import { setLangAction } from "@/app/api/actions/set-lang";
import { useEffect, useState } from "react";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function LanguageSwitcher() {
  const mounted = useMounted();
  const { locales, lang } = useI18nConfig();

  const onChange = async (next: string) => {
    await setLangAction(next);
    document.documentElement.lang = next;
    window.location.reload();
  };

  // ВАЖНО: на сервере и при первом рендере клиента будет null → гидрация ок
  if (!mounted) return null;
  if (locales.length <= 1) return null;

  return (
    <div className="flex gap-6 md:gap-2 mt-1">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          disabled={l === lang}
          onClick={() => onChange(l)}
          className={cn("cursor-pointer hover:text-primary", {
            "text-primary font-semibold": lang === l,
          })}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}