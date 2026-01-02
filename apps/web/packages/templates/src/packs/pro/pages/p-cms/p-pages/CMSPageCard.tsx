"use client";

import React from "react";
import { Button, cn, Image } from "@heroui/react";
import { MdNoPhotography, MdDragIndicator } from "react-icons/md";

export type SiteModuleKey = "public" | "admin" | "login";

export type ProjectPage = {
  _id: string;
  path: string;
  kind: "static" | "dynamic" | string;
  blocks?: any[];
  // опционально: сортировка внутри модуля
  sortOrder?: number;
  [k: string]: any;
};

export function CMSPageCard({
  page,
  projectPreviewUrl,
  onEdit,
  handleProps,
}: {
  page: ProjectPage;
  projectPreviewUrl?: string | null;
  onEdit: (p: ProjectPage) => void;
  handleProps: { attributes: any; listeners?: any };
}) {
  return (
    <div className="bg-background rounded-4xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base sm:text-lg font-semibold truncate">{page.path}</p>
          <p className="text-xs text-foreground-500 mt-0.5 truncate">
            {page.kind} • id: <span className="font-mono">{page._id}</span>
          </p>
        </div>

        {/* ✅ Drag handle ONLY */}
        <Button
          isIconOnly
          radius="full"
          variant="flat"
          className={cn("shrink-0", "touch-none")}
          {...handleProps.attributes}
          {...(handleProps.listeners ?? {})}   // ✅
        >
          <MdDragIndicator className="text-[20px]" />
        </Button>
      </div>

      <div className="mt-4">
        <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden">
          <div
            className={cn("absolute inset-0", {
              ["bg-foreground-100 flex items-center justify-center"]: !projectPreviewUrl,
            })}
          >
            {projectPreviewUrl ? (
              <Image
                alt={page.path}
                src={projectPreviewUrl}
                radius="none"
                removeWrapper
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="flex flex-col gap-2 items-center justify-center text-foreground-500">
                <MdNoPhotography className="text-[28px] sm:text-[34px]" />
                <p className="text-[11px] sm:text-xs">Нет превью</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button color="primary" radius="full" onPress={() => onEdit(page)}>
          Редактировать
        </Button>
      </div>
    </div>
  );
}
