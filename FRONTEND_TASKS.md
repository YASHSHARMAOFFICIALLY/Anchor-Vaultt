# Frontend Tasks for Anchor Vault

Goal: build a small frontend for the Anchor vault program inside `backend/`.

Use this checklist slowly. Do one checkbox, test it, then move to the next one.

## Rules Before Starting

- [ ] Work on `localnet` first.
- [ ] Do not use mainnet.
- [ ] Do not paste private keys or seed phrases into the frontend.
- [ ] Keep every change small.
- [ ] If something breaks, fix that one thing before adding a new feature.

## Current Backend Facts

- Program folder: `backend/`
- Program ID: `ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK`
- IDL file: `backend/target/idl/backend.json`
- Type file: `backend/target/types/backend.ts`
- Cluster in `backend/Anchor.toml`: `localnet`

## What The Program Does

- `initialize(lock_duration)`
  - Creates the user's vault state.
  - Saves the lock end time.
- `deposit(amount)`
  - Moves SOL from user wallet into the vault PDA.
- `withdraw(amount)`
  - Moves SOL from vault PDA back to user.
  - Only works after lock time ends.
- `close()`
  - Sends all remaining vault SOL back to user.
  - Closes the vault state account.
  - Only works after lock time ends.

## Program Accounts

- User wallet:
  - The connected wallet.
- `vault_state` PDA:
  - Seeds: `["state", userPublicKey]`
  - Stores user, created time, lock time, bumps.
- `vault` PDA:
  - Seeds: `["vault", userPublicKey]`
  - Holds SOL lamports.
- System program:
  - `11111111111111111111111111111111`

## Suggested Frontend Stack

Use this beginner path first:

- React
- Vite
- TypeScript
- `@anchor-lang/core`
- `@solana/web3.js`
- Solana wallet adapter

Why Vite: this project uses Anchor CLI `1.0.0` and `@anchor-lang/core`. The package notes that webpack 5 needs extra polyfills, so Vite is the smaller first step than Next.js.

## Folder Decision

There is already an empty `Frontend/` folder.

- [ ] Use the existing `Frontend/` folder.
- [ ] Keep the backend in `backend/`.
- [ ] Keep the frontend in `Frontend/`.
- [ ] Do not mix frontend files inside `backend/programs/`.

## Phase 1: Check Backend Builds

- [ ] Open terminal.
- [ ] Go to backend:

```bash
cd backend
```

- [ ] Install backend packages if needed:

```bash
yarn install
```

- [ ] Build the Anchor program:

```bash
NO_DNA=1 anchor build
```

- [ ] Confirm this file exists:

```text
backend/target/idl/backend.json
```

- [ ] Confirm this file exists:

```text
backend/target/types/backend.ts
```

- [ ] Do not start frontend work until the IDL exists.

## Phase 2: Run Local Validator

- [ ] Open a second terminal.
- [ ] Start local validator:

```bash
solana-test-validator --reset
```

- [ ] Leave this terminal running.
- [ ] Open another terminal.
- [ ] Go to backend:

```bash
cd backend
```

- [ ] Deploy the program:

```bash
NO_DNA=1 anchor deploy
```

- [ ] Confirm deployed program ID matches:

```text
ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK
```

## Phase 3: Create The React App

- [ ] Go back to project root:

```bash
cd /Users/yashsharma/web3_project/anchor_vault
```

- [ ] Create a Vite React app inside the existing folder:

```bash
npm create vite@latest Frontend -- --template react-ts
```

- [ ] If Vite says the folder is not empty, check it first.
- [ ] If the folder is empty, continue.
- [ ] Go to frontend:

```bash
cd Frontend
```

- [ ] Install packages:

```bash
npm install
```

- [ ] Start dev server:

```bash
npm run dev
```

- [ ] Open the local URL shown in terminal.
- [ ] Confirm the default Vite page loads.

## Phase 4: Clean The Starter UI

- [ ] Open `Frontend/src/App.tsx`.
- [ ] Remove the default counter.
- [ ] Show only this text first:

```text
Anchor Vault Frontend
```

- [ ] Save.
- [ ] Confirm browser updates.
- [ ] Open `Frontend/src/App.css`.
- [ ] Remove styles you do not need.
- [ ] Keep the page simple.

## Phase 5: Install Solana Frontend Packages

