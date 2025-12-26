"use client";

import React, { useMemo } from "react";
import { Button, Card, Divider, Image, cn } from "@heroui/react";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { MdNoPhotography } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

/** -----------------------------
 *  Types (dumb mode)
 * ----------------------------- */

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

type EntityCardBaseProps = {
  /** dumb mode: already resolved image url */
  imageUrl?: string | null;
  imageAlt?: string;

  /** shown when no imageUrl */
  placeholder?: React.ReactNode;

  /** rows in the description block */
  rows?: EntityCardRow[];

  /** actions row (buttons) */
  actions?: EntityCardAction[];

  /** optional custom blocks */
  header?: React.ReactNode;
  footer?: React.ReactNode;

  /** styling */
  className?: string;
  imageWrapperClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
};

/** -----------------------------
 *  Smart mode
 * ----------------------------- */

export type EntityCardApiKey =
  | "templates"
  | "themes"
  | "layouts"
  | "pages"
  | "sections"
  | "widgets";

type SmartModeProps<T extends Record<string, any>> = {
  api: EntityCardApiKey;
  item: T;

  /** smart mode actions */
  onEdit?: (item: T) => void;
  onRemove?: (item: T) => void;

  /**
   * allow customizing rows/actions for some cases
   * - extend: adds to default
   * - override: fully replaces default rows/actions
   */
  rowsOverride?: EntityCardRow[] | ((item: T) => EntityCardRow[]);
  rowsExtend?: EntityCardRow[] | ((item: T) => EntityCardRow[]);
  actionsOverride?: EntityCardAction[] | ((item: T) => EntityCardAction[]);
  actionsExtend?: EntityCardAction[] | ((item: T) => EntityCardAction[]);
};

type EntityCardProps<T extends Record<string, any> = Record<string, any>> =
  | (EntityCardBaseProps & { api?: never; item?: never })
  | (Omit<EntityCardBaseProps, "imageUrl" | "rows" | "actions"> & SmartModeProps<T>);

/** -----------------------------
 *  Registry / switch
 * ----------------------------- */

type CardConfig<T extends Record<string, any>> = {
  imagePathKey?: keyof T | string;
  rows: (item: T) => EntityCardRow[];
};

function getCardConfig<T extends Record<string, any>>(
  api: EntityCardApiKey
): CardConfig<T> {
  switch (api) {
    case "layouts":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Mode", value: (item as any)?.mode ?? "—" },
        ],
      };

    case "templates":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Тип", value: (item as any)?.type ?? "—" },
        ],
      };

    case "themes":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Primary", value: (item as any)?.primaryColor ?? "—" },
        ],
      };

    case "pages":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Route", value: (item as any)?.route ?? "—" },
        ],
      };

    case "sections":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Widget", value: (item as any)?.widgetKey ?? "—" },
        ],
      };

    case "widgets":
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
          { label: "Key", value: (item as any)?.key ?? "—" },
        ],
      };

    default:
      // на всякий: базовое поведение
      return {
        imagePathKey: "previewPath",
        rows: (item) => [
          { label: "Название", value: item?.name ?? "—", valueClassName: "font-semibold" },
        ],
      };
  }
}

function resolveMaybeFn<TItem, TValue>(
  v: TValue | ((item: TItem) => TValue),
  item: TItem
): TValue {
  return typeof v === "function" ? (v as any)(item) : v;
}

/** -----------------------------
 *  Component
 * ----------------------------- */

export function EntityCard<T extends Record<string, any> = Record<string, any>>(
  props: EntityCardProps<T>
) {
  // ---------- SMART MODE ----------
  const isSmart = "api" in props && !!props.api && "item" in props && !!props.item;

  const placeholderDefault = (
    <div className="flex flex-col items-center gap-6 text-foreground-500">
      <MdNoPhotography className="text-[36px]" />
      <p className="text-xs">Фото не загружено</p>
    </div>
  );

  const baseClassName = props.className;
  const imageWrapperClassName = props.imageWrapperClassName;
  const contentClassName = props.contentClassName;
  const actionsClassName = props.actionsClassName;

  const header = props.header;
  const footer = props.footer;

  let imageUrl: string | null | undefined = (props as any).imageUrl;
  let rows: EntityCardRow[] = (props as any).rows ?? [];
  let actions: EntityCardAction[] = (props as any).actions ?? [];
  const imageAlt = (props as any).imageAlt ?? "";

  if (isSmart) {
    const { api, item } = props as SmartModeProps<T> & EntityCardBaseProps;

    const cfg = useMemo(() => getCardConfig<T>(api), [api]);

    const imagePathKey = cfg.imagePathKey as string | undefined;
    const imagePath = imagePathKey ? (item?.[imagePathKey] as unknown as string | undefined) : undefined;

    const { url } = usePresignedUrl(imagePath);
    imageUrl = url;

    // default rows
    rows = useMemo(() => cfg.rows(item), [cfg, item]);

    // rows override/extend
    if ((props as any).rowsOverride) {
      rows = resolveMaybeFn((props as any).rowsOverride, item);
    } else if ((props as any).rowsExtend) {
      const ext = resolveMaybeFn((props as any).rowsExtend, item);
      rows = [...rows, ...ext];
    }

    // default actions (если передали обработчики)
    const baseActions: EntityCardAction[] = [
      ...(props.onRemove
        ? [
            {
              key: "delete",
              icon: <RiDeleteBin5Fill className="text-[18px]" />,
              color: "danger",
              variant: "flat",
              onPress: () => props.onRemove?.(item),
            } as EntityCardAction,
          ]
        : []),
      ...(props.onEdit
        ? [
            {
              key: "edit",
              icon: <BiSolidMessageSquareEdit className="text-[20px] min-w-[20px] mx-[2px]" />,
              color: "default",
              variant: "solid",
              onPress: () => props.onEdit?.(item),
            } as EntityCardAction,
          ]
        : []),
    ];

    actions = baseActions;

    // actions override/extend
    if ((props as any).actionsOverride) {
      actions = resolveMaybeFn((props as any).actionsOverride, item);
    } else if ((props as any).actionsExtend) {
      const ext = resolveMaybeFn((props as any).actionsExtend, item);
      actions = [...actions, ...ext];
    }
  }

  const placeholder = (props as any).placeholder ?? placeholderDefault;

  const visibleRows = (rows ?? []).filter((r) => !r.hidden);
  const visibleActions = (actions ?? []).filter((a) => !a.isHidden);

  return (
    <Card className={cn("flex flex-col gap-3 p-3 rounded-4xl", baseClassName)}>
      {header}

      <div
        className={cn(
          "relative w-full aspect-square rounded-[21px] overflow-hidden",
          !imageUrl ? "bg-foreground-100 flex items-center justify-center" : "",
          imageWrapperClassName
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
      </div>

      {visibleRows.length > 0 && (
        <div className={cn("flex flex-col gap-3 p-4 px-4 rounded-[21px]", contentClassName)}>
          {visibleRows.map((row, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <p>{row.label}</p>
                <p className={cn("truncate text-right", row.valueClassName)}>{row.value}</p>
              </div>
              {idx !== visibleRows.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      )}

      {footer}

      {visibleActions.length > 0 && (
        <div className={cn("flex justify-between gap-2", actionsClassName)}>
          {visibleActions.map((a) => (
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
