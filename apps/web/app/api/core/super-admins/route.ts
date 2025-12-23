import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET(req: NextRequest) {
    const nestUrl = `${process.env.CORE_API_URL}/super-admins`;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const h: any = headers()
    const projectId = h.get('x-project-id')!;
    const mode = h.get('x-project-mode')!;

    const res = await fetch(nestUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(projectId ? { "x-project-id": projectId } : {}),
            ...(mode ? { 'x-project-mode': mode } : {})
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
