/** Testnet pair: Cardano Preprod ↔ Midnight Preview. */
export const NETWORK_LABEL = 'testnet — Cardano Preprod ↔ Midnight preview'
export const MIDNIGHT_NETWORK_ID = 'preview'

/** tUSDM on Cardano Preprod (policy id + asset name). */
export const CARDANO_USDM_UNIT = 'e675b46e4d2242c991a8932a99db3044e80515ae14b4c4ccf6b3f4c90014df10745553444d'
/** USDM token color on Midnight Preview. */
export const MIDNIGHT_USDM_TOKEN_COLOR = '003bacd9a361ba0d425e408776020e40271375e8b8de42d73eec046a44947d73'

/**
 * Midnight wallets (1AM, Lace's mnLace) also inject a stub under
 * window.cardano — they can't sign Cardano txs, so keep them out of that list.
 */
export const NOT_CARDANO = /1am|midnight|mnlace/i

// Chain reads are configured by env vars baked in via vite.config define
// (BLOCKFROST_PROJECT_ID → Blockfrost, else the same-origin /koios proxy) —
// nothing to pass at call sites, exactly like on a server.

export const explorerTxUrl = (txHash: string): string => `https://preprod.cardanoscan.io/transaction/${txHash}`
