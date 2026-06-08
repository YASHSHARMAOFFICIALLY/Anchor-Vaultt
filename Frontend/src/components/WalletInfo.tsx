import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export function Walletinfo() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    if (!publicKey) return;
    const lamports = await connection.getBalance(publicKey);
    setBalance(lamports / 1_000_000_000);
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="wallet-info">
      <p><strong>Wallet:</strong> {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</p>
      <p><strong>Balance:</strong> {balance === null ? "Loading..." : `${balance} SOL`}</p>
      <button onClick={fetchBalance}>Refresh</button>
    </div>
  );
}
export default Walletinfo;