- [ ] Stop dev server if it is running.
- [ ] From `Frontend/`, install Solana packages:

```bash
npm install @anchor-lang/core @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets bn.js buffer
```

- [ ] Install BN types:

```bash
npm install -D @types/bn.js
```

- [ ] Start dev server again:

```bash
npm run dev
```

- [ ] Confirm app still loads.

## Phase 6: Add Environment Values

- [ ] Create `Frontend/.env.local`.
- [ ] Add localnet RPC:

```env
VITE_SOLANA_RPC_URL=http://127.0.0.1:8899
VITE_BACKEND_PROGRAM_ID=ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK
```

- [ ] Restart dev server after adding env values.
- [ ] Create `Frontend/src/lib/constants.ts`.
- [ ] Read `VITE_SOLANA_RPC_URL` from `import.meta.env`.
- [ ] Read `VITE_BACKEND_PROGRAM_ID` from `import.meta.env`.
- [ ] Export both values.
- [ ] Show the program ID on the page.
- [ ] Confirm it appears in browser.

## Phase 7: Copy IDL Into Frontend

- [ ] Create folder:

```text
Frontend/src/idl/
```

- [ ] Copy this file:

```text
backend/target/idl/backend.json
```

- [ ] Paste it here:

```text
Frontend/src/idl/backend.json
```

- [ ] Copy this file:

```text
backend/target/types/backend.ts
```

- [ ] Paste it here:

```text
Frontend/src/idl/backend.ts
```

- [ ] Remember: after every `anchor build`, copy fresh IDL files again.

## Phase 8: Create Small Helper Files

- [ ] Create `Frontend/src/lib/format.ts`.
- [ ] Add a helper to convert lamports to SOL.
- [ ] Add a helper to convert SOL input to lamports.
- [ ] Add a helper to format unix seconds into readable date.
- [ ] Create `Frontend/src/lib/pdas.ts`.
- [ ] Add a function to find `vault_state` PDA.
- [ ] Add a function to find `vault` PDA.
- [ ] Use seed `"state"` for `vault_state`.
- [ ] Use seed `"vault"` for `vault`.
- [ ] Use connected wallet public key as second seed.
- [ ] Return both PDA public keys.

## Phase 9: Add Wallet Provider

- [ ] Open `Frontend/src/main.tsx`.
- [ ] Import wallet adapter CSS:

```ts
import "@solana/wallet-adapter-react-ui/styles.css";
```

- [ ] Create `Frontend/src/components/Providers.tsx`.
- [ ] Add `ConnectionProvider`.
- [ ] Use RPC URL from env.
- [ ] Add `WalletProvider`.
- [ ] Add `WalletModalProvider`.
- [ ] Wrap `<App />` with `<Providers>`.
- [ ] Save.
- [ ] Confirm browser still loads.

## Phase 10: Add Wallet Button

- [ ] Create `Frontend/src/components/WalletConnect.tsx`.
- [ ] Import `WalletMultiButton`.
- [ ] Render the wallet button.
- [ ] Add `WalletConnect` to `App.tsx`.
- [ ] Open browser.
- [ ] Click connect.
- [ ] Connect Phantom, Backpack, or another local wallet.
- [ ] Confirm the wallet address appears in the button.

## Phase 11: Show Connected Wallet Address

- [ ] Create `Frontend/src/components/WalletInfo.tsx`.
- [ ] Use `useWallet()`.
- [ ] If no wallet, show:

```text
Wallet not connected
```

- [ ] If wallet exists, show public key.
- [ ] Add `WalletInfo` to `App.tsx`.
- [ ] Confirm address updates after connect.

## Phase 12: Show User SOL Balance

- [ ] In `WalletInfo.tsx`, use `useConnection()`.
- [ ] When wallet connects, call `connection.getBalance(publicKey)`.
- [ ] Store balance in state.
- [ ] Convert lamports to SOL.
- [ ] Show user SOL balance.
- [ ] Add a refresh button.
- [ ] Click refresh.
- [ ] Confirm balance updates.

## Phase 13: Airdrop Localnet SOL

- [ ] Copy your connected wallet public key.
- [ ] In terminal, airdrop localnet SOL:

```bash
solana airdrop 2 YOUR_WALLET_PUBLIC_KEY --url http://127.0.0.1:8899
```

- [ ] Refresh frontend balance.
- [ ] Confirm wallet has SOL.

