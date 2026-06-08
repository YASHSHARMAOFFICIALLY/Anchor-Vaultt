use anchor_lang::prelude::*;
#[derive(InitSpace)]
#[account]
pub struct VaultState {
    pub user: Pubkey,
    pub created_at: i64,
    pub vault_bump: u8,
    pub state_bump: u8,
    pub lock_until: i64,
}
