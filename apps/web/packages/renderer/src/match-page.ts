import { PageNode } from "@/packages/schema/src/site-schema";

export type MatchResult = {
  page: PageNode;
  params: Record<string, string>;
};

function normalizePath(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

function split(path: string): string[] {
  const p = normalizePath(path);
  return p === "/" ? [""] : p.split("/");
}

export function matchPage(pages: PageNode[], path: string): MatchResult | null {
  const target = split(path);

  // 1) exact match first (fast path)
  const exact = pages.find((p) => normalizePath(p.path) === normalizePath(path));
  if (exact) return { page: exact, params: {} };

  // 2) dynamic patterns: "/blog/[slug]" => matches "/blog/hello"
  for (const page of pages) {
    const pattern = split(page.path);
    if (pattern.length !== target.length) continue;

    const params: Record<string, string> = {};
    let ok = true;

    for (let i = 0; i < pattern.length; i++) {
      const pat = pattern[i];
      const seg = target[i];

      // skip leading "" root segment
      if (i === 0 && pat === "" && seg === "") continue;

      if (pat.startsWith("[") && pat.endsWith("]")) {
        const key = pat.slice(1, -1);
        params[key] = seg;
        continue;
      }

      if (pat !== seg) {
        ok = false;
        break;
      }
    }

    if (ok) return { page, params };
  }

  return null;
}
