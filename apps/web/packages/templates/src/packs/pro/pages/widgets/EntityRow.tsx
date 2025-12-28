"use client";

import React, { useMemo } from "react";
import { Button, cn } from "@heroui/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { useT } from "@/lib/i18n/client";

export type EntityRowApiKey =
  | "templates"
  | "themes"
  | "layouts"
  | "pages"
  | "sections"
  | "widgets"
  | "projects";

export type EntityRowColumn<T> = {
  key: string;
  label: React.ReactNode;
  value: (item: T) => React.ReactNode;
  className?: string;
  hidden?: (item: T) => boolean;
};

type RowConfig<T extends Record<string, any>> = {
  title: (item: T) => React.ReactNode;
  subtitle?: (item: T) => React.ReactNode;
  columns: Array<EntityRowColumn<T>>;
};



function isHexColor(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const s = v.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s);
}

function isColorKey(key: string) {
  // под твой кейс (colorPrimary/colorSecondary) + на будущее
  return key === "colorPrimary" || key === "colorSecondary" || key.toLowerCase().startsWith("color");
}

function renderValueWithColorSwatch(key: string, node: React.ReactNode) {
  // value() у тебя возвращает ReactNode; для swatch нам нужен именно string
  const str = typeof node === "string" ? node : null;

  if (!isColorKey(key) || !str || !isHexColor(str)) return node;

  return (
    <div className="flex items-center gap-3 min-w-0 p-1 pl-0 -pb-1">
      <span
        className="inline-block h-3 w-10 rounded-md shadow-sm shrink-0"
        style={{ backgroundColor: str }}
        title={str}
      />
      <span className="text-xs opacity-60 truncate">{str}</span>
    </div>
  );
}

type Props<T extends Record<string, any>> = {
  api: EntityRowApiKey;
  item: T;

  /** grid tuning */
  className?: string;
  columnsClassName?: string;

  /** actions */
  onEdit?: (item: T) => void;
  onRemove?: (item: T) => void;

  /** optional: override/extend columns */
  columnsOverride?: Array<EntityRowColumn<T>> | ((item: T) => Array<EntityRowColumn<T>>);
  columnsExtend?: Array<EntityRowColumn<T>> | ((item: T) => Array<EntityRowColumn<T>>);

  /** optional: custom right block */
  rightSlot?: React.ReactNode;
};

function resolveMaybeFn<TItem, TValue>(
  v: TValue | ((item: TItem) => TValue),
  item: TItem
): TValue {
  return typeof v === "function" ? (v as any)(item) : v;
}

