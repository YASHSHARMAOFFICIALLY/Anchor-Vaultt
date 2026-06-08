use crate::error::ErrorCode;
use crate::state::VaultState;
use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"state", user.key().as_ref()],
        bump = vault_state.state_bump,
        has_one = user,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}
impl<'info> Withdraw<'info> {
    pub fn withdraw(&mut self, amount: u64) -> Result<()> {
        let cpi_account = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };
        let now = Clock::get()?.unix_timestamp;
        require!(now >= self.vault_state.lock_until, ErrorCode::VaultLocked);

        let seeds = &[
            b"vault",
            self.user.to_account_info().key.as_ref(),
            &[self.vault_state.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx =
            CpiContext::new_with_signer(self.system_program.key(), cpi_account, signer_seeds);
        transfer(cpi_ctx, amount)?;

        Ok(())
    }
}
