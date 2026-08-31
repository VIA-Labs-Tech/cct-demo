import { useState } from 'react'
import type { CardanoWallet } from '../hooks/useCardanoWallet'
import { useCardanoBalance } from '../hooks/useCardanoBalance'
import { useCardanoBridge, CARDANO_BRIDGE_STEPS } from '../hooks/useCardanoBridge'
import { Steps } from './Steps'
import { WalletButtons } from './WalletButtons'
import { explorerTxUrl } from '../config'

export function CardanoToMidnightCard({
    wallet,
    midnightAddress,
}: {
    wallet: CardanoWallet
    /** The other card's connected Midnight address, for the recipient fill. */
    midnightAddress?: string | null
}) {
    const { balance, refresh } = useCardanoBalance(wallet.api)
    const { bridge, step, txHash, error } = useCardanoBridge(wallet.name)
    const [amount, setAmount] = useState('')
    const [recipient, setRecipient] = useState('')
    const busy = step !== 'idle' && step !== 'done'

    return (
        <div className="card">
            <h2>Cardano → Midnight</h2>
            <WalletButtons
                wallets={wallet.wallets}
                connecting={wallet.connecting}
                connected={wallet.name}
                onConnect={wallet.connect}
                emptyText="No CIP-30 wallet found — install Eternl (or similar) and reload."
            />
            {wallet.address && (
                <p className="addr">
                    {wallet.address}
                    {balance && (
                        <>
                            <br />
                            ADA {balance.ada} · USDM {balance.usdm}
                        </>
                    )}
                </p>
            )}
            <div className="row">
                <input placeholder="Amount (USDM), e.g. 0.5" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="row">
                <input
                    placeholder="Midnight address (mn_addr_… or 64-hex)"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                {midnightAddress && <button onClick={() => setRecipient(midnightAddress)}>use my Midnight wallet</button>}
            </div>
            <div className="row">
                <button
                    className="primary"
                    disabled={!wallet.api || busy || !amount || !recipient}
                    onClick={() =>
                        bridge(amount, recipient).then((hash) => {
                            if (hash) refresh()
                        })
                    }
                >
                    Bridge to Midnight
                </button>
            </div>
            <Steps steps={CARDANO_BRIDGE_STEPS} current={step} />
            {step === 'signing' && <div className="status">Check your wallet popup to sign.</div>}
            {txHash && (
                <div className="status">
                    Bridged. Cardano tx:{' '}
                    <a href={explorerTxUrl(txHash)} target="_blank" rel="noreferrer">
                        {txHash}
                    </a>
                    <br />
                    Funds arrive on Midnight after the source-chain confirmations.
                </div>
            )}
            {(wallet.error || error) && <div className="status error">{wallet.error || error}</div>}
        </div>
    )
}
