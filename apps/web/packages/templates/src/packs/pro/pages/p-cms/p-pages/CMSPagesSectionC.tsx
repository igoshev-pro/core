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
  type SitePage,
  type SiteBlock,
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
const DEFAULT_PAGE: SitePage = {
  _id: "",
  name: "",
  path: "/",
  kind: "static",
  access: {},
  blocks: [],
};

const DEFAULT_BLOCK: SiteBlock = {
  _id: "",
  type: "widget",
  key: "",
  props: {},
};

// ===================== Page Inputs Component =====================
const PageInputs = memo(function PageInputs({
  page,
  pageIndex,
  updatePage,
}: {
  page: SitePage;
  pageIndex: number;
  updatePage: (pageIndex: number, field: keyof SitePage, value: any) => void;
}) {
  const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageIndex, "_id", e.target.value);
  }, [pageIndex, updatePage]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageIndex, "name", e.target.value);
  }, [pageIndex, updatePage]);

  const handlePathChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageIndex, "path", e.target.value);
  }, [pageIndex, updatePage]);

  const handleKindChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePage(pageIndex, "kind", e.target.value);
  }, [pageIndex, updatePage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <Input
        label="ID"
        size="lg"
        value={page._id}
        onChange={handleIdChange}
      />
      <Input
        label="Name"
        size="lg"
        value={page.name}
        onChange={handleNameChange}
      />
      <Input
        label="Path"
        size="lg"
        value={page.path}
        onChange={handlePathChange}
      />
      <Select
        label="Kind"
        size="lg"
        selectedKeys={[page.kind]}
        onChange={handleKindChange}
      >
        <SelectItem key="static">static</SelectItem>
        <SelectItem key="dynamic">dynamic</SelectItem>
      </Select>
    </div>
  );
});

// ===================== Sortable Block Item =====================
const SortableBlockItem = memo(function SortableBlockItem({
  block,
  pageIndex,
  blockIndex,
  onUpdate,
  onRemove,
}: {
  block: SiteBlock;
  pageIndex: number;
  blockIndex: number;
  onUpdate: (pageIndex: number, blockIndex: number, field: keyof SiteBlock, value: any) => void;
  onRemove: (pageIndex: number, blockIndex: number) => void;
}) {
  // Используем стабильный id на основе индексов, чтобы не терять фокус при изменении _id
  const stableId = useMemo(() => `block-${pageIndex}-${blockIndex}`, [pageIndex, blockIndex]);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stableId,
  });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging]);

  // Мемоизируем обработчики, чтобы не создавать новые функции при каждом рендере
  const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(pageIndex, blockIndex, "_id", e.target.value);
  }, [pageIndex, blockIndex, onUpdate]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(pageIndex, blockIndex, "type", e.target.value);
  }, [pageIndex, blockIndex, onUpdate]);

  const handleKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(pageIndex, blockIndex, "key", e.target.value);
  }, [pageIndex, blockIndex, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(pageIndex, blockIndex);
  }, [pageIndex, blockIndex, onRemove]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex gap-3 items-center bg-background rounded-xl p-3",
        isDragging ? "shadow-lg" : "border-transparent"
      )}
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-foreground-400 hover:text-foreground-600 touch-none"
        {...attributes}
        {...listeners}
      >
        <RiDraggable className="text-lg" />
      </button>

      <Input
        label="ID"
        size="sm"
        className="flex-1"
        value={block._id}
        onChange={handleIdChange}
      />
      <Select
        label="Type"
        size="sm"
        className="w-32"
        selectedKeys={[block.type]}
        onChange={handleTypeChange}
      >
        <SelectItem key="widget">widget</SelectItem>
        <SelectItem key="section">section</SelectItem>
      </Select>
      <Input
        label="Key"
        size="sm"
        className="flex-1"
        value={block.key}
        onChange={handleKeyChange}
      />
      <Button
        variant="flat"
        color="danger"
        radius="full"
        isIconOnly
        size="sm"
        onPress={handleRemove}
      >
        <RiDeleteBin5Fill />
      </Button>
    </div>
  );
});

