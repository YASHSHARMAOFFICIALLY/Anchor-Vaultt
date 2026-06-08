# Anchor Vault Frontend

This is the React/Vite frontend for the Anchor Vault Solana program. It provides wallet connection support and reads the configured RPC endpoint and Anchor program ID from Vite environment variables.

## Tech Stack

- React
- TypeScript
- Vite
- Solana Wallet Adapter
- Anchor TypeScript client

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```env
VITE_SOLANA_RPC_URL=http://127.0.0.1:8899
VITE_BACKEND_PROGRAM_ID=ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Source Layout

```text
src/
├── components/
│   ├── provider.tsx
│   ├── Walletconnect.tsx
│   └── WalletInfo.tsx
├── idl/
│   ├── backend.json
│   └── backend.ts
├── lib/
│   ├── constant.ts
│   ├── pdas.ts
│   └── program.ts
├── App.tsx
└── main.tsx
```

## Environment Variables

```env
VITE_SOLANA_RPC_URL=
VITE_BACKEND_PROGRAM_ID=
```

Keep `.env` out of version control. Use `.env.example` for shareable configuration templates.
