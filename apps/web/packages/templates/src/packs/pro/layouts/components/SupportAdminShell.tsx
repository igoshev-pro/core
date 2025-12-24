'use client'

import { Button } from '@heroui/react'
import React from 'react'
import { FaTelegram } from 'react-icons/fa6'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'

const SupportAdminShell = () => {
    return (
        <div className="flex flex-col gap-4">
            <p className="">Служба поддержки</p>
            <div className="flex items-center gap-4 -ml-1.5">
                <Button
                    isIconOnly
                    className="group bg-transparent"
                    radius="full"
                    variant="flat"
                >
                    <FaTelegram className="text-[32px] group-hover:text-primary" />
                </Button>
                <Button
                    isIconOnly
                    className="group bg-transparent"
                    radius="full"
                    variant="flat"
                >
                    <IoLogoWhatsapp className="text-[34px] group-hover:text-primary" />
                </Button>
                <Button
                    isIconOnly
                    className="group bg-transparent"
                    radius="full"
                    variant="flat"
                >
                    <MdEmail className="text-[36px] group-hover:text-primary" />
                </Button>
            </div>
        </div>
    )
}

export default SupportAdminShell