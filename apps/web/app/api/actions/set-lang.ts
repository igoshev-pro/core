"use server";

import { cookies } from "next/headers";

export async function setLangAction(lang: string) {
    const c = await cookies()
    c.set("lang", lang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    });
}
