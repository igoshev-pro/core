"use client"

import { Button } from '@heroui/react'
import React from 'react'
import { CgMenuRight } from 'react-icons/cg'

const BurgerMenu = () => {
    return (
        <button className='cursor-pointer'>
            <CgMenuRight className="text-4xl hover:text-primary" />
        </ button>
    )
}

export default BurgerMenu