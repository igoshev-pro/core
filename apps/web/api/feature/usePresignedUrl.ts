"use client";

import { useEffect, useMemo, useState } from "react";

type CacheEntry = { url: string; expAt: number };
const cache = new Map<string, CacheEntry>();

async function presignDownload(path: string, expiresInSec: number): Promise<string> {
  const res = await fetch("/api/storage/presign/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ path, expiresInSec }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`Presign download failed: ${res.status} ${text}`);

  const data = text ? (JSON.parse(text) as { url: string }) : { url: "" };
  return data.url;
}

export function usePresignedUrl(path?: string | null, opts?: { expiresInSec?: number }) {
  const expiresInSec = opts?.expiresInSec ?? 300;

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const key = useMemo(() => (path ? String(path) : ""), [path]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!key) {
        setUrl(null);
        return;
      }

      const now = Date.now();
      const cached = cache.get(key);

      // обновляем заранее за 10 сек до истечения
      if (cached && cached.expAt - 10_000 > now) {
        setUrl(cached.url);
        return;
      }

      setLoading(true);
      try {
        const signed = await presignDownload(key, expiresInSec);
        if (cancelled) return;

        cache.set(key, { url: signed, expAt: now + expiresInSec * 1000 });
        setUrl(signed);
      } catch {
        if (!cancelled) setUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [key, expiresInSec]);

  return { url, loading };
}
