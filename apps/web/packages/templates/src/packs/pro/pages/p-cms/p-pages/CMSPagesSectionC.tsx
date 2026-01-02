"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { addToast, Button, Tabs, Tab, cn } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CMSPageCard, ProjectPage, SiteModuleKey } from "./CMSPageCard";

import { getProject, updateProject } from "@/api/core/projectsApi";
import { usePresignedUrl } from "@/api/feature/usePresignedUrl";
import { LoaderModal } from "../../../components/modals/LoaderModal";
import { SortableWithHandle } from "../../widgets/SortableWithHandle";

const ORDER_STEP = 1000;

type ProjectSiteModule = {
  version?: string;
  layout?: any;
  pages?: ProjectPage[];
  [k: string]: any;
};

type ProjectEntity = {
  _id: string;
  previewPath?: string;
  site?: Partial<Record<SiteModuleKey, ProjectSiteModule>> & Record<string, any>;
  [k: string]: any;
};

const MODULES: { key: SiteModuleKey; label: string }[] = [
  { key: "public", label: "Public" },
  { key: "admin", label: "Admin" },
  { key: "login", label: "Login" }
];

function getPagesForModule(project: ProjectEntity | null, moduleKey: SiteModuleKey): ProjectPage[] {
  const pages = (project?.site?.[moduleKey]?.pages ?? []) as ProjectPage[];
  // если sortOrder не задан — стабильно пронумеруем по порядку массива
  return pages.map((p, i) => ({
    ...p,
    sortOrder: p.sortOrder ?? (i + 1) * ORDER_STEP,
  }));
}

function applySortOrders(pages: ProjectPage[]) {
  return pages.map((p, idx) => ({
    ...p,
    sortOrder: (idx + 1) * ORDER_STEP,
  }));
}

export default function CMSPagesSectionC({ projectId }: { projectId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectEntity | null>(null);

  const [activeModule, setActiveModule] = useState<SiteModuleKey>("public");

  // локальный список страниц текущего таба (чтобы DnD был мгновенный)
  const [pages, setPages] = useState<ProjectPage[]>([]);

  // project preview (одна картинка на все карточки, как в примере)
  const { url: projectPreviewUrl } = usePresignedUrl(project?.previewPath);

  // DnD sensors: на мобиле лучше TouchSensor + маленькая задержка, но у нас handle touch-none -> норм
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
  );

  // ===== load project =====
  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    getProject(projectId)
      .then((res: any) => {
        setProject(res as ProjectEntity);
      })
      .catch(() => {
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Не удалось загрузить проект",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  // ===== whenever module or project changes -> reset pages list =====
  useEffect(() => {
    setPages(getPagesForModule(project, activeModule));
  }, [project, activeModule]);

  // ===== persist order back to project.site[module].pages =====
  const persist = useCallback(
    async (nextPages: ProjectPage[]) => {
      if (!project?._id) return;

      const nextOrdered = applySortOrders(nextPages);

      const prevSite = (project.site ?? {}) as any;
      const prevModule = (prevSite?.[activeModule] ?? {}) as ProjectSiteModule;

      const nextSite = {
        ...prevSite,
        [activeModule]: {
          ...prevModule,
          pages: nextOrdered,
        },
      };

      setLoading(true);
      try {
        await updateProject(project._id, { site: nextSite });

        setProject((prev) =>
          prev ? ({ ...prev, site: nextSite } as ProjectEntity) : prev
        );

        addToast({
          color: "success",
          title: "Успешно!",
          description: "Порядок страниц сохранён",
          variant: "solid",
          radius: "lg",
          timeout: 2200,
          shouldShowTimeoutProgress: true,
        });
      } catch {
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Не удалось сохранить порядок страниц",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        // откатимся к проектным данным
        setPages(getPagesForModule(project, activeModule));
      } finally {
        setLoading(false);
      }
    },
    [activeModule, project]
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;

      setPages((current) => {
        const oldIndex = current.findIndex((x) => x._id === active.id);
        const newIndex = current.findIndex((x) => x._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return current;

        const next = arrayMove(current, oldIndex, newIndex);

        // ✅ сохраняем на сервер сразу (можно сделать debounce, но ты просил без уточнений — делаю сразу)
        void persist(next);

        return next;
      });
    },
    [persist]
  );

  // роут редактирования: под себя поправишь (я сделал best-effort)
  const goEdit = useCallback(
    (page: ProjectPage) => {
      // Вариант 1: если у тебя отдельная CMS-страница редактора
      // router.push(`/admin/cms/pages/edit/${projectId}/${activeModule}/${page._id}`);
      //
      // Вариант 2: если редактор живёт на том же маршруте и открывается модалкой — поменяешь сам.

      router.push(
        `/admin/cms/pages/edit/${projectId}?module=${activeModule}&pageId=${page._id}`
      );
    },
    [activeModule, projectId, router]
  );

  const currentTabHasPages = pages.length > 0;

  return (
    <div className="relative">
      {loading ? <LoaderModal /> : null}

      <div className="w-full">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-9">
          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">
              Страницы проекта
            </h1>
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              radius="full"
              variant="flat"
              onPress={() => {
                setLoading(true);
                getProject(projectId)
                  .then((res: any) => setProject(res as ProjectEntity))
                  .finally(() => setLoading(false));
              }}
            >
              Обновить
            </Button>

            <Button
              color="primary"
              radius="full"
              onPress={() => {
                router.push(`/admin/cms/pages/create/${projectId}?module=${activeModule}`);
              }}
            >
              Создать
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-background rounded-4xl sm:p-4 mb-4 sm:mb-6">
          <Tabs
            aria-label="Modules"
            selectedKey={activeModule}
            onSelectionChange={(k) => setActiveModule(k as SiteModuleKey)}
            variant="light"
            radius="full"
          >
            {MODULES.map((m) => (
              <Tab key={m.key} title={m.label} />
            ))}
          </Tabs>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {!currentTabHasPages ? (
            <div className="bg-background rounded-4xl p-6 text-foreground-500 sm:col-span-2 xl:col-span-3">
              В этом модуле пока нет страниц.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={pages.map((p) => p._id)}
                strategy={rectSortingStrategy}
              >
                {pages.map((p) => (
                  <SortableWithHandle key={p._id} id={p._id}>
                    {({ handleProps }) => (
                      <CMSPageCard
                        page={p}
                        projectPreviewUrl={projectPreviewUrl ?? null}
                        onEdit={goEdit}
                        handleProps={handleProps}
                      />
                    )}
                  </SortableWithHandle>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
