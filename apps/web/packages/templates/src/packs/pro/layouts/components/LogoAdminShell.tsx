'use client'

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState, memo } from "react";

export const LogoAdminShell = memo(() => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Используем resolvedTheme для более точного определения темы
  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/img/system/logo.png" 
    : "/img/system/logo-dark.png";

  return (
    <Image
      alt="logo"
      height={52}
      src={logoSrc}
      width={151}
      priority
    />
  );
});

LogoAdminShell.displayName = 'LogoAdminShell';