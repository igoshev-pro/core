"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { addToast, Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import { SmartCollection, SmartCollectionHandle } from "./SmartCollection";
import { ConfirmModal } from "../../components/modals/ConfirmModal";
import { LoaderModal } from "../../components/modals/LoaderModal";
import { SortableCard } from "../widgets/SortableCard";

import { getTemplates, removeTemplate, updateTemplate } from "@/api/factory/templatesApi";
import { EntityCard } from "../widgets/EntityCard";
import { EntityRow } from "../widgets/EntityRow";
import { getThemes, removeTheme, updateTheme } from "@/api/factory/themesApi";
import { getLayouts, removeLayout, updateLayout } from "@/api/factory/layoutsApi";
import { getPages, removePage, updatePage } from "@/api/factory/pagesApi";
import { getSections, removeSection, updateSection } from "@/api/factory/sectionsApi";
import { getWidgets, removeWidget, updateWidget } from "@/api/factory/widgetsApi";
import { getProjects, updateProject, removeProject } from "@/api/core/projectsApi";

type Item = { _id: string; name?: any; sortOrder?: number;[k: string]: any };
const ORDER_STEP = 1000;

function unwrapItems(res: unknown): Item[] {
  if (Array.isArray(res)) return res as Item[];
  if (res && typeof res === "object") {
    const anyRes = res as any;
    if (Array.isArray(anyRes.data)) return anyRes.data as Item[];
  }
  return [];
}

// ✅ лучше сделать ключи типобезопасными
type FactoryApiKey =
  | "templates"
  | "layouts"
  | "themes"
  | "pages"
  | "sections"
  | "widgets"
  | "projects"
  ;

type EntityStrings = {
  label: string;
  labelPlural: string;
};

type EntityRoutes = {
  list: string;
  create: string;
  edit: (id: string) => string;
};

type EntityMethods = {
  getItems: (limit: number, offset: number) => Promise<unknown>;
  removeItem: (id: string) => Promise<unknown>;
  updateItem: (id: string, dto: Partial<Item>) => Promise<unknown>;
};

type EntityConfig = {
  strings?: EntityStrings;
  ui?: any;
  routes: EntityRoutes;
  methods: EntityMethods;
};

function assertNever(x: never): never {
  throw new Error(`Unhandled api key: ${String(x)}`);
}

function getEntityConfig(api: FactoryApiKey, ui: any): EntityConfig {
  switch (api) {
    case "templates":
      return {
        routes: {
          list: "/admin/factory/templates",
          create: "/admin/factory/templates/create",
          edit: (id) => `/admin/factory/templates/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getTemplates(limit, offset),
          removeItem: (id) => removeTemplate(id),
          updateItem: (id, dto) => updateTemplate(id, dto),
        },
      };

    case "themes":
      return {
        routes: {
          list: "/admin/factory/themes",
          create: "/admin/factory/themes/create",
          edit: (id) => `/admin/factory/themes/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getThemes(limit, offset),
          removeItem: (id) => removeTheme(id),
          updateItem: (id, dto) => updateTheme(id, dto),
        },
      };

    case "layouts":
      return {
        routes: {
          list: "/admin/factory/layouts",
          create: "/admin/factory/layouts/create",
          edit: (id) => `/admin/factory/layouts/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getLayouts(limit, offset),
          removeItem: (id) => removeLayout(id),
          updateItem: (id, dto) => updateLayout(id, dto),
        },
      };

    case "pages":
      return {
        routes: {
          list: "/admin/factory/pages",
          create: "/admin/factory/pages/create",
          edit: (id) => `/admin/factory/pages/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getPages(limit, offset),
          removeItem: (id) => removePage(id),
          updateItem: (id, dto) => updatePage(id, dto),
        },
      };

    case "sections":
      return {
        routes: {
          list: "/admin/factory/sections",
          create: "/admin/factory/sections/create",
          edit: (id) => `/admin/factory/sections/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getSections(limit, offset),
          removeItem: (id) => removeSection(id),
          updateItem: (id, dto) => updateSection(id, dto),
        },
      };

    case "widgets":
      return {
        routes: {
          list: "/admin/factory/widgets",
          create: "/admin/factory/widgets/create",
          edit: (id) => `/admin/factory/widgets/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getWidgets(limit, offset),
          removeItem: (id) => removeWidget(id),
          updateItem: (id, dto) => updateWidget(id, dto),
        },
      };

    case "projects":
      return {
        ui,
        routes: {
          list: "/admin/core/projects",
          create: "/admin/core/projects/create",
          edit: (id) => `/admin/core/projects/edit/${id}`,
        },
        methods: {
          getItems: (limit, offset) => getProjects(limit, offset),
          removeItem: (id) => removeProject(id),
          updateItem: (id, dto) => updateProject(id, dto),
        },
      };

    default:
      return assertNever(api);
  }
}

