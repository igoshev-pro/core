'use client'

import { getMeClient } from '@/api/core/clientsApi'
import { getMeSuperAdmin } from '@/api/core/superAdminsApi'
import { formatMoneyStr } from '@/common/helper/getFormatedMoneyStr'
import { useEffect, useState } from 'react'

const UserBalanceAdminShell = () => {
    const [me, setMe] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            try {
                const [clientMe, superMe] = await Promise.all([
                    getMeClient(),
                    getMeSuperAdmin(),
                ])

                if (cancelled) return

                setMe(superMe ?? clientMe ?? null)
            } catch (e) {
                console.error('Failed to load me', e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [])

    if (loading || !me) return null

    return (
        <button
            className="mt-[5px] cursor-pointer flex items-center"
            onClick={() =>
                window.open(
                    'https://buy.stripe.com/9B6dR92Tz6ZsfbI6e6co000',
                    '_blank',
                )
            }
        >
            <p className="text-xs">
                Ваш баланс{' '}
                <span className="text-primary text-base ml-[3px]">
                    {formatMoneyStr([{ balance: 0, currency: 'RUB' }], 'RUB')}
                </span>
            </p>
        </button>
    )
}

export default UserBalanceAdminShell
