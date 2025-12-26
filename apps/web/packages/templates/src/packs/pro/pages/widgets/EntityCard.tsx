"use client";

import React, { useMemo } from "react";
import { Button, Card, Divider, Image, cn } from "@heroui/react";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { MdNoPhotography } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

export type EntityCardRow = {
  label: React.ReactNode;
  value: React.ReactNode;
  valueClassName?: string;
  hidden?: boolean;
};

export type EntityCardAction = {
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "light" | "flat" | "bordered" | "ghost";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  isIconOnly?: boolean;
  className?: string;
  isDisabled?: boolean;
  isHidden?: boolean;
};

export type EntityCardApiKey =
  | "templates"
  | "themes"
  | "layouts"
  | "pages"
  | "sections"
  | "widgets";

type EntityCardBaseProps = {
  imageUrl?: string | null;
  imageAlt?: string;
  placeholder?: React.ReactNode;
  rows?: EntityCardRow[];
  actions?: EntityCardAction[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  imageWrapperClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
};

type SmartModeProps<T extends Record<string, any>> = {
  api: EntityCardApiKey;
  item: T;
  onEdit?: (item: T) => void;
  onRemove?: (item: T) => void;

  rowsOverride?: EntityCardRow[] | ((item: T) => EntityCardRow[]);
  rowsExtend?: EntityCardRow[] | ((item: T) => EntityCardRow[]);
  actionsOverride?: EntityCardAction[] | ((item: T) => EntityCardAction[]);
  actionsExtend?: EntityCardAction[] | ((item: T) => EntityCardAction[]);
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
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="inline-block h-4 w-10 rounded-md shadow-sm shrink-0"
        style={{ backgroundColor: str }}
        title={str}
      />
      {/* <span className="text-xs opacity-60 truncate">{str}</span> */}
    </div>
  );
}

export type EntityCardProps<T extends Record<string, any> = Record<string, any>> =
  | (EntityCardBaseProps & { api?: never; item?: never })
  | (Omit<EntityCardBaseProps, "imageUrl" | "rows" | "actions"> & SmartModeProps<T>);

type CardConfig<T extends Record<string, any>> = {
  imagePathKey?: keyof T | string;
  rows: (item: T) => EntityCardRow[];
};

function getCardConfig<T extends Record<string, any>>(api: EntityCardApiKey): CardConfig<T> {
  switch (api) {
    case "templates":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Slug", value: (item as any)?.slug ?? "—" },
          { label: "Тип", value: (item as any)?.mode ?? "—" },
          { label: "Статус", value: (item as any)?.status ?? "—" },
        ],
      };

    case "layouts":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Ключ макета", value: (item as any)?.layoutKey ?? "—" },
          { label: "Mode", value: (item as any)?.mode ?? "—" },
          { label: "Тип", value: (item as any)?.type ?? "—" },
          { label: "Статус", value: (item as any)?.status ?? "—" },
        ],
      };

    case "themes":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { key: "", label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
          { key: "slug", label: "Slug", value: (item as any)?.slug ?? "—" },
          { key: "colorPrimary", label: "Основной цвет", value: (item as any)?.colorPrimary ?? "—" },
          { key: "colorSecondary", label: "Второй цвет", value: (item as any)?.colorSecondary ?? "—" },
          { key: "fontSans", label: "Шрифт", value: (item as any)?.fontSans ?? "—" },
          { label: "Статус", value: (item as any)?.status ?? "—" },
        ],
      };

    case "pages":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Ключ", value: (item as any)?.key ?? "—" },
          { label: "Путь", value: (item as any)?.route ?? "—" },
          { label: "Дочерний путь", value: (item as any)?.kind ?? "—" },
          { label: "Статус", value: (item as any)?.status ?? "—" },
        ],
      };

    case "sections":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Ключ", value: (item as any)?.key ?? "—" },
          { label: "Статус", value: (item as any)?.status ?? "—" },
        ],
      };

    case "widgets":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Ключ", value: (item as any)?.key ?? "—" },
          { label: "Статус", value: (item as any)?.status ?? "—" },
        ],
      };

    default:
      // ✅ всегда возвращаем конфиг
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: (item as any)?.name?.ru ?? (item as any)?.name ?? "—", valueClassName: "font-semibold" },
        ],
      };
  }
}

function resolveMaybeFn<TItem, TValue>(v: TValue | ((item: TItem) => TValue), item: TItem): TValue {
  return typeof v === "function" ? (v as any)(item) : v;
}