export function EntityRow<T extends Record<string, any>>({
  api,
  item,
  className,
  columnsClassName,
  onEdit,
  onRemove,
  columnsOverride,
  columnsExtend,
  rightSlot,
}: Props<T>) {
  const tc = useT()
  const cfg = useMemo(() => getRowConfig<T>(api), [api]);

  function getRowConfig<T extends Record<string, any>>(api: EntityRowApiKey): RowConfig<T> {
  switch (api) {
    case "templates":
      return {
        title: (i) => (i as any)?.name?.ru ?? (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          { key: "slug", label: "Slug", value: (i) => (i as any)?.slug ?? "—" },
          { key: "mode", label: "Тип", value: (i) => (i as any)?.mode ?? "—" },
          { key: "status", label: "Статус", value: (i) => (i as any)?.status ?? "—" },
        //   { key: "updated", label: "Обновлён", value: (i) => (i as any)?.updatedAt ?? "—" },
        ],
      };

    case "layouts":
      return {
        title: (i) => (i as any)?.name?.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          { key: "layoutKey", label: "Ключ макета", value: (i) => (i as any)?.slug ?? "—" },
          { key: "mode", label: "Тип", value: (i) => (i as any)?.mode ?? "—" },
          { key: "status", label: "Статус", value: (i) => (i as any)?.status ?? "—" },
        ],
      };

    case "themes":
      return {
        title: (i) => (i as any)?.name.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          { key: "colorPrimary", label: "Основной цвет", value: (i) => (i as any)?.colorPrimary ?? "—" },
          { key: "colorSecondary", label: "Второй цвет", value: (i) => (i as any)?.colorSecondary ?? "—" },
          { key: "fontSans", label: "Шрифт", value: (i) => (i as any)?.fontSans ?? "—" },  
        ],
      };

      case "projects":
      return {
        title: (i) => (i as any)?.name.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          { key: "name", label: "Название", value: (i) => tc((i as any)?.name) ?? "—" },
          { key: "owner", label: "Владелец", value: (i) => tc((i as any)?.owner?.name) ?? "—" },
          { key: "status", label: "Статус", value: (i) => (i as any)?.status ?? "—" },
        ],
      };

    case "pages":
      return {
        title: (i) => (i as any)?.name.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          
          { key: "key", label: "Ключ", value: (i) => (i as any)?.key ?? "—" },
          { key: "path", label: "Путь", value: (i) => (i as any)?.path ?? "—" },
          { key: "kind", label: "Дочерний путь", value: (i) => (i as any)?.kind ?? "—" },
        ],
      };

    case "sections":
      return {
        title: (i) => (i as any)?.name.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          { key: "key", label: "Ключ", value: (i) => (i as any)?.key ?? "—" },
          { key: "template", label: "Шаблон", value: (i) => (i as any)?.template?.name ?? "—" },
          { key: "status", label: "Статус", value: (i) => (i as any)?.status ?? "—" },
        ],
      };

    case "widgets":
      return {
        title: (i) => (i as any)?.name.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [
          { key: "key", label: "Ключ", value: (i) => (i as any)?.key ?? "—" },
          { key: "template", label: "Шаблон", value: (i) => (i as any)?.template?.name ?? "—" },
          { key: "status", label: "Статус", value: (i) => (i as any)?.status ?? "—" },
        ],
      };

    default:
      return {
        title: (i) => (i as any)?.name.ru ??  (i as any)?.name ?? "Без имени",
        subtitle: (i) => (i as any)?._id,
        columns: [],
      };
  }
}

  const title = cfg.title(item);
  const subtitle = cfg.subtitle?.(item);

  const columns = useMemo(() => {
    let cols = cfg.columns;

    if (columnsOverride) cols = resolveMaybeFn(columnsOverride, item);
    else if (columnsExtend) cols = [...cols, ...resolveMaybeFn(columnsExtend, item)];

    return cols.filter((c) => !(c.hidden?.(item)));
  }, [cfg.columns, columnsOverride, columnsExtend, item]);

  return (
  <div className={cn("w-full bg-background dark:bg-foreground-50 rounded-2xl shadow-custom-light p-4", className)}>
    <div className="flex flex-row md:items-center gap-9">
      {/* Left */}
      <div className="w-[250px] min-w-0">
        <div className="font-semibold truncate">{title}</div>
        {subtitle ? <div className="text-xs opacity-60 truncate">{subtitle}</div> : null}
      </div>

      {/* Middle */}
      <div className={cn("flex-1 min-w-0 md:border-l md:border-foreground-200 md:pl-4", columnsClassName)}>
        {columns.length > 0 ? (
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {columns.map((c) => (
              <div
                key={c.key}
                className={cn(
                  "flex-1 min-w-[160px]",
                  c.className
                )}
              >
                <div className="text-[10px] uppercase tracking-wide opacity-50 whitespace-nowrap">
                  {c.label}
                </div>
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {renderValueWithColorSwatch(c.key, c.value(item))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs opacity-50">—</div>
        )}
      </div>

      {/* Right */}
      <div className="md:border-l md:border-foreground-200 md:pl-4 flex md:justify-end gap-2">
        {rightSlot ? (
          rightSlot
        ) : (
          <>
            {onEdit && (
              <Button
                className="w-full md:w-auto"
                radius="full"
                variant="light"
                isIconOnly
                onPress={() => onEdit(item)}
              >
                <BiSolidMessageSquareEdit className="text-[18px]" />
              </Button>
            )}
            {onRemove && (
              <Button
                className="w-full md:w-auto"
                radius="full"
                color="danger"
                variant="light"
                isIconOnly
                onPress={() => onRemove(item)}
              >
                <RiDeleteBin5Fill className="text-[18px]" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);

}
