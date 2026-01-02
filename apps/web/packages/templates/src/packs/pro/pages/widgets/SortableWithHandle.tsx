"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type HandleProps = {
  attributes: Record<string, any>;
  listeners?: Record<string, any>; // ✅ может быть undefined
};

type SortableWithHandleProps = {
  id: string;
  className?: string;
  children: (p: { handleProps: { attributes: any; listeners?: any }; isDragging: boolean }) => React.ReactNode;
};

export function SortableWithHandle({ id, className, children }: SortableWithHandleProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({
        handleProps: {
          attributes,
          listeners: listeners ?? undefined, // ✅ явно
        },
        isDragging,
      })}
    </div>
  );
}
