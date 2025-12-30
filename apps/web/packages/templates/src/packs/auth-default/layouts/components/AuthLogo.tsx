"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export const AuthLogo = ({ className = "" }: any) => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Пока компонент не смонтирован, отдаем только "светлую" версию (SSR-safe)
    return <Image alt="logo" height={110} src="/img/system/logo.png" width={319} />;
  }

  return (
    <Image
      className={className}
      alt="logo"
      height={110}
      src={"/img/system/logo.png"}
      width={319}
    />
  );
};
