# Anchor Vault

Anchor Vault is a Solana time-lock vault built with Anchor and a React/Vite frontend. The on-chain program lets a user initialize a personal vault, deposit SOL, withdraw after the lock expires, and close the vault when it is no longer locked.

## Features

- User-specific vault and state PDAs
- Configurable lock duration at initialization
- SOL deposits through the system program
- Time-gated withdrawals and vault closure
- React frontend with Solana wallet adapter support
- Environment-based RPC URL and program ID configuration

## Tech Stack

- Solana + Anchor
- Rust
- TypeScript
- React
- Vite
- Solana Wallet Adapter

## Project Structure

```text
.
├── backend/
│   ├── Anchor.toml
│   ├── programs/backend/src/
│   │   ├── lib.rs
│   │   ├── instructions/
│   │   ├── state.rs
│   │   └── error.rs
│   └── migrations/
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── idl/
    │   └── lib/
    └── package.json
```

## Prerequisites

Install the following before running the project:

- Rust
- Solana CLI
- Anchor CLI
- Node.js
- Yarn or npm

## Backend Setup

```bash
cd backend
yarn install
anchor build
```

Run tests:

```bash
anchor test
```

Start a local validator if needed:

```bash
solana-test-validator
```

Deploy to localnet:

```bash
anchor deploy
```

The localnet program ID is configured in `backend/Anchor.toml`:

```text
ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK
```

## Frontend Setup

```bash
cd Frontend
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

If `.env.example` is not present, create `.env` with:

```env
VITE_SOLANA_RPC_URL=http://127.0.0.1:8899
VITE_BACKEND_PROGRAM_ID=ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK
```

Run the frontend:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Program Instructions

### `initialize(lock_duration)`

Creates the user's vault state account and stores the lock expiry timestamp.

### `deposit(amount)`

Transfers SOL from the user wallet into the user's vault PDA.

### `withdraw(amount)`

Transfers SOL from the vault PDA back to the user after the lock expires.

### `close()`

Transfers the remaining SOL from the vault PDA to the user and closes the vault state account after the lock expires.

## PDA Seeds

The program derives user-scoped accounts with the following seeds:

```text
vault_state: ["state", user_pubkey]
vault:       ["vault", user_pubkey]
```

## Environment Variables

The frontend uses:

```env
VITE_SOLANA_RPC_URL=
VITE_BACKEND_PROGRAM_ID=
```

Never commit `.env` files or private keys. If secrets were pushed to GitHub, rotate them and remove the files from Git history.

## Security Notes

- Withdrawals and vault closure are blocked until `lock_until` has passed.
- `lock_duration` must be greater than zero.
- Each vault is tied to the initializing user through PDA seeds and account ownership checks.
- The current project is suitable for local development and learning. Review and test thoroughly before using with real funds.

## License

ISC
