import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const h: any = headers()
    const projectId = h.get('x-project-id')!;
    const mode = h.get('x-project-mode')!;

    const nestUrl = `${process.env.API_URL}/users`;

    const res = await fetch(nestUrl, {
        method: "GET",
        headers: {
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
