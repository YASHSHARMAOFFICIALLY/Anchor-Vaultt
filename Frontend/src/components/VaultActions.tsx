import { getProgram } from "../lib/program";
import { findVaultPda, findVaultStatePda } from "../lib/pdas";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import BN from "bn.js";
import { SystemProgram } from "@solana/web3.js";
import { solToLamports } from "../lib/format";

export function VaultAction() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = wallet;

  const [lockDuration, setLockDuration] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("");
  const [vaultData, setVaultData] = useState<any>(null);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const program = publicKey ? getProgram(connection, wallet) : null;
  const vaultState = publicKey ? findVaultStatePda(publicKey) : null;
  const vault = publicKey ? findVaultPda(publicKey) : null;

  const fetchVaultState = async () => {
    if (!program || !vaultState || !vault) return;
    try {
      const data = await program.account.vaultState.fetch(vaultState);
      const balance = await connection.getBalance(vault);
      setVaultData(data);
      setVaultBalance(balance);
    } catch {
      setVaultData(null);
      setVaultBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchVaultState();
    } else {
      setLoading(false);
    }
  }, [publicKey]);

  if (!publicKey) return null;
  if (loading) return <p className="status-msg">Loading vault...</p>;

  const now = Math.floor(Date.now() / 1000);
  const lockUntil = vaultData?.lockUntil?.toNumber() ?? 0;
  const isLocked = now < lockUntil;
  const secondsLeft = isLocked ? lockUntil - now : 0;

  const formatDuration = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleInitialize = async () => {
    try {
      await program!.methods
        .initialize(new BN(lockDuration))
        .accounts({
          user: publicKey,
          vaultState,
          vault,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setStatus("Vault initialized!");
      await fetchVaultState();
    } catch (e: any) {
      setStatus(`Initialize failed: ${e.message}`);
    }
  };

  const handleDeposit = async () => {
    try {
      await program!.methods
        .deposit(new BN(solToLamports(Number(depositAmount))))
        .accounts({
          user: publicKey,
          vaultState,
          vault,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setStatus("Deposit successful!");
      setDepositAmount("");
      await fetchVaultState();
    } catch (e: any) {
      setStatus(`Deposit failed: ${e.message}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      await program!.methods
        .withdraw(new BN(solToLamports(Number(withdrawAmount))))
        .accounts({
          user: publicKey,
          vaultState,
          vault,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setStatus("Withdraw successful!");
      setWithdrawAmount("");
      await fetchVaultState();
    } catch (e: any) {
      setStatus(`Withdraw failed: ${e.message}`);
    }
  };

  const handleClose = async () => {
    try {
      await program!.methods
        .close()
        .accounts({
          user: publicKey,
          vaultState,
          vault,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setStatus("Vault closed!");
      await fetchVaultState();
    } catch (e: any) {
      setStatus(`Close failed: ${e.message}`);
    }
  };

  // No vault exists — show only Initialize
  if (!vaultData) {
    return (
      <div className="vault-section">
        <div className="vault-row">
          <input
            placeholder="Lock duration (seconds)"
            value={lockDuration}
            onChange={(e) => setLockDuration(e.target.value)}
          />
          <button onClick={handleInitialize}>Initialize</button>
        </div>
        {status && <p className="status-msg">{status}</p>}
      </div>
    );
  }

  // Vault exists — show state + actions
  return (
    <div className="vault-section">
      <div className="vault-state-card">
        <p><strong>Vault Balance:</strong> {(vaultBalance / 1_000_000_000).toFixed(4)} SOL</p>
        <p>
          <strong>Status:</strong>{" "}
          {isLocked
            ? `Locked — unlocks in ${formatDuration(secondsLeft)}`
            : "Unlocked — ready to withdraw"}
        </p>
      </div>
      <div className="vault-row">
        <input
          placeholder="Amount in SOL"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>
      <div className="vault-row">
        <input
          placeholder="Amount in SOL"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
      <button className="close-btn" onClick={handleClose}>Close Vault</button>
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}