## Phase 14: Create Anchor Program Client

- [ ] Create `Frontend/src/lib/program.ts`.
- [ ] Import `Connection`.
- [ ] Import `PublicKey`.
- [ ] Import `AnchorProvider`.
- [ ] Import `Program`.
- [ ] Import IDL JSON.
- [ ] Import `Backend` type.
- [ ] Create a function named `getProgram`.
- [ ] Pass `connection`.
- [ ] Pass wallet adapter wallet.
- [ ] Create `AnchorProvider`.
- [ ] Create `Program<Backend>`.
- [ ] Return the program.
- [ ] Keep this file small.

## Phase 15: Read Vault State

- [ ] Create `Frontend/src/hooks/useVault.ts`.
- [ ] Use connected wallet public key.
- [ ] If no wallet, return empty state.
- [ ] Derive `vault_state` PDA.
- [ ] Derive `vault` PDA.
- [ ] Fetch `vault_state` account.
- [ ] If account does not exist, return `isInitialized: false`.
- [ ] Fetch vault PDA balance with `connection.getBalance(vaultPda)`.
- [ ] Return:
  - `isInitialized`
  - `vaultStatePda`
  - `vaultPda`
  - `vaultBalance`
  - `createdAt`
  - `lockUntil`
  - `isLocked`
  - `secondsRemaining`
- [ ] Add a `refresh()` function.
- [ ] Do not add transactions yet.

## Phase 16: Show Vault Status UI

- [ ] Create `Frontend/src/components/VaultStatus.tsx`.
- [ ] Use `useVault()`.
- [ ] If wallet is not connected, show simple message.
- [ ] If vault is not initialized, show:

```text
Vault not initialized
```

- [ ] If vault is initialized, show vault PDA.
- [ ] Show vault balance in SOL.
- [ ] Show created time.
- [ ] Show lock end time.
- [ ] Show locked or unlocked.
- [ ] Show seconds remaining.
- [ ] Add refresh button.
- [ ] Confirm it works before adding forms.

## Phase 17: Initialize Form

- [ ] Create `Frontend/src/components/InitializeVaultForm.tsx`.
- [ ] Add input for lock duration in seconds.
- [ ] Default value: `60`.
- [ ] Disable form if wallet is not connected.
- [ ] Disable form if vault already exists.
- [ ] On submit, call `initialize(lock_duration)`.
- [ ] Convert input to BN.
- [ ] Use accounts:
  - `user`
  - `vault_state`
  - `vault`
  - `system_program`
- [ ] Show loading text while transaction is pending.
- [ ] Show transaction signature after success.
- [ ] Refresh vault status after success.
- [ ] Test with `60` seconds.

## Phase 18: Deposit Form

- [ ] Create `Frontend/src/components/DepositForm.tsx`.
- [ ] Add input for amount in SOL.
- [ ] Default value: `0.1`.
- [ ] Disable if wallet is not connected.
- [ ] Disable if vault is not initialized.
- [ ] Convert SOL input to lamports.
- [ ] Convert lamports to BN.
- [ ] On submit, call `deposit(amount)`.
- [ ] Use accounts:
  - `user`
  - `vault_state`
  - `vault`
  - `system_program`
- [ ] Show loading text.
- [ ] Show transaction signature.
- [ ] Refresh wallet balance.
- [ ] Refresh vault balance.
- [ ] Confirm vault balance increases.

## Phase 19: Withdraw Form

- [ ] Create `Frontend/src/components/WithdrawForm.tsx`.
- [ ] Add input for amount in SOL.
- [ ] Default value: `0.05`.
- [ ] Disable if wallet is not connected.
- [ ] Disable if vault is not initialized.
- [ ] Disable if vault is still locked.
- [ ] Convert SOL input to lamports.
- [ ] Convert lamports to BN.
- [ ] On submit, call `withdraw(amount)`.
- [ ] Use accounts:
  - `user`
  - `vault_state`
  - `vault`
  - `system_program`
- [ ] Show loading text.
- [ ] Show transaction signature.
- [ ] Refresh wallet balance.
- [ ] Refresh vault balance.
- [ ] Confirm withdraw fails before lock ends.
- [ ] Confirm withdraw works after lock ends.

## Phase 20: Close Button

