use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Custom error message")]
    CustomError,
    #[msg("Vault is still locked")]
    VaultLocked,
    #[msg("Lock duration must be greater than zero")]
    InvalidLockDuration,
    #[msg("Lock duration overflowed")]
    LockDurationOverflow,
}
