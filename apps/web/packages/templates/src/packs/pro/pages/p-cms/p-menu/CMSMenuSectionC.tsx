"use client";

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { addToast, Button, cn, Input, Select, SelectItem } from "@heroui/react";
import { IoChevronBack } from "react-icons/io5";
import { RiAddLine, RiDeleteBin5Fill, RiDraggable } from "react-icons/ri";

// DnD Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { LoaderModal } from "../../../components/modals/LoaderModal";
import {
  getSiteSchema,
  updateSiteSchema,
  type ProjectSiteSchema,
  type SiteSchemaSection,
  type SiteMenuItem,
  type SitePage,
} from "@/api/core/projectsApi";

// ===================== UI blocks =====================
function Section({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-background rounded-4xl p-4 sm:p-6", className)}>
      {title && (
        <div className="flex flex-col gap-1 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
          {description && <p className="text-sm text-foreground-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ===================== Types =====================
type Mode = "public" | "admin" | "login";

type Props = {
  projectId: string;
};

// ===================== Default values =====================
const DEFAULT_MENU_ITEM: SiteMenuItem = {
  _id: "",
  label: {},
  order: 0,
  linkType: "internal",
  pagePath: "",
  externalUrl: "",
  parentId: undefined,
  icon: "",
  iconSize: "",
};

// ===================== Menu Label Inputs Component =====================
const MenuLabelInputs = memo(function MenuLabelInputs({
  item,
  itemIndex,
  onUpdate,
}: {
  item: SiteMenuItem;
  itemIndex: number;
  onUpdate: (itemIndex: number, field: keyof SiteMenuItem, value: any) => void;
}) {
  const handleRuChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = { ...item.label, ru: e.target.value };
    onUpdate(itemIndex, "label", newLabel);
  }, [item.label, itemIndex, onUpdate]);

  const handleEnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = { ...item.label, en: e.target.value };
    onUpdate(itemIndex, "label", newLabel);
  }, [item.label, itemIndex, onUpdate]);

  const handleDeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = { ...item.label, de: e.target.value };
    onUpdate(itemIndex, "label", newLabel);
  }, [item.label, itemIndex, onUpdate]);

  return (
    <>
      <Input
        label="RU"
        size="sm"
        placeholder="Главная"
        value={item.label?.ru || ""}
        onChange={handleRuChange}
      />
      <Input
        label="EN"
        size="sm"
        placeholder="Home"
        value={item.label?.en || ""}
        onChange={handleEnChange}
      />
      <Input
        label="DE"
        size="sm"
        placeholder="Startseite"
        value={item.label?.de || ""}
        onChange={handleDeChange}
      />
    </>
  );
});

