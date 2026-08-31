/**
 * Midnight -> Cardano bridging. The entire bridge is ONE bridgeUSDM call —
 * the package joins the gateway, proves inside the wallet (no proof server),
 * submits, and confirms; `step` streams every phase for the UI.
 */
import { useCallback, useState } from 'react'
import { bridgeUSDM } from '@via-labs-tech/usdm-bridge'

export const MIDNIGHT_BRIDGE_STEPS = ['joining', 'proving', 'confirming'] as const
export type MidnightBridgeStep = (typeof MIDNIGHT_BRIDGE_STEPS)[number] | 'idle' | 'done'

/** `wallet` is the wallet name under window.midnight (e.g. '1am') — the package finds and uses it. */
export function useMidnightBridge(wallet: string | null) {
    const [step, setStep] = useState<MidnightBridgeStep>('idle')
    const [result, setResult] = useState<{ txId: string; txHash: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const bridge = useCallback(
        async (amount: string, recipient: string) => {
            if (!wallet) throw new Error('Connect a Midnight wallet first')
            setError(null)
            setResult(null)
            try {
                const { txId, txHash } = await bridgeUSDM({
                    direction: 'midnight-to-cardano',
                    amount,
                    recipient,
                    wallet,
                    onStatus: (s) => setStep(s as MidnightBridgeStep),
                })
                const value = { txId: txId!, txHash }
                setResult(value)
                setStep('done')
                return value
            } catch (err) {
                setStep('idle')
                setError(err instanceof Error ? err.message : String(err))
                return null
            }
        },
        [wallet],
    )

    return { bridge, step, result, error }
}

export type MidnightBridge = ReturnType<typeof useMidnightBridge>
