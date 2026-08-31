import { useState } from 'react'
import type { MidnightWallet } from '../hooks/useMidnightWallet'
import { useMidnightBalance } from '../hooks/useMidnightBalance'
import { useMidnightBridge, MIDNIGHT_BRIDGE_STEPS } from '../hooks/useMidnightBridge'
import { Steps } from './Steps'
import { WalletButtons } from './WalletButtons'

export function MidnightToCardanoCard({
    wallet,
    cardanoAddress,
}: {
    wallet: MidnightWallet
    /** The other card's connected Cardano address, for the recipient fill. */
    cardanoAddress?: string | null
}) {
    const { balance, refresh } = useMidnightBalance(wallet.api)
    const { bridge, step, result, error } = useMidnightBridge(wallet.name)
    const [amount, setAmount] = useState('')
    const [recipient, setRecipient] = useState('')
    const busy = step !== 'idle' && step !== 'done'

    return (
        <div className="card">
            <h2>Midnight → Cardano</h2>
            <WalletButtons
                wallets={wallet.wallets}
                connecting={wallet.connecting}
                connected={wallet.name}
                onConnect={wallet.connect}
                emptyText="No Midnight wallet found — install a connector-v4 wallet and reload."
            />
            {wallet.address && (
                <p className="addr">
                    {wallet.address}
                    {balance && (
                        <>
                            <br />
                            USDM {balance.usdm} · DUST {balance.dust.toFixed(3)}
                        </>
                    )}
                </p>
            )}
            <div className="row">
                <input placeholder="Amount (USDM), e.g. 0.5" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="row">
                <input
                    placeholder="Cardano address (addr… / addr_test…)"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                {cardanoAddress && <button onClick={() => setRecipient(cardanoAddress)}>use my Cardano wallet</button>}
            </div>
            <div className="row">
                <button
                    className="primary"
                    disabled={!wallet.api || busy || !amount || !recipient}
                    onClick={() =>
                        bridge(amount, recipient).then((res) => {
                            if (res) refresh()
                        })
                    }
                >
                    Bridge to Cardano
                </button>
            </div>
            <Steps steps={MIDNIGHT_BRIDGE_STEPS} current={step} />
            {step === 'proving' && (
                <div className="status">Proving in your wallet — approve the prompt; this can take a minute.</div>
            )}
            {result && (
                <div className="status">
                    Bridged. Midnight tx id: {result.txId}
                    <br />
                    tx hash: {result.txHash}
                    <br />
                    Funds are released on Cardano after the source-chain confirmations.
                </div>
            )}
            {(wallet.error || error) && <div className="status error">{wallet.error || error}</div>}
        </div>
    )
}