// ===================== Sortable Menu Item =====================
const SortableMenuItem = memo(function SortableMenuItem({
  item,
  itemIndex,
  pages,
  menuItems,
  onUpdate,
  onRemove,
}: {
  item: SiteMenuItem;
  itemIndex: number;
  pages: SitePage[];
  menuItems: SiteMenuItem[];
  onUpdate: (itemIndex: number, field: keyof SiteMenuItem, value: any) => void;
  onRemove: (itemIndex: number) => void;
}) {
  // Используем стабильный id на основе индекса, чтобы не терять фокус при изменении _id
  const stableId = useMemo(() => `menu-item-${itemIndex}`, [itemIndex]);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stableId,
  });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging]);

  // Получаем доступные родители (все пункты меню кроме текущего и его потомков)
  const availableParents = useMemo(() => 
    menuItems.filter((m) => m._id !== item._id && m.parentId !== item._id),
    [menuItems, item._id]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-foreground-200 rounded-3xl p-4",
        isDragging ? "shadow-lg" : ""
      )}
    >
      <div className="flex gap-3 items-start">
        {/* Drag Handle */}
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-1 text-foreground-400 hover:text-foreground-600 touch-none mt-2"
          {...attributes}
          {...listeners}
        >
          <RiDraggable className="text-lg" />
        </button>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* i18n Labels */}
          <div className="lg:col-span-2">
            <p className="text-sm font-medium mb-2">Название (i18n)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MenuLabelInputs
                item={item}
                itemIndex={itemIndex}
                onUpdate={onUpdate}
              />
            </div>
          </div>

          {/* Link Type */}
          <Select
            label="Тип ссылки"
            size="sm"
            selectedKeys={[item.linkType]}
            onChange={(e) => {
              onUpdate(itemIndex, "linkType", e.target.value);
              // Очищаем противоположное поле
              if (e.target.value === "internal") {
                onUpdate(itemIndex, "externalUrl", "");
              } else {
                onUpdate(itemIndex, "pagePath", "");
              }
            }}
          >
            <SelectItem key="internal">Внутренняя</SelectItem>
            <SelectItem key="external">Внешняя</SelectItem>
          </Select>

          {/* Page Path (для внутренней ссылки) */}
          {item.linkType === "internal" && (
            <Select
              label="Страница"
              size="sm"
              selectedKeys={item.pagePath ? [item.pagePath] : []}
              onChange={(e) => onUpdate(itemIndex, "pagePath", e.target.value)}
            >
              {pages.map((page) => (
                <SelectItem key={page.path}>
                  {page.name || page.path}
                </SelectItem>
              ))}
            </Select>
          )}

          {/* External URL (для внешней ссылки) */}
          {item.linkType === "external" && (
            <Input
              label="Внешняя ссылка"
              size="sm"
              placeholder="https://example.com"
              value={item.externalUrl || ""}
              onChange={(e) => onUpdate(itemIndex, "externalUrl", e.target.value)}
            />
          )}

          {/* Parent */}
          <Select
            label="Родитель"
            size="sm"
            selectedKeys={item.parentId ? [item.parentId] : item.parentId === undefined ? ["__none__"] : []}
            onChange={(e) => {
              const value = e.target.value === "__none__" ? undefined : e.target.value;
              onUpdate(itemIndex, "parentId", value);
            }}
          >
            <>
              <SelectItem key="__none__">
                Нет родителя
              </SelectItem>
              {availableParents.map((parent) => (
                <SelectItem key={parent._id}>
                  {parent.label?.ru || parent.label?.en || parent.label?.de || parent._id}
                </SelectItem>
              ))}
            </>
          </Select>

          {/* Order */}
          <Input
            label="Порядок"
            size="sm"
            type="number"
            value={String(item.order || 0)}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10);
              onUpdate(itemIndex, "order", isNaN(num) ? 0 : num);
            }}
          />

          {/* Icon */}
          <Input
            label="Иконка (опционально)"
            size="sm"
            placeholder="icon-name"
            value={item.icon || ""}
            onChange={(e) => onUpdate(itemIndex, "icon", e.target.value || undefined)}
          />

          {/* Icon Size */}
          <Input
            label="Размер иконки (опционально)"
            size="sm"
            placeholder="24px или 1.5rem"
            value={item.iconSize || ""}
            onChange={(e) => onUpdate(itemIndex, "iconSize", e.target.value || undefined)}
          />
        </div>

        <Button
          variant="flat"
          color="danger"
          radius="full"
          isIconOnly
          size="sm"
          onPress={() => onRemove(itemIndex)}
          className="mt-2"
        >
          <RiDeleteBin5Fill />
        </Button>
      </div>
    </div>
  );
});

