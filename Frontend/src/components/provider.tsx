import { RPC_URL } from "../lib/constant";
import { type ReactNode,useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {PhantomWalletAdapter,SolflareWalletAdapter} from "@solana/wallet-adapter-wallets"
import '@solana/wallet-adapter-react-ui/styles.css'
import { ChildProcess } from "child_process";


const endpoint = RPC_URL || clusterApiUrl('devnet')

type Props = {
    Children:ReactNode
}
export const AppwalletProvider = ({Children}:Props)=>{

    const wallets = useMemo(()=>[new PhantomWalletAdapter(),new SolflareWalletAdapter()],[])
    return(
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{Children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}