import { useEffect, useState } from 'react'

export interface InjectedWallet<T> {
    /** The wallet's name — its property on window.cardano / window.midnight (what bridgeUSDM takes). */
    name: string
    /** Human-readable label the extension reports, for buttons. */
    label: string
    api: T
}

/**
 * Discover wallet extensions injected under a window namespace
 * (window.cardano / window.midnight). Extensions inject asynchronously, so the
 * scan re-runs a few times after mount.
 */
export function useInjectedWallets<T extends { name?: string }>(
    scan: () => Record<string, T> | undefined,
    exclude?: RegExp,
): InjectedWallet<T>[] {
    const [wallets, setWallets] = useState<InjectedWallet<T>[]>([])

    useEffect(() => {
        const run = () =>
            setWallets(
                Object.entries(scan() ?? {})
                    .filter(([name, w]) => !exclude || (!exclude.test(name) && !exclude.test(w?.name ?? '')))
                    .map(([name, w]) => ({ name, label: w?.name ?? name, api: w })),
            )
        run()
        const timers = [250, 1000, 3000].map((d) => setTimeout(run, d))
        return () => timers.forEach(clearTimeout)
        // scan/exclude are expected to be stable (module-level values).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return wallets
}
