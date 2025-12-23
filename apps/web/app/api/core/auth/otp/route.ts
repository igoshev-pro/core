import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function POST(req: NextRequest) {
    const nestUrl = `${process.env.CORE_API_URL}/auth/otp`;

    const h: any = headers()
    const projectId = h.get('x-project-id')!;
    const mode = h.get('x-project-mode')!;

    const body = await req.json();

    const res = await fetch(nestUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(projectId ? { "x-project-id": projectId } : {}),
            ...(mode ? { 'x-project-mode': mode } : {})
        },
        cache: "no-store",
        body: JSON.stringify(body)
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
    // return NextResponse.json({ ok: true });
}
