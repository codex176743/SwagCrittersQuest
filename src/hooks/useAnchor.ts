"use client";

import { useMemo } from "react";
import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, IdlAccounts } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import idl from "@/anchor/critters_nft.json";
import { CrittersNft } from "@/types/critters_nft";
import { PROGRAM_ID, NETWORK } from "@/config";

export const connection = new Connection(NETWORK || "devnet", "confirmed");

export const useAnchor = () => {
  const wallet = useWallet();

  const provider = useMemo(() => {
    return new AnchorProvider(
      connection,
      wallet as AnchorWallet,
      AnchorProvider.defaultOptions()
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    return new Program<CrittersNft>(idl as CrittersNft, provider);
  }, [provider]);

  return { program, provider };
};

export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  PROGRAM_ID
);

// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type CounterData = IdlAccounts<CrittersNft>["counter"];
