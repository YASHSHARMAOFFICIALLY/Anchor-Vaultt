import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID} from "./constant";

const  program_id= new PublicKey(PROGRAM_ID)

export  function findVaultStatePda (userPublicKey:PublicKey){
        const [vaultStatePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state"),userPublicKey.toBuffer()],
            program_id
        );
        return vaultStatePda;
}

export function findVaultPda(userPublicKey:PublicKey){
    const[vaultpda]= PublicKey.findProgramAddressSync(
        [Buffer.from("vault"),userPublicKey.toBuffer()],
        program_id
    );
    return vaultpda;
}
