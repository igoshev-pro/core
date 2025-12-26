'use client'

import { logoutAction } from '@/app/api/actions/logout'
import { Button } from '@heroui/react'
import React from 'react'
import { TbLogout2 } from 'react-icons/tb'

const LogoutAdminShell = () => {
    return (
        <Button isIconOnly variant='light' size='lg' color="danger" radius='full' onPress={() => {
            logoutAction()
        }}>
            <TbLogout2 className='text-[34px] pr-1'/>
        </Button>
    )
}

export default LogoutAdminShell