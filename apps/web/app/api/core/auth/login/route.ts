import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function POST(req: NextRequest) {
  const nestUrl = `${process.env.CORE_API_URL}/auth/login`;

  const h: any = headers();
  const projectId = h.get("x-project-id");
  const mode = h.get("x-project-mode");

  const body = (await req.json()) as { email: string; otp: string };

  const res = await fetch(nestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(projectId ? { "x-project-id": projectId } : {}),
      ...(mode ? { "x-project-mode": mode } : {}),
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      { message: "Nest API error", status: res.status, details: text },
      { status: 502 }
    );
  }

  const data = JSON.parse(text) as { accessToken: string };

  // ✅ HttpOnly cookie (клиентский JS не видит)
  const cookieStore = await cookies();
  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // maxAge: 60 * 60, // например 1 час (по желанию)
  });

  // Важно: не возвращай accessToken клиенту, если хочешь "совсем безопасно"
  return NextResponse.json({ ok: true });
}