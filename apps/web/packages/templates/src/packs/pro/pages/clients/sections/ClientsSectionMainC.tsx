"use client";

import { addToast, Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderModal } from "../../../components/modals/LoaderModal";
import { getClients, removeClient } from "@/api/core/clientsApi";
import { UserCard } from "../../../components/widgets/UserCard";
import { ConfirmModal } from "../../../components/modals/ConfirmModal";
import { AddMoneyModal } from "../../../components/modals/AddMoneyModal";
import { ROUTES } from "@/packages/templates/common/routes";
import { withProjectId } from "@/api/utils/withProjectId";

export default function ClientsSectionMainC() {
    const router = useRouter();

    const [current, setCurrent] = useState<any>();
    const [loading, setLoading] = useState(false);

    const [clients, setClients] = useState([])

    const load = async () => {
        setLoading(true);
        try {
            const res = await getClients(20);
            setClients(res);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => { load(); }, []);

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
        if (!current?._id) return

        setLoading(true);

        try {
            await removeClient(current._id)
            await load()

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
            setLoading(false)
        }
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

                    <div className="grid grid-cols-3 gap-6">
                        {clients?.map((item: any) => (
                            <UserCard
                                key={item?._id}
                                item={item}
                                onEdit={(i: any) => {
                                    setCurrent(i),
                                        router.push('/' + `/${i?._id}`);
                                }}
                                onRemove={(i: any) => {
                                    setCurrent(i), onDelete();
                                }}
                                onAddMoney={(i: any) => {
                                    setCurrent(i), onAddMoney();
                                }}
                            />
                        ))}
                    </div>
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
