use crate::error::ErrorCode;
use crate::state::VaultState;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer=user,
        seeds=[b"state",user.key().as_ref()],
        bump,
        space = 8 + VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        seeds = [b"vault",user.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bump: &InitializeBumps, lock_duration: i64) -> Result<()> {
        require!(lock_duration > 0, ErrorCode::InvalidLockDuration);

        let now = Clock::get()?.unix_timestamp;
        let lock_until = now
            .checked_add(lock_duration)
            .ok_or(error!(ErrorCode::LockDurationOverflow))?;

        self.vault_state.user = self.user.key();
        self.vault_state.created_at = now;
        self.vault_state.lock_until = lock_until;
        self.vault_state.vault_bump = bump.vault;
        self.vault_state.state_bump = bump.vault_state;

        Ok(())
    }
}
