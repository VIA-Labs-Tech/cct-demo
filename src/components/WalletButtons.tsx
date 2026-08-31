import type { InjectedWallet } from '../hooks/useInjectedWallets'

/** One connect button per detected wallet extension; once one is connected, just its name. */
export function WalletButtons<T>({
    wallets,
    connecting,
    connected,
    onConnect,
    emptyText,
}: {
    wallets: InjectedWallet<T>[]
    connecting: boolean
    /** Name of the connected wallet (its window property) — collapses the buttons. */
    connected?: string | null
    onConnect: (wallet: InjectedWallet<T>) => void
    emptyText: string
}) {
    if (connected) {
        const label = wallets.find((w) => w.name === connected)?.label ?? connected
        return <div className="row connected">connected: {label}</div>
    }
    if (wallets.length === 0) return <div className="row">{emptyText}</div>
    return (
        <div className="row">
            {wallets.map((w) => (
                <button key={w.name} disabled={connecting} onClick={() => onConnect(w)}>
                    Connect {w.label}
                </button>
            ))}
        </div>
    )
}
