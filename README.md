# cct-demo

Reference frontend for the **Via Labs quest: Midnight ↔ Cardano**. Transfers USDM both directions (Cardano Preprod ↔ Midnight Preview) with [`@via-labs-tech/usdm-bridge`](https://www.npmjs.com/package/@via-labs-tech/usdm-bridge) — one call:

```ts
import { bridgeUSDM } from '@via-labs-tech/usdm-bridge'

const { txHash } = await bridgeUSDM({
    direction: 'cardano-to-midnight', // or 'midnight-to-cardano'
    amount: '5',
    recipient: 'mn_addr_...',
    wallet: 'eternl', // extension name on window.cardano / window.midnight
})
```

Everything else here is plain frontend code: wallet discovery, connect, balances, progress UI.

## Run

```bash
cp .env.example .env   # optional Blockfrost key; empty = Koios via the /koios proxy
npm install
npm run dev
```

Open the printed **https** URL (self-signed cert — accept the warning). Wallets: a CIP-30 wallet on **Preprod** with tUSDM + ADA, a connector-v4 Midnight wallet on **Preview** with USDM + DUST.

## Where to look

- `src/hooks/useCardanoBridge.ts` — Cardano → Midnight (building → completing → signing → submitting → confirming)
- `src/hooks/useMidnightBridge.ts` — Midnight → Cardano (joining → proving → confirming; proving happens inside the wallet)
- `src/hooks/useInjectedWallets.ts` — extension discovery
- `src/lib/cardanoWallet.ts` — CIP-30 balance decode + bech32
- `src/components/`, `src/App.tsx` — cards, steps, buttons
- `src/config.ts` — networks, token units, explorer links

The hooks are self-contained — lift them into any React app.

## Notes

- Env vars are baked in via `define` in `vite.config.ts`: `VITE_BLOCKFROST_PREPROD` → Blockfrost; unset → same-origin `/koios` proxy (public Koios has no CORS).
- `public/artifacts/midnight` symlinks the package's ZK assets (`artifacts/midnight/preview`).
- Full build-setup details: `node_modules/@via-labs-tech/usdm-bridge/FRONTEND.md`.
