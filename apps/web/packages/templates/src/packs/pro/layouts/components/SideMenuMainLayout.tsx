'use client'

import { Button } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaChevronDown, FaChevronRight, FaLaptopCode, FaSitemap, FaUsers } from 'react-icons/fa6';
import { IoRocketSharp } from 'react-icons/io5';
import { MdDesignServices, MdFactory, MdWork } from 'react-icons/md';
import { IoIosColorPalette } from "react-icons/io";
import { RiLayoutMasonryFill } from 'react-icons/ri';
import { SiPlatformdotsh } from "react-icons/si";
import { BiSolidWidget } from 'react-icons/bi';

const SideMenuMainLayout = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [menuItems, setMenuItems] = useState([
        {
            label: "Проекты",
            icon: <MdWork className="text-[24px]" />,
            route: `/admin/projects}`,
        },
        {
            label: "Клиенты",
            icon: <FaUsers className="text-[24px]" />,
            route: `/admin/clients}`,
        },
        {
            label: "Фабрика",
            icon: <MdFactory className="text-[24px]" />,
            route: `/admin/factory`,
            isOpen: false,
            submenu: [
                // {
                //     label: "Фичи",
                //     icon: <FaLaptopCode className="text-[24px]" />,
                //     route: '/admin/factory/features',
                // },
                {
                    label: "Шаблоны",
                    icon: <MdDesignServices className="text-[24px] w-[24px] flex justify-center" />,
                    route: '/admin/factory/templates',
                },
                {
                    label: "Темы",
                    icon: <IoIosColorPalette  className="text-[24px] w-[24px] flex justify-center" />,
                    route: '/admin/factory/themes',
                },
                {
                    label: "Лейауты",
                    icon: <RiLayoutMasonryFill className="text-[21px] w-[24px] flex justify-center" />,
                    route: '/admin/factory/layouts',
                },
                {
                    label: "Страницы",
                    icon: <FaSitemap className="text-[18px] w-[24px] flex justify-center" />,
                    route: '/admin/factory/pages',
                },
                {
                    label: "Секции",
                    icon: <SiPlatformdotsh className="text-[18px] w-[24px] flex justify-center" />,
                    route: '/admin/factory/sections',
                },
                {
                    label: "Виджеты",
                    icon: <BiSolidWidget className="text-[23px] w-[24px] flex justify-center" />,
                    route: '/admin/factory/widgets',
                },
            ],
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

export default SideMenuMainLayout