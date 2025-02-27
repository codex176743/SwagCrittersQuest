"use client";

import { useMemo } from "react";
import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import idl from "@/anchor/critters_nft_contract.json";
import { CrittersNftContract } from "@/types/critters_nft_contract";
import { connection } from "@/config/solana";

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
    return new Program<CrittersNftContract>(
      idl as CrittersNftContract,
      provider
    );
  }, [provider]);

  return { program, provider };
};
