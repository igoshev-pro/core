'use client'

import { Badge } from "@heroui/react"
import { useRouter } from "next/navigation"
import { IoNotifications } from "react-icons/io5"

export const NotificationsAdminShell = () => {
    const router = useRouter()
    return (
        <button
            className="flex items-center"
            onClick={() => router.push('/admin')}
        >
            <Badge
                className="mr-2 mt-px cursor-pointer"
                color="danger"
                content={4}
                isInvisible={false}
                shape="circle"
            >
                <IoNotifications className="text-[22px] text-foreground-500 mr-2 mt-px cursor-pointer" />
            </Badge>
        </button>
    )
}