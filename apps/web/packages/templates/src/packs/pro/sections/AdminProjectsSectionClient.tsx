"use client";

import { addToast, Button, cn, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConfirmModal } from "../components/modals/ConfirmModal";
import { LoaderModal } from "../components/modals/LoaderModal";
import { getProjects, removeProject } from "@/api/core/projectsApi";
import { ProjectCard } from "../components/widgets/ProjectCard";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Project = {
  _id: string;
  name?: string;
  sortOrder?: number;
  [key: string]: any;
};

const ORDER_STEP = 1000;

function getBatchSizeByCols(cols: number) {
  if (cols >= 5) return 20;
  if (cols === 4) return 16;
  if (cols === 3) return 12;
  return 10;
}

/**
 * grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
 */
function useGridColumns() {
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1536) return 5;
      if (w >= 1280) return 4;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    };

    const update = () => setCols(calc());
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

function unwrapProjects(res: unknown): Project[] {
  // поддерживаем и массив, и axios-like { data: [...] }
  if (Array.isArray(res)) return res as Project[];
  if (res && typeof res === "object" && Array.isArray((res as any).data)) {
    return (res as any).data as Project[];
  }
  return [];
}

/** DnD wrapper (карточку не трогаем) */
export function SortableProjectCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: "grab",
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}


export default function AdminProjectsSection() {
  const router = useRouter();

  const [current, setCurrent] = useState<Project | undefined>();

  const [projects, setProjects] = useState<Project[]>([]);
  const projectsRef = useRef<Project[]>([]);
  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const cols = useGridColumns();
  const batchSize = useMemo(() => getBatchSizeByCols(cols), [cols]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const ids = useMemo(() => projects.map((p) => p._id), [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const {
    isOpen: isDelete,
    onOpen: onDelete,
    onClose: closeDelete,
  } = useDisclosure();

  const loadInitial = useCallback(async () => {
    setInitialLoading(true);
    try {
      // стараемся вызвать как (limit, offset), но если у тебя пока (limit) — тоже ок
      const resRaw = await (getProjects as any)(batchSize, 0);
      const res = unwrapProjects(resRaw);

      setProjects(res);
      setHasMore(res.length === batchSize);
    } catch (e) {
      // fallback: попробуем старую сигнатуру (limit)
      try {
        const resRaw = await (getProjects as any)(batchSize);
        const res = unwrapProjects(resRaw);
        setProjects(res);
        setHasMore(false); // без offset бесконечная пагинация невозможна
      } catch {
        setProjects([]);
        setHasMore(false);
        addToast({
          color: "danger",
          title: "Ошибка!",
          description: "Не удалось загрузить проекты",
          variant: "solid",
          radius: "lg",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setInitialLoading(false);
    }
  }, [batchSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || initialLoading || !hasMore) return;

    setLoadingMore(true);
    try {
      const offset = projectsRef.current.length;

      // Если getProjects не поддерживает offset — этот вызов упадёт, мы покажем тост и выключим hasMore
      const resRaw = await (getProjects as any)(batchSize, offset);
      const res = unwrapProjects(resRaw);

      if (res.length === 0) {
        setHasMore(false);
        return;
      }

      setProjects((prev) => [...prev, ...res]);
      setHasMore(res.length === batchSize);
    } catch (e) {
      setHasMore(false);
      addToast({
        color: "danger",
        title: "Ошибка!",
        description:
          "Не удалось догрузить проекты (возможно, API не поддерживает offset)",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setLoadingMore(false);
    }
  }, [batchSize, hasMore, initialLoading, loadingMore]);

  // первая загрузка
  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  // если изменился batchSize (колонки) — перезагрузка
  useEffect(() => {
    if (projectsRef.current.length > 0) {
      void loadInitial();
    }
  }, [batchSize, loadInitial]);

  // infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          void loadMore();
        }
      },
      {
        root: null,
        rootMargin: "800px",
        threshold: 0,
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const onRemove = async () => {
    if (!current?._id) return;

    setInitialLoading(true);
    try {
      await removeProject(current._id);

      addToast({
        color: "success",
        title: "Успешно!",
        description: `Проект успешно удален`,
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });

      closeDelete();
      await loadInitial();
    } catch (err) {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: `Произошла ошибка при удалении проекта`,
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setInitialLoading(false);
    }
  };

  // DnD reorder (локально)
  // Важно: я не трогаю источник данных. Если у тебя есть updateProject — можно будет сюда добавить persist.
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setProjects((prev) => {
      const oldIndex = prev.findIndex((p) => p._id === String(active.id));
      const newIndex = prev.findIndex((p) => p._id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;

      const next = arrayMove(prev, oldIndex, newIndex);

      // аккуратно пересчитаем sortOrder локально (ничего не отправляем)
      return next.map((p, idx) => ({
        ...p,
        sortOrder: (idx + 1) * ORDER_STEP,
      }));
    });
  };

  return (
    <>
      <div className="flex justify-between items-senter mb-9">
        <h1 className="text-3xl font-bold">Проекты</h1>

        <Button color="primary" radius="full" onPress={() => router.push("/")}>
          Создать
        </Button>
      </div>

      {initialLoading ? (
        <LoaderModal />
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {projects.map((item) => (
                  <SortableProjectCard key={item._id} id={item._id}>
                    <ProjectCard
                      project={item}
                      onEdit={(i: any) => {
                        setCurrent(i);
                        router.push("/" + `/${i?._id}`);
                      }}
                      onRemove={(i: any) => {
                        setCurrent(i);
                        onDelete();
                      }}
                    />
                  </SortableProjectCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="mt-6 flex justify-center opacity-70 text-sm">
              Загрузка...
            </div>
          )}

          {!hasMore && projects.length > 0 && (
            <div className="mt-6 flex justify-center opacity-60 text-sm">
              Больше проектов нет
            </div>
          )}
        </>
      )}

      <ConfirmModal
        actionBtnText="Удалить"
        isOpen={isDelete}
        text={`Вы уверены что хотите удалить проект ${current?.name}?`}
        title="Удаление"
        onAction={onRemove}
        onClose={closeDelete}
      />
    </>
  );
}
