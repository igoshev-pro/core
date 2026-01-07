// app/api/core/projects/[id]/site-schema/route.ts

import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const nestUrl = `${process.env.API_URL}/core/projects/${id}/site-schema`;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const h = await headers();
  const projectId = h.get("x-project-id") ?? "";
  const mode = h.get("x-project-mode") ?? "";

  const res = await fetch(nestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(projectId ? { "x-project-id": projectId } : {}),
      ...(mode ? { "x-project-mode": mode } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { message: "Nest API error", status: res.status, details: text },
      { status: 502 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const nestUrl = `${process.env.API_URL}/core/projects/${id}/site-schema`;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const h = await headers();
  const projectId = h.get("x-project-id") ?? "";
  const mode = h.get("x-project-mode") ?? "";

  const body = await req.json();

  const res = await fetch(nestUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(projectId ? { "x-project-id": projectId } : {}),
      ...(mode ? { "x-project-mode": mode } : {}),
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    return NextResponse.json(
      { message: "Nest API error", status: res.status, details: text },
      { status: 502 }
    );
  }

  if (res.status === 204 || !text) {
    return NextResponse.json({ ok: true });
  }

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ ok: true, raw: text });
  }
}
