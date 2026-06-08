import {LAMPORTS_PER_SOL} from "@solana/web3.js"

export function LamportsToSol(lamports:number):number{
    return lamports/LAMPORTS_PER_SOL;
}
export function solToLamports(sol:number):number{
    return LAMPORTS_PER_SOL*sol;
}