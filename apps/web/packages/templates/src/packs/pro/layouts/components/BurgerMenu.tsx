"use client"

import { Button } from "@heroui/react"
import React, { useEffect, useState } from "react"
import { CgClose, CgMenuRight } from "react-icons/cg"
import { MdDesignServices, MdFactory, MdWork } from "react-icons/md"
import { FaChevronDown, FaChevronRight, FaSitemap, FaUsers } from "react-icons/fa6"
import { IoIosColorPalette } from "react-icons/io"
import { RiLayoutMasonryFill, RiPagesFill } from "react-icons/ri"
import { SiPlatformdotsh } from "react-icons/si"
import { BiSolidWidget } from "react-icons/bi"
import { TbLogout2, TbWorldWww } from "react-icons/tb"
import { IoRocketSharp, IoSettingsSharp } from "react-icons/io5"
import { GiHamburgerMenu } from "react-icons/gi"
import { usePathname, useRouter } from "next/navigation"
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher"
import { logoutAction } from "@/app/api/actions/logout"
import { ThemeSwitch } from "@/components/theme-switch"

type SubItem = {
    label: string
    icon: React.ReactNode
    route: string
    extraClass?: string
}

type MenuItem = {
    label: string
    icon: React.ReactNode
    route: string
    isOpen?: boolean
    extraClass?: string
    submenu?: SubItem[]
}

const parentKey = (route: string) => `parent:${route}`

