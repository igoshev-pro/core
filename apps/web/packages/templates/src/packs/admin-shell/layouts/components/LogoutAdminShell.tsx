'use client'

import { logoutAction } from '@/app/api/actions/logout'
import React from 'react'
import { TbLogout2 } from 'react-icons/tb'

const LogoutAdminShell = () => {
    return (
        <TbLogout2
            className="text-danger text-[24px] cursor-pointer ml-[3px]"
            onClick={() => {
                logoutAction()
            }}
        />
    )
}

export default LogoutAdminShell