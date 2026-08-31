import { useCardanoWallet } from './hooks/useCardanoWallet'
import { useMidnightWallet } from './hooks/useMidnightWallet'
import { CardanoToMidnightCard } from './components/CardanoToMidnightCard'
import { MidnightToCardanoCard } from './components/MidnightToCardanoCard'
import { NETWORK_LABEL } from './config'

/**
 * Coordinator: owns the two wallet connections and crosses their addresses
 * over, so each card can offer "send to my other wallet". Balances and
 * bridging live in each card's own hooks.
 */
export default function App() {
    const cardano = useCardanoWallet()
    const midnight = useMidnightWallet()

    return (
        <>
            <h1>USDM Bridge</h1>
            <p className="net">network: {NETWORK_LABEL}</p>
            <CardanoToMidnightCard wallet={cardano} midnightAddress={midnight.address} />
            <MidnightToCardanoCard wallet={midnight} cardanoAddress={cardano.address} />
        </>
    )
}
