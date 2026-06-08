import WalletConnect from "./components/Walletconnect";
import { Walletinfo } from "./components/WalletInfo";
import { VaultAction } from "./components/VaultActions";

const App = () => {
  return (
    <div>
      <nav className="navbar">
        <span className="navbar-title">Anchor Vault</span>
        <div className="navbar-right">
          <a
            href="https://github.com/YASHSHARMAOFFICIALLY"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
          >
            GitHub
          </a>
          <WalletConnect />
        </div>
      </nav>
      <main className="main-content">
        <h1>Solana Vault</h1>
        <p className="subtitle">Deposit, lock, and withdraw SOL securely on-chain.</p>
        <Walletinfo />
        <VaultAction />
      </main>
    </div>
  );
};
export default App;
