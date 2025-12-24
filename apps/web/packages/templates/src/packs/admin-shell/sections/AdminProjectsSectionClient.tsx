"use client";

import { addToast, Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ConfirmModal } from "../components/modals/ConfirmModal";
import { LoaderModal } from "../components/modals/LoaderModal";
import { getProjects } from "@/api/core/projectsApi";
import { ProjectCard } from "../components/widgets/ProjectCard";

export default function AdminProjectsSection() {
    const router = useRouter();

    const [current, setCurrent] = useState<any>();
    const [loading, setLoading] = useState(false);

    const [projects, setProjects] = useState([])

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await getProjects(20)
                setProjects(res)
            } finally {
                setLoading(false)
            }

        }

        load()
    }, [])


    const {
        isOpen: isDelete,
        onOpen: onDelete,
        onClose: closeDelete,
    } = useDisclosure();

    const onRemove = () => {
        // if (!current?._id) return

        // setLoading(true);

        // removeProject(current?._id)
        //     .unwrap()
        //     .then(() => {
        //         addToast({
        //             color: "success",
        //             title: "Успешно!",
        //             description: `Проект успешно удален`,
        //             variant: "solid",
        //             radius: "lg",
        //             timeout: 3000,
        //             shouldShowTimeoutProgress: true,
        //         });
        //         closeDelete();
        //     })
        //     .catch((err: any) => {
        //         addToast({
        //             color: "danger",
        //             title: "Ошибка!",
        //             description: `Произошла ошибка при удалении проекта`,
        //             variant: "solid",
        //             radius: "lg",
        //             timeout: 3000,
        //             shouldShowTimeoutProgress: true,
        //         });
        //     })
        //     .finally(() => setLoading(false));
    };

    return (
        <>
            <div className="flex justify-between items-senter mb-9">
                <h1 className="text-3xl font-bold">Проекты</h1>

                <Button
                    color="primary"
                    radius="full"
                    onPress={() => router.push('/')}
                >
                    Создать
                </Button>
            </div>

            {loading ? (
                <LoaderModal />
            ) : (
                <div className="grid grid-cols-4 gap-6">
                    {projects?.map((item: any) => (
                        <ProjectCard
                            key={item?._id}
                            project={item}
                            onEdit={(i: any) => {
                                setCurrent(i),
                                    router.push('/' + `/${i?._id}`);
                            }}
                            onRemove={(i: any) => {
                                setCurrent(i), onDelete();
                            }}
                        />
                    ))}
                </div>
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