export function EntityCard<T extends Record<string, any> = Record<string, any>>(props: EntityCardProps<T>) {
  const placeholderDefault = (
    <div className="flex flex-col items-center gap-6 text-foreground-500">
      <MdNoPhotography className="text-[36px]" />
      <p className="text-xs">Фото не загружено</p>
    </div>
  );

  // ✅ "smart" определяется строго по наличию api+item
  const isSmart = (props as any).api != null && (props as any).item != null;

  const api: EntityCardApiKey | null = isSmart ? ((props as any).api as EntityCardApiKey) : null;
  const item: T | null = isSmart ? ((props as any).item as T) : null;

  // ✅ хуки всегда вызываются
  const cfg = useMemo(() => (api ? getCardConfig<T>(api) : null), [api]);

  const imagePathKey = (cfg?.imagePathKey as string | undefined) ?? undefined;
  const imagePath = item && imagePathKey ? ((item as any)?.[imagePathKey] as string | undefined) : undefined;

  const { url: presignedUrl } = usePresignedUrl(imagePath);

  const imageUrl = useMemo(() => {
    if (!isSmart) return (props as any).imageUrl ?? null;
    return presignedUrl ?? null;
  }, [isSmart, presignedUrl, props]);

  const rows = useMemo(() => {
    if (!isSmart) return (props as any).rows ?? [];
    if (!cfg || !item) return [];

    let base = cfg.rows(item);

    const p: any = props;
    if (p.rowsOverride) base = resolveMaybeFn(p.rowsOverride, item);
    else if (p.rowsExtend) base = [...base, ...resolveMaybeFn(p.rowsExtend, item)];

    return base;
  }, [isSmart, cfg, item, props]);

  const actions = useMemo(() => {
    if (!isSmart) return (props as any).actions ?? [];
    if (!item) return [];

    const p: any = props;

    const baseActions: EntityCardAction[] = [
      ...(p.onRemove
        ? [{
          key: "delete",
          icon: <RiDeleteBin5Fill className="text-[18px]" />,
          color: "danger",
          variant: "flat",
          onPress: () => p.onRemove(item),
        } satisfies EntityCardAction]
        : []),
      ...(p.onEdit
        ? [{
          key: "edit",
          icon: <BiSolidMessageSquareEdit className="text-[20px] min-w-[20px] mx-[2px]" />,
          color: "default",
          variant: "solid",
          onPress: () => p.onEdit(item),
        } satisfies EntityCardAction]
        : []),
    ];

    if (p.actionsOverride) return resolveMaybeFn(p.actionsOverride, item);
    if (p.actionsExtend) return [...baseActions, ...resolveMaybeFn(p.actionsExtend, item)];
    return baseActions;
  }, [isSmart, item, props]);

  const placeholder = (props as any).placeholder ?? placeholderDefault;
  const imageAlt = (props as any).imageAlt ?? "";

  const visibleRows = rows.filter((r: any) => !r.hidden);
  const visibleActions = actions.filter((a: any) => !a.isHidden);

  return (
    <Card className={cn("flex flex-col gap-3 p-3 rounded-4xl", props.className)}>
      {props.header}

      {/* ✅ DEBUG: можешь временно оставить, чтобы увидеть, что smart реально включился */}
      {/* <div className="text-[10px] opacity-50">smart={String(isSmart)} api={String(api)} rows={visibleRows.length} actions={visibleActions.length}</div> */}

      {api !== "themes" ? (<div
        className={cn(
          "relative w-full aspect-square rounded-[21px] overflow-hidden",
          !imageUrl ? "bg-foreground-100 flex items-center justify-center" : "",
          props.imageWrapperClassName
        )}
      >
        {imageUrl ? (
          <Image
            alt={imageAlt}
            src={imageUrl}
            radius="none"
            removeWrapper
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          placeholder
        )}
      </div>) : null}

      {visibleRows.length > 0 && (
        <div className={cn("flex flex-col gap-3 p-4 px-4 rounded-[21px]", props.contentClassName)}>
          {visibleRows.map((row: any, idx: number) => (
            <React.Fragment key={idx}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <p>{row.label}</p>
                <div className={cn("truncate text-right", row.valueClassName)}>
                  {row?.key ? renderValueWithColorSwatch(row.key, row.value) : row.value}
                </div>
              </div>
              {idx !== visibleRows.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      )}

      {props.footer}

      {visibleActions.length > 0 && (
        <div className={cn("flex justify-between gap-2", props.actionsClassName)}>
          {visibleActions.map((a: any) => (
            <Button
              key={a.key}
              isIconOnly={a.isIconOnly ?? true}
              color={a.color ?? "default"}
              radius={a.radius ?? "full"}
              size={a.size ?? "md"}
              variant={a.variant ?? "solid"}
              onPress={a.onPress}
              className={a.className}
              isDisabled={a.isDisabled}
            >
              {a.icon}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}
