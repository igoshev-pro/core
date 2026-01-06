"use client";

import { addToast, Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { LoaderModal } from "../../../components/modals/LoaderModal";
import { getClients, removeClient, updateClient } from "@/api/core/clientsApi";
import { UserCard } from "../../../components/widgets/UserCard";
import { ConfirmModal } from "../../../components/modals/ConfirmModal";
import { AddMoneyModal } from "../../../components/modals/AddMoneyModal";
import { ROUTES } from "@/packages/templates/common/routes";

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
import { SortableUserCard } from "../../../components/widgets/SortableUserCard";

type Client = {
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
  return 10; // 1 или 2
}

/**
 * Определяем кол-во колонок по tailwind breakpoint’ам
 * grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
 */
function useGridColumns() {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const calc = () => {
      // tailwind default breakpoints:
      // sm: 640, lg: 1024, xl: 1280, 2xl: 1536
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

// ✅ главное: что бы ни вернул getClients — на выходе всегда Client[]
function unwrapClients(res: unknown): Client[] {
  // вариант 1: API сразу вернул массив
  if (Array.isArray(res)) return res as Client[];

  // вариант 2: axios/fetch wrapper: { data: [...] }
  if (res && typeof res === "object") {
    const anyRes = res as any;
    if (Array.isArray(anyRes.data)) return anyRes.data as Client[];
  }

  return [];
}

export default function ClientsSectionMainC() {
  const router = useRouter();

  const [current, setCurrent] = useState<Client | undefined>();

  // ✅ clients всегда массив
  const [clients, setClients] = useState<Client[]>([]);
  const clientsRef = useRef<Client[]>([]);
  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  const [initialLoading, setInitialLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const cols = useGridColumns();
  const batchSize = useMemo(() => getBatchSizeByCols(cols), [cols]);

  // sentinel для IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const ids = useMemo(() => clients.map((c) => c._id), [clients]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const {
    isOpen: isDelete,
    onOpen: onDelete,
    onClose: closeDelete,
  } = useDisclosure();

  const {
    isOpen: isAddMoney,
    onOpen: onAddMoney,
    onClose: closeAddMoney,
  } = useDisclosure();

  const loadInitial = useCallback(async () => {
    setInitialLoading(true);
    try {
      const resRaw = await getClients(batchSize, 0);
      const res = unwrapClients(resRaw);

      setClients(res);
      setHasMore(res.length === batchSize);
    } catch (e) {
      setClients([]);
      setHasMore(false);

      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Не удалось загрузить клиентов",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setInitialLoading(false);
    }
  }, [batchSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || initialLoading || !hasMore) return;
    setLoadingMore(true);

    try {
      const offset = clientsRef.current.length;
      const resRaw = await getClients(batchSize, offset);
      const res = unwrapClients(resRaw);

      if (res.length === 0) {
        setHasMore(false);
        return;
      }

      setClients((prev) => [...prev, ...res]);
      setHasMore(res.length === batchSize);
    } catch (e) {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: "Не удалось догрузить клиентов",
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setLoadingMore(false);
    }
  }, [batchSize, hasMore, initialLoading, loadingMore]);

  // 1) первая загрузка
  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  // 2) если изменилось кол-во колонок -> batchSize -> перезагружаем
  useEffect(() => {
    if (clientsRef.current.length > 0) {
      void loadInitial();
    }
  }, [batchSize, loadInitial]);

  // 3) IntersectionObserver для infinite scroll
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
      await removeClient(current._id);
      await loadInitial();

      addToast({
        color: "success",
        title: "Успешно!",
        description: `Пользователь успешно удален`,
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      closeDelete();
    } catch (err) {
      addToast({
        color: "danger",
        title: "Ошибка!",
        description: `Произошла ошибка при удалении клиента`,
        variant: "solid",
        radius: "lg",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const persistOrder = async (next: Client[], prev: Client[]) => {
    // пересчитываем sortOrder по позиции (только для уже загруженных)
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
      changed.map((c) => updateClient(c._id, { sortOrder: c.sortOrder }))
    );

    setClients(nextWithOrder);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setClients((prev) => {
      const oldIndex = prev.findIndex((c) => c._id === String(active.id));
      const newIndex = prev.findIndex((c) => c._id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;

      const next = arrayMove(prev, oldIndex, newIndex);

      void (async () => {
        try {
          await persistOrder(next, prev);
        } catch (e) {
          setClients(prev);
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

      return next;
    });
  };

  return (
    <>
      {initialLoading ? (
        <LoaderModal />
      ) : (
        <>
          <div className="flex justify-between items-senter mb-9">
            <h1 className="text-3xl font-bold">Клиенты</h1>

            <Button
              color="primary"
              radius="full"
              onPress={() => router.push(ROUTES.ADMIN_CLIENTS_CREATE)}
            >
              Создать
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {clients.map((item) => (
                  <SortableUserCard key={item._id} id={item._id}>
                    <UserCard
                      item={item}
                      onEdit={(i: Client) => {
                        setCurrent(i);
                        router.push(`${ROUTES.ADMIN_CLIENTS_EDIT}/${i?._id}`);
                      }}
                      onRemove={(i: Client) => {
                        setCurrent(i);
                        onDelete();
                      }}
                      onAddMoney={(i: Client) => {
                        setCurrent(i);
                        onAddMoney();
                      }}
                    />
                  </SortableUserCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* sentinel: как только он близко к экрану — догружаем */}
          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="mt-6 flex justify-center opacity-70 text-sm">
              Загрузка...
            </div>
          )}

          {!hasMore && clients.length > 0 && (
            <div className="mt-6 flex justify-center opacity-60 text-sm">
              Больше клиентов нет
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={isDelete}
        onClose={closeDelete}
        onAction={onRemove}
        title="Удаление"
        text={`Вы действительно хотите удалить пользователя ${current?.name}?`}
        actionBtnText="Удалить"
      />

      <AddMoneyModal
        isOpen={isAddMoney}
        onClose={closeAddMoney}
        user={current}
      />
    </>
  );
}
