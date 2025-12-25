"use client";

import { addToast, Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LoaderModal } from "../../../components/modals/LoaderModal";
import { getClients, removeClient, updateClient } from "@/api/core/clientsApi";
import { UserCard } from "../../../components/widgets/UserCard";
import { ConfirmModal } from "../../../components/modals/ConfirmModal";
import { AddMoneyModal } from "../../../components/modals/AddMoneyModal";
import { ROUTES } from "@/packages/templates/common/routes";
import { withProjectId } from "@/api/utils/withProjectId";

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

// тип можно заменить на твой нормальный
type Client = {
  _id: string;
  name?: string;
  sortOrder?: number;
  [key: string]: any;
};

const ORDER_STEP = 1000;

export default function ClientsSectionMainC() {
  const router = useRouter();

  const [current, setCurrent] = useState<Client | undefined>();
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getClients(20);
      // ожидаем что бек уже сортирует по sortOrder
      setClients(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const onRemove = async () => {
    if (!current?._id) return;

    setLoading(true);
    try {
      await removeClient(current._id);
      await load();

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
      setLoading(false);
    }
  };

  const persistOrder = async (next: Client[], prev: Client[]) => {
    // пересчитываем sortOrder по позиции
    const nextWithOrder = next.map((c, index) => ({
      ...c,
      sortOrder: (index + 1) * ORDER_STEP,
    }));

    // сохраняем только изменившиеся
    const prevMap = new Map(prev.map((c) => [c._id, c.sortOrder ?? 0]));
    const changed = nextWithOrder.filter(
      (c) => (prevMap.get(c._id) ?? 0) !== (c.sortOrder ?? 0)
    );

    if (changed.length === 0) return;

    // параллельно патчим (можно ограничить батчом, но обычно списки небольшие)
    await Promise.all(
      changed.map((c) => updateClient(c._id, { sortOrder: c.sortOrder }))
    );

    // фиксируем локально (на случай если было без sortOrder)
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

      // optimistic UI: уже переставили
      // сохраняем порядок асинхронно (без ожидания setState)
      // важно: берем "prev" и "next" именно из этого замыкания
      void (async () => {
        try {
          await persistOrder(next, prev);
        } catch (e) {
          // откат
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
      {loading ? (
        <LoaderModal />
      ) : (
        <>
          <div className="flex justify-between items-senter mb-9">
            <h1 className="text-3xl font-bold">Клиенты</h1>

            <Button
              color="primary"
              radius="full"
              onPress={() => router.push(ROUTES.ADMIN_CLIENTS_CREATE + withProjectId())}
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
              <div className="grid grid-cols-3 gap-6">
                {clients?.map((item) => (
                  <SortableUserCard key={item._id} id={item._id}>
                    <UserCard
                      item={item}
                      onEdit={(i: any) => {
                        setCurrent(i);
                        router.push(`${ROUTES.ADMIN_CLIENTS_EDIT}/${i?._id}/${withProjectId()}`);
                      }}
                      onRemove={(i: any) => {
                        setCurrent(i);
                        onDelete();
                      }}
                      onAddMoney={(i: any) => {
                        setCurrent(i);
                        onAddMoney();
                      }}
                    />
                  </SortableUserCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
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

      <AddMoneyModal isOpen={isAddMoney} onClose={closeAddMoney} user={current} />
    </>
  );
}