- [ ] Create `Frontend/src/components/CloseVaultButton.tsx`.
- [ ] Disable if wallet is not connected.
- [ ] Disable if vault is not initialized.
- [ ] Disable if vault is still locked.
- [ ] On click, call `close()`.
- [ ] Use accounts:
  - `user`
  - `vault`
  - `vault_state`
  - `system_program`
- [ ] Show loading text.
- [ ] Show transaction signature.
- [ ] Refresh wallet balance.
- [ ] Refresh vault status.
- [ ] Confirm vault state disappears after close.

## Phase 21: Error Messages

- [ ] Create `Frontend/src/lib/errors.ts`.
- [ ] Map `VaultLocked` to:

```text
Vault is still locked. Wait until the unlock time.
```

- [ ] Map `InvalidLockDuration` to:

```text
Lock duration must be greater than zero.
```

- [ ] Map `LockDurationOverflow` to:

```text
Lock duration is too large.
```

- [ ] Show clean error text in each form.
- [ ] Test invalid lock duration.
- [ ] Test withdraw before unlock.

## Phase 22: Basic Page Layout

- [ ] Keep one page only.
- [ ] Put wallet button at top.
- [ ] Put wallet balance under wallet button.
- [ ] Put vault status next.
- [ ] Put initialize form next.
- [ ] Put deposit form next.
- [ ] Put withdraw form next.
- [ ] Put close button last.
- [ ] Keep styling simple.
- [ ] Do not add routing yet.
- [ ] Do not add dashboard pages yet.

## Phase 23: Local Manual Test

- [ ] Start local validator.
- [ ] Deploy program.
- [ ] Start frontend.
- [ ] Connect wallet.
- [ ] Airdrop SOL.
- [ ] Initialize vault with `60` seconds.
- [ ] Confirm vault state appears.
- [ ] Deposit `0.1` SOL.
- [ ] Confirm vault balance increases.
- [ ] Try withdraw before 60 seconds.
- [ ] Confirm it fails with locked message.
- [ ] Wait until lock ends.
- [ ] Withdraw `0.05` SOL.
- [ ] Confirm vault balance decreases.
- [ ] Close vault.
- [ ] Confirm vault state disappears.

## Phase 24: Small Code Cleanup

- [ ] Remove unused imports.
- [ ] Remove console logs you do not need.
- [ ] Keep helper files small.
- [ ] Keep components small.
- [ ] Make every button disabled during loading.
- [ ] Make every form validate empty input.
- [ ] Make every form validate amount greater than zero.
- [ ] Run TypeScript build:

```bash
npm run build
```

- [ ] Fix TypeScript errors one by one.

## Phase 25: Only After Localnet Works

- [ ] Deploy backend to devnet.
- [ ] Update `VITE_SOLANA_RPC_URL` to devnet RPC.
- [ ] Update `VITE_BACKEND_PROGRAM_ID` if program ID changed.
- [ ] Copy fresh IDL into frontend.
- [ ] Switch wallet to devnet.
- [ ] Airdrop devnet SOL.
- [ ] Repeat the manual test.
- [ ] Do not use mainnet yet.

## Tiny Commit Plan

If you use git, commit in small chunks:

- [ ] Commit 1: create Vite app.
- [ ] Commit 2: add wallet connect.
- [ ] Commit 3: add constants and IDL.
- [ ] Commit 4: add PDA helpers.
- [ ] Commit 5: add vault status read.
- [ ] Commit 6: add initialize.
- [ ] Commit 7: add deposit.
- [ ] Commit 8: add withdraw.
- [ ] Commit 9: add close.
- [ ] Commit 10: polish errors and layout.

## Do Not Build Yet

Skip these until the basic vault works:

- [ ] Do not add authentication.
- [ ] Do not add database.
- [ ] Do not add backend API server.
- [ ] Do not add SPL token support.
- [ ] Do not add charts.
- [ ] Do not add multiple vaults.
- [ ] Do not add mainnet.
- [ ] Do not add complex UI libraries.

## Final Done Checklist

- [ ] Wallet connects.
- [ ] Wallet balance shows.
- [ ] Vault PDA is derived correctly.
- [ ] Vault state is fetched correctly.
- [ ] Initialize works.
- [ ] Deposit works.
- [ ] Withdraw is blocked before unlock.
- [ ] Withdraw works after unlock.
- [ ] Close works after unlock.
- [ ] Frontend build passes.
