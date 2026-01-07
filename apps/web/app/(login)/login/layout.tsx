import React from "react";
import { Providers } from "@/app/providers";
import "../../../styles/globals.css";
import { getI18nConfig, getLocale } from "@/lib/i18n/server";


export default async function LoginRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const cfg = await getI18nConfig();
    const lang = await getLocale();
    
  return (
    <html 
      suppressHydrationWarning
      lang={lang}
      data-locales={cfg.locales.join(",")}
      data-default-locale={cfg.defaultLocale}
      className="h-full"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans m-0 p-0 h-full w-full overflow-x-hidden"><Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>{children}</Providers></body>
    </html>
  );
}