import { AnchorProvider, Program } from "@anchor-lang/core";
import { Connection, PublicKey } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

import idl from "../idl/backend.json";
import type { Backend } from "../idl/backend";
import { PROGRAM_ID } from "./constant";

export function getProgram(connection: Connection, wallet: WalletContextState) {
    const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
    });

    return new Program<Backend>(idl as any, provider);
}