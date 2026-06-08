pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK");

#[program]
pub mod backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, lock_duration: i64) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps, lock_duration)
    }
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)
    }
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)
    }
    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()
    }
}
