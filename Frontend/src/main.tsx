import { StrictMode } from "react";
import { Buffer } from "buffer";
(window as any).Buffer = Buffer;
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { createRoot } from "react-dom/client";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

import "./index.css";
import App from "./App.tsx";
const endPoint = clusterApiUrl("devnet");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConnectionProvider endpoint={endPoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
);
