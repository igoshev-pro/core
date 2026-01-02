import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    // небольшая пауза если есть анимации/ленивая загрузка
    await page.waitForTimeout(300);

    const buffer = await page.screenshot({ type: "png", fullPage: false });

    // @ts-ignore
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
