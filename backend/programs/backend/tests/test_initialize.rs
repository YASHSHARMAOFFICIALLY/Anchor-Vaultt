use {
    anchor_lang::{
        prelude::{Clock, Pubkey},
        solana_program::instruction::Instruction,
        AccountDeserialize, InstructionData, ToAccountMetas,
    },
    litesvm::{types::TransactionResult, LiteSVM},
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

const PAYER_LAMPORTS: u64 = 1_000_000_000;
const DEPOSIT_AMOUNT: u64 = 100_000_000;
const WITHDRAW_AMOUNT: u64 = 40_000_000;
const LOCK_DURATION: i64 = 60;

struct Fixture {
    svm: LiteSVM,
    payer: Keypair,
    program_id: Pubkey,
    vault_state: Pubkey,
    vault: Pubkey,
    state_bump: u8,
    vault_bump: u8,
}

fn setup_svm() -> Fixture {
    let program_id = backend::id();
    let payer = Keypair::new();
    let (vault_state, state_bump) =
        Pubkey::find_program_address(&[b"state", payer.pubkey().as_ref()], &program_id);
    let (vault, vault_bump) =
        Pubkey::find_program_address(&[b"vault", payer.pubkey().as_ref()], &program_id);
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!("../../../target/deploy/backend.so");
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), PAYER_LAMPORTS).unwrap();

    Fixture {
        svm,
        payer,
        program_id,
        vault_state,
        vault,
        state_bump,
        vault_bump,
    }
}

fn setup_initialized(lock_duration: i64) -> Fixture {
    let mut fixture = setup_svm();
    let ix = initialize_ix(&fixture, lock_duration);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();
    fixture
}

fn send_ix(svm: &mut LiteSVM, payer: &Keypair, ix: Instruction) -> TransactionResult {
    svm.expire_blockhash();
    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[ix], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();
    svm.send_transaction(tx)
}

fn initialize_ix(fixture: &Fixture, lock_duration: i64) -> Instruction {
    Instruction::new_with_bytes(
        fixture.program_id,
        &backend::instruction::Initialize { lock_duration }.data(),
        backend::accounts::Initialize {
            user: fixture.payer.pubkey(),
            vault_state: fixture.vault_state,
            vault: fixture.vault,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn deposit_ix(fixture: &Fixture, amount: u64) -> Instruction {
    Instruction::new_with_bytes(
        fixture.program_id,
        &backend::instruction::Deposit { amount }.data(),
        backend::accounts::Deposit {
            user: fixture.payer.pubkey(),
            vault_state: fixture.vault_state,
            vault: fixture.vault,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn withdraw_ix(fixture: &Fixture, amount: u64) -> Instruction {
    Instruction::new_with_bytes(
        fixture.program_id,
        &backend::instruction::Withdraw { amount }.data(),
        backend::accounts::Withdraw {
            user: fixture.payer.pubkey(),
            vault_state: fixture.vault_state,
            vault: fixture.vault,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn close_ix(fixture: &Fixture) -> Instruction {
    Instruction::new_with_bytes(
        fixture.program_id,
        &backend::instruction::Close {}.data(),
        backend::accounts::Close {
            user: fixture.payer.pubkey(),
            vault: fixture.vault,
            vault_state: fixture.vault_state,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn vault_state(fixture: &Fixture) -> backend::VaultState {
    let account = fixture.svm.get_account(&fixture.vault_state).unwrap();
    backend::VaultState::try_deserialize(&mut account.data.as_slice()).unwrap()
}

fn vault_balance(fixture: &Fixture) -> u64 {
    fixture.svm.get_balance(&fixture.vault).unwrap_or(0)
}

fn set_time(fixture: &mut Fixture, timestamp: i64) {
    let mut clock = fixture.svm.get_sysvar::<Clock>();
    clock.unix_timestamp = timestamp;
    fixture.svm.set_sysvar::<Clock>(&clock);
}

#[test]
fn initialize_stores_state_metadata() {
    let fixture = setup_initialized(LOCK_DURATION);
    let state = vault_state(&fixture);

    assert_eq!(state.user, fixture.payer.pubkey());
    assert_eq!(state.vault_bump, fixture.vault_bump);
    assert_eq!(state.state_bump, fixture.state_bump);
    assert_eq!(state.lock_until - state.created_at, LOCK_DURATION);
}

#[test]
fn initialize_rejects_non_positive_lock_duration() {
    let mut fixture = setup_svm();
    let ix = initialize_ix(&fixture, 0);

    let res = send_ix(&mut fixture.svm, &fixture.payer, ix);

    assert!(res.is_err());
    assert!(fixture.svm.get_account(&fixture.vault_state).is_none());
}

#[test]
fn deposit_increases_vault_balance() {
    let mut fixture = setup_initialized(LOCK_DURATION);

    let ix = deposit_ix(&fixture, DEPOSIT_AMOUNT);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();

    assert_eq!(vault_balance(&fixture), DEPOSIT_AMOUNT);
}

#[test]
fn withdraw_before_lock_fails() {
    let mut fixture = setup_initialized(LOCK_DURATION);
    let ix = deposit_ix(&fixture, DEPOSIT_AMOUNT);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();

    let ix = withdraw_ix(&fixture, WITHDRAW_AMOUNT);
    let res = send_ix(&mut fixture.svm, &fixture.payer, ix);

    assert!(res.is_err());
    assert_eq!(vault_balance(&fixture), DEPOSIT_AMOUNT);
}

#[test]
fn withdraw_after_lock_succeeds() {
    let mut fixture = setup_initialized(LOCK_DURATION);
    let ix = deposit_ix(&fixture, DEPOSIT_AMOUNT);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();
    let state = vault_state(&fixture);
    set_time(&mut fixture, state.lock_until);

    let ix = withdraw_ix(&fixture, WITHDRAW_AMOUNT);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();

    assert_eq!(vault_balance(&fixture), DEPOSIT_AMOUNT - WITHDRAW_AMOUNT);
}

#[test]
fn close_before_lock_fails() {
    let mut fixture = setup_initialized(LOCK_DURATION);
    let ix = deposit_ix(&fixture, DEPOSIT_AMOUNT);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();

    let ix = close_ix(&fixture);
    let res = send_ix(&mut fixture.svm, &fixture.payer, ix);

    assert!(res.is_err());
    assert_eq!(vault_balance(&fixture), DEPOSIT_AMOUNT);
    assert!(fixture.svm.get_account(&fixture.vault_state).is_some());
}

#[test]
fn close_after_lock_succeeds() {
    let mut fixture = setup_initialized(LOCK_DURATION);
    let ix = deposit_ix(&fixture, DEPOSIT_AMOUNT);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();
    let state = vault_state(&fixture);
    set_time(&mut fixture, state.lock_until);

    let ix = close_ix(&fixture);
    send_ix(&mut fixture.svm, &fixture.payer, ix).unwrap();

    assert_eq!(vault_balance(&fixture), 0);
    assert!(fixture.svm.get_account(&fixture.vault_state).is_none());
}
