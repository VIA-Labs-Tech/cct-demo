# plain-frontend

Minimal React + Vite frontend for `@via-labs-tech/usdm-bridge` — both directions, testnet (Cardano Preprod ↔ Midnight Preview). The package is used through its single `bridgeUSDM` export (the `wallet` param selects browser signing); everything else (wallet discovery, connect, balances) is plain frontend code against the wallet apis.

## Structure

- `src/hooks/useCardanoBridge.ts` — Cardano → Midnight: CIP-30 connect + `bridgeUSDM`, with a `step` state for every phase (building → completing → signing → submitting → confirming).
- `src/hooks/useMidnightBridge.ts` — Midnight → Cardano: connector-v4 connect + `bridgeUSDM` (joining → proving → confirming; proving happens inside the wallet — no proof server).
- `src/hooks/useInjectedWallets.ts` — discovers extensions under `window.cardano` / `window.midnight`.
- `src/lib/cardanoWallet.ts` — CIP-30 balance CBOR decode + address bech32, no chain queries.
- `src/components/` — the two cards, step indicator, wallet buttons. `src/App.tsx` just coordinates.
- `src/config.ts` — network constants, token units, provider selection, explorer links.

The hooks are self-contained — lift them into any React app.

## Run

```bash
npm install
npm run dev
```

Open the printed https URL (self-signed cert — accept the warning; wallet extensions require a secure context). Wallets must be on the testnet pair: a CIP-30 wallet on Cardano **Preprod** with tUSDM + ADA, a connector-v4 Midnight wallet on **Preview** with USDM + DUST.

## Wiring notes

- Configuration is env vars baked in via `define` in `vite.config.ts` (same names as the Node `.env`): `VITE_BLOCKFROST_PREPROD` in `.env` becomes `BLOCKFROST_PROJECT_ID` → Blockfrost; without it the package defaults to the same-origin `/koios` proxy (Koios cannot be called cross-origin).
- `public/artifacts/midnight` is a symlink to the package's `artifacts/midnight/preview` — the ZK assets the Midnight direction fetches at runtime.

