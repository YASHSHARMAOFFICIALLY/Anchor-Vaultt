import { useWallet} from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";


 export function walletinfo(){
    const {publicKey} = useWallet();
    const {connection}= useConnection();
    const[Balance,setBalance] = useState<number|null>(null)

    const fetchBalance = async () =>{
        if(!publicKey) return;

        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports/1_000_000_000);
    };

    useEffect(()=>{
        fetchBalance()
    },[publicKey,connection])
    
    return(
        <div>
           <p>Wallet: {publicKey.toBase58()}</p>
           <p>Balance: {Balance === null ? "Loading....":`${Balance}Sol`}</p>
           <button onClick={fetchBalance}>Refresh</button>
        </div>
    )
    
 }