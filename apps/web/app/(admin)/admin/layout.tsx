import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import "../../../styles/globals.css";
import { Providers } from "@/app/providers";
import MeClient from "./MeClient";
import { loginAction } from "@/app/api/actions/login";
import { logoutAction } from "@/app/api/actions/logout";

async function isCoreAdmin() {
  const h = await headers()
  const host = h.get("host") ?? "";

  return (
    host === "core.igoshev.pro"
  );
}

type Role = "client" | "superAdmin";

type AnyMe = {
  role?: string;
  [key: string]: unknown;
};

type MeResolved =
  | { ok: true; role: Role; raw: AnyMe }
  | { ok: false };

const ROLE_PRIORITY: Role[] = ["superAdmin", "client"];

// маппинг строк с бэка -> Role
function normalizeRole(v: unknown): Role | null {
  if (typeof v !== "string") return null;

  const s = v.toLowerCase();

  if (s === "superadmin" || s === "super_admin" || s === "super-admin") return "superAdmin";
  if (s === "client") return "client";

  return null;
}

async function fetchMe(url: string, token: string): Promise<AnyMe | null> {
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  try {
    return (await res.json()) as AnyMe;
  } catch {
    return null;
  }
}

function extractRole(me: AnyMe): Role | null {
  // пробуем разные поля
  return (
    normalizeRole(me.role) ??
    normalizeRole(me.userRole) ??
    normalizeRole(me.type) ??
    null
  );
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await loginAction()

  if (!token) redirect(`/login`);

  const clientUrl = `${process.env.CORE_API_URL}/clients/get/me`;
  const superAdminUrl = `${process.env.CORE_API_URL}/super-admins/get/me`;

  // получаем все ответы
  const [clientMe, superMe] = await Promise.all([
    fetchMe(clientUrl, token),
    fetchMe(superAdminUrl, token),
  ]);

  // собираем найденные роли
  const candidates: Array<{ role: Role; raw: AnyMe }> = [];

  if (clientMe) {
    const r = extractRole(clientMe) ?? "client";
    candidates.push({ role: r, raw: clientMe });
  }
  if (superMe) {
    const r = extractRole(superMe) ?? "superAdmin";
    candidates.push({ role: r, raw: superMe });
  }

  // выбираем по приоритету
  const chosen = ROLE_PRIORITY
    .map((role) => candidates.find((c) => c.role === role))
    .find(Boolean);

  const result: MeResolved = chosen
    ? { ok: true, role: chosen.role, raw: chosen.raw }
    : { ok: false };

  if (!result.ok) {
    logoutAction()
  }

  // @ts-ignore
  if (await isCoreAdmin() && result.role !== "superAdmin") {
    redirect(`/login`);
  }

  return (
    <html lang="ru" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
     <body className="font-sans"><Providers themeProps={{ attribute: "class", defaultTheme: "light" }}><MeClient me={superMe ?? clientMe}>{children}</MeClient></Providers></body>
    </html>
  );
}