// ===================== Sortable Blocks List =====================
const SortableBlocksList = memo(function SortableBlocksList({
  blocks,
  pageIndex,
  onUpdate,
  onRemove,
  onReorder,
  onAdd,
}: {
  blocks: SiteBlock[];
  pageIndex: number;
  onUpdate: (pageIndex: number, blockIndex: number, field: keyof SiteBlock, value: any) => void;
  onRemove: (pageIndex: number, blockIndex: number) => void;
  onReorder: (pageIndex: number, oldIndex: number, newIndex: number) => void;
  onAdd: (pageIndex: number) => void;
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
      const oldIndex = blocks.findIndex(
        (_, i) => `block-${pageIndex}-${i}` === active.id
      );
      const newIndex = blocks.findIndex(
        (_, i) => `block-${pageIndex}-${i}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(pageIndex, oldIndex, newIndex);
      }
    }
  }, [blocks, pageIndex, onReorder]);

  const blockIds = useMemo(() => 
    blocks.map((_, i) => `block-${pageIndex}-${i}`),
    [blocks.length, pageIndex]
  );

  return (
    <div className="bg-foreground-50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">Blocks ({blocks.length})</p>
        <Button
          size="sm"
          variant="light"
          color="primary"
          radius="full"
          startContent={<RiAddLine />}
          onPress={() => onAdd(pageIndex)}
        >
          Добавить блок
        </Button>
      </div>

      {blocks.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {blocks.map((block, blockIndex) => {
                // Используем стабильный key на основе индексов, чтобы не терять фокус при изменении _id
                const blockKey = `block-${pageIndex}-${blockIndex}`;
                return (
                  <SortableBlockItem
                    key={blockKey}
                    block={block}
                    pageIndex={pageIndex}
                    blockIndex={blockIndex}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-sm text-foreground-400 text-center py-4">Нет блоков</p>
      )}
    </div>
  );
});

// ===================== Main Component =====================
export default function ProjectSiteSchemaEditPage({ projectId }: Props) {
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

  // ===================== Layout handlers =====================
  const updateLayout = useCallback((field: string, value: string) => {
    setSchema((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          layout: {
            ...prev[activeMode].layout,
            [field]: value,
          },
        },
      };
    });
  }, [activeMode]);

  // ===================== Page handlers =====================
  const updatePage = useCallback((pageIndex: number, field: keyof SitePage, value: any) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const pages = [...prev[activeMode].pages];
      pages[pageIndex] = { ...pages[pageIndex], [field]: value };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages,
        },
      };
    });
  }, [activeMode]);

  const addPage = useCallback(() => {
    setSchema((prev) => {
      if (!prev) return prev;
      const newPage: SitePage = {
        ...DEFAULT_PAGE,
        _id: `page-${Date.now()}`,
        name: "New Page",
      };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages: [...prev[activeMode].pages, newPage],
        },
      };
    });
  }, [activeMode]);

  const removePage = useCallback((pageIndex: number) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const pages = prev[activeMode].pages.filter((_, i) => i !== pageIndex);
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages,
        },
      };
    });
  }, [activeMode]);

  // ===================== Block handlers =====================
  const updateBlock = useCallback((
    pageIndex: number,
    blockIndex: number,
    field: keyof SiteBlock,
    value: any
  ) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const pages = [...prev[activeMode].pages];
      const blocks = [...pages[pageIndex].blocks];
      blocks[blockIndex] = { ...blocks[blockIndex], [field]: value };
      pages[pageIndex] = { ...pages[pageIndex], blocks };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages,
        },
      };
    });
  }, [activeMode]);

  const addBlock = useCallback((pageIndex: number) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const pages = [...prev[activeMode].pages];
      const newBlock: SiteBlock = {
        ...DEFAULT_BLOCK,
        _id: `block-${Date.now()}`,
      };
      pages[pageIndex] = {
        ...pages[pageIndex],
        blocks: [...pages[pageIndex].blocks, newBlock],
      };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages,
        },
      };
    });
  }, [activeMode]);

  const removeBlock = useCallback((pageIndex: number, blockIndex: number) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const pages = [...prev[activeMode].pages];
      const blocks = pages[pageIndex].blocks.filter((_, i) => i !== blockIndex);
      pages[pageIndex] = { ...pages[pageIndex], blocks };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages,
        },
      };
    });
  }, [activeMode]);

  // ===================== Reorder blocks (DnD) =====================
  const reorderBlocks = useCallback((pageIndex: number, oldIndex: number, newIndex: number) => {
    setSchema((prev) => {
      if (!prev) return prev;
      const pages = [...prev[activeMode].pages];
      const blocks = arrayMove(pages[pageIndex].blocks, oldIndex, newIndex);
      pages[pageIndex] = { ...pages[pageIndex], blocks };
      return {
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          pages,
        },
      };
    });
    console.log(`🔄 Reordered blocks in page ${pageIndex}: ${oldIndex} -> ${newIndex}`);
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
        description: "Схема сайта сохранена",
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
        description: "Не удалось сохранить схему",
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
              Схема сайта
            </h1>
            <p className="text-xs sm:text-sm text-foreground-500 mt-1">
              Редактирование layout, pages и blocks (перетаскивайте блоки для изменения порядка)
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
          <div className="flex flex-col gap-6">
            {/* Layout */}
            <Section title="Layout">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Input
                  label="ID"
                  size="lg"
                  value={currentSection.layout._id}
                  onChange={(e) => updateLayout("_id", e.target.value)}
                />
                <Input
                  label="Type"
                  size="lg"
                  value={currentSection.layout.type}
                  onChange={(e) => updateLayout("type", e.target.value)}
                />
                <Input
                  label="Layout Key"
                  size="lg"
                  value={currentSection.layout.layoutKey}
                  onChange={(e) => updateLayout("layoutKey", e.target.value)}
                />
              </div>
            </Section>

            {/* Pages */}
            <Section title="Pages" description={`${currentSection.pages.length} страниц`}>
              <div className="flex flex-col gap-6">
                {currentSection.pages.map((page, pageIndex) => {
                  // Используем стабильный key на основе индекса, чтобы не терять фокус при изменении _id
                  const pageKey = `page-${activeMode}-${pageIndex}`;
                  return (
                  <div
                    key={pageKey}
                    className="border border-foreground-200 rounded-3xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">
                        Страница #{pageIndex + 1}: {page.name || "(без названия)"}
                      </h3>
                      <Button
                        variant="flat"
                        color="danger"
                        radius="full"
                        isIconOnly
                        size="sm"
                        onPress={() => removePage(pageIndex)}
                      >
                        <RiDeleteBin5Fill />
                      </Button>
                    </div>

                    <PageInputs
                      page={page}
                      pageIndex={pageIndex}
                      updatePage={updatePage}
                    />

                    {/* Blocks with DnD */}
                    <SortableBlocksList
                      blocks={page.blocks}
                      pageIndex={pageIndex}
                      onUpdate={updateBlock}
                      onRemove={removeBlock}
                      onReorder={reorderBlocks}
                      onAdd={addBlock}
                    />
                  </div>
                  );
                })}

                <Button
                  variant="light"
                  color="primary"
                  radius="full"
                  startContent={<RiAddLine />}
                  onPress={addPage}
                >
                  Добавить страницу
                </Button>
              </div>
            </Section>
          </div>
        )}

        {/* Empty state */}
        {!loading && !currentSection && (
          <Section>
            <div className="text-center py-12">
              <p className="text-foreground-500 mb-4">
                Схема сайта не найдена для режима "{activeMode}".
              </p>
              <Button
                color="primary"
                radius="full"
                onPress={() => {
                  if (!schema) {
                    // Create default schema
                    setSchema({
                      public: {
                        version: "1.0.0",
                        layout: { _id: "l-public", type: "layout", layoutKey: "public.default" },
                        pages: [],
                      },
                      admin: {
                        version: "1.0.0",
                        layout: { _id: "l-admin", type: "layout", layoutKey: "admin.shell" },
                        pages: [],
                      },
                      login: {
                        version: "1.0.0",
                        layout: { _id: "l-login", type: "layout", layoutKey: "auth.default" },
                        pages: [],
                      },
                    });
                  }
                }}
              >
                Создать схему
              </Button>
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
