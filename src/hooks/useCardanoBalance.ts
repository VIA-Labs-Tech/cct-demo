/**
 * ADA + USDM balances of a connected CIP-30 wallet, decoded from the wallet's
 * own getBalance() — no chain queries. `refresh()` re-reads (e.g. after a bridge).
 */
import { useCallback, useEffect, useState } from 'react'
import { decodeBalance } from '../lib/cardanoWallet'
import type { CardanoWalletApi } from './useCardanoWallet'

export function useCardanoBalance(api: CardanoWalletApi | null) {
    const [balance, setBalance] = useState<{ ada: number; usdm: number } | null>(null)

    const refresh = useCallback(async () => {
        if (!api) return
        const { lovelace, usdm } = decodeBalance(await api.getBalance())
        setBalance({ ada: Number(lovelace) / 1e6, usdm: Number(usdm) / 1e6 })
    }, [api])

    useEffect(() => {
        refresh()
    }, [refresh])

    return { balance, refresh }
}
