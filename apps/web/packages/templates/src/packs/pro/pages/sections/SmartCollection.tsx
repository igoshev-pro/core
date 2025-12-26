"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { addToast, Button } from "@heroui/react";
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
} from "@dnd-kit/sortable";
import { IoGridOutline, IoListOutline } from "react-icons/io5";

type ViewMode = "grid" | "list";

type LoadPageArgs = { limit: number; offset: number };
type LoadPageResult<T> = T[];

export type SmartCollectionHandle = {
  refresh: () => Promise<void>;
  removeLocal: (id: string) => void;
};

export type SmartCollectionProps<T> = {
  title?: string;
  actions?: React.ReactNode;

  defaultView?: ViewMode;
  enableViewToggle?: boolean;

  gridClassName?: string;
  gapClassName?: string;
  getBatchSize?: (cols: number) => number;

  loadPage: (args: LoadPageArgs) => Promise<LoadPageResult<T>>;
  getId: (item: T) => string;

  renderCard: (item: T) => React.ReactNode;
  renderRow?: (item: T) => React.ReactNode;

  enableDnd?: boolean;
  onPersistOrder?: (next: T[], prev: T[]) => Promise<void>;

  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;

  onItemsChange?: (items: T[]) => void;

  className?: string;
};

function useGridColumns() {
  const [cols, setCols] = useState(3);

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

const defaultGetBatchSize = (cols: number) => {
  if (cols >= 5) return 20;
  if (cols === 4) return 16;
  if (cols === 3) return 12;
  return 10;
};

export const SmartCollection = forwardRef(function SmartCollectionInner<T>(
  props: SmartCollectionProps<T>,
  ref: React.Ref<SmartCollectionHandle>
) {
  const {
    title,
    actions,
    defaultView = "grid",
    enableViewToggle = true,

    gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    gapClassName = "gap-6",
    getBatchSize = defaultGetBatchSize,

    loadPage,
    getId,

    renderCard,
    renderRow,

    enableDnd = true,
    onPersistOrder,

    emptyState,
    loadingState,

    onItemsChange,
    className,
  } = props;

  const cols = useGridColumns();
  const batchSize = useMemo(() => getBatchSize(cols), [cols, getBatchSize]);

  const [view, setView] = useState<ViewMode>(defaultView);

  const [items, setItems] = useState<T[]>([]);
  const itemsRef = useRef<T[]>([]);
  useEffect(() => {
    itemsRef.current = items;
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const ids = useMemo(() => items.map((x) => getId(x)), [items, getId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadInitial = useCallback(async () => {
    setInitialLoading(true);
    setLoadingMore(false);
    try {
      const res = await loadPage({ limit: batchSize, offset: 0 });
      setItems(res);
      setHasMore(res.length === batchSize);
    } catch (e) {
      setItems([]);
      setHasMore(false);
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Не удалось загрузить данные",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setInitialLoading(false);
    }
  }, [batchSize, loadPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || initialLoading || !hasMore) return;
    setLoadingMore(true);

    try {
      const offset = itemsRef.current.length;
      const res = await loadPage({ limit: batchSize, offset });

      if (res.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...res]);
      setHasMore(res.length === batchSize);
    } catch (e) {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Не удалось догрузить данные",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setLoadingMore(false);
    }
  }, [batchSize, hasMore, initialLoading, loadingMore, loadPage]);

  // ✅ expose imperative API
  useImperativeHandle(
    ref,
    () => ({
      refresh: async () => {
        await loadInitial();
      },
      removeLocal: (id: string) => {
        setItems((prev) => prev.filter((x) => getId(x) !== id));
      },
    }),
    [getId, loadInitial]
  );

  // initial
  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  // recalc batch size => reload
  useEffect(() => {
    if (itemsRef.current.length > 0) void loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchSize]);

  // infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) void loadMore();
      },
      { root: null, rootMargin: "800px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      if (!enableDnd) return;
      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;

      setItems((prev) => {
        const oldIndex = prev.findIndex((x) => getId(x) === String(active.id));
        const newIndex = prev.findIndex((x) => getId(x) === String(over.id));
        if (oldIndex === -1 || newIndex === -1) return prev;

        const next = arrayMove(prev, oldIndex, newIndex);

        if (onPersistOrder) {
          void (async () => {
            try {
              await onPersistOrder(next, prev);
            } catch (e) {
              setItems(prev);
              addToast({
                color: "danger",
                title: "Ошибка!",
                description: "Не удалось сохранить порядок. Откатил изменения.",
                variant: "solid",
                radius: "lg",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
              });
            }
          })();
        }

        return next;
      });
    },
    [enableDnd, getId, onPersistOrder]
  );

  const canList = !!renderRow;
  const showToggle = enableViewToggle && (canList || view === "grid");

  return (
    <div className={className}>
      {(title || actions || showToggle) && (
        <div className="flex justify-between items-center mb-9">
          {showToggle && canList && (
            <div className="flex gap-3">
              <Button
                isIconOnly
                variant={view === "grid" ? "bordered" : "light"}
                color="primary"
                onPress={() => setView("grid")}
              >
                <IoGridOutline className="text-[22px]" />
              </Button>
              <Button
                isIconOnly
                variant={view === "list" ? "bordered" : "light"}
                color="primary"
                onPress={() => setView("list")}
              >
                <IoListOutline className="text-[24px]" />
              </Button>
            </div>
          )}
          {title ? <h1 className="text-3xl font-bold">{title}</h1> : <div />}
          <div className="flex items-center gap-3 ml-2">{actions}</div>
        </div>
      )}

      {initialLoading ? (
        loadingState ?? <div className="opacity-70 text-sm">Загрузка...</div>
      ) : items.length === 0 ? (
        emptyState ?? <div className="opacity-70 text-sm">Пусто</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            {view === "grid" ? (
              <div className={`${gridClassName} ${gapClassName}`}>
                {items.map((item) => renderCard(item))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">{items.map((item) => renderRow?.(item))}</div>
            )}
          </SortableContext>
        </DndContext>
      )}

      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="mt-6 flex justify-center opacity-70 text-sm">Загрузка...</div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="mt-6 flex justify-center opacity-60 text-sm">Больше нет</div>
      )}
    </div>
  );
}) as <T>(
  props: SmartCollectionProps<T> & { ref?: React.Ref<SmartCollectionHandle> }
) => React.ReactElement;
