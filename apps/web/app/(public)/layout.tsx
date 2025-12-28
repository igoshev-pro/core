import "../../styles/globals.css";
import { Providers } from "../providers";
import { getI18nConfig, getLocale } from "@/lib/i18n/server";

export default async function PublicRootLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getI18nConfig();
  const lang = await getLocale();

  return (
    <html
      suppressHydrationWarning
      lang={lang}
      data-locales={cfg.locales.join(",")}
      data-default-locale={cfg.defaultLocale}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
