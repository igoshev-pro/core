"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addToast, Button, cn, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { IoChevronBack } from "react-icons/io5";
import { RiAddLine, RiDeleteBin5Fill } from "react-icons/ri";

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

// ===================== Component =====================
export default function ProjectSiteSchemaEditPage({ projectId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [schema, setSchema] = useState<ProjectSiteSchema | null>(null);
  const [activeMode, setActiveMode] = useState<Mode>("public");

  // Load schema
  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    getSiteSchema(projectId)
      .then((data) => setSchema(data))
      .catch(() => {
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Не удалось загрузить схему сайта",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
        });
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const currentSection: SiteSchemaSection | undefined = schema?.[activeMode];

  // ===================== Handlers =====================
  const updateLayout = (field: string, value: string) => {
    if (!schema) return;
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        layout: {
          ...schema[activeMode].layout,
          [field]: value,
        },
      },
    });
  };

  const updatePage = (pageIndex: number, field: keyof SitePage, value: any) => {
    if (!schema) return;
    const pages = [...schema[activeMode].pages];
    pages[pageIndex] = { ...pages[pageIndex], [field]: value };
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        pages,
      },
    });
  };

  const addPage = () => {
    if (!schema) return;
    const newPage: SitePage = {
      ...DEFAULT_PAGE,
      _id: `page-${Date.now()}`,
      name: "New Page",
    };
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        pages: [...schema[activeMode].pages, newPage],
      },
    });
  };

  const removePage = (pageIndex: number) => {
    if (!schema) return;
    const pages = schema[activeMode].pages.filter((_, i) => i !== pageIndex);
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        pages,
      },
    });
  };

  const updateBlock = (pageIndex: number, blockIndex: number, field: keyof SiteBlock, value: any) => {
    if (!schema) return;
    const pages = [...schema[activeMode].pages];
    const blocks = [...pages[pageIndex].blocks];
    blocks[blockIndex] = { ...blocks[blockIndex], [field]: value };
    pages[pageIndex] = { ...pages[pageIndex], blocks };
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        pages,
      },
    });
  };

  const addBlock = (pageIndex: number) => {
    if (!schema) return;
    const pages = [...schema[activeMode].pages];
    const newBlock: SiteBlock = {
      ...DEFAULT_BLOCK,
      _id: `block-${Date.now()}`,
    };
    pages[pageIndex] = {
      ...pages[pageIndex],
      blocks: [...pages[pageIndex].blocks, newBlock],
    };
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        pages,
      },
    });
  };

  const removeBlock = (pageIndex: number, blockIndex: number) => {
    if (!schema) return;
    const pages = [...schema[activeMode].pages];
    const blocks = pages[pageIndex].blocks.filter((_, i) => i !== blockIndex);
    pages[pageIndex] = { ...pages[pageIndex], blocks };
    setSchema({
      ...schema,
      [activeMode]: {
        ...schema[activeMode],
        pages,
      },
    });
  };

  // ===================== Save =====================
  const handleSave = async () => {
    if (!schema) return;

    setSaving(true);
    try {
      await updateSiteSchema(projectId, schema);
      addToast({
        color: "success",
        title: "Успешно!",
        description: "Схема сайта сохранена",
        variant: "solid",
        radius: "lg",
        timeout: 2500,
      });
    } catch {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Не удалось сохранить схему",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
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
              Редактирование layout, pages и blocks
            </p>
          </div>

          <Button
            color="primary"
            size="lg"
            radius="full"
            isLoading={saving}
            onPress={handleSave}
          >
            Сохранить
          </Button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
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
                  value={currentSection.layout._id}
                  onChange={(e) => updateLayout("_id", e.target.value)}
                />
                <Input
                  label="Type"
                  value={currentSection.layout.type}
                  onChange={(e) => updateLayout("type", e.target.value)}
                />
                <Input
                  label="Layout Key"
                  value={currentSection.layout.layoutKey}
                  onChange={(e) => updateLayout("layoutKey", e.target.value)}
                />
              </div>
            </Section>

            {/* Pages */}
            <Section
              title="Pages"
              description={`${currentSection.pages.length} страниц`}
            >
              <div className="flex flex-col gap-6">
                {currentSection.pages.map((page, pageIndex) => (
                  <div
                    key={page._id || pageIndex}
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

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                      <Input
                        label="ID"
                        size="sm"
                        value={page._id}
                        onChange={(e) => updatePage(pageIndex, "_id", e.target.value)}
                      />
                      <Input
                        label="Name"
                        size="sm"
                        value={page.name}
                        onChange={(e) => updatePage(pageIndex, "name", e.target.value)}
                      />
                      <Input
                        label="Path"
                        size="sm"
                        value={page.path}
                        onChange={(e) => updatePage(pageIndex, "path", e.target.value)}
                      />
                      <Select
                        label="Kind"
                        size="sm"
                        selectedKeys={[page.kind]}
                        onChange={(e) => updatePage(pageIndex, "kind", e.target.value)}
                      >
                        <SelectItem key="static">static</SelectItem>
                        <SelectItem key="dynamic">dynamic</SelectItem>
                      </Select>
                    </div>

                    {/* Blocks */}
                    <div className="bg-foreground-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">
                          Blocks ({page.blocks.length})
                        </p>
                        <Button
                          size="sm"
                          variant="light"
                          color="primary"
                          radius="full"
                          startContent={<RiAddLine />}
                          onPress={() => addBlock(pageIndex)}
                        >
                          Добавить блок
                        </Button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {page.blocks.map((block, blockIndex) => (
                          <div
                            key={block._id || blockIndex}
                            className="flex gap-3 items-center bg-background rounded-xl p-3"
                          >
                            <Input
                              label="ID"
                              size="sm"
                              className="flex-1"
                              value={block._id}
                              onChange={(e) =>
                                updateBlock(pageIndex, blockIndex, "_id", e.target.value)
                              }
                            />
                            <Select
                              label="Type"
                              size="sm"
                              className="w-32"
                              selectedKeys={[block.type]}
                              onChange={(e) =>
                                updateBlock(pageIndex, blockIndex, "type", e.target.value)
                              }
                            >
                              <SelectItem key="widget">widget</SelectItem>
                              <SelectItem key="section">section</SelectItem>
                            </Select>
                            <Input
                              label="Key"
                              size="sm"
                              className="flex-1"
                              value={block.key}
                              onChange={(e) =>
                                updateBlock(pageIndex, blockIndex, "key", e.target.value)
                              }
                            />
                            <Button
                              variant="flat"
                              color="danger"
                              radius="full"
                              isIconOnly
                              size="sm"
                              onPress={() => removeBlock(pageIndex, blockIndex)}
                            >
                              <RiDeleteBin5Fill />
                            </Button>
                          </div>
                        ))}

                        {page.blocks.length === 0 && (
                          <p className="text-sm text-foreground-400 text-center py-4">
                            Нет блоков
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="flat"
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
      </div>
    </div>
  );
}

// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { addToast, Button, Tabs, Tab, cn } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import {
//   DndContext,
//   DragEndEvent,
//   PointerSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   closestCenter,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
//   rectSortingStrategy,
// } from "@dnd-kit/sortable";

// import { CMSPageCard, ProjectPage, SiteModuleKey } from "./CMSPageCard";

// import { getProject, updateProject } from "@/api/core/projectsApi";
// import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
// import { LoaderModal } from "../../../components/modals/LoaderModal";
// import { SortableWithHandle } from "../../widgets/SortableWithHandle";

// const ORDER_STEP = 1000;

// type ProjectSiteModule = {
//   version?: string;
//   layout?: any;
//   pages?: ProjectPage[];
//   [k: string]: any;
// };

// type ProjectEntity = {
//   _id: string;
//   previewPath?: string;
//   site?: Partial<Record<SiteModuleKey, ProjectSiteModule>> & Record<string, any>;
//   [k: string]: any;
// };

// const MODULES: { key: SiteModuleKey; label: string }[] = [
//   { key: "public", label: "Public" },
//   { key: "admin", label: "Admin" },
//   { key: "login", label: "Login" }
// ];

// function getPagesForModule(project: ProjectEntity | null, moduleKey: SiteModuleKey): ProjectPage[] {
//   const pages = (project?.site?.[moduleKey]?.pages ?? []) as ProjectPage[];
//   // если sortOrder не задан — стабильно пронумеруем по порядку массива
//   return pages.map((p, i) => ({
//     ...p,
//     sortOrder: p.sortOrder ?? (i + 1) * ORDER_STEP,
//   }));
// }

// function applySortOrders(pages: ProjectPage[]) {
//   return pages.map((p, idx) => ({
//     ...p,
//     sortOrder: (idx + 1) * ORDER_STEP,
//   }));
// }

// export default function CMSPagesSectionC({ projectId }: { projectId: string }) {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [project, setProject] = useState<ProjectEntity | null>(null);

//   const [activeModule, setActiveModule] = useState<SiteModuleKey>("public");

//   // локальный список страниц текущего таба (чтобы DnD был мгновенный)
//   const [pages, setPages] = useState<ProjectPage[]>([]);

//   // project preview (одна картинка на все карточки, как в примере)
//   const { url: projectPreviewUrl } = usePresignedUrl(project?.previewPath);

//   // DnD sensors: на мобиле лучше TouchSensor + маленькая задержка, но у нас handle touch-none -> норм
//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
//   );

//   // ===== load project =====
//   useEffect(() => {
//     if (!projectId) return;

//     setLoading(true);
//     getProject(projectId)
//       .then((res: any) => {
//         setProject(res as ProjectEntity);
//       })
//       .catch(() => {
//         addToast({
//           color: "danger",
//           title: "Ошибка!",
//           description: "Не удалось загрузить проект",
//           variant: "solid",
//           radius: "lg",
//           timeout: 3000,
//           shouldShowTimeoutProgress: true,
//         });
//       })
//       .finally(() => setLoading(false));
//   }, [projectId]);

//   // ===== whenever module or project changes -> reset pages list =====
//   useEffect(() => {
//     setPages(getPagesForModule(project, activeModule));
//   }, [project, activeModule]);

//   // ===== persist order back to project.site[module].pages =====
//   const persist = useCallback(
//     async (nextPages: ProjectPage[]) => {
//       if (!project?._id) return;

//       const nextOrdered = applySortOrders(nextPages);

//       const prevSite = (project.site ?? {}) as any;
//       const prevModule = (prevSite?.[activeModule] ?? {}) as ProjectSiteModule;

//       const nextSite = {
//         ...prevSite,
//         [activeModule]: {
//           ...prevModule,
//           pages: nextOrdered,
//         },
//       };

//       setLoading(true);
//       try {
//         await updateProject(project._id, { site: nextSite });

//         setProject((prev) =>
//           prev ? ({ ...prev, site: nextSite } as ProjectEntity) : prev
//         );

//         addToast({
//           color: "success",
//           title: "Успешно!",
//           description: "Порядок страниц сохранён",
//           variant: "solid",
//           radius: "lg",
//           timeout: 2200,
//           shouldShowTimeoutProgress: true,
//         });
//       } catch {
//         addToast({
//           color: "danger",
//           title: "Ошибка!",
//           description: "Не удалось сохранить порядок страниц",
//           variant: "solid",
//           radius: "lg",
//           timeout: 3000,
//           shouldShowTimeoutProgress: true,
//         });

//         // откатимся к проектным данным
//         setPages(getPagesForModule(project, activeModule));
//       } finally {
//         setLoading(false);
//       }
//     },
//     [activeModule, project]
//   );

//   const onDragEnd = useCallback(
//     async (event: DragEndEvent) => {
//       const { active, over } = event;
//       if (!over) return;
//       if (active.id === over.id) return;

//       setPages((current) => {
//         const oldIndex = current.findIndex((x) => x._id === active.id);
//         const newIndex = current.findIndex((x) => x._id === over.id);
//         if (oldIndex === -1 || newIndex === -1) return current;

//         const next = arrayMove(current, oldIndex, newIndex);

//         // ✅ сохраняем на сервер сразу (можно сделать debounce, но ты просил без уточнений — делаю сразу)
//         void persist(next);

//         return next;
//       });
//     },
//     [persist]
//   );

//   // роут редактирования: под себя поправишь (я сделал best-effort)
//   const goEdit = useCallback(
//     (page: ProjectPage) => {
//       // Вариант 1: если у тебя отдельная CMS-страница редактора
//       // router.push(`/admin/cms/pages/edit/${projectId}/${activeModule}/${page._id}`);
//       //
//       // Вариант 2: если редактор живёт на том же маршруте и открывается модалкой — поменяешь сам.

//       router.push(
//         `/admin/cms/pages/edit/${projectId}?module=${activeModule}&pageId=${page._id}`
//       );
//     },
//     [activeModule, projectId, router]
//   );

//   const currentTabHasPages = pages.length > 0;

//   return (
//     <div className="relative">
//       {loading ? <LoaderModal /> : null}

//       <div className="w-full">
//         {/* Header */}
//         <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-9">
//           <div className="flex flex-col min-w-0">
//             <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">
//               Страницы проекта
//             </h1>
//           </div>

//           <div className="ml-auto flex gap-2">
//             <Button
//               radius="full"
//               variant="flat"
//               onPress={() => {
//                 setLoading(true);
//                 getProject(projectId)
//                   .then((res: any) => setProject(res as ProjectEntity))
//                   .finally(() => setLoading(false));
//               }}
//             >
//               Обновить
//             </Button>

//             <Button
//               color="primary"
//               radius="full"
//               onPress={() => {
//                 router.push(`/admin/cms/pages/create/${projectId}?module=${activeModule}`);
//               }}
//             >
//               Создать
//             </Button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-background rounded-4xl mb-4 sm:mb-9">
//           <Tabs
//             aria-label="Modules"
//             selectedKey={activeModule}
//             onSelectionChange={(k) => setActiveModule(k as SiteModuleKey)}
//             variant="light"
//             radius="full"
//           >
//             {MODULES.map((m) => (
//               <Tab key={m.key} title={m.label} />
//             ))}
//           </Tabs>
//         </div>

//         {/* List */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
//           {!currentTabHasPages ? (
//             <div className="bg-background rounded-4xl p-6 text-foreground-500 sm:col-span-2 xl:col-span-3">
//               В этом модуле пока нет страниц.
//             </div>
//           ) : (
//             <DndContext
//               sensors={sensors}
//               collisionDetection={closestCenter}
//               onDragEnd={onDragEnd}
//             >
//               <SortableContext
//                 items={pages.map((p) => p._id)}
//                 strategy={rectSortingStrategy}
//               >
//                 {pages.map((p) => (
//                   <SortableWithHandle key={p._id} id={p._id}>
//                     {({ handleProps }) => (
//                       <CMSPageCard
//                         page={p}
//                         projectPreviewUrl={projectPreviewUrl ?? null}
//                         onEdit={goEdit}
//                         handleProps={handleProps}
//                       />
//                     )}
//                   </SortableWithHandle>
//                 ))}
//               </SortableContext>
//             </DndContext>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
