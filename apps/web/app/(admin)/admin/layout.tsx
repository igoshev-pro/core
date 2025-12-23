import React from "react";
import "../../../styles/globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { withProjectId } from "@/api/utils/withProjectId";

type MeCheckResult =
  | { ok: true; role: "user" | "client" | "superadmin" }
  | { ok: false };

async function checkMe(url: string, token: string) {
  return fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect(`/login${withProjectId()}`);

  // ВАЖНО: убедись что эти env есть именно на сервере (без NEXT_PUBLIC)
  const userUrl = `${process.env.API_URL}/user/get/me`;
  const clientUrl = `${process.env.CORE_API_URL}/clients/get/me`;
  const superAdminUrl = `${process.env.CORE_API_URL}/superadmins/get/me`;

  // Проверяем по очереди, кто это
  const [userRes, clientRes, superRes] = await Promise.allSettled([
    checkMe(userUrl, token),
    checkMe(clientUrl, token),
    checkMe(superAdminUrl, token),
  ]);

  const isOk = (r: PromiseSettledResult<Response>) =>
    r.status === "fulfilled" && r.value.ok;

  const result: MeCheckResult =
    isOk(userRes)
      ? { ok: true, role: "user" }
      : isOk(clientRes)
        ? { ok: true, role: "client" }
        : isOk(superRes)
          ? { ok: true, role: "superadmin" }
          : { ok: false };

  if (!result.ok) {
    // токен не подошёл ни к одному me-эндпоинту — чистим и на логин
    cookieStore.delete("access_token");
    redirect(`/login${withProjectId()}`);
  }

  // (опционально) можно прокинуть роль дальше через контекст/props, если надо
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
