# Learning Progress

## Anchor Vault + PDAs

### Understood (answered correctly under grill)
- PDA = Program Derived Address (not public)
- PDAs have no private key, derived from seeds + program ID + bump
- The PROGRAM signs on behalf of PDAs, not the user
- Two PDAs needed: vault (SystemAccount, holds SOL) and vault_state (Account, holds data)
- SystemAccount owned by System Program — cannot store custom data
- Vault_state owned by your program — can store data but System Program won't transfer SOL into it
- Bumps stored in state to save compute (canonical bump never changes)
- `has_one = user` checks that vault_state.user == user.key()
- Discriminator = 8 bytes Anchor prepends to identify account type
- Discriminator prevents fake accounts being passed as valid VaultState
- Deposit uses CpiContext::new (user is signer, user sends SOL)
- Withdraw uses CpiContext::new_with_signer (vault is PDA, program must sign)
- `close = user` deletes account and returns lamports + rent to user
- Transferring 0 lamports succeeds (no-op)
- vault PDA not closed in close instruction — persists empty, reusable

### Shaky (needed hints or got partially wrong)
- Who signs for PDAs — initially said "system program", "vault state", needed multiple redirects
- `has_one` attack — confused direction of the check, needed explanation
- Deposit vs withdraw signing — said "system program" instead of "the sender authorizes"
- Discriminator purpose — knew the word but needed prompt on what attack it prevents

### Not Yet Covered
- CPI mechanics in depth
- `checked_add` and overflow safety
- `Clock::get()` and unix timestamps
- Error handling with custom ErrorCode
- Test file (test_initialize.rs)
- constants.rs

### Errors Made in Code (and whether understood after)
- 2026-05-26 | Grill session | PDA signer identity | Understood after multiple redirects: yes
- 2026-05-26 | Grill session | Deposit vs withdraw signer | Understood after explanation: yes

## Frontend Bugs Found (to fix next session)
- WalletInfo.tsx line 6: function named `walletinfo` (lowercase) — React won't render it as component
- WalletInfo.tsx line 24: `publicKey.toBase58()` with no null check — will crash if wallet not connected

## Next Session TODO
1. Fix WalletInfo.tsx bugs (both above)
2. Write `deposit_twice_increases_vault_balance` test in test_initialize.rs
3. Continue Phase 15: useVault.ts hook
