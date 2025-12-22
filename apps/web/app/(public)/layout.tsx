import "../../styles/globals.css";
import { Providers } from "../providers";

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
  // Global public wrapper; keep it light for SEO
  return (
    <html suppressHydrationWarning lang="ru">
      <body>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
