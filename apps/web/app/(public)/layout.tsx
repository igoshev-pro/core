import React from "react";

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
  // Global public wrapper; keep it light for SEO
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
