'use client'

import { withProjectId } from '@/api/utils/withProjectId';
import { Button } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaChevronDown, FaChevronRight, FaUsers } from 'react-icons/fa6';
import { IoRocketSharp } from 'react-icons/io5';
import { MdWork } from 'react-icons/md';

const SideMenuAdminShell = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [menuItems, setMenuItems] = useState([
        {
            label: "Проекты",
            icon: <MdWork className="text-[24px]" />,
            route: `/admin/projects${withProjectId()}`,
        },
        {
            label: "Клиенты",
            icon: <FaUsers className="text-[24px]" />,
            route: `/admin/clients${withProjectId()}`,
        }
    ]);

    const isActive = (route: string) => pathname.startsWith(route);

    const onEdit = () => {

    }

    return (
        <div className="flex flex-col w-full gap-6">
            <Button
                className={`w-full justify-start`}
                color={"primary"}
                radius="full"
                size="lg"
                startContent={
                    <IoRocketSharp className="text-[20px] mx-[2px]" />
                }
                variant={"light"}
                onPress={() => onEdit()}
            >
                Новый проект
            </Button>

            {menuItems?.map((item: any) => (
                <div key={item.route}>
                    <Button
                        className={`w-full justify-between ${item.extraClass || ""} ${isActive(item.route) ? "shadow-custom" : ""
                            }`}
                        color={isActive(item.route) ? "primary" : "default"}
                        endContent={
                            item?.submenu?.length ? (
                                item?.isOpen ? (
                                    <FaChevronDown className="text-[10px]" />
                                ) : (
                                    <FaChevronRight className="text-[10px]" />
                                )
                            ) : null
                        }
                        radius="full"
                        size="lg"
                        startContent={item.icon}
                        variant={isActive(item.route) ? "solid" : "light"}
                        onPress={() => {
                            router.push(item.route);
                            setMenuItems((prev: any) =>
                                prev.map((menuItem: any) =>
                                    menuItem.route === item.route
                                        ? { ...menuItem, isOpen: !item?.isOpen }
                                        : { ...menuItem, isOpen: false },
                                ),
                            );
                        }}
                    >
                        <span className="flex-1 text-left">{item?.label}</span>
                    </Button>

                    {item?.isOpen && item?.submenu?.length ? (
                        <div className="flex flex-col mt-6 gap-6">
                            {item?.submenu?.map((i: any) => (
                                <Button
                                    key={i.route}
                                    className={`w-full justify-start pl-[60px] ${i.extraClass || ""} `}
                                    color={isActive(i.route) ? "primary" : "default"}
                                    radius="full"
                                    size="lg"
                                    startContent={i.icon}
                                    variant={"light"}
                                    onPress={() => {
                                        router.push(i.route);
                                    }}
                                >
                                    {i.label}
                                </Button>
                            ))}
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    )

}

export default SideMenuAdminShell