const BurgerMenu = () => {
    const pathname = usePathname()
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)

    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        {
            label: "Проекты",
            icon: <MdWork className="text-[24px]" />,
            route: `/admin/core/projects`,
        },
        {
            label: "Клиенты",
            icon: <FaUsers className="text-[24px]" />,
            route: `/admin/clients`,
        },
        {
            label: "Фабрика",
            icon: <MdFactory className="text-[24px]" />,
            route: `/admin/factory/templates`,
            isOpen: false,
            submenu: [
                {
                    label: "Шаблоны",
                    icon: <MdDesignServices className="text-[24px] w-[24px] flex justify-center" />,
                    route: "/admin/factory/templates",
                },
                {
                    label: "Темы",
                    icon: <IoIosColorPalette className="text-[24px] w-[24px] flex justify-center" />,
                    route: "/admin/factory/themes",
                },
                {
                    label: "Макеты",
                    icon: <RiLayoutMasonryFill className="text-[21px] w-[24px] flex justify-center" />,
                    route: "/admin/factory/layouts",
                },
                {
                    label: "Страницы",
                    icon: <FaSitemap className="text-[18px] w-[24px] flex justify-center" />,
                    route: "/admin/factory/pages",
                },
                {
                    label: "Секции",
                    icon: <SiPlatformdotsh className="text-[18px] w-[24px] flex justify-center" />,
                    route: "/admin/factory/sections",
                },
                {
                    label: "Виджеты",
                    icon: <BiSolidWidget className="text-[23px] w-[24px] flex justify-center" />,
                    route: "/admin/factory/widgets",
                },
            ],
        },
        {
            label: "Сайт",
            icon: <TbWorldWww className="text-[24px]" />,
            route: `/admin/cms/settings`,
            isOpen: false,
            submenu: [
                {
                    label: "Настройки",
                    icon: <IoSettingsSharp className="text-[22px] w-[24px] flex justify-center" />,
                    route: "/admin/cms/settings",
                },
                {
                    label: "Меню сайта",
                    icon: <GiHamburgerMenu className="text-[22px] w-[24px] flex justify-center" />,
                    route: "/admin/cms/menu",
                },
                {
                    label: "Страницы",
                    icon: <RiPagesFill className="text-[22px] w-[24px] flex justify-center" />,
                    route: "/admin/cms/pages",
                },
            ],
        },
    ])

    // ✅ единый источник "активности"
    // - route для обычных пунктов
    // - parent:<route> для родителя с submenu (чтобы не подсвечивался первый подпункт)
    const [activeKey, setActiveKey] = useState<string>(pathname)

    // если activeKey = parent:..., то никакие route/подпункты не считаем активными по startsWith
    const matchPath = activeKey.startsWith("parent:") ? "" : activeKey
    const isActiveByPath = (route: string) => matchPath.startsWith(route)

    // при реальной навигации синкаем activeKey с url
    useEffect(() => {
        setActiveKey(pathname)
    }, [pathname])

    // автoраскрытие по url (когда реально перешли)
    useEffect(() => {
        setMenuItems((prev) =>
            prev.map((item) => {
                const hasSubmenu = !!item?.submenu?.length
                if (!hasSubmenu) return item

                const shouldBeOpen =
                    pathname.startsWith(item.route) || item.submenu!.some((s) => pathname.startsWith(s.route))

                return { ...item, isOpen: shouldBeOpen }
            }),
        )
    }, [pathname])

    const onEdit = () => {
        setActiveKey("/admin/core/projects/create")
        router.push("/admin/core/projects/create")
    }

    const toggleParentOpen = (parentRoute: string) => {
        setMenuItems((prev) =>
            prev.map((m) => {
                if (m.route !== parentRoute) return { ...m, isOpen: false }
                return { ...m, isOpen: !m.isOpen }
            }),
        )
    }

    return (
        <>
            <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
                <CgMenuRight className="text-4xl hover:text-primary" />
            </button>

            {isOpen ? (
                <div className="fixed min-h-screen min-w-screen bg-background top-0 left-0 bottom-0 right-0 z-30 flex flex-col gap-3 p-4">
                    <div className="flex justify-between items-center gap-6 px-2 min-h-[52px] mb-6">
                        <p className="text-3xl font-semibold ml-1">Меню</p>
                        <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
                            <CgClose className="text-4xl hover:text-primary -mr-1" />
                        </button>
                    </div>

                    <Button
                        className="w-full justify-start"
                        color="primary"
                        radius="full"
                        size="lg"
                        startContent={<IoRocketSharp className="text-[20px] mx-[2px]" />}
                        variant="light"
                        onPress={onEdit}
                    >
                        Новый проект
                    </Button>

                    {menuItems.map((item) => {
                        const hasSubmenu = !!item?.submenu?.length

                        // ✅ родитель активен если:
                        // - он открыт, или
                        // - он выбран кликом (activeKey = parent:...), или
                        // - реальный url внутри него (matchPath startsWith)
                        const parentActive = hasSubmenu
                            ? !!item.isOpen ||
                            activeKey === parentKey(item.route) ||
                            isActiveByPath(item.route) ||
                            item.submenu!.some((s) => isActiveByPath(s.route))
                            : isActiveByPath(item.route)

                        return (
                            <div key={item.route}>
                                <Button
                                    className={`w-full justify-between ${item.extraClass || ""} ${parentActive ? "shadow-custom" : ""}`}
                                    color={parentActive ? "primary" : "default"}
                                    endContent={
                                        hasSubmenu ? (
                                            item.isOpen ? <FaChevronDown className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />
                                        ) : null
                                    }
                                    radius="full"
                                    size="lg"
                                    startContent={item.icon}
                                    variant={parentActive ? ("solid" as any) : ("light" as any)}
                                    onPress={() => {
                                        if (hasSubmenu) {
                                            toggleParentOpen(item.route)
                                            // ✅ делаем активным именно родителя, НЕ подпункт
                                            setActiveKey(parentKey(item.route))
                                            return
                                        }

                                        setMenuItems((prev) => prev.map((m) => ({ ...m, isOpen: false })))
                                        setActiveKey(item.route)
                                        router.push(item.route)
                                    }}
                                >
                                    <span className="flex-1 text-left">{item.label}</span>
                                </Button>

                                {item.isOpen && hasSubmenu ? (
                                    <div className="flex flex-col mt-6 gap-6">
                                        {item.submenu!.map((i) => (
                                            <Button
                                                key={i.route}
                                                className={`w-full justify-start pl-[60px] ${i.extraClass || ""}`}
                                                color={isActiveByPath(i.route) ? "primary" : "default"}
                                                radius="full"
                                                size="lg"
                                                startContent={i.icon}
                                                variant="light"
                                                onPress={() => {
                                                    setActiveKey(i.route)
                                                    router.push(i.route)
                                                }}
                                            >
                                                {i.label}
                                            </Button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )
                    })}

                    <div className="flex items-center justify-between gap-6 px-6 mt-10">
                        <p>Выбор темы</p>
                        <ThemeSwitch className="" />
                    </div>

                    <div className="flex items-center justify-between gap-6 px-6 mt-3 mb-9">
                        <p>Выбор языка</p>
                        <LanguageSwitcher />
                    </div>

                    <Button
                        className="justify-start"
                        variant="light"
                        size="lg"
                        color="danger"
                        radius="full"
                        startContent={<TbLogout2 className="text-2xl" />}
                        onPress={() => logoutAction()}
                    >
                        Выйти
                    </Button>
                </div>
            ) : null}
        </>
    )
}

export default BurgerMenu
