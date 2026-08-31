import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import wasm from 'vite-plugin-wasm'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
// The bridge package's transitive deps live next to the package (repo root
// when symlinked via file:), not in this project's node_modules.
const bridgeNodeModules = path.resolve(path.dirname(require.resolve('@via-labs-tech/usdm-bridge')), '../node_modules')

// Config distilled from example/midnight-bridge (the production frontend) —
// the minimum that makes the Cardano (CML) and Midnight (ledger/onchain-runtime)
// wasm stacks work in Vite.
export default defineConfig(({ mode }) => ({
    define: {
        'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
        // The bridge package is configured by env vars exactly like on a
        // server — bake them in here (same names as the Node .env).
        'process.env': JSON.stringify({
            NETWORK: 'testnet',
            BLOCKFROST_PROJECT_ID: loadEnv(mode, process.cwd(), 'VITE_').VITE_BLOCKFROST_PREPROD ?? '',
        }),
        // The polyfilled process has no `version`, but readable-stream (inside
        // Lucid) reads it at module init — stamp it in at build time.
        'process.version': JSON.stringify('v22.0.0'),
        global: 'globalThis',
    },
    plugins: [
        // The bridge package is a symlinked file: dependency, so the polyfill
        // shim imports injected into its modules resolve from the repo root,
        // where vite-plugin-node-polyfills isn't installed — pin them here.
        {
            name: 'shim-resolver',
            enforce: 'pre',
            resolveId(id: string) {
                // require.resolve lands on the CJS build; the ESM build next to
                // it is what both dev (native ESM) and rollup need.
                if (id.startsWith('vite-plugin-node-polyfills/shims/'))
                    return require.resolve(id).replace(/\.cjs$/, '.js')
            },
        },
        // Wallet extensions require a secure context; basicSsl makes the dev
        // server https so testing from another machine works too.
        react(),
        basicSsl(),
        nodePolyfills({
            include: ['buffer', 'events', 'process', 'util', 'stream', 'string_decoder'],
            globals: { Buffer: true, process: true },
            protocolImports: false,
        }),
        wasm(),
    ],
    resolve: {
        alias: {
            '@midnight-ntwrk/ledger': '@midnight-ntwrk/ledger-v8',
            // ESM build of libsodium-wrappers-sumo has a broken relative import.
            'libsodium-wrappers-sumo': path.join(
                bridgeNodeModules,
                'libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js',
            ),
        },
    },
    optimizeDeps: {
        entries: ['index.html'],
        // Same defines for the dep pre-bundle — that's where readable-stream
        // actually lives (inside the Lucid chunk).
        esbuildOptions: { define: { global: 'globalThis', 'process.version': '"v22.0.0"' } },
        exclude: [
            '@via-labs-tech/usdm-bridge',
            '@midnight-ntwrk/onchain-runtime-v2',
            '@midnight-ntwrk/ledger-v8',
            '@midnight-ntwrk/midnight-js-network-id',
            '@midnight-ntwrk/dapp-connector-api',
        ],
    },
    server: {
        host: true,
        // The bridge package is a file: dependency symlinked to the repo root —
        // let Vite serve its real path.
        fs: { allow: ['.', '../..'] },
        // Koios' responses omit Access-Control-Allow-Origin, so browsers can't
        // call it cross-origin — proxy it same-origin instead. (Blockfrost is
        // CORS-open; set VITE_BLOCKFROST_PREPROD to use it directly.)
        proxy: {
            '/koios': {
                target: 'https://preprod.koios.rest/api/v1',
                changeOrigin: true,
                rewrite: (p: string) => p.replace(/^\/koios/, ''),
            },
        },
    },
    build: { target: 'esnext', commonjsOptions: { transformMixedEsModules: true } },
}))
