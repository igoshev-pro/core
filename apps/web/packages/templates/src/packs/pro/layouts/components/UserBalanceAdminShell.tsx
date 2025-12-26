'use client'

import { formatMoneyStr } from '@/common/helper/getFormatedMoneyStr'

const UserBalanceAdminShell = () => {
    return (
        <button
            className="cursor-pointer flex flex-col items-start"
            onClick={() =>
                window.open(
                    'https://buy.stripe.com/9B6dR92Tz6ZsfbI6e6co000',
                    '_blank',
                )
            }
        >
            <p className="text-[10px]">
                Баланс{' '}
            </p>
            <p className="text-base font-semibold -mt-1">
                {formatMoneyStr([{ balance: 87400, currency: 'RUB' }], 'RUB')}
            </p>
        </button>
    )
}

export default UserBalanceAdminShell
