'use client'

import { useMe } from '@/app/(admin)/admin/MeClient'
import { formatMoneyStr } from '@/common/helper/getFormatedMoneyStr'

const UserBalanceAdminShell = () => {
    const me = useMe()
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
                <span className="text-base font-semibold ml-[3px]">
                    {formatMoneyStr([{ balance: 87400, currency: 'RUB' }], 'RUB')}
                </span>
            </p>
        </button>
    )
}

export default UserBalanceAdminShell