/**
 * Если прилетит неизвестный api (string), мы не падаем "тихо",
 * а приводим к корректному ключу. Можно по-своему (например, редирект/ошибка).
 */
function normalizeApi(api: string): FactoryApiKey {
  switch (api) {
    case "templates":
      return "templates";
    case "themes":
      return "themes";
    case "layouts":
      return "layouts";
    case "pages":
      return "pages";
    case "sections":
      return "sections";
    case "widgets":
      return "widgets";
    case "projects":
      return "projects"

    default:
      // best-effort: пусть будет templates, чтобы не падать
      return "templates";
  }
}

export default function EntityCollection({ api, ui }: { api: string, ui?: any }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Item | undefined>();

  const collectionRef = useRef<SmartCollectionHandle>(null);

  const { isOpen: isDelete, onOpen: onDelete, onClose: closeDelete } = useDisclosure();

  const apiKey = useMemo(() => normalizeApi(api), [api]);
  const cfg = useMemo(() => getEntityConfig(apiKey, ui), [apiKey]);

  const loadPage = useCallback(
    async ({ limit, offset }: { limit: number; offset: number }) => {
      const raw = await cfg.methods.getItems(limit, offset);
      return unwrapItems(raw);
    },
    [cfg.methods]
  );

  const onRemove = useCallback(async () => {
    if (!current?._id) return;

    const id = current._id;

    try {
      await cfg.methods.removeItem(id);

      addToast({
        color: "success",
        title: "Успешно!",
        description: `Объект успешно удален`,
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      closeDelete();
      setCurrent(undefined);

      // ✅ моментально обновили UI
      collectionRef.current?.removeLocal(id);

      // ✅ если хочешь 100% консистентность с сервером (например, пагинация/hasMore)
      void collectionRef.current?.refresh();

      // router.refresh(); // больше не нужен для этого кейса
    } catch {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: `Произошла ошибка при удалении объекта`,
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  }, [cfg.methods, closeDelete, current?._id]);

  const onPersistOrder = useCallback(
    async (next: Item[], prev: Item[]) => {
      const nextWithOrder = next.map((c, index) => ({
        ...c,
        sortOrder: (index + 1) * ORDER_STEP,
      }));

      const prevMap = new Map(prev.map((c) => [c._id, c.sortOrder ?? 0]));
      const changed = nextWithOrder.filter(
        (c) => (prevMap.get(c._id) ?? 0) !== (c.sortOrder ?? 0)
      );
      if (changed.length === 0) return;

      await Promise.all(
        changed.map((c) => cfg.methods.updateItem(c._id, { sortOrder: c.sortOrder }))
      );
    },
    [cfg.methods]
  );

  return (
    <>
      <SmartCollection<Item>
        ref={collectionRef}
        title={cfg?.ui?.title?.ru}
        actions={
          <Button color="primary" radius="full" onPress={() => router.push(cfg.routes.create)}>
            Создать
          </Button>
        }
        enableViewToggle
        defaultView="grid"
        enableDnd
        loadPage={loadPage}
        getId={(c) => c._id}
        loadingState={<LoaderModal />}
        renderCard={(item) => (
          <SortableCard key={item._id} id={item._id}>
            <EntityCard
              api={apiKey}
              item={item}
              onEdit={(i) => router.push(cfg.routes.edit(i._id))}
              onRemove={(i) => { setCurrent(i); onDelete(); }}
            />
          </SortableCard>
        )}
        renderRow={(item) => (
          <SortableCard key={item._id} id={item._id}>
            <EntityRow
              api={apiKey}
              item={item}
              onEdit={(i) => router.push(cfg.routes.edit(i._id))}
              onRemove={(i) => {
                setCurrent(i);
                onDelete();
              }}
            />
          </SortableCard>
        )}
        onPersistOrder={onPersistOrder}
      />

      <ConfirmModal
        isOpen={isDelete}
        onClose={closeDelete}
        onAction={onRemove}
        title="Удаление"
        text={`Вы действительно хотите удалить объект?`}
        actionBtnText="Удалить"
      />
    </>
  );
}

