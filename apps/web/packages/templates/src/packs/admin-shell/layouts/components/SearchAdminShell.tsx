"use client";

import { Input } from "@heroui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

type SearchItemBase = { id: string | number };

type ApiKey = "users" | "projects" | "orders"; // добавляй свои ключи сюда

type Fetcher<T> = (query: string, signal: AbortSignal) => Promise<T[]>;

type Props<T> = {
  /** Внешний value (если хочешь контролируемый инпут). Если не передан — будет uncontrolled внутри */
  value?: string;
  /** Коллбек на изменение строки */
  onValueChange?: (value: string) => void;

  /** Минимум символов для запроса */
  minLength?: number;
  /** Дебаунс в мс */
  debounceMs?: number;

  /**
   * Выбор API через ключ (switch-case внутри компонента).
   * Например: api="users" -> GET /api/proxy/users/search?q=...
   */
  api: ApiKey;

  /** Сюда отдаём результат */
  onResults?: (items: T[], query: string) => void;
  /** Ошибки запроса */
  onError?: (error: unknown) => void;

  /** Автозапрос при маунте, если value уже есть и >= minLength */
  immediate?: boolean;

  /** UI кастомизация */
  placeholder?: string;
  className?: string;
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "onClear"
    | "isClearable"
    | "placeholder"
    | "className"
    | "radius"
    | "size"
    | "startContent"
    | "type"
  >;
};

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function buildSearchUrl(api: ApiKey, query: string) {
  // тут один источник правды: куда стучимся в Next API
  // можно менять пути без правок компонента
  const q = encodeURIComponent(query);

  switch (api) {
    case "users":
      return `/api/proxy/users`;
    case "projects":
      return `/api/proxy/projects/search?q=${q}`;
    case "orders":
      return `/api/proxy/orders/search?q=${q}`;
    default: {
      // compile-time сюда не попадём, но оставим на всякий случай
      return `/api/proxy/search?q=${q}`;
    }
  }
}

async function defaultFetcher<T>(api: ApiKey, query: string, signal: AbortSignal): Promise<T[]> {
  const url = buildSearchUrl(api, query);

  const res = await fetch(url, {
    method: "GET",
    signal,
    // если нужно — можно включить куки:
    // credentials: "include",
  });

  if (!res.ok) {
    // можно попробовать прочитать текст для дебага
    const text = await res.text().catch(() => "");
    throw new Error(`Search failed (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}

export function SearchAdminShell<T extends SearchItemBase>({
  value,
  onValueChange,

  minLength = 2,
  debounceMs = 500,

  api,

  onResults,
  onError,

  immediate = true,

  placeholder = "Найти...",
  className = "rounded-full col-span-1 my-1",
  inputProps,
}: Props<T>) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const query = isControlled ? value! : internalValue;

  const debouncedQuery = useDebouncedValue(query.trim(), debounceMs);

  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>("");

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const canSearch = useMemo(() => debouncedQuery.length >= minLength, [debouncedQuery, minLength]);

  useEffect(() => {
    // не делать запрос на маунте, если immediate=false
    if (!immediate && lastQueryRef.current === "" && debouncedQuery === "") return;

    // если меньше minLength — отменяем текущий запрос и очищаем результаты (по желанию)
    if (!canSearch) {
      abortRef.current?.abort();
      abortRef.current = null;
      lastQueryRef.current = debouncedQuery;
      onResults?.([], debouncedQuery);
      return;
    }

    // если строка та же — не дёргаем
    if (lastQueryRef.current === debouncedQuery) return;
    lastQueryRef.current = debouncedQuery;

    // отменяем предыдущий
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    defaultFetcher<T>(api, debouncedQuery, controller.signal)
      .then((items) => {
        if (controller.signal.aborted) return;
        onResults?.(items, debouncedQuery);
      })
      .catch((e) => {
        if ((e as any)?.name === "AbortError") return;
        onError?.(e);
      });

    return () => controller.abort();
  }, [api, debouncedQuery, canSearch, onResults, onError, immediate]);

  return (
    <Input
      isClearable
      className={className}
      placeholder={placeholder}
      radius="full"
      size="lg"
      startContent={<IoSearchOutline className="text-[20px]" />}
      type="text"
      value={query}
      onValueChange={(v: string) => setValue(v)}
      onClear={() => setValue("")}
      {...inputProps}
    />
  );
}