// ===================== Sortable Menu List =====================
const SortableMenuList = memo(function SortableMenuList({
  items,
  pages,
  onUpdate,
  onRemove,
  onReorder,
  onAdd,
}: {
  items: SiteMenuItem[];
  pages: SitePage[];
  onUpdate: (itemIndex: number, field: keyof SiteMenuItem, value: any) => void;
  onRemove: (itemIndex: number) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onAdd: () => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Используем стабильные id на основе индексов
      const oldIndex = items.findIndex(
        (_, i) => `menu-item-${i}` === active.id
      );
      const newIndex = items.findIndex(
        (_, i) => `menu-item-${i}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  }, [items, onReorder]);

  const itemIds = useMemo(() => 
    items.map((_, i) => `menu-item-${i}`),
    [items.length]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Пункты меню ({items.length})</p>
      </div>

      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {items.map((item, itemIndex) => {
                // Используем стабильный key на основе индекса, чтобы не терять фокус при изменении _id
                const itemKey = `menu-item-${itemIndex}`;
                return (
                  <SortableMenuItem
                    key={itemKey}
                    item={item}
                    itemIndex={itemIndex}
                    pages={pages}
                    menuItems={items}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-sm text-foreground-400 text-center py-4">Нет пунктов меню</p>
      )}

      <Button
        variant="light"
        color="primary"
        radius="full"
        startContent={<RiAddLine />}
        onPress={onAdd}
      >
        Добавить пункт
      </Button>
    </div>
  );
});

// ===================== Main Component =====================
export default function CMSMenuSectionC({ projectId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [schema, setSchema] = useState<ProjectSiteSchema | null>(null);
  const [activeMode, setActiveMode] = useState<Mode>("public");

  // ===================== Load schema =====================
  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    getSiteSchema(projectId)
      .then((data) => {
        setSchema(data);
      })
      .catch((err) => {
        console.error("❌ Load schema error:", err);
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Не удалось загрузить схему сайта",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const currentSection: SiteSchemaSection | undefined = schema?.[activeMode];
  const menuItems: SiteMenuItem[] = currentSection?.menu || [];
  const pages: SitePage[] = currentSection?.pages || [];

  // ===================== Menu handlers =====================
  const updateMenuItem = useCallback((itemIndex: number, field: keyof SiteMenuItem, value: any) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const menu = [...(prev[activeMode].menu || [])];
      menu[itemIndex] = { ...menu[itemIndex], [field]: value };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          menu,
        },
      };
    });
  }, [activeMode]);

  const addMenuItem = useCallback(() => {
    setSchema((prev) => {
      if (!prev) return prev;
      const currentMenu = prev[activeMode].menu || [];
      const newItem: SiteMenuItem = {
        ...DEFAULT_MENU_ITEM,
        _id: `menu-item-${Date.now()}`,
        order: currentMenu.length,
      };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          menu: [...currentMenu, newItem],
        },
      };
    });
  }, [activeMode]);

  const removeMenuItem = useCallback((itemIndex: number) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const menu = (prev[activeMode].menu || []).filter((_, i) => i !== itemIndex);
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          menu,
        },
      };
    });
  }, [activeMode]);

  const reorderMenuItems = useCallback((oldIndex: number, newIndex: number) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const currentMenu = prev[activeMode].menu || [];
      const menu = arrayMove(currentMenu, oldIndex, newIndex);
      // Обновляем order для всех элементов
      const menuWithOrder = menu.map((item, index) => ({
        ...item,
        order: index,
      }));
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          menu: menuWithOrder,
        },
      };
    });
    console.log(`🔄 Reordered menu items: ${oldIndex} -> ${newIndex}`);
  }, [activeMode]);

  // ===================== Save =====================
  const handleSave = async () => {
    if (!schema) return;

    console.log("💾 Saving schema:", schema);
    setSaving(true);

    try {
      const result = await updateSiteSchema(projectId, schema);
      console.log("✅ Schema saved:", result);

      addToast({
        color: "success",
        title: "Успешно!",
        description: "Меню сайта сохранено",
        variant: "solid",
        radius: "lg",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("❌ Save error:", error);
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Не удалось сохранить меню",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // ===================== Render =====================
  return (
    <div className="relative">
      {loading && <LoaderModal />}

      <div className="w-full">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-9">
          <Button isIconOnly radius="full" onPress={() => router.back()}>
            <IoChevronBack className="text-[20px]" />
          </Button>

          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">
              Меню сайта
            </h1>
            <p className="text-xs sm:text-sm text-foreground-500 mt-1">
              Редактирование пунктов меню (перетаскивайте для изменения порядка)
            </p>
          </div>

          <Button
            color="primary"
            size="lg"
            radius="full"
            isLoading={saving}
            onPress={handleSave}
            className="hidden sm:flex"
          >
            Сохранить
          </Button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["public", "admin", "login"] as Mode[]).map((mode) => (
            <Button
              key={mode}
              variant={activeMode === mode ? "solid" : "flat"}
              color={activeMode === mode ? "primary" : "default"}
              radius="full"
              onPress={() => setActiveMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>

        {currentSection && (
          <Section title="Пункты меню" description={`${menuItems.length} пунктов`}>
            <SortableMenuList
              items={menuItems}
              pages={pages}
              onUpdate={updateMenuItem}
              onRemove={removeMenuItem}
              onReorder={reorderMenuItems}
              onAdd={addMenuItem}
            />
          </Section>
        )}

        {/* Empty state */}
        {!loading && !currentSection && (
          <Section>
            <div className="text-center py-12">
              <p className="text-foreground-500 mb-4">
                Схема сайта не найдена для режима "{activeMode}".
              </p>
            </div>
          </Section>
        )}
      </div>

      {/* Mobile save button */}
      <div className="sm:hidden sticky bottom-3 z-20">
        <div className="bg-background shadow-custom rounded-4xl p-4 mt-6">
          <Button
            className="w-full"
            color="primary"
            size="lg"
            radius="full"
            isLoading={saving}
            onPress={handleSave}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}

