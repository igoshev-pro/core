'use client'

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Logo = () => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Пока компонент не смонтирован, отдаем только "светлую" версию (SSR-safe)
    return (
      <Image alt="logo" height={52} src="/img/system/logo-dark.png" width={151} />
    );
  }

  return (
    <Image
      alt="logo"
      height={52}
      src={theme === "dark" ? "/img/system/logo.png" : "/img/system/logo-dark.png"}
      width={151}
    />
  );
};
