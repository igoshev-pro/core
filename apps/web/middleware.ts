import { NextRequest, NextResponse } from 'next/server';

const H_PROJECT_ID = 'x-project-id';
const H_PROJECT_MODE = 'x-project-mode';
const H_PROJECT_HOST = 'x-project-host';

const H_LANG = "x-lang";
const H_LOCALES = "x-locales";
const H_DEFAULT_LOCALE = "x-default-locale";

function norm(s: string | null | undefined) {
  return (s ?? "").trim().toLowerCase();
}

function pickFromAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header.split(",").map((p) => p.trim().slice(0, 2).toLowerCase()).filter(Boolean);
}

function getHost(req: NextRequest) {
  const raw = (req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  // strip port if present
  return raw.replace(/:\d+$/, '');
}

function isSkip(pathname: string) {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/_system')) return true; // важно
  if (pathname === '/favicon.ico') return true;
  if (pathname === '/robots.txt') return true;
  if (pathname === '/sitemap.xml') return true;
  if (/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|woff|woff2|ttf|eot)$/i.test(pathname)) return true;
  return false;
}

async function resolveProject(host: string) {
  const base = process.env.CORE_API_URL ?? 'https://api.igoshev.pro';
  const token = process.env.CORE_INTERNAL_TOKEN ?? '';
  if (!token) return null;

  const url = new URL('/core/domains/resolve', base);
  url.searchParams.set('host', host);

  const res = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      'x-internal-token': token,
    },
    // лучше управляемое кеширование
    next: { revalidate: 60 }, // или 300
  });

  if (!res.ok) return null;
  return (await res.json()) as
    | { ok: true; projectId: string; status: string, i18n?: { locales?: string[]; defaultLocale?: string } }
    | { ok: false; code: string };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isSkip(pathname)) return NextResponse.next();

  const host = getHost(req);
  const mode = pathname.startsWith('/admin') ? 'admin' : pathname.startsWith('/login') ? 'login' : 'public';

  // ⬇️ обычный прод-резолв по домену
  const resolved = (await resolveProject(host));

  if (!resolved || resolved.ok === false) {
    const url = req.nextUrl.clone();
    url.pathname = "/_system/not-found";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  const projectLocales = (resolved.i18n?.locales?.map(norm).filter(Boolean) ?? ["ru"]);
  const defaultLocale = norm(resolved.i18n?.defaultLocale) || projectLocales[0] || "ru";

  const cookieLang = norm(req.cookies.get("lang")?.value);
  const acceptLangs = pickFromAcceptLanguage(req.headers.get("accept-language"));

  const chosen =
    (cookieLang && projectLocales.includes(cookieLang) ? cookieLang : "") ||
    (acceptLangs.find((l) => projectLocales.includes(l)) ?? "") ||
    defaultLocale;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(H_PROJECT_ID, resolved.projectId);
  requestHeaders.set(H_PROJECT_MODE, mode);
  requestHeaders.set(H_PROJECT_HOST, host);

  requestHeaders.set(H_LANG, chosen);
  requestHeaders.set(H_LOCALES, projectLocales.join(","));
  requestHeaders.set(H_DEFAULT_LOCALE, defaultLocale);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  res.cookies.set("lang", chosen, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